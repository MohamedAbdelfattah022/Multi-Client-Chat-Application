using System.ComponentModel.DataAnnotations;

namespace server.Data
{
    public class Group
    {
        [Key]
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public byte[] Avatar { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<GroupMessage> Messages { get; set; }
        public ICollection<GroupMember> GroupMembers { get; set; }
    }
}
