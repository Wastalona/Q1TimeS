using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models;

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
        [HttpGet]
        public IActionResult CompositeSurvey()
        /* Page used to create a new composite survey */
        {
            return View();
        }
        
        [Authorize]
        [HttpPost]
        public IActionResult CompositeSurvey([FromBody] SurveyModel model)
        /* Page used to create a new composite survey */
        {
            if (ModelState.IsValid) return Redirect("Workshop");
            else return BadRequest(ModelState);
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
