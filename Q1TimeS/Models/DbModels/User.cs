namespace Q1TimeS.Models.DbModels
{
    public class User
    {
        public Int32 UserId { get; set; }
        public string SessionKey { get; set; } = string.Empty;
        public Int32 Survey { get; set; }
    }
}
