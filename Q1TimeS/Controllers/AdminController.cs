using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Q1TimeS.Controllers
{
    public class AdminController : Controller
    {
        [HttpGet, HttpPost]
        public IActionResult Auth()
        {
            return View();
        }

        [Authorize]
        [HttpGet, HttpPost]
        public IActionResult Workshop()
        {
            return View();
        }

        [Authorize]
        public IActionResult CompositeSurvey()
        /* Page used to create a new composite survey */
        {
            return View();
        }

        [Authorize]
        public IActionResult SimpleSurvey()
        /* Page used to create a new simple survey */
        {
            return View();
        }

        public IActionResult SurveyPage()
        /* Basic survey page used for the template */
        {
            return View();
        }
    }
}
