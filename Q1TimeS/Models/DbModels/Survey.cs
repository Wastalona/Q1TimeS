namespace Q1TimeS.Models.DbModels
{
    public class Survey
    {
        public Int32 SurveyId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string SurPassword { get; set; } = string.Empty;
        public Int32 CutOffTime { get; set; }
        public Int32 PeopleLimit { get; set; }
        public Int32 SurveyStatus { get; set; }
    }
}
