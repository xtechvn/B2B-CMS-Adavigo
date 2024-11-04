using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class HotelFilterViewComponent : ViewComponent
    {
        private readonly HotelService _HotelService;

        public HotelFilterViewComponent(HotelService hotelService)
        {
            _HotelService = hotelService;
        }

        public async Task<IViewComponentResult> InvokeAsync(string cacheId)
        {
            var models = new FilterDataViewModel();
            try
            {
                models = await _HotelService.GetHotelFilter(cacheId);
            }
            catch
            {
                models.IsNoCacheData = true;
            }
            return View(models);
        }
    }
}
