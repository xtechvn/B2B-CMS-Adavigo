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

                var startDate = DateTime.ParseExact(input.arrivalDate, "dd/MM/yyyy", null);
                var endDate = DateTime.ParseExact(input.departureDate, "dd/MM/yyyy", null);
                int nights = (int)(endDate - startDate).TotalDays;
                models = await _HotelService.GetHotelRoomList(input);
                if(models!=null && models.rooms!=null && models.rooms.Count() > 0)
                {
                    models.night_time = nights < 1 ? 1 : nights;
                }
                ViewBag.Nights = nights < 1 ? 1 : nights;
            }
            catch
            {

            }
            return View(models);
        }
    }
}
