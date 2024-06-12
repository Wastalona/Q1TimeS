using System.ComponentModel.DataAnnotations;

namespace Q1TimeS.Models.Db
{
    public class Survey
    {
        [Key]
        public int SurveyId { get; set; }
        
        [Required(ErrorMessage = "Название опроса обязательно.")]
        [StringLength(20, ErrorMessage = "Название опроса должно быть не более 20 символов.")]
        public string Title { get; set; }

        [StringLength(99, ErrorMessage = "Описание опроса должно быть не более 99 символов.")]
        public string Description { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Таймаут должен быть положительным числом.")]
        public int CutOffTime { get; set; }

        [Range(1, 100, ErrorMessage = "Лимит должен быть положительным числом.")]
        public int Limit { get; set; }

        public bool IsQuizMode { get; set; }
        public ICollection<Question> Questions { get; set; }
    }
}
