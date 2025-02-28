using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class RoomPackageViewComponent : ViewComponent
    {
        private readonly HotelService _HotelService;

        public RoomPackageViewComponent(HotelService hotelService)
        {
            _HotelService = hotelService;
        }

        public async Task<IViewComponentResult> InvokeAsync(string cache_id, string room_id, int night_time, int view_type, string arrivalDate, string departureDate, bool isVinHotel)
        {
            HotelPackageDataModel models = new HotelPackageDataModel();
            try
            {
                models = await _HotelService.GetRoomPagekageList(cache_id, room_id, arrivalDate, departureDate, isVinHotel);
                models.night_time = night_time;
                models.view_type = view_type;
                models.guid_popup = Guid.NewGuid().ToString();
            }
            catch
            {

            }
            return View(models);
        }
    }
}
