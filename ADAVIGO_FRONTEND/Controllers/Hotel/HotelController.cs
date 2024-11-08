﻿using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.ENTITIES.ViewModels.Hotels;
using LIB.Utilities.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Utilities.Contants;

namespace ADAVIGO_FRONTEND.Controllers.Hotel
{
    [Authorize]
    public class HotelController : Controller
    {
        private readonly HotelService _HotelService;
        private readonly string _KeyEncodeParam;
        private IMemoryCache _MemoryCache;
        private readonly HomeService _HomeService;
        public HotelController(HotelService hotelService, IConfiguration configuration, IMemoryCache memoryCache, HomeService homeService)
        {
            _HotelService = hotelService;
            _KeyEncodeParam = configuration["KeyEncodeParam"];
            _MemoryCache = memoryCache;
            _HomeService = homeService;
        }

        public IActionResult Index(string filter)
        {
            var model = new HotelSearchParamModel()
            {
                arrivalDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy"),
                departureDate = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                rooms = new RoomData[]
                {
                    new RoomData
                    {
                        room = 1,
                        number_adult =2,
                        number_child = 0,
                        number_infant = 0
                    }
                }
            };

            try
            {
                if (!string.IsNullOrEmpty(filter))
                {
                    model = JsonConvert.DeserializeObject<HotelSearchParamModel>(filter);
                    model.arrivalDate = DateTime.Parse(model.arrivalDate).ToString("dd/MM/yyyy");
                    model.departureDate = DateTime.Parse(model.departureDate).ToString("dd/MM/yyyy");
                    model.quickSearch = 1;
                }
            }
            catch
            {

            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSuggestHotel(string textSearch, int search_type, int limit)
        {
            try
            {
                // var datas1 = await _HotelService.GetSuggestHotel(textSearch, limit);
                var datas = await _HotelService.GetHotelList(textSearch, search_type);
                var results = new List<HotelESSuggestModel>();
               
                if (datas != null && datas.Any())
                {
                    results.AddRange(datas);

                }

                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Success",
                    data = results
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public IActionResult SearchHotel(HotelSearchParamModel model)
        {
            return ViewComponent("HotelListing", model);
        }

        [HttpPost]
        public async Task<IActionResult> GetBlockedImageUrl(IEnumerable<string> url_images)
        {
            try
            {
                var imgs = await _HotelService.GetBlockedImageUrl(url_images);

                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Thành công",
                    data = imgs
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetHotelPrice(string cacheId)
        {
            try
            {
                var prices = await _HotelService.GetHotelPrice(cacheId);

                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Thành công",
                    data = prices
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        public IActionResult GetHotelFilter(string cacheId)
        {
            return ViewComponent("HotelFilter", new { cacheId = cacheId });
        }


        public IActionResult Detail(string filter)
        {
            //var strJsonData = CommonHelper.Decode(token, _KeyEncodeParam);
            var model = JsonConvert.DeserializeObject<RoomDetailViewModel>(filter);
            return View(model);
        }

        public IActionResult PopupRoomDetail()
        {
            return View();
        }

        public IActionResult PopupRoomPackageDetail(RoomPackagePopupModel model)
        {
            return View(model);
        }

        public IActionResult GetRoomPackages(string cache_id, string room_id, int night_time, int view_type, DateTime? arrival_date, DateTime? departure_date, bool isVinHotel)
        {
            return ViewComponent("RoomPackage", new { cache_id, room_id, night_time, view_type, arrivalDate = arrival_date, departureDate = departure_date, isVinHotel });
        }

        public IActionResult MultiplePackageOfRoom(MultiplePackageRoomModel model)
        {
            return View(model);
        }

        public async Task<IActionResult> GetOtherRoomPackages(HotelPackageParamModel model)
        {
            var cache_id = await _HotelService.GetOtherRoomPagekageList(model);
            var night_time = (int)(model.departure_date - model.arrival_date).TotalDays;
            return ViewComponent("RoomPackage", new { cache_id, model.room_id, night_time = night_time, view_type = 1, arrivalDate = model.arrival_date, departureDate = model.departure_date, model.isVinHotel });
        }

        public IActionResult PopupRoomPackagesOfRoom(MultiplePackageRoomSearchModel model)
        {
            model.night_time = (int)(model.departure_date - model.arrival_date).TotalDays;
            return View(model);
        }

        [HttpPost]
        public IActionResult SaveCustomerData(HotelOrderDataModel data)
        {
            try
            {
                var cache_name = Guid.NewGuid().ToString();
                _MemoryCache.Set(cache_name, data, TimeSpan.FromMinutes(30));
                try
                {
                    DateTime departure_date = DateTime.ParseExact(data.departureDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    foreach (var room in data.rooms)
                    {
                        foreach (var rate in room.packages)
                        {
                            DateTime departure_date_package = DateTime.ParseExact(rate.departure_date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                            if(departure_date==DateTime.MinValue || departure_date < departure_date_package)
                            {
                                departure_date = departure_date_package;
                            }

                        }
                    }
                    data.departureDate=departure_date.ToString("yyyy-MM-dd");
                }
                catch { }
                return new JsonResult(new
                {
                    isSuccess = true,
                    url = Url.Action("Order", "Hotel", new { token = cache_name })
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        public IActionResult Order(string token)
        {
            HotelOrderDataModel model = null;
            var cache_data = _MemoryCache.Get<HotelOrderDataModel>(token);

            if (cache_data != null)
            {
                model = cache_data;
                model.orderToken = token;
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> SaveOrder(string dataObject)
        {
            try
            {
                var jsonData = JObject.Parse(dataObject);
                var cache_name = jsonData["order_token"].ToString();
                var cache_data = _MemoryCache.Get<HotelOrderDataModel>(cache_name);
                if (cache_data == null)
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Hết thời hạn để Booking"
                    });
                }


                jsonData.Add("search", JObject.FromObject(new
                {
                    arrivalDate = cache_data.arrivalDate,
                    departureDate = cache_data.departureDate,
                    hotelID = cache_data.hotelID,
                    numberOfRoom = cache_data.rooms.Count(),
                    numberOfAdult = cache_data.rooms.Sum(s => s.adult),
                    numberOfChild = cache_data.rooms.Sum(s => s.child),
                    numberOfInfant = cache_data.rooms.Sum(s => s.infant)
                }));

                jsonData.Add("detail", JObject.FromObject(new
                {
                    email = cache_data.email,
                    telephone = cache_data.telephone
                }));

                var rooms = new List<dynamic>();
                decimal total_money = 0;
                if (cache_data.rooms != null && cache_data.rooms.Any())
                {
                    var arrayGuest = JArray.Parse(jsonData["guests"].ToString());
                    foreach (var room in cache_data.rooms)
                    {
                        var rates = new List<dynamic>();
                        decimal total_price = 0, total_profit = 0, total_amount = 0;
                        foreach (var pack in room.packages)
                        {
                            total_price += (pack.amount - pack.profit);
                            total_profit += pack.profit;
                            total_amount += pack.amount;

                            rates.Add(new
                            {
                                arrivalDate = pack.arrival_date,
                                departureDate = pack.departure_date,
                                rate_plan_code = pack.package_code,
                                rate_plan_id = pack.package_id,
                                allotment_id = pack.allotment_id,
                                price = pack.amount - pack.profit,
                                profit = pack.profit,
                                total_amount = pack.amount,
                                package_includes = pack.package_includes,
                            });
                        }

                        rooms.Add(new
                        {
                            room_number = room.room_number,
                            room_type_id = room.room_id,
                            room_type_code = room.room_code,
                            room_type_name = room.room_name,
                            numberOfAdult = room.adult,
                            numberOfChild = room.child,
                            numberOfInfant = room.infant,
                            package_includes = room.package_includes,
                            price = total_price,
                            profit = total_profit,
                            total_amount = total_amount,
                            special_request = string.Empty,
                            rates = rates,
                            guests = arrayGuest != null && arrayGuest.Any() ? arrayGuest.Where(s => s["room"].ToString() == room.room_number) : null
                        });

                        total_money += total_amount;
                    }
                }

                jsonData.Add("rooms", JArray.FromObject(rooms));
                jsonData.Property("order_token").Remove();
                jsonData.Property("guests").Remove();

                var booking_id = await _HotelService.SaveHotel(JsonConvert.SerializeObject(jsonData));

                var payment_token = CommonHelper.Encode(JsonConvert.SerializeObject(new HotelPaymentModel
                {
                    hotelID = cache_data.hotelID,
                    hotelName = cache_data.hotelName,
                    arrivalDate = DateTime.Parse(cache_data.arrivalDate),
                    departureDate = DateTime.Parse(cache_data.departureDate),
                    numberOfRoom = cache_data.rooms.Count(),
                    numberOfAdult = cache_data.rooms.Sum(s => s.adult),
                    numberOfChild = cache_data.rooms.Sum(s => s.child),
                    numberOfInfant = cache_data.rooms.Sum(s => s.infant),
                    totalMoney = total_money,// model.rooms.Sum(x => x.amount),
                    bookingID = booking_id
                }), _KeyEncodeParam);

                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Thêm booking thành công",
                    data = HttpUtility.UrlEncode(payment_token)
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        public IActionResult Payment(string booking)
        {
            //booking = "OmpYCSIvLS0lVFNFXlVXamhkSxc5DgUXLQZRCzNoe0YqHsKIBAdGHeG7uz9mM1AiFVFAY2QSByQ4KBIAGi0GGwNMYHN0VwdlTEFEbHgIMmZ6e1RRTFlXTUpMPjQ2BkclFAMXBSlEA3RwY1ZRRF1KX1BDamgSVwVrUUFIcXgSSnQkNAkDExsoCTQBNTxkXQR9Qx8HLCpVFBksAAAUGh1FVVRCeD8zClc0Ez4UAiBZCjJoe1RNVAcSAgQLKB4gLls3AB8GY3IASnQ+LhAAGiQIAQMXeGtwUQVhUUFccWQSBDklKg0PESAjTVxMbmh+UwZzTVMdMyxVFB8OY15DQlBfW1VMJw ==";
            booking = booking.Replace(' ', '+');
            var strJsonData = CommonHelper.Decode(booking, _KeyEncodeParam);
            var model = JsonConvert.DeserializeObject<HotelPaymentModel>(strJsonData);
            var fund_datas =  _HomeService.GetAmountDeposit().Result;
            ViewBag.Fund = new FundDataModel();
            if (fund_datas!=null && fund_datas.Count() > 0)
            {
                ViewBag.Fund = fund_datas.Where(x => x.service_type == 1).FirstOrDefault();
            }
            return View(model);
        }

        public async Task<IActionResult> PopupPaymentHotel(PaymentHotelModel model)
        {
            ViewBag.QRCode = await  _HotelService.GetVietQRCode(model);
            return View(model);
        }

        [HttpPost]
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
                if (model.payment_type==(int)PaymentType.KY_QUY)
                {
                    var data = await _HotelService.CheckFundPaymentAvailable(new CheckFundAvailableRequest()
                    {
                        booking_id=model.booking_id,
                        service_type=1
                    });
                    if(data!=null && !data.data)
                    {

                        return new JsonResult(new
                        {
                            isSuccess = false,
                            message = "Không thể thanh toán đơn hàng bằng ký quỹ do số dư không đủ, vui lòng nạp thêm hoặc liên hệ bộ phận CSKH"
                        });
                    }
                    var data_payment = await _HotelService.SaveHotelPayment(model);
                    if (data_payment != null)
                    {
                        var fund_payment =  _HotelService.ConfirmPaymentWithFund(new ConfirmPaymentWithFundRequest()
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
                    var data = await _HotelService.SaveHotelPayment(model);
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Thanh toán thành công",
                        data = data.order_no,
                        order_id= data.order_id
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
       
        public IActionResult OrderSuccess(string order_no,int? payment_type)
        {
            ViewBag.PaymentType = payment_type;
            ViewBag.OrderNo = order_no;
            ViewBag.ExpirationDate = DateTime.Now.AddHours(3);
            return View();
        }
         

        [HttpPost]
        public async Task<IActionResult> GetDataFromFile(IFormFile file)
        {
            try
            {
                var result_data = await _HotelService.ReadImportFile(file);
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = result_data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        public IActionResult HotelExclusiveListing()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetExclusiveHotel(HotelExclusiveRequest request_model)
        {
            try
            {
                var result_data = await _HotelService.ListHotelExclusive(request_model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = result_data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetExclusiveHotelPosition(HotelExclusiveRequest request_model)
        {
            try
            {
                request_model.position_type = 1;
                var result_data = await _HotelService.ListHotelExclusivePosition(request_model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = result_data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetExclusiveHotelDetail(HotelExclusiveDetailRequest request_model)
        {
            try
            {
                var result_data = await _HotelService.ListHotelExclusiveDetail(request_model);
                if(result_data != null)
                {
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        data = result_data
                    });
                }
                return new JsonResult(new
                {
                    isSuccess = false
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        public IActionResult HotelExclusives()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelExclusiveFilter()
        {
            try
            {
                var data = await _HotelService.GetHotelExclusiveFilter();

                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Thành công",
                    data = data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        public IActionResult HotelCommitListing()
        {
            return View();
        }
        public IActionResult HotelCommit()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelCommit(HotelExclusiveRequest request_model)
        {
            try
            {
                var result_data = await _HotelService.GetHotelCommit(request_model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = result_data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelCommitLocation(string id="")
        {
            try
            {
                var result_data = await _HotelService.GetHotelCommitLocation();
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = result_data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelCommitDetail(HotelExclusiveDetailRequest request_model)
        {
            try
            {
                var result_data = await _HotelService.GetHotelCommitDetail(request_model);
                if (result_data != null)
                {
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        data = result_data
                    });
                }
                return new JsonResult(new
                {
                    isSuccess = false
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }
    }
}
