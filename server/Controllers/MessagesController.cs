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

        [HttpPost("sendMessage")]
        //[Authorize]
        public async Task<ActionResult> SendMessage(SendMessageDto messageDto) {
            if (!ModelState.IsValid) return BadRequest("Invalid model");

            if (string.IsNullOrEmpty(messageDto.MessageContent) && messageDto.ImageContent == null)
                return BadRequest("Message content cannot be empty.");

            if (messageDto.GroupId > 0 && messageDto.RecipientId == 0) { // Group message
                var groupMessage = new GroupMessage {
                    SenderId = messageDto.SenderId,
                    GroupId = messageDto.GroupId,
                    MessageContent = messageDto.MessageContent,
                    ImageContent = messageDto.ImageContent,
                    SentAt = DateTime.UtcNow
                };

                dbContext.GroupMessages.Add(groupMessage);
            }
            else if (messageDto.RecipientId > 0 && messageDto.GroupId == 0) { // Private message
                var privateMessage = new PrivateMessage {
                    SenderId = messageDto.SenderId,
                    RecipientId = messageDto.RecipientId,
                    MessageContent = messageDto.MessageContent,
                    ImageContent = messageDto.ImageContent,
                    SentAt = DateTime.UtcNow
                };

                dbContext.PrivateMessages.Add(privateMessage);
            }
            else {
                return BadRequest("Message cannot be both a private and group message at the same time.");
            }

            await dbContext.SaveChangesAsync();
            return Ok(new { SentAt = DateTime.UtcNow });
        }

        [HttpGet("getMessages")]
        //[Authorize]
        public async Task<ActionResult> GetMessages([FromQuery] GetMessagesDto messagesDto) {
            if (!ModelState.IsValid) return BadRequest("Model not valid");

            IQueryable<object> query;

            if (messagesDto.GroupId == 0) { // Private Messages
                query = dbContext.PrivateMessages
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
                    });
            }
            else { // Group Messages
                query = dbContext.GroupMessages
                    .OrderBy(m => m.SentAt)
                    .Where(m => m.GroupId == messagesDto.GroupId)
                    .Select(m => new MessageResponseDto {
                        MessageId = m.GroupMessageId,
                        SenderId = m.SenderId,
                        SenderName = m.Sender.Name,
                        GroupId = m.GroupId,
                        GroupName = m.Group.GroupName,
                        MessageContent = m.MessageContent,
                        ImageContent = m.ImageContent,
                        SentAt = m.SentAt
                    });
            }

            var messages = await query.ToListAsync();

            if (!messages.Any()) return NotFound("No messages found");
            return Ok(messages);
        }

        [HttpPatch("updatePrivateMessage/{messageId:int}")]
        //[Authorize]
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

        [HttpPatch("updateGroupMessage/{messageId:int}")]
        //[Authorize]
        public async Task<ActionResult> UpdateGroupMessage(int messageId, UpdateMessageDto updateMessageDto) {
            if (!ModelState.IsValid)
                return BadRequest("Invalid Model");

            var message = await dbContext.GroupMessages.FindAsync(messageId);
            if (message == null)
                return NotFound("Group message not found");

            message.MessageContent = updateMessageDto.MessageContent ?? message.MessageContent;
            message.ImageContent = updateMessageDto.ImageContent ?? message.ImageContent;
            message.SentAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            return Ok("Group message updated successfully");
        }


        [HttpDelete("deletePrivateMessage/{messageId}")]
        //[Authorize]
        public async Task<ActionResult> DeletePrivateMessage(int messageId) {
            var message = await dbContext.PrivateMessages.FindAsync(messageId);

            if (message == null)
                return NotFound("Private message not found");

            dbContext.PrivateMessages.Remove(message);
            await dbContext.SaveChangesAsync();

            return Ok("Private message deleted successfully");
        }

        [HttpDelete("deleteGroupMessage/{messageId}")]
        //[Authorize]
        public async Task<ActionResult> DeleteGroupMessage(int messageId) {
            var message = await dbContext.GroupMessages.FindAsync(messageId);

            if (message == null)
                return NotFound("Group message not found");

            dbContext.GroupMessages.Remove(message);
            await dbContext.SaveChangesAsync();

            return Ok("Group message deleted successfully");
        }
    }
}
