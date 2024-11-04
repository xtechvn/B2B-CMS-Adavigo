using ADAVIGO_FRONTEND.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ADAVIGO_FRONTEND.Controllers.Flight
{
    [Authorize]
    public class FlightBookingController : Controller
    {
        private readonly B2CFlightService _adavigoService;
        public FlightBookingController(B2CFlightService adavigoService)
        {
            _adavigoService = adavigoService;
        }

        public IActionResult Index()
        {
            return View();

        }
        public IActionResult OrderDetail()
        {
            return View();
        }


    }
}
