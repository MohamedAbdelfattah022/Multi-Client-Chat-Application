using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class SendGroupMessageDto
    {
        [Required]
        public int SenderId { get; set; }
        public int GroupId { get; set; }
        [Required]
        [RegularExpression(@"^[^<>{}]*$")]
        public string MessageContent { get; set; }
        public byte[]? ImageContent { get; set; }
    }
}
