using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class HotelListingViewComponent : ViewComponent
    {
        private readonly HotelService _HotelService;

        public HotelListingViewComponent(HotelService hotelService)
        {
            _HotelService = hotelService;
        }

        public async Task<IViewComponentResult> InvokeAsync(HotelSearchParamModel input)
        {
            HotelDataModel models = new HotelDataModel();
            try
            {
                models = await _HotelService.SearchHotel(input);
                try
                {
                    var startDate = DateTime.Parse(input.arrivalDate);
                    var endDate = DateTime.Parse(input.departureDate);
                    int nights = (int)(endDate - startDate).TotalDays;

                    ViewBag.Nights = nights < 1 ? 1 : nights;

                }
                catch
                {
                    var startDate = DateTime.ParseExact(input.arrivalDate, "dd/MM/yyyy", null);
                    var endDate = DateTime.ParseExact(input.departureDate, "dd/MM/yyyy", null);
                    int nights = (int)(endDate - startDate).TotalDays;

                    ViewBag.Nights = nights < 1 ? 1 : nights;
                }
               
            }
            catch
            {

            }
            return View(models);
        }
    }
}
