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
            var survey = _dbcontext.Surveys.FirstOrDefault(s => s.CCode == code);
            if (survey == null)
                return NotFound("Survey not found.");
            
            return View();
        }
    }
}
