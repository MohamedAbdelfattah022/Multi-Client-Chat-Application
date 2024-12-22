using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTO;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendshipController(JwtOptions jwtOptions, AppDbContext dbContext) : ControllerBase
    {
        [HttpPost("sendRequest")]
        [Authorize]
        public async Task<ActionResult> SendFriendRequest(FriendRequestDto requestDto) {

            if (string.IsNullOrEmpty(requestDto.RecipientEmail)) return BadRequest("Recipient email is required.");

            var requestedFriend = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == requestDto.RecipientEmail);
            if (requestedFriend == null) return NotFound("Recipient user does not exist.");

            var sender = await dbContext.Users.FindAsync(requestDto.SenderId);
            if (sender == null) return BadRequest("Invalid sender user.");

            if (sender.UserId == requestedFriend.UserId) return BadRequest("Cannot send a friend request to yourself.");

            var existingRequest = await dbContext.FriendRequests.FirstOrDefaultAsync(fr =>
                (fr.SenderId == sender.UserId && fr.RecipientId == requestedFriend.UserId) ||
                (fr.SenderId == requestedFriend.UserId && fr.RecipientId == sender.UserId));

            if (existingRequest != null) {
                if (existingRequest.Status)
                    return BadRequest("You are already friends.");
                else
                    return BadRequest("A pending friend request already exists.");
            }

            var request = new FriendRequest {
                SenderId = sender.UserId,
                RecipientId = requestedFriend.UserId,
                Status = false,
                CreatedAt = DateTime.UtcNow,
            };

            await dbContext.FriendRequests.AddAsync(request);
            await dbContext.SaveChangesAsync();

            return Ok("Friend request sent successfully.");
        }

        [HttpGet("getReceivedRequests/{userId:int}")]
        [Authorize]
        public async Task<ActionResult> GetReceivedRequests(int userId) {
            if (userId <= 0) return BadRequest("Invalid user ID");

            var receivedRequests = await dbContext.FriendRequests
                .Where(fr => fr.RecipientId == userId && fr.Status == false)
                .Include(fr => fr.Sender)
                .Select(fr => new {
                    RequestId = fr.RequestId,
                    SenderId = fr.SenderId,
                    SenderName = fr.Sender.Name,
                    SenderEmail = fr.Sender.Email,
                    SenderProfilePic = fr.Sender.ProfilePic,
                    CreatedAt = fr.CreatedAt
                }).ToListAsync();

            if (!receivedRequests.Any())
                return NotFound("No pending friend requests found.");

            return Ok(receivedRequests);
        }

        [HttpPost("respondToRequest")]
        [Authorize]
        public async Task<ActionResult> RespondToFriendRequest(FriendRequestActionDto actionDto) {
            if (actionDto.RequestId <= 0) return BadRequest("Invalid Id");

            var request = await dbContext.FriendRequests
                            .Include(fr => fr.Recipient)
                            .Include(fr => fr.Sender)
                            .FirstOrDefaultAsync(fr => fr.RequestId == actionDto.RequestId);
            if (request == null) return NotFound("Request not found");

            if (actionDto.CurrentUserId != request.RecipientId) return Unauthorized("You cannot take action for this request");

            if (actionDto.Accept) {
                request.Status = true;
                await dbContext.SaveChangesAsync();
                return Ok($"Request Accepted");
            }
            else {
                dbContext.FriendRequests.Remove(request);
                await dbContext.SaveChangesAsync();
                return Ok($"Request Declined");
            }
        }

        [HttpGet("getFriends/{id:int}")]
        [Authorize]
        public async Task<ActionResult> GetFriends(int id) {
            if (id <= 0) return BadRequest("Invalid Id");

            var friends = await dbContext.FriendRequests
                .Where(fr => (fr.SenderId == id || fr.RecipientId == id) && fr.Status == true)
                .Select(fr => fr.SenderId == id
                    ? new { fr.Recipient.UserId, fr.Recipient.Name, fr.Recipient.Email, fr.Recipient.ProfilePic }
                    : new { fr.Sender.UserId, fr.Sender.Name, fr.Sender.Email, fr.Sender.ProfilePic })
                .ToListAsync();

            if (friends.Count == 0) return NotFound("No friends found.");
            return Ok(friends);
        }
    }
}
