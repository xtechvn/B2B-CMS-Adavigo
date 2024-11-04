using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class PagingViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(PagingModel pageModel)
        {
            return View(pageModel);
        }
    }
}
