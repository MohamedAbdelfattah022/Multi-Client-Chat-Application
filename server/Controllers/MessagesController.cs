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
        public async Task<ActionResult> SendPrivateMessage(SendMessageDto messageDto) {
            if (!ModelState.IsValid) return BadRequest("Invalid model");

            if (string.IsNullOrEmpty(messageDto.MessageContent) && messageDto.ImageContent == null)
                return BadRequest("Message content cannot be empty.");

            var privateMessage = new PrivateMessage {
                SenderId = messageDto.SenderId,
                RecipientId = messageDto.RecipientId,
                MessageContent = messageDto.MessageContent,
                ImageContent = messageDto.ImageContent,
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
                ImageContent = messageWithUsers.ImageContent,
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
                    ImageContent = m.ImageContent,
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
            message.ImageContent = updateMessageDto.ImageContent ?? message.ImageContent;
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
