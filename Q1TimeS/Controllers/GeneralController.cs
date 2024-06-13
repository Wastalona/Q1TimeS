using Microsoft.AspNetCore.Mvc;

namespace Q1TimeS.Controllers
{
    public class GeneralController : Controller
    {
        public IActionResult Documenation (){
            return View();
        }

        public IActionResult About(){
            return View();
        }
    }
}
