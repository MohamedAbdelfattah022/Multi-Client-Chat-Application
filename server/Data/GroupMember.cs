using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class GroupMember
    {
        [Key]
        public int GroupMemberId { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
        public DateTime JoinedAt { get; set; }
        public bool IsAdmin { get; set; }

        public Group Group { get; set; }
        public User User { get; set; }
    }
}
