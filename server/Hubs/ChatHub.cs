using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace server.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> OnlineUsers = new();

        public async Task JoinPrivateChat(string userId) {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            OnlineUsers.TryAdd(userId, Context.ConnectionId);
        }

        public async Task InitiatePrivateChat(string currentUserId, string targetUserId) {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{currentUserId}-{targetUserId}");
        }
        public async Task LeavePrivateChat(string userId) {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
    }

}
