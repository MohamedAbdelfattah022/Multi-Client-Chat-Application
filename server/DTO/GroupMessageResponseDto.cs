﻿namespace server.DTO
{
    public class GroupMessageResponseDto
    {
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; }
        public int? GroupId { get; set; }
        public string GroupName { get; set; }
        public string MessageContent { get; set; }
        public string? ImagePath { get; set; }
        public DateTime SentAt { get; set; }
    }
}
