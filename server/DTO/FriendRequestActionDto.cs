using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class FriendRequestActionDto
    {
        [Required]
        public int RequestId { get; set; }
        [Required]
        public bool Accept { get; set; }

        public int CurrentUserId { get; set; }
    }
}
