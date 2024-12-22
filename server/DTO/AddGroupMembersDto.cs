namespace server.DTO
{
    public class AddGroupMembersDto
    {
        public int AdminId { get; set; }
        public int GroupId { get; set; }
        public List<int> UserIds { get; set; } = new();
    }
}
