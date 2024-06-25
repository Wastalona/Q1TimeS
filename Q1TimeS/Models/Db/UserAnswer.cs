using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Q1TimeS.Models.Db
{
    public class UserAnswer
    {
        [Key]
        public int UserAnswerId { get; set; }
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
        public int UserId { get; set; }
    }
}
