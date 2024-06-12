using System.ComponentModel.DataAnnotations;

namespace Q1TimeS.Models.Db
{
    public class Answer
    {
        [Key]
        public int AnswerId { get; set; }
        public int QuestionId { get; set; }
        [Required]
        public string AnswerText { get; set; }
    }
}
