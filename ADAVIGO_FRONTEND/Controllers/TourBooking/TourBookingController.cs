using ADAVIGO_FRONTEND.Controllers.Tour.Bussiness;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.Models.Tour.TourOrders;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.TourBooking
{
    public class TourBookingController : Controller
    {
        private readonly AdavigoTourService _adavigoTourService;
        public TourBookingController(AdavigoTourService adavigoTourService)
        {
           
            _adavigoTourService = adavigoTourService;
          ;
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> GetTourOrdersListing(TourOrdersListingRequest model)
        {
            var data = await _adavigoTourService.GetTourOrdersListing(model);
            if (data != null)
            {
                return PartialView(data.data);
            }
            return PartialView(new List<TourOrderListingResponseData>());
        }

        public async Task<IActionResult> TourOrderDetail(int id)
        {
            var request = new TourOrdersDetailRequest { tour_id = id };
            var data = await _adavigoTourService.GetTourOrderDetail(request);
            if (data == null || data.status != 0)
            {
                return View(new TourOrderDetailResponse());
            }
            return View(data.data);
        }
    }
}
