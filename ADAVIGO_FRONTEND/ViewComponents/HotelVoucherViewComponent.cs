using ADAVIGO_FRONTEND.Models.Configs;
using ADAVIGO_FRONTEND.Models.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class HotelVoucherViewComponent : ViewComponent
    {
        private readonly HotelService _hotelService;
        public HotelVoucherViewComponent(HotelService hotelService)
        {
            _hotelService = hotelService;
        }
        public async Task<IViewComponentResult> InvokeAsync(string hotel_id)
        {
            ViewBag.List = await _hotelService.GetVoucherList(new Models.Flights.TrackingVoucher.B2BVoucherListRequest()
            {
                hotel_id = hotel_id,
            });

            return View();
        }
    }
}
