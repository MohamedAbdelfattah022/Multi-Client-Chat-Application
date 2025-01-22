using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class SendMessageDto
    {
        [Required]
        public int SenderId { get; set; }
        public int RecipientId { get; set; }

        [RegularExpression(@"^[^<>{}]*$")]
        public string? MessageContent { get; set; }
        public string? ImagePath { get; set; }
    }
}