using ADAVIGO_FRONTEND.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ADAVIGO_FRONTEND.Controllers.Flight
{
    [Authorize]
    public class FlightsController : Controller
    {
        private readonly B2CFlightService _adavigoService;
        public FlightsController(B2CFlightService adavigoService)
        {
            _adavigoService = adavigoService;
        }

        public IActionResult Index(string dtcr = null, string dtcp = null)
        {
            return View();

        }
        public IActionResult CustomerInfo()
        {          
            return View();
        }

        public IActionResult Payment()
        {
            return View();
        }

        public IActionResult Notification()
        {
            return View();
        }

        public IActionResult FlightList()
        {        
            return View();
        }

        public IActionResult Account()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAdavigoSettings()
        {
            return Json(_adavigoService.GetAdavigoSettings());
        }

    }
}
