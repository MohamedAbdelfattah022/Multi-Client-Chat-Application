namespace server.Data
{
    public class PrivateMessage
    {
        public int PrivateMessageId { get; set; }
        public int SenderId { get; set; }
        public User Sender { get; set; }
        public int RecipientId { get; set; }
        public User Recipient { get; set; }
        public string MessageContent { get; set; }
        public byte[]? ImageContent { get; set; }
        public DateTime SentAt { get; set; }
    }

}
