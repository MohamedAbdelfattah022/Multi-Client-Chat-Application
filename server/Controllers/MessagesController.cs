using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTO;
using server.Hubs;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController(AppDbContext dbContext, IHubContext<ChatHub> hubContext) : ControllerBase
    {
        [HttpPost("sendPrivateMessage")]
        [Authorize]
        public async Task<ActionResult> SendPrivateMessage([FromForm] SendMessageDto messageDto, IFormFile? imageFile) {
            if (!ModelState.IsValid) return BadRequest("Invalid model");

            if (string.IsNullOrEmpty(messageDto.MessageContent) && imageFile == null)
                return BadRequest("Message content cannot be empty.");

            string imagePath = null;
            if (imageFile != null) {

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.");

                var maxFileSize = 5 * 1024 * 1024;
                if (imageFile.Length > maxFileSize)
                    return BadRequest("File size exceeds the limit of 5MB.");

                var sanitizedFileName = Path.GetFileNameWithoutExtension(imageFile.FileName)
                    .Replace(" ", "_")
                    .Replace("-", "_")
                    .Replace("..", "")
                    .Replace("/", "")
                    .Replace("\\", "");

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + sanitizedFileName + fileExtension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) {
                    await imageFile.CopyToAsync(stream);
                }

                imagePath = Path.Combine("Uploads", uniqueFileName);
            }

            var privateMessage = new PrivateMessage {
                SenderId = messageDto.SenderId,
                RecipientId = messageDto.RecipientId,
                MessageContent = messageDto.MessageContent,
                ImagePath = imagePath,
                SentAt = DateTime.UtcNow
            };

            dbContext.PrivateMessages.Add(privateMessage);
            await dbContext.SaveChangesAsync();

            var messageWithUsers = await dbContext.PrivateMessages
                .Include(m => m.Sender)
                .Include(m => m.Recipient)
                .FirstOrDefaultAsync(m => m.PrivateMessageId == privateMessage.PrivateMessageId);

            var messageResponse = new MessageResponseDto {
                MessageId = messageWithUsers.PrivateMessageId,
                SenderId = messageWithUsers.SenderId,
                SenderName = messageWithUsers.Sender.Name,
                RecipientId = messageWithUsers.RecipientId,
                RecipientName = messageWithUsers.Recipient.Name,
                MessageContent = messageWithUsers.MessageContent,
                ImagePath = messageWithUsers.ImagePath,
                SentAt = messageWithUsers.SentAt
            };

            await hubContext.Clients.Group(messageDto.SenderId.ToString())
                .SendAsync("ReceiveMessage", messageResponse);

            await hubContext.Clients.Group(messageDto.RecipientId.ToString())
                .SendAsync("ReceiveMessage", messageResponse);

            return Ok(new { SentAt = privateMessage.SentAt });
        }

        [HttpGet("getPrivateMessages")]
        [Authorize]
        public async Task<ActionResult> GetPrivateMessages([FromQuery] GetMessagesDto messagesDto) {
            if (!ModelState.IsValid) return BadRequest("Model not valid");

            var messages = await dbContext.PrivateMessages
                .OrderBy(m => m.SentAt)
                .Where(m =>
                    (m.SenderId == messagesDto.SenderId && m.RecipientId == messagesDto.RecipientId) ||
                    (m.SenderId == messagesDto.RecipientId && m.RecipientId == messagesDto.SenderId)
                )
                .Select(m => new MessageResponseDto {
                    MessageId = m.PrivateMessageId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.Name,
                    RecipientId = m.RecipientId,
                    RecipientName = m.Recipient.Name,
                    MessageContent = m.MessageContent,
                    ImagePath = m.ImagePath,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any()) return NotFound("No messages found");
            return Ok(messages);
        }

        [HttpPatch("updatePrivateMessage/{messageId:int}")]
        [Authorize]
        public async Task<ActionResult> UpdatePrivateMessage(int messageId, UpdateMessageDto updateMessageDto) {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Model");

            var message = await dbContext.PrivateMessages.FindAsync(messageId);
            if (message == null)
                return NotFound("Private message not found");

            message.MessageContent = updateMessageDto.MessageContent ?? message.MessageContent;
            message.ImagePath = updateMessageDto.ImagePath ?? message.ImagePath;
            message.SentAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            return Ok("Private message updated successfully");
        }

        [HttpDelete("deletePrivateMessage/{messageId}")]
        [Authorize]
        public async Task<ActionResult> DeletePrivateMessage(int messageId) {
            var message = await dbContext.PrivateMessages.FindAsync(messageId);

            if (message == null)
                return NotFound("Private message not found");

            dbContext.PrivateMessages.Remove(message);
            await dbContext.SaveChangesAsync();

            return Ok("Private message deleted successfully");
        }
    }
}