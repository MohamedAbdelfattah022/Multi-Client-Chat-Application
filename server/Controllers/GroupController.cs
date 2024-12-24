using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTO;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController(AppDbContext dbContext) : ControllerBase
    {

        [HttpPost("sendGroupMessage")]
        [Authorize]
        public async Task<ActionResult> SendGroupMessage(SendGroupMessageDto messageDto) {
            if (!ModelState.IsValid) return BadRequest("Invalid model");

            if (string.IsNullOrEmpty(messageDto.MessageContent) && messageDto.ImageContent == null)
                return BadRequest("Message content cannot be empty.");

            var members = dbContext.GroupMembers
                .Where(m => m.GroupId == messageDto.GroupId)
                .Select(u => u.UserId).ToHashSet();

            if (!members.Contains(messageDto.SenderId))
                return Unauthorized("You are not a group member");

            var groupMessage = new GroupMessage {
                SenderId = messageDto.SenderId,
                GroupId = messageDto.GroupId,
                MessageContent = messageDto.MessageContent,
                ImageContent = messageDto.ImageContent,
                SentAt = DateTime.UtcNow
            };

            dbContext.GroupMessages.Add(groupMessage);
            await dbContext.SaveChangesAsync();

            return Ok(new { SentAt = groupMessage.SentAt });
        }

        [HttpGet("getGroupMessages")]
        [Authorize]
        public async Task<ActionResult> GetGroupMessages([FromQuery] GetGroupMessagesDto messagesDto) {
            if (!ModelState.IsValid) return BadRequest("Model not valid");

            var messages = await dbContext.GroupMessages
                .OrderBy(m => m.SentAt)
                .Where(m => m.GroupId == messagesDto.GroupId)
                .Select(m => new GroupMessageResponseDto {
                    MessageId = m.GroupMessageId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.Name,
                    GroupId = m.GroupId,
                    GroupName = m.Group.GroupName,
                    MessageContent = m.MessageContent,
                    ImageContent = m.ImageContent,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any()) return NotFound("No messages found");
            return Ok(messages);
        }

        [HttpPost("createGroup")]
        [Authorize]
        public async Task<ActionResult> CreateGroup(CreateGroupDto createGroupDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrEmpty(createGroupDto.GroupName))
                return BadRequest("Group Name Is Required");

            var group = new Group {
                GroupName = createGroupDto.GroupName,
                Description = createGroupDto.Description,
                Avatar = createGroupDto.Avatar,
                CreatedAt = DateTime.Now,
            };

            dbContext.Groups.Add(group);
            await dbContext.SaveChangesAsync();
            var members = new List<GroupMember>();

            foreach (var userId in createGroupDto.ParticipantIds) {
                members.Add(new GroupMember {
                    GroupId = group.GroupId,
                    UserId = userId,
                    JoinedAt = DateTime.Now,
                    IsAdmin = false,
                });
            }
            members.Add(new GroupMember {
                GroupId = group.GroupId,
                UserId = createGroupDto.AdminId,
                JoinedAt = DateTime.Now,
                IsAdmin = true,
            });
            await dbContext.GroupMembers.AddRangeAsync(members);
            await dbContext.SaveChangesAsync();
            return Ok("Group created successfully");
        }

        [HttpGet("getUserGroups/{userId}")]
        [Authorize]
        public async Task<ActionResult> GetUserGroups(int userId) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userGroups = await dbContext.GroupMembers
                .Where(gm => gm.UserId == userId)
                .Select(gm => new {
                    gm.Group.GroupId,
                    gm.Group.GroupName,
                    gm.Group.Description,
                    gm.Group.Avatar,
                    gm.Group.CreatedAt,
                }).ToListAsync();

            if (!userGroups.Any())
                return NotFound("No groups found for this user");

            return Ok(userGroups);
        }

        [HttpPost("addGroupMembers")]
        [Authorize]
        public async Task<ActionResult> AddGroupMember(AddGroupMembersDto addMembersDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await dbContext.Groups.FindAsync(addMembersDto.GroupId);
            if (group == null) return NotFound("Group Not Found");

            var admins = dbContext.GroupMembers
                .Where(m => m.GroupId == addMembersDto.GroupId && m.IsAdmin == true)
                .Select(user => user.UserId).ToHashSet();

            if (!admins.Contains(addMembersDto.AdminId))
                return Unauthorized("You are not authorized to do this action");

            var currentMembers = dbContext.GroupMembers
                .Where(m => m.GroupId == addMembersDto.GroupId)
                .Select(m => m.UserId).ToHashSet();

            var newMembers = addMembersDto.UserIds
                .Where(id => !currentMembers.Contains(id))
                .Select(userId => new GroupMember {
                    GroupId = addMembersDto.GroupId,
                    UserId = userId,
                    JoinedAt = DateTime.Now,
                    IsAdmin = false
                }).ToList();

            if (!newMembers.Any()) return BadRequest("No new members to add");
            await dbContext.GroupMembers.AddRangeAsync(newMembers);
            await dbContext.SaveChangesAsync();
            return Ok(new { Message = "Members added successfully", AddedCount = newMembers.Count });
        }

        [HttpDelete("deleteMember")]
        [Authorize]
        public async Task<ActionResult> DeleteMember(AddGroupMembersDto deleteMemberDto) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await dbContext.Groups.FindAsync(deleteMemberDto.GroupId);
            if (group == null) return NotFound("Group Not Found");

            var admins = dbContext.GroupMembers
                .Where(m => m.GroupId == deleteMemberDto.GroupId && m.IsAdmin == true)
                .Select(user => user.UserId).ToHashSet();

            if (!admins.Contains(deleteMemberDto.AdminId))
                return Unauthorized("You are not authorized to do this action");

            var deleteList = await dbContext.GroupMembers
                .Where(m => m.GroupId == deleteMemberDto.GroupId &&
                m.UserId != deleteMemberDto.AdminId &&
                deleteMemberDto.UserIds.Contains(m.UserId))
                .ToListAsync();

            if (!deleteList.Any()) return BadRequest("Invalid Members");

            dbContext.GroupMembers.RemoveRange(deleteList);
            await dbContext.SaveChangesAsync();
            return Ok("Members deleted successfully");
        }


        [HttpPatch("updateGroupMessage/{messageId:int}")]
        [Authorize]
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

        [HttpDelete("deleteGroupMessage/{messageId}")]
        [Authorize]
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
