using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Q1TimeS.Models.Db;
using Q1TimeS.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text;
using System.Xml.Serialization;
using System.Text.Json;
using System.Linq;
using System.Xml.Linq;

namespace Q1TimeS.Controllers
{
    public class AdminController : Controller
    {
        private readonly IHubContext<SurveyHub> _hubContext;
        private readonly MySqlContext _dbcontext;

        public AdminController(IHubContext<SurveyHub> hubContext, MySqlContext dbcontext)
        {
            _hubContext = hubContext;
            _dbcontext = dbcontext;
        }

        [HttpGet, HttpPost]
        public IActionResult Auth()
        {
            return View();
        }

        // Helper
        private SurveyStatisticsViewModel getSurveyInfo(Survey s) {
            if (s == null) return null;

            var users = _dbcontext.Users.Where(u => u.SurveyId == s.SurveyId).ToList();
            var questions = _dbcontext.Questions.Where(q => q.SurveyId == s.SurveyId).ToList();
            var answers = _dbcontext.Answers
                .Where(a => questions.Select(q => q.QuestionId).Contains(a.QuestionId))
                .ToList();
            var userAnswers = _dbcontext.UserAnswers
                .Where(ua => questions.Select(q => q.QuestionId).Contains(ua.QuestionId))
                .ToList();


            return new SurveyStatisticsViewModel
            {
                Survey = s,
                Users = users ?? new List<User>(),
                UserAnswers = userAnswers,
                Questions = questions,
                Answers = answers
            };
        }


