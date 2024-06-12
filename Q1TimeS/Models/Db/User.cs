using System.ComponentModel.DataAnnotations;

namespace Q1TimeS.Models.Db
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public int SurveyId { get; set; }
        [Required]
        public string SessionKey { get; set; } = string.Empty;
    }
}
