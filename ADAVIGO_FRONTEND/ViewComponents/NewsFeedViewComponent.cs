using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class NewsFeedViewComponent : ViewComponent
    {
        private readonly NewsService _NewsService;

        public NewsFeedViewComponent(NewsService newsService)
        {
            _NewsService = newsService;
        }

        public async Task<IViewComponentResult> InvokeAsync(bool isShowSlider = false)
        {
            var model = new NewsViewModel()
            {
                IsShowSlider = isShowSlider
            };

            try
            {
                model.NewsDatas = await _NewsService.GetNewsList();
            }
            catch
            {

            }
            return View(model);
        }
    }
}
