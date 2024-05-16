namespace Q1TimeS.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string SessionKey { get; set; } = string.Empty;
        public int? Survey { get; set; }
    }
}
