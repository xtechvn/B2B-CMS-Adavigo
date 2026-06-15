using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using B2B.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Flight
{
    [Authorize]
    public class FlightsController : Controller
    {
        private readonly B2CFlightService _adavigoService;
        private readonly B2BFlightService _B2BFlightService;
        public FlightsController(B2CFlightService adavigoService, B2BFlightService b2BFlightService)
        {
            _adavigoService = adavigoService;
            _B2BFlightService = b2BFlightService;
        }

        public async Task<IActionResult> Index(string dtcr = null, string dtcp = null)
        {
            var airline = await _B2BFlightService.GetListAPC(0);
            if (airline != null )
            {
                ViewBag.Airline = airline;
            }

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
        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Search(GetListFlightWarehouseModel searchModel)
        {
            var result = await _B2BFlightService.GetList(searchModel);
            if (result !=null )
            {
                return PartialView(result);
            }
            return PartialView();
        }  
        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Detail(int id)
        {
            try
            {
                var result = await _B2BFlightService.GetDetail(id);
                if (result != null)
                {

                    return Json(new { status = 0, data = result });
                }
            }
            catch(Exception ex)
            {
                return Json(new { status = -1, msg = ex.Message });
            }
           

            return Json(new { status = 1, msg = "Ch?a có data" });
        }

        [HttpGet]
        public JsonResult GetAdavigoSettings()
        {
            return Json(_adavigoService.GetAdavigoSettings());
        }

    }
}
