using ADAVIGO_FRONTEND.Controllers.Tour.Bussiness;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Helpers;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.Models.Tour.TourBooking;
using ADAVIGO_FRONTEND.Models.Tour.TourDetail;
using ADAVIGO_FRONTEND.Models.Tour.TourListing;
using ADAVIGO_FRONTEND.Models.Tour.V2;
using ADAVIGO_FRONTEND.ViewModels;
using ADAVIGO_FRONTEND_B2C.Infrastructure.Utilities.Constants;
using B2B.Utilities.Contants;
using LIB.ENTITIES.ViewModels.Hotels;
using LIB.Utilities.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using Utilities.Contants;

namespace ADAVIGO_FRONTEND.Controllers.Tour
{
    public class TourController : Controller
    {
        private readonly AdavigoTourService _adavigoTourService;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private readonly AccountService _AccountService;
        private readonly HomeService _HomeService;
        private IMemoryCache _MemoryCache;
        private readonly string _KeyEncodeParam;
        private readonly HotelService _HotelService;
        public TourController(AdavigoTourService adavigoTourService, IMemoryCache cache, IConfiguration configuration, AccountService AccountService, HomeService homeService, IMemoryCache memoryCache, HotelService hotelService)
        {
            _cache = cache;
            _HomeService = homeService;
            _adavigoTourService = adavigoTourService;
            _configuration = configuration;
            _AccountService = AccountService;
            _MemoryCache = memoryCache;
            _KeyEncodeParam = configuration["KeyEncodeParam"];
            _HotelService = hotelService;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Detail(string slug_location = "", string slug = "", int id = 0)
        {
            var TaskModel = _AccountService.GetDetail().Result;
            if (id <= 0)
            {
                return BadRequest();
            }
            var searchObj = new TourDetailRequest()
            {
                tour_id = id,
                type = TaskModel.client_type
            };
            var detail = _adavigoTourService.GetTourDetail(searchObj).Result;
            ViewBag.Slug = "detail";
            if (detail != null)
            {
                ViewBag.ImageDomain = _configuration["API_UPLOAD_IMAGE"];
                ViewBag.Location = detail.data;
                ViewBag.Slug = StringHelper.RemoveSpecialCharacters(StringHelper.RemoveUnicode(detail.data.tourName).ToLower()).Replace(" ", "-");
                string endpoint_main = detail.data.groupEndPoint1;
                switch (detail.data.tourType)
                {
                    case (int)TourType.INBOUND:
                        {
                            endpoint_main = detail.data.groupEndPoint2;
                        }
                        break;
                    case (int)TourType.OUTBOUND:
                        {
                            endpoint_main = detail.data.groupEndPoint3;
                        }
                        break;
                }
                endpoint_main = endpoint_main.Split(",")[0];
                endpoint_main = endpoint_main.Trim();
                ViewBag.SlugLocation = StringHelper.RemoveSpecialCharacters(StringHelper.RemoveUnicode(endpoint_main).ToLower()).Replace(" ", "-");
            }
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
        public IActionResult CustomerInfo()
        {
            var TaskModel = _AccountService.GetDetail().Result;
            ViewBag.UserManager = TaskModel;
            return View();
        }
        public async Task<IActionResult> SaveTour(TourPaymentModel model)
        {
            try
            {
                var TaskModel = _AccountService.GetDetail().Result;

                var BookingRequest = new TourBookingRequest();
                BookingRequest.account_client_id = TaskModel.id;
                BookingRequest.client_type = TaskModel.client_type.ToString();
                BookingRequest.start_date = DateTime.ParseExact(model.startDate, "dd/MM/yyyy", null);
                BookingRequest.voucher_name = model.voucherName == null ? "" : model.voucherName;
                BookingRequest.note = model.note == null ? "" : model.note;
                BookingRequest.is_daily = false;
                BookingRequest.tour_product_package_id = model.packageId;
                BookingRequest.tour_product_id = model.tourId;

                var contact = new TourBookingRequestContact();
                contact.firstName = model.firstName;
                contact.phoneNumber = model.phoneNumber;
                contact.email = model.email;
                BookingRequest.contact = contact;

                var guest = new TourBookingRequestGuest();
                guest.adult = model.numberOfAdult;
                guest.child = model.numberOfChild;
                BookingRequest.guest = guest;

                var booking_id = await _adavigoTourService.SaveBooking(BookingRequest);

                model.bookingId = booking_id.data;
                var cache_name = Guid.NewGuid().ToString();
                _MemoryCache.Set(cache_name, model, TimeSpan.FromMinutes(30));
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = cache_name
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                });
            }
            
        }
        public IActionResult Payment(string booking)
        {
            var model = _MemoryCache.Get<TourPaymentModel>(booking);

            var fund_datas = _HomeService.GetAmountDeposit().Result;
            ViewBag.Fund = new FundDataModel();
            if (fund_datas != null && fund_datas.Count() > 0)
            {
                ViewBag.Fund = fund_datas.Where(x => x.service_type == 1).FirstOrDefault();
            }
            return View(model);
        }
        public async Task<IActionResult> SavePayment(PaymentHotelModel model)
        {
            try
            {

                if (model.order_id <= 0)
                {
                    model.event_status = 0;
                    model.order_id = -1;
                }
                else
                {
                    model.event_status = 1;
                }
                if (model.payment_type == (int)PaymentType.KY_QUY)
                {
                    var data = await _HotelService.CheckFundPaymentAvailable(new CheckFundAvailableRequest()
                    {
                        booking_id = model.booking_id,
                        service_type = 5
                    });
                    if (data != null && !data.data)
                    {

                        return new JsonResult(new
                        {
                            isSuccess = false,
                            message = "Không thể thanh toán đơn hàng bằng ký quỹ do số dư không đủ, vui lòng nạp thêm hoặc liên hệ bộ phận CSKH"
                        });
                    }
                    var data_payment = await _adavigoTourService.SaveTourPayment(model);
                    if (data_payment != null)
                    {
                        var fund_payment = _HotelService.ConfirmPaymentWithFund(new ConfirmPaymentWithFundRequest()
                        {
                            booking_id = model.booking_id,
                            order_id = data_payment.order_id
                        });
                        return new JsonResult(new
                        {
                            isSuccess = true,
                            message = "Thanh toán thành công",
                            data = data_payment.order_no,
                            order_id = data_payment.order_id

                        });
                    }

                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Không thể thanh toán đơn hàng bằng ký quỹ, vui lòng liên hệ bộ phận CSKH"
                    });
                }
                else
                {
                    var data = await _adavigoTourService.SaveTourPayment(model);
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Thanh toán thành công",
                        data = data.order_no,
                        order_id = data.order_id
                    });
                }


            }
            catch
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = "Không thể thanh toán đơn hàng, vui lòng liên hệ bộ phận CSKH"
                });
            }
        }

        [HttpPost]
        public async Task<TourListingResponseExtension> SearchTour(TourListingRequest request)
        {
            var TaskModel = _AccountService.GetDetail().Result;
            request.clienttype = TaskModel.client_type;
            var detail = await _adavigoTourService.SearchTour(request);
            if(detail.data != null&& detail.data.Count > 0)
            {
                var listIMG = detail.data.Select(s => s.avatar).ToList();
                detail.listimages = listIMG;
            }
            return detail;
        }
        [HttpPost]
        public async Task<BaseObjectResponse<TourDetailResponseExtend>> TourDetail(TourDetailRequest request)
        {
            var TaskModel = _AccountService.GetDetail().Result;
            request.type = TaskModel.client_type;
            var detail = await _adavigoTourService.GetTourDetail(request);

            return detail;
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
            if (request.tour_type <= 0 || request.tour_type < -1)
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
