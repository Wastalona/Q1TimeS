using System.ComponentModel.DataAnnotations;

namespace Q1TimeS.Models
{
    public class Survey
    {
        public int SurveyId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? SurPassword { get; set; } = string.Empty;
        public int? CutOffTime { get; set; }
        public int? PeopleLimit { get; set; }
        public int SurveyStatus { get; set; }
    }
}

public class SurveyModel
{
    [Required(ErrorMessage = "Название опроса обязательно.")]
    [StringLength(20, ErrorMessage = "Название опроса должно быть не более 20 символов.")]
    public string Title { get; set; }

    [StringLength(99, ErrorMessage = "Описание опроса должно быть не более 99 символов.")]
    public string Description { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Таймаут должен быть положительным числом.")]
    public int? CutOffTime { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Лимит должен быть положительным числом.")]
    public int? Limit { get; set; }

    public bool IsQuizMode { get; set; }

    [Required(ErrorMessage = "Должен быть хотя бы один вопрос.")]
    [MinLength(1, ErrorMessage = "Должен быть хотя бы один вопрос.")]
    public List<QuestionModel> Questions { get; set; }
}

public class QuestionModel
{
    [Required(ErrorMessage = "Текст вопроса обязателен.")]
    public string QuestionText { get; set; }

    public bool MultiAnswer { get; set; }

    [Required(ErrorMessage = "Должен быть хотя бы один ответ.")]
    [MinLength(2, ErrorMessage = "Должно быть как минимум два варианта ответа.")]
    [MaxLength(10, ErrorMessage = "Не более 10 вариантов ответа.")]
    public List<string> Answers { get; set; }

    public int? TrueAnswerIndex { get; set; }
}