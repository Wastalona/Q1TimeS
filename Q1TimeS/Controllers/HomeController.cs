using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models;
using System.Diagnostics;

namespace Q1TimeS.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // General Views
        public IActionResult SurveysPage()
        /* Display of all surveys */
        {
            return View();
        }        

        public IActionResult SurveyInfoPage()
        /* Display info about the selected survey */
        {
            return View();
        }

        public IActionResult Index()
        /* Choice between administrator and user */
        {
            return View();
        }

        // Admin Views
        public IActionResult CreateSurveyPage()
        /* Page used to create a new survey */
        {
            return View();
        }

        public IActionResult SurveyPage()
        /* Basic survey page used for the template */
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}