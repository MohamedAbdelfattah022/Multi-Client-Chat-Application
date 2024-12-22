using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class GroupMessage
    {
        [Key]
        public int GroupMessageId { get; set; }
        public int SenderId { get; set; }
        public int GroupId { get; set; }
        public string MessageContent { get; set; }
        public byte[]? ImageContent { get; set; }
        public DateTime SentAt { get; set; }

        public User Sender { get; set; }
        public Group Group { get; set; }
    }
}
