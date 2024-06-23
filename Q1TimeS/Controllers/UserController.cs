using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models.Db;

namespace Q1TimeS.Controllers
{
    public class UserController : Controller
    {
        private readonly MySqlContext _dbcontext;
        public UserController(MySqlContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet]
        public IActionResult SurveysList()
        /* Display of all surveys */
        {
            HttpContext.Session.SetString("user_session_key", HttpContext.Session.Id);
            return View();
        }

        [HttpGet]
        public IActionResult ConnectWithCode(string code, string nickname)
        {
            using var transaction = _dbcontext.Database.BeginTransaction();

            try
            {
                string sessionKey = HttpContext.Session.GetString("user_session_key");
                if (string.IsNullOrEmpty(sessionKey))
                {
                    HttpContext.Session.SetString("user_session_key", HttpContext.Session.Id);
                    sessionKey = HttpContext.Session.Id;
                }

                var survey = _dbcontext.Surveys.FirstOrDefault(s => s.CCode == code);
                if (survey == null)
                    return BadRequest("Не удалось найти опрос.");

                var existingUser = _dbcontext.Users.FirstOrDefault(u =>
                    u.SessionKey == sessionKey && u.SurveyId == survey.SurveyId);

                if (existingUser != null)
                    return BadRequest("Вы уже подключены к опросу.");

                _dbcontext.Users.Add(new User
                {
                    SurveyId = survey.SurveyId,
                    SessionKey = sessionKey,
                    NickName = nickname
                });

                _dbcontext.SaveChanges();
                transaction.Commit();

                return RedirectToAction("SurveyPage", "User", new { code });
            }
            catch (Exception)
            {
                transaction.Rollback();
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

        [HttpGet]
        public IActionResult SurveyPage(string code)
        {
            var viewModel = _dbcontext.Surveys
                .Where(s => s.CCode == code)
                .Select(s => new Survey
                {
                    SurveyId = s.SurveyId,
                    Title = s.Title,
                    Description = s.Description,
                    IsRunning = s.IsRunning,
                    Questions = s.Questions.Select(q => new Question
                    {
                        QuestionId = q.QuestionId,
                        QuestionText = q.QuestionText,
                        MultiAnswer = q.MultiAnswer,
                        Answers = q.Answers.Select(a => new Answer
                        {
                            AnswerId = a.AnswerId,
                            AnswerText = a.AnswerText
                        }).ToList()
                    }).ToList()
                }).FirstOrDefault();

            if (viewModel == null)
                return NotFound("Опрос не найден");

            return View(viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> SendResults()
        {
            try
            {
                // Получаем данные из формы
                var formData = await Request.ReadFormAsync();
                var userAnswers = new List<UserAnswer>();

                // Получаем ID пользователя
                string sessionKey = HttpContext.Session.GetString("user_session_key");
                var user = _dbcontext.Users.FirstOrDefault(u => u.SessionKey == sessionKey);
                if (user == null)
                    return BadRequest("Пользователь не найден");

                foreach (var key in formData.Keys){
                    if (key.StartsWith("question_")){
                        var questionIdString = key.Split('-')[1];
                        if (int.TryParse(questionIdString, out int questionId)){
                            var answerTexts = formData[key]; // StringValues

                            foreach (var answerText in answerTexts){
                                var answer = _dbcontext.Answers.FirstOrDefault(a => a.AnswerText == answerText);
                                if (answer != null){
                                    var userAnswer = new UserAnswer{
                                        QuestionId = questionId,
                                        AnswerId = answer.AnswerId,
                                        UserId = user.UserId
                                    };
                                    userAnswers.Add(userAnswer);
                                }
                            }
                        }
                    }
                }

                if (userAnswers.Count == 0)
                    return BadRequest("Достоверных ответов не найдено");

                _dbcontext.UserAnswers.AddRange(userAnswers);
                await _dbcontext.SaveChangesAsync();

                return Redirect("SurveysList");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка со стороные сервера: {ex.Message}");
            }
        }

    }
}
