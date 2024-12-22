using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTO;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController(AppDbContext dbContext) : ControllerBase
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

            return Ok(new { SentAt = privateMessage.SentAt });
        }



        [HttpGet("getPrivateMessages")]
        [Authorize]
        public async Task<ActionResult> GetPrivateMessages([FromQuery] GetMessagesDto messagesDto) {
            if (!ModelState.IsValid) return BadRequest("Model not valid");

            var messages = await dbContext.PrivateMessages
                .OrderByDescending(m => m.SentAt)
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
