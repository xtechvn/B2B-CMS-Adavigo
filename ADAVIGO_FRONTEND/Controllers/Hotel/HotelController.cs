using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.ENTITIES.ViewModels.Hotels;
using LIB.Utilities.Common;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;
using OfficeOpenXml.FormulaParsing.Utilities;
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
        private readonly BookingService _BookingService;
        public HotelController(HotelService hotelService, IConfiguration configuration, IMemoryCache memoryCache, HomeService homeService, BookingService BookingService)
        {
            _HotelService = hotelService;
            _KeyEncodeParam = configuration["KeyEncodeParam"];
            _MemoryCache = memoryCache;
            _HomeService = homeService;
            _BookingService = BookingService;
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
        public IActionResult SaveCustomerData(long BookingId)
        {
            try
            {
                var DetailRequestHotelBooking = _BookingService.GetDetailRequestHotelBooking(BookingId).Result;

                var data = new HotelOrderDataModel();
                data.hotelName = DetailRequestHotelBooking.HotelName;
                data.hotelID = DetailRequestHotelBooking.HotelId;
                data.telephone = DetailRequestHotelBooking.telephone;
                data.email = DetailRequestHotelBooking.email;
                data.arrivalDate = DetailRequestHotelBooking.arrivalDate;
                data.departureDate = DetailRequestHotelBooking.departureDate;

                data.bookingID = BookingId.ToString();
                if (DetailRequestHotelBooking.Rooms != null)
                {
                    data.numberOfAdult = (int)DetailRequestHotelBooking.Rooms.Sum(s => s.NumberOfAdult);
                    data.numberOfChild = (int)DetailRequestHotelBooking.Rooms.Sum(s => s.NumberOfChild);
                    data.numberOfInfant = (int)DetailRequestHotelBooking.Rooms.Sum(s => s.NumberOfInfant);
                }
                var rooms = new List<RoomOrderData>();
                if (DetailRequestHotelBooking.Rates != null)
                {
                    foreach (var item in DetailRequestHotelBooking.Rooms.Where(s=>s.IsRoomAvailable==(int)RoomAvailableStatus.CON_PHONG))
                    {

                        var rooms_detail = new RoomOrderData();
                        rooms_detail.room_number = item.NumberOfRooms.ToString();
                        rooms_detail.room_id = item.RoomTypeId;
                        rooms_detail.room_code = item.RoomTypeCode;
                        rooms_detail.room_name = item.RoomTypeName;
                        rooms_detail.adult = (int)item.NumberOfAdult;
                        rooms_detail.child = (int)item.NumberOfChild;
                        rooms_detail.infant = (int)item.NumberOfInfant;
                        rooms_detail.package_includes = item.PackageIncludes.Split(',');

                        var Package = new List<PackageOrderData>();
                        foreach (var item2 in DetailRequestHotelBooking.Rates.Where(s => s.HotelBookingRoomId == item.Id))
                        {
                            var Package_detail = new PackageOrderData();
                            Package_detail.package_id = item2.RatePlanId;
                            Package_detail.package_code = item2.RatePlanCode;
                            Package_detail.amount = (decimal)item2.TotalAmount;
                            Package_detail.profit = (decimal)item2.Profit;
                            Package_detail.arrival_date = ((DateTime)item2.StartDate).ToString("yyyy-MM-dd");
                            Package_detail.departure_date = ((DateTime)item2.EndDate).ToString("yyyy-MM-dd");
                            Package_detail.allotment_id = item2.AllotmentId;
                            Package_detail.package_includes = item2.PackagesInclude.Split(',');
                            Package.Add(Package_detail);
                        }
                        rooms_detail.packages = Package;
                        rooms.Add(rooms_detail);
                    }
                }
                data.rooms = rooms;
                data.extrapackages = DetailRequestHotelBooking.ExtraPackages;

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
                            if (departure_date == DateTime.MinValue || departure_date < departure_date_package)
                            {
                                departure_date = departure_date_package;
                            }

                        }
                    }
                    data.departureDate = departure_date.ToString("yyyy-MM-dd");
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

                _BookingService.UpdateRequestHotelBooking(Convert.ToInt32(cache_data.bookingID));
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
                decimal extrapackages_money = 0;
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
                if(cache_data.extrapackages != null && cache_data.extrapackages.Count > 0){
                    total_money += cache_data.extrapackages.Sum(s => (decimal)s.Amount);
                    extrapackages_money += cache_data.extrapackages.Sum(s => (decimal)s.Amount);
                }
                jsonData.Add("rooms", JArray.FromObject(rooms));
                jsonData.Add("extrapackages", cache_data.extrapackages != null && cache_data.extrapackages.Count > 0 ? JArray.FromObject( cache_data.extrapackages):null);
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
                    extrapackagesMoney = extrapackages_money,
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
            var fund_datas = _HomeService.GetAmountDeposit().Result;
            ViewBag.Fund = new FundDataModel();
            if (fund_datas != null && fund_datas.Count() > 0)
            {
                ViewBag.Fund = fund_datas.Where(x => x.service_type == 1).FirstOrDefault();
            }
            return View(model);
        }

        public async Task<IActionResult> PopupPaymentHotel(PaymentHotelModel model)
        {
            ViewBag.QRCode = await _HotelService.GetVietQRCode(model);
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
                if (model.payment_type == (int)PaymentType.KY_QUY)
                {
                    var data = await _HotelService.CheckFundPaymentAvailable(new CheckFundAvailableRequest()
                    {
                        booking_id = model.booking_id,
                        service_type = 1
                    });
                    if (data != null && !data.data)
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
                    var data = await _HotelService.SaveHotelPayment(model);
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

        public IActionResult OrderSuccess(string order_no, int? payment_type)
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
        public async Task<IActionResult> GetHotelCommitLocation(string id = "")
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
        [HttpPost]
        public async Task<IActionResult> SaveRequestData(HotelOrderDataModel data)
        {
            try
            {
                var data_Request = new BookingHotelB2BViewModel();
                decimal total_money = 0;
                if (data.rooms != null)
                {
                    var rooms = new List<BookingHotelB2BViewModelRooms>();

                    var detai = new BookingHotelB2BViewModelDetail();
                    detai.email = data.email;
                    detai.telephone = data.telephone;
                    detai.image_thumb = "";
                    detai.address = "";
                    detai.note = data.note;
                    detai.check_out_time = DateTime.Parse(data.arrivalDate);
                    detai.check_in_time = DateTime.Parse(data.departureDate);

                    var search = new BookingHotelB2BViewModelSearch();
                    search.arrivalDate = data.arrivalDate;
                    search.departureDate = data.departureDate;
                    search.hotelID = data.hotelID;
                    search.numberOfRoom = data.rooms.Sum(s => Convert.ToInt32(s.room_number));
                    search.numberOfAdult = data.rooms.Sum(s=>s.adult);
                    search.numberOfChild = data.rooms.Sum(s => s.child);
                    search.numberOfInfant = data.rooms.Sum(s => s.infant);

                    foreach (var room in data.rooms)
                    {
                        var room_detail = new BookingHotelB2BViewModelRooms();
                        var rates = new List<BookingHotelB2BViewModelRates>();
                        decimal total_price = 0, total_profit = 0, total_amount = 0;
                        foreach (var pack in room.packages)
                        {
                            total_price += (pack.amount - pack.profit);
                            total_profit += pack.profit;
                            total_amount += pack.amount;
                            var rates_detail = new BookingHotelB2BViewModelRates();
                            rates_detail.arrivalDate = pack.arrival_date;
                            rates_detail.departureDate = pack.departure_date;
                            rates_detail.rate_plan_code = pack.package_code;
                            rates_detail.rate_plan_id = pack.package_id;
                            rates_detail.allotment_id = pack.allotment_id;
                            rates_detail.price = (double)(pack.amount - pack.profit);
                            rates_detail.profit = (double)pack.profit;
                            rates_detail.total_amount = (double)pack.amount;
                            rates_detail.package_includes = (List<string>)pack.package_includes;
                            rates.Add(rates_detail);
                        }
                        if (search.numberOfAdult == 0 && search.numberOfChild == 0 && search.numberOfInfant == 0)
                        {
                            search.numberOfAdult = room.adult;
                            search.numberOfChild = room.child;
                            search.numberOfInfant = room.infant;
                        }
                        room_detail.numberOfRooms = (short?)Convert.ToInt32(room.room_number);
                        room_detail.room_type_id = room.room_id;
                        room_detail.room_type_code = room.room_code;
                        room_detail.room_type_name = room.room_name;
                        room_detail.numberOfAdult = room.adult;
                        room_detail.numberOfChild = room.child;
                        room_detail.numberOfInfant = room.infant;
                        room_detail.package_includes = (List<string>)room.package_includes;
                        room_detail.price = (double)total_price;
                        room_detail.profit = (double)total_profit;
                        room_detail.total_amount = (double)total_amount;
                        room_detail.special_request = string.Empty;
                        room_detail.rates = rates;
                        rooms.Add(room_detail);

                        total_money += total_amount;
                    }
                    data_Request.rooms = rooms;
                    data_Request.detail = detai;
                    data_Request.search = search;
                }
                var SaveRequestHotel = await _HotelService.SaveRequestHotel(data_Request);
                return new JsonResult(new
                {
                    isSuccess = true,
                    id = SaveRequestHotel
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
