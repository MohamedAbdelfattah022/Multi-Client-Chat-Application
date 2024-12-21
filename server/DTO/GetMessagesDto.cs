using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class GetMessagesDto
    {
        [Required]
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public int GroupId { get; set; }
    }
}
