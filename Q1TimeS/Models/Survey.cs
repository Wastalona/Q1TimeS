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