        /* ACCESS */
        // Delete action
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        public IActionResult DeleteAddresses(List<int> SelectedIPs)
        {
            if (SelectedIPs == null || !SelectedIPs.Any())
            {
                return BadRequest("Не выбраны адреса для удаления.");
            }

            using var transaction = _dbcontext.Database.BeginTransaction();
            try
            {
                var ipsToDelete = _dbcontext.TrustedIP.Where(ip => SelectedIPs.Contains(ip.AddressId)).ToList();
                _dbcontext.TrustedIP.RemoveRange(ipsToDelete);
                _dbcontext.SaveChanges();
                transaction.Commit();
                return Ok();
            }
            catch (Exception)
            {
                transaction.Rollback();
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Access()
        {
            var IPs = _dbcontext.TrustedIP.ToList();
            return View(IPs);
        }

        // Add action
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Access([FromForm] TrustedIP model)
        {
            if (ModelState.IsValid)
            {
                using var transaction = _dbcontext.Database.BeginTransaction();
                try
                {
                    _dbcontext.TrustedIP.Add(model);
                    _dbcontext.SaveChanges();
                    transaction.Commit();
                    return Redirect("Access");
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    return StatusCode(500, "Внутренняя ошибка сервера.");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        /* END ACCESS  */

        [Authorize(Roles = "Admin")]
        [HttpGet, HttpPost]
        public IActionResult Workshop()
        {
            var survey = _dbcontext.Surveys.ToList();
            return View(survey);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult CompositeSurvey()
        /* Page used to create a new composite survey */
        {
            return View();
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult CompositeSurvey([FromBody] Survey model)
        /* Page used to create a new composite survey */
        {
            if (ModelState.IsValid){
                // Start transaction
                using var transaction = _dbcontext.Database.BeginTransaction();

                try{
                    // Add surveys
                    _dbcontext.Surveys.Add(model);

                    // Add question and answers
                    foreach (var question in model.Questions){
                        question.QuestionId = 0;  // Reset id
                        question.SurveyId = model.SurveyId;
                        _dbcontext.Questions.Add(question);

                        foreach (var answer in question.Answers)
                        {
                            answer.AnswerId = 0;  // Reset id
                            answer.QuestionId = question.QuestionId;
                            _dbcontext.Answers.Add(answer);
                        }
                    }

                    _dbcontext.SaveChanges();

                    // Commit transaction
                    transaction.Commit();

                    return Redirect("Workshop");
                }catch (Exception){
                    // In case of an error, we roll back the transaction
                    transaction.Rollback();
                    return StatusCode(500, "Внутренняя ошибка сервера.");
                }
            }else{
                return BadRequest(ModelState);
            }
        }

        /* Survey options */
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Statistics(int key)
        {
            Survey survey = _dbcontext.Surveys.Include(s => s.Questions).FirstOrDefault(s => s.SurveyId == key);
            if (survey == null)
                return NotFound("Опрос не найден.");

            SurveyStatisticsViewModel viewModel = getSurveyInfo(survey);

            ViewBag.UserCount = SurveyHub.GetUserCount(survey.CCode);
            ViewBag.Limit = survey.Limit;

            return View(viewModel);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> ToggleTimer(int surveyId)
        {
            var survey = _dbcontext.Surveys.FirstOrDefault(s => s.SurveyId == surveyId);
            if (survey == null)
                return NotFound("Опрос не найден");

            survey.IsRunning = !survey.IsRunning;
            await _dbcontext.SaveChangesAsync();

            return Ok(new { IsRunning = survey.IsRunning });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> ClearSurveyUsers(int surveyId)
        {
            var survey = _dbcontext.Surveys.FirstOrDefault(s => s.SurveyId == surveyId);
            if (survey == null)
                return NotFound("Опрос не найден");

            survey.IsRunning = false;

            // Get users to be removed
            var usersToRemove = _dbcontext.Users.Where(u => u.SurveyId == surveyId).ToList();

            // Remove users from SignalR groups
            var hubClients = _hubContext.Clients;

            foreach (var user in usersToRemove) 
                await hubClients.Group(survey.CCode).SendAsync("LeaveSurvey");
            
            _dbcontext.Users.RemoveRange(usersToRemove);
            await _dbcontext.SaveChangesAsync();
            return Ok(survey.CCode);
        }
        /* Survey options end*/

        /* API */
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        public async Task<IActionResult> DeleteSurvey(int key, bool surveyDelete = true)
        {
            // Find the survey by key
            var survey = await _dbcontext.Surveys
                                         .Include(s => s.Questions)
                                         .ThenInclude(q => q.Answers)
                                         .FirstOrDefaultAsync(s => s.SurveyId == key);
            if (survey == null)
                return NotFound("Опрос не найден");

            _dbcontext.Users.RemoveRange(_dbcontext.Users.Where(u => u.SurveyId == key));

            if (surveyDelete)
            {
                // Deleting all dependent questions and answers
                foreach (var question in survey.Questions)
                    _dbcontext.Answers.RemoveRange(question.Answers);
                _dbcontext.Questions.RemoveRange(survey.Questions);
                _dbcontext.Surveys.Remove(survey);
            }

            await _dbcontext.SaveChangesAsync(); 

            return Ok();
        }

        [HttpGet]
        public IActionResult ExportFile(int key, String extension)
        {
            Survey survey = _dbcontext.Surveys.Include(s => s.Questions).FirstOrDefault(s => s.SurveyId == key);
            if (survey == null)
                return BadRequest("Опрос не найден.");

            SurveyStatisticsViewModel stats = getSurveyInfo(survey);
            if (stats == null)
                return BadRequest("Нет данных для создания файла.");

            if (extension.ToLower() == "csv")
                return ExportCSV(stats);
            else
                return ExportJSON(stats);
        }
        
        [HttpGet]
        public IActionResult ExportCSV(SurveyStatisticsViewModel stats)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Никнейм,Вопрос,Ответ");

            foreach (var user in stats.Users)
            {
                var userAnswers = stats.UserAnswers.Where(ua => ua.UserId == user.UserId);
                foreach (var ua in userAnswers)
                {
                    var question = stats.Questions.FirstOrDefault(q => q.QuestionId == ua.QuestionId);
                    var answer = stats.Answers.FirstOrDefault(a => a.AnswerId == ua.AnswerId);

                    sb.AppendLine($"{user.NickName},{question?.QuestionText},{answer?.AnswerText}");
                }
            }
            return File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", "csv_answers.csv");
        }

        [HttpGet]
        public IActionResult ExportJSON(SurveyStatisticsViewModel stats)
        {
            var jsonResult = new
            {
                Users = stats.Users.Select(user => new
                {
                    user.NickName,
                    Answers = stats.UserAnswers
                        .Where(ua => ua.UserId == user.UserId)
                        .Select(ua => new
                        {
                            Question = stats.Questions.FirstOrDefault(q => q.QuestionId == ua.QuestionId)?.QuestionText,
                            Answer = stats.Answers.FirstOrDefault(a => a.AnswerId == ua.AnswerId)?.AnswerText
                        })
                })
            };

            var json = JsonSerializer.Serialize(jsonResult, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            return File(Encoding.UTF8.GetBytes(json), "application/json", "json_answers.json");
        }

    }
}
