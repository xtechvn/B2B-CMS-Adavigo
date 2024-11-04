using ADAVIGO_FRONTEND.Controllers.Tour.Bussiness;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Models.Tour.V2;
using LIB.Utilities.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Tour
{
    public class TourController : Controller
    {
        private readonly AdavigoTourService _adavigoTourService;
        private readonly IMemoryCache _cache;

        public TourController( AdavigoTourService adavigoTourService, IMemoryCache cache)
        {
            _cache = cache;

            _adavigoTourService = adavigoTourService;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Detail()
        {
            return View();
        }
        public IActionResult Listing()
        {
            return View();
        }
        public IActionResult Search()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> LocationStart(TourLocationRequestModel request)
        {
            if (request.tour_type <= 0)
            {
                return BadRequest();
            }

            //-- memory_cache:
            var cacheKey = CacheKeys.TourLocationStart + EncryptionHelper.MD5Hash(JsonConvert.SerializeObject(request)); // Đặt khóa cho cache
            if (!_cache.TryGetValue(cacheKey, out var result)) // Kiểm tra xem có trong cache không
            {
                 result = await _adavigoTourService.GetLocationStart(request);
                if (result != null)
                {
                    // Lưu vào cache với thời gian hết hạn 
                    _cache.Set(cacheKey, result, TimeSpan.FromSeconds(120));
                }
            }
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> LocationEnd(TourLocationRequestModel request)
        {
            if (request.tour_type <= 0 || request.tour_type<-1)
            {
                return BadRequest();
            }
            //-- memory_cache:
            var cacheKey = CacheKeys.TourLocationEnd + EncryptionHelper.MD5Hash(JsonConvert.SerializeObject(request)); // Đặt khóa cho cache
            if (!_cache.TryGetValue(cacheKey, out var result)) // Kiểm tra xem có trong cache không
            {
                result = await _adavigoTourService.GetLocationEnd(request);
                if (result != null)
                {
                    // Lưu vào cache với thời gian hết hạn 
                    _cache.Set(cacheKey, result, TimeSpan.FromSeconds(120));
                }
            }
            return Ok(result);
        }
    }
}
