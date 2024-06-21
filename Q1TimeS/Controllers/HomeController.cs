using Microsoft.AspNetCore.Mvc;
using Q1TimeS.Models;
using System.Diagnostics;

namespace Q1TimeS.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger){
            _logger = logger;
        }

        // The method of verifying the user's session key
        private bool checkUserSessionKey(){
            return HttpContext.Session.Keys.Contains("user_session_key");
        }


        private string getTokenCookie(){
            return Request.Cookies["token"];
        }

        [HttpGet]
        public IActionResult Index()
        /* Choice between administrator and user */
        {
            ViewBag.ActiveCard = null;
            if (checkUserSessionKey())
                ViewBag.ActiveCard = "user";
            if (!string.IsNullOrEmpty(getTokenCookie()))
                ViewBag.ActiveCard = "admin";
            return View();
        }

        [HttpGet]
        public IActionResult Logout()
        /* Removing user and administrator roles */
        {
            if (checkUserSessionKey())
                HttpContext.Session.Remove("user_session_key");
            if (!string.IsNullOrEmpty(getTokenCookie()))
                Response.Cookies.Delete("token");

            return Redirect("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error(){
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}