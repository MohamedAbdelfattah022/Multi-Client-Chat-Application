using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class GetGroupMessagesDto
    {
        [Required]
        public int SenderId { get; set; }
        public int GroupId { get; set; }
    }
}
