using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class HotelRoomViewComponent : ViewComponent
    {
        private readonly HotelService _HotelService;

        public HotelRoomViewComponent(HotelService hotelService)
        {
            _HotelService = hotelService;
        }

        public async Task<IViewComponentResult> InvokeAsync(HotelSearchParamModel input)
        {
            HotelRoomGridModel models = new HotelRoomGridModel();
            try
            {
                models = await _HotelService.GetHotelRoomList(input);
                var startDate = DateTime.Parse(input.arrivalDate);
                var endDate = DateTime.Parse(input.departureDate);
                int nights = (int)(endDate - startDate).TotalDays;
                ViewBag.Nights = nights < 1 ? 1 : nights;
            }
            catch
            {

            }
            return View(models);
        }
    }
}
