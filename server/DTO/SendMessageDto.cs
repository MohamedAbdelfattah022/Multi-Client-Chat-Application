using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class SendMessageDto
    {
        [Required]
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public int GroupId { get; set; }
        [Required]
        public string MessageContent { get; set; }
        public byte[] ImageContent { get; set; }
    }
}
