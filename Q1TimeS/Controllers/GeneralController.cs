using Microsoft.AspNetCore.Mvc;

namespace Q1TimeS.Controllers
{
    public class GeneralController : Controller
    {
        public IActionResult Documentation (){
            return View();
        }

        public IActionResult About(){
            return View();
        }
    }
}
