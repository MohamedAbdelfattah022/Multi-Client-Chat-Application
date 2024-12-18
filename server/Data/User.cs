using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public byte[] ProfilePic { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Message> SentMessages { get; set; }
        public ICollection<Message> ReceivedMessages { get; set; }
        public ICollection<GroupMember> GroupMemberships { get; set; }
        public ICollection<FriendRequest> SentRequests { get; set; }
        public ICollection<FriendRequest> ReceivedRequests { get; set; }

    }
}
