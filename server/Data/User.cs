using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Data
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public byte[]? ProfilePic { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<PrivateMessage> SentPrivateMessages { get; set; }
        public ICollection<PrivateMessage> ReceivedPrivateMessages { get; set; }
        public ICollection<GroupMessage> SentGroupMessages { get; set; }
        public ICollection<GroupMember> GroupMemberships { get; set; }
        public ICollection<FriendRequest> SentRequests { get; set; }
        public ICollection<FriendRequest> ReceivedRequests { get; set; }

        [NotMapped]
        public IEnumerable<User> Friends =>
            SentRequests.Where(fr => fr.Status).Select(fr => fr.Recipient)
            .Concat(ReceivedRequests.Where(fr => fr.Status).Select(fr => fr.Sender));

    }
}
