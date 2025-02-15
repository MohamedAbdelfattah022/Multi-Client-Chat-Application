﻿using Microsoft.AspNetCore.Authorization;
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
    public class GroupController(AppDbContext dbContext, IHubContext<ChatHub> hubContext) : ControllerBase
    {

        [HttpPost("sendGroupMessage")]
        [Authorize]
        public async Task<ActionResult> SendGroupMessage([FromForm] SendGroupMessageDto messageDto, IFormFile? imageFile) {
            if (!ModelState.IsValid) return BadRequest("Invalid model");

            if (string.IsNullOrEmpty(messageDto.MessageContent) && imageFile == null)
                return BadRequest("Message content cannot be empty.");

            var members = dbContext.GroupMembers
                .Where(m => m.GroupId == messageDto.GroupId)
                .Select(u => u.UserId).ToHashSet();

            if (!members.Contains(messageDto.SenderId))
                return Unauthorized("You are not a group member");

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

            var groupMessage = new GroupMessage {
                SenderId = messageDto.SenderId,
                GroupId = messageDto.GroupId,
                MessageContent = messageDto.MessageContent,
                ImagePath = imagePath,
                SentAt = DateTime.UtcNow
            };

            dbContext.GroupMessages.Add(groupMessage);
            await dbContext.SaveChangesAsync();

            var messageWithDetails = await dbContext.GroupMessages
                .Include(m => m.Sender)
                .Include(m => m.Group)
                .FirstOrDefaultAsync(m => m.GroupMessageId == groupMessage.GroupMessageId);

            var messageResponse = new GroupMessageResponseDto {
                MessageId = messageWithDetails.GroupMessageId,
                SenderId = messageWithDetails.SenderId,
                SenderName = messageWithDetails.Sender.Name,
                GroupId = messageWithDetails.GroupId,
                GroupName = messageWithDetails.Group.GroupName,
                MessageContent = messageWithDetails.MessageContent,
                ImagePath = messageWithDetails.ImagePath,
                SentAt = messageWithDetails.SentAt
            };

            await hubContext.Clients.Group($"group_{messageDto.GroupId}")
                .SendAsync("ReceiveGroupMessage", messageResponse);

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
                    ImagePath = m.ImagePath,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any()) return NotFound("No messages found");
            return Ok(messages);
        }

        [HttpGet("getGroupMembers/{groupId:int}")]
        [Authorize]
        public async Task<ActionResult> GetGroupMembers(int groupId) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var members = await dbContext.GroupMembers
                .Where(m => m.GroupId == groupId)
                .Select(m => new {
                    m.UserId,
                    m.User.Name,
                    m.User.ProfilePic,
                    m.IsAdmin
                }).ToListAsync();
            if (!members.Any()) return NotFound("No members found for this group");
            return Ok(members);
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
            message.ImagePath = updateMessageDto.ImagePath ?? message.ImagePath;
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
