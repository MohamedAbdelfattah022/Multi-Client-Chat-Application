using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class FriendRequest
    {
        [Key]
        public int RequestId { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public User Sender { get; set; }
        public User Recipient { get; set; }
    }
}
