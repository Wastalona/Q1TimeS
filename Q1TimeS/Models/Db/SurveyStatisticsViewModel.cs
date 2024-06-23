namespace Q1TimeS.Models.Db
{
    public class SurveyStatisticsViewModel
    {
        public Survey Survey { get; set; }
        public List<User> Users { get; set; }
        public List<UserAnswer> UserAnswers { get; set; }
        public List<Question> Questions { get; set; }
        public List<Answer> Answers { get; set; }
    }

}
