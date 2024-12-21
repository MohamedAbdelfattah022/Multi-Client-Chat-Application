namespace server.DTO
{
    public class MessageResponseDto
    {
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; }
        public int? RecipientId { get; set; }
        public string RecipientName { get; set; }
        public int? GroupId { get; set; }
        public string GroupName { get; set; }
        public string MessageContent { get; set; }
        public byte[] ImageContent { get; set; }
        public DateTime SentAt { get; set; }
    }
}
