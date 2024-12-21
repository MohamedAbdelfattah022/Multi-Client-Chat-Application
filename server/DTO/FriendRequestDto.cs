using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class FriendRequestDto
    {
        [Required]
        public int SenderId { get; set; }
        [Required, EmailAddress]
        public string RecipientEmail { get; set; }
    }
}
