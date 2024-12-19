namespace server.Data
{
    public class JwtOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int DurationInMin { get; set; }
        public string SigningKey { get; set; }
    }
}
