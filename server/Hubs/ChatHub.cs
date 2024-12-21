using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace server.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> OnlineUsers = new();

        public override async Task OnConnectedAsync() {
            var userId = Context.User?.Identity?.Name;
            if (!string.IsNullOrEmpty(userId)) {
                OnlineUsers[Context.ConnectionId] = userId;
                await Clients.All.SendAsync("UserConnected", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) {
            if (OnlineUsers.TryRemove(Context.ConnectionId, out var userId)) {
                await Clients.All.SendAsync("UserDisconnected", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessageToGroup(string groupName, string message) {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", Context.User?.Identity?.Name, message);
        }

        public async Task SendPrivateMessage(string recipientUserId, string message) {
            var connectionId = OnlineUsers.FirstOrDefault(u => u.Value == recipientUserId).Key;
            if (!string.IsNullOrEmpty(connectionId)) {
                await Clients.Client(connectionId).SendAsync("ReceivePrivateMessage", Context.User?.Identity?.Name, message);
            }
        }

        public async Task JoinGroup(string groupName) {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("GroupJoined", Context.User?.Identity?.Name);
        }

        public async Task LeaveGroup(string groupName) {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("GroupLeft", Context.User?.Identity?.Name);
        }

        public async Task GetOnlineUsers() {
            await Clients.Caller.SendAsync("ReceiveOnlineUsers", OnlineUsers.Values);
        }
    }
}
