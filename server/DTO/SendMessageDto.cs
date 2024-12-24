using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class SendMessageDto
    {
        [Required]
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        [Required]
        [RegularExpression(@"^[^<>{}]*$")]
        public string MessageContent { get; set; }
        public byte[]? ImageContent { get; set; }
    }
}
