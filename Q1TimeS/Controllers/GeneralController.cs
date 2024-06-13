﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models.Db;

namespace Q1TimeS.Controllers
{
    public class GeneralController : Controller
    {
        private readonly MySqlContext _dbcontext;

        public GeneralController(MySqlContext dbcontext){
            _dbcontext = dbcontext;
        }

        [HttpGet]
        public IActionResult SurveysPage()
        /* Display of all surveys */
        {
            HttpContext.Session.SetString("user_session_key", HttpContext.Session.Id);
            var surveys = _dbcontext.Surveys.ToList();
            return View(surveys);
        }

        [HttpGet]
        public IActionResult ConnectToSurvey(int surveyId)
        {
            using var transaction = _dbcontext.Database.BeginTransaction();

            try
            {
                string sessionKey = HttpContext.Session.GetString("user_session_key");
                if (string.IsNullOrEmpty(sessionKey) )
                    HttpContext.Session.SetString("user_session_key", HttpContext.Session.Id);

                var existingUser = _dbcontext.Users.FirstOrDefault(u => 
                    u.SessionKey == sessionKey && u.SurveyId == surveyId);

                if (existingUser != null)
                    return Redirect("Workshop");

                _dbcontext.Users.Add(new User
                {
                    SurveyId = surveyId,
                    SessionKey = sessionKey
                });

                _dbcontext.SaveChanges();
                transaction.Commit();

                return Redirect("Workshop");
            }
            catch (Exception)
            {
                transaction.Rollback();
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }


        public IActionResult SurveyInfoPage()
        /* Display info about the selected survey */
        {
            return View();
        }

        // GET: GeneralController
        public ActionResult Index()
        {
            return View();
        }
    }
}
