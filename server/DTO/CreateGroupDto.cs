using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class CreateGroupDto
    {
        [Required]
        public string GroupName { get; set; }
        public string? Description { get; set; }
        public byte[]? Avatar { get; set; }
        [Required]
        public int AdminId { get; set; }
        [Required]
        public List<int> ParticipantIds { get; set; } = new();
    }
}
