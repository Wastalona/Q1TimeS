using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models;

namespace Q1TimeS.Controllers
{
    public class GeneralController : Controller
    {
        public IActionResult SurveysPage()
        /* Display of all surveys */
        {
            HttpContext.Session.SetString("user_session_key", HttpContext.Session.Id);

            List<Survey> surveys = new List<Survey>();

            return View(surveys);
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
