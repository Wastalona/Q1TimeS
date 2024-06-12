using System.ComponentModel.DataAnnotations;

namespace Q1TimeS.Models.Db
{
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }
        [Required(ErrorMessage = "Текст вопроса обязателен.")]
        public string QuestionText { get; set; }

        public bool MultiAnswer { get; set; }

        [Required(ErrorMessage = "Должен быть хотя бы один ответ.")]
        [MinLength(2, ErrorMessage = "Должно быть как минимум два варианта ответа.")]
        [MaxLength(10, ErrorMessage = "Не более 10 вариантов ответа.")]
        public List<Answer> Answers { get; set; }

        public int? TrueAnswerIndex { get; set; }

        public int SurveyId { get; set; }
    }

}
