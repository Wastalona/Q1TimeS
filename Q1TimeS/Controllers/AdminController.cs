using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Q1TimeS.Models.Db;
using System.Diagnostics.Eventing.Reader;

namespace Q1TimeS.Controllers
{
    public class AdminController : Controller
    {
        private readonly MySqlContext _dbcontext;

        public AdminController(MySqlContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpGet, HttpPost]
        public IActionResult Auth()
        {
            return View();
        }

        [Authorize]
        [HttpGet, HttpPost]
        public IActionResult Workshop()
        {
            var survey = _dbcontext.Surveys.ToList();
            return View(survey);
        }

        [Authorize]
        [HttpGet]
        public IActionResult CompositeSurvey()
        /* Page used to create a new composite survey */
        {
            return View();
        }
        
        [Authorize]
        [HttpPost]
        public IActionResult CompositeSurvey([FromBody] Survey model)
        /* Page used to create a new composite survey */
        {
            if (ModelState.IsValid)
            {
                // Start transaction
                using var transaction = _dbcontext.Database.BeginTransaction();

                try
                {
                    // Add surveys
                    _dbcontext.Surveys.Add(model);
                    _dbcontext.SaveChangesAsync();

                    // Add question and answers
                    foreach (var question in model.Questions)
                    {
                        question.QuestionId = 0;  // Reset id
                        question.SurveyId = model.SurveyId;
                        _dbcontext.Questions.Add(question);
                        _dbcontext.SaveChangesAsync();

                        foreach (var answer in question.Answers)
                        {
                            answer.AnswerId = 0;  // Reset id
                            answer.QuestionId = question.QuestionId;
                            _dbcontext.Answers.Add(answer);
                        }
                    }

                    _dbcontext.SaveChangesAsync();

                    // Commit transaction
                    transaction.Commit();

                    return Redirect("Workshop");
                }
                catch (Exception)
                {
                    // In case of an error, we roll back the transaction
                    transaction.RollbackAsync();
                    return StatusCode(500, "Внутренняя ошибка сервера.");
                }
            }
            else{
                return BadRequest(ModelState);
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult Statistics(string key)
        {
            ViewBag.Key = key;
            return View();
        }
    }
}
