namespace server.DTO
{
    public class MessageResponseDto
    {
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; }
        public int? RecipientId { get; set; }
        public string RecipientName { get; set; }
        public string MessageContent { get; set; }
        public string? ImagePath { get; set; }
        public DateTime SentAt { get; set; }
    }
}
