
using ADAVIGO_FRONTEND.Models.News.FindArticle;
using ADAVIGO_FRONTEND.Models.News.GetDetail;
using ADAVIGO_FRONTEND.Models.News.GetListByCategoryId;
using ADAVIGO_FRONTEND.Models.News.GetListByTag;
using ADAVIGO_FRONTEND.Models.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly B2CFlightService _adavigoService;
        public NewsController( B2CFlightService adavigoService)
        {
            _adavigoService = adavigoService;
        }
 

        [HttpGet]
        [Route("getNewsCategory")]
        public async Task<IActionResult> GetNewsCategory()
        {
            var result = await _adavigoService.GetNewsCategory();

            return Ok(result);
        }

        [HttpPost]
        [Route("getNewsByCategoryId")]
        public async Task<IActionResult> GetNewsByCategoryId(GetListByCategoryIdRequest request)
        {
            var result = await _adavigoService.GetNewsByCategoryId(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getNewsByCategoryIdV2")]
        public async Task<IActionResult> GetNewsByCategoryIdV2(GetListByCategoryIdRequest request)
        {
            var result = await _adavigoService.GetNewsByCategoryIdV2(request);

            return Ok(result);
        }

        [HttpGet]
        [Route("getMostViewedArticles")]
        public async Task<IActionResult> GetMostViewedArticles()
        {
            var result = await _adavigoService.GetMostViewedArticles();

            return Ok(result);
        }

        [HttpPost]
        [Route("getNewsDetail")]
        public async Task<IActionResult> GetNewsDetail(GetNewDetailRequest request)
        {
            var result = await _adavigoService.GetNewsDetail(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("findArticle")]
        public async Task<IActionResult> FindArticle(FindArticleRequest request)
        {
            var result = await _adavigoService.FindArticle(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getNewsByTag")]
        public async Task<IActionResult> GetNewsByTag(GetListByTagRequest request)
        {
            var result = await _adavigoService.GetNewsByTag(request);

            return Ok(result);
        }
    }
}
