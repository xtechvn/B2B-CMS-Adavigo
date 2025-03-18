using ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.ENTITIES.ViewModels.Hotels;
using LIB.Utilities.Common;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
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
            return View(model);
        }
        public IActionResult Search(string filter)
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
                    //model.arrivalDate = DateTime.Parse(model.arrivalDate).ToString("dd/MM/yyyy");
                    //model.departureDate = DateTime.Parse(model.departureDate).ToString("dd/MM/yyyy");
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


        public async Task<IActionResult> Detail(string filter)
        {
            ViewBag.Hotel = new HotelGridInfoModel();
            ViewBag.FromDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy");
            ViewBag.ToDate = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy");
            ViewBag.Address = "";
            //var strJsonData = CommonHelper.Decode(token, _KeyEncodeParam);
            var model = JsonConvert.DeserializeObject<RoomDetailViewModel>(filter);
            model.hotelName = CommonHelper.RemoveSpecialCharacterExceptVietnameseCharacter(model.hotelName).Replace("quotequote", "\"").Replace("andand", "&");
            try
            {
                var hotel = await _HotelService.SearchHotel(new HotelSearchParamModel()
                {
                    arrivalDate = model.arrivalDate,
                    departureDate = model.departureDate,
                    hotelID = model.hotelID,
                    hotelName = model.hotelName,
                    isVinHotel = model.isVinHotel==null?"false": model.isVinHotel,
                    productType = "0",
                    quickSearch=model.quickSearch,
                    rooms=model.rooms
                });
                if (hotel != null && hotel.hotels != null && hotel.hotels.Any())
                {
                    ViewBag.Hotel = hotel.hotels.First();
                    model.hotelName = hotel.hotels.First().name;
                    ViewBag.Address = hotel.hotels.First().street;

                }
                var search_model = new HotelSearchParamModel()
                {
                    arrivalDate = model.arrivalDate,
                    departureDate = model.departureDate,
                    rooms = model.rooms,
                    hotelID = model.hotelID,
                    hotelName = model.hotelName,
                    isVinHotel = model.isVinHotel == null ? "false" : model.isVinHotel,
                    productType = "0",
                    quickSearch = 1
                };


                ViewBag.FromDate = DateTime.ParseExact(model.arrivalDate, "dd/MM/yyyy", null);
                ViewBag.ToDate = DateTime.ParseExact(model.departureDate, "dd/MM/yyyy", null);
                ViewBag.SearchModel = search_model;
            }
            catch (Exception ex)
            {

            }
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

        public IActionResult GetRoomPackages(string cache_id, string room_id, int night_time, int view_type, string arrival_date, string departure_date, bool isVinHotel)
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
                if(DetailRequestHotelBooking.voucher!=null && DetailRequestHotelBooking.voucher.id > 0)
                {
                    data.voucher = DetailRequestHotelBooking.voucher;
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
                    totalMoney =total_money,// model.rooms.Sum(x => x.amount),
                    extrapackagesMoney = extrapackages_money,
                    bookingID = booking_id
                }), _KeyEncodeParam);
                if (jsonData["voucher_code"]!=null && jsonData["voucher_code"].ToString() != null && jsonData["voucher_code"].ToString().Trim() != "")
                {
                    var response = await _HotelService.TrackingVoucher(new B2BTrackingVoucherRequest()
                    {
                        total_order_amount_before = (double)total_money,
                        project_type = 1,
                        service_id = cache_data.hotelID,
                        voucher_name = jsonData["voucher_code"].ToString()
                    });
                    double total_discount = 0;
                    double percent = Convert.ToDouble(response.value); // Giá trị giảm của voucher. Có thể là % hoặc vnđ                  
                   
                    foreach (var room in cache_data.rooms)
                    {
                        foreach(var rate in room.packages)
                        {
                            int nights = Convert.ToInt32((DateTime.ParseExact(rate.departure_date, "yyyy-MM-dd", null) - DateTime.ParseExact(rate.arrival_date, "yyyy-MM-dd", null)).TotalDays);
                            switch (response.type)
                            {
                                case "percent":
                                    //Tinh số tiền giảm theo %
                                    total_discount += ((double)rate.amount * Convert.ToDouble(percent / 100) * nights); 
                                    break;
                                case "vnd":
                                    total_discount += (percent * nights); //Math.Min(Convert.ToDouble(voucher.LimitTotalDiscount), total_fee_not_luxury) ;
                                    break;

                                default:break;
                                    
                            }
                        }
                    }
                    payment_token = CommonHelper.Encode(JsonConvert.SerializeObject(new HotelPaymentModel
                    {
                        hotelID = cache_data.hotelID,
                        hotelName = cache_data.hotelName,
                        arrivalDate = DateTime.Parse(cache_data.arrivalDate),
                        departureDate = DateTime.Parse(cache_data.departureDate),
                        numberOfRoom = cache_data.rooms.Count(),
                        numberOfAdult = cache_data.rooms.Sum(s => s.adult),
                        numberOfChild = cache_data.rooms.Sum(s => s.child),
                        numberOfInfant = cache_data.rooms.Sum(s => s.infant),
                        totalMoney = total_money - Convert.ToDecimal(total_discount),// model.rooms.Sum(x => x.amount),
                        extrapackagesMoney = extrapackages_money,
                        bookingID = booking_id
                    }), _KeyEncodeParam);
                }
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
                    detai.check_out_time = DateTime.ParseExact(data.arrivalDate, "dd/MM/yyyy", null);
                    detai.check_in_time = DateTime.ParseExact(data.departureDate, "dd/MM/yyyy", null);

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
                if(data.voucher!=null && data.voucher.id > 0)
                {
                    data_Request.voucher = data.voucher;
                }
                if(data.extrapackages!=null && data.extrapackages.Count > 0)
                {
                    data_Request.extrapackages = data.extrapackages;

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
        [HttpPost]
        public async Task<IActionResult> TrackingVoucher(B2BTrackingVoucherRequestFE request)
        {
            try
            {
                if(request.voucher_name == null || request.voucher_name.Trim() == "")
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Vui lòng điền đúng mã giảm giá"
                    });
                }
                if (request.total_order_amount_before <=0 && (request.token == null || request.token.Trim() == "")
                    && (request.detail==null|| request.detail.rooms ==null|| request.detail.rooms.Count() <= 0))
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Vui lòng chọn phòng trước khi áp dụng mã Voucher này"
                    });
                }
                if (request.total_order_amount_before <= 0 && (request.detail == null || request.detail.rooms == null || request.detail.rooms.Count() <= 0))
                {
                    var cache_data = _MemoryCache.Get<HotelOrderDataModel>(request.token);
                    if (cache_data != null)
                    {
                        if (request.detail == null) request.detail = new HotelOrderDataModel();
                        request.detail.hotelID = cache_data.hotelID;
                        request.detail.rooms = cache_data.rooms;
                        request.detail.extrapackages = cache_data.extrapackages;
                    }
                }
                decimal TotalMoney = (request.detail.rooms != null && request.detail.rooms.Count() > 0) ? request.detail.rooms.Sum(x=>x.packages.Sum(x=>x.amount)):0;
                double TotalEX = request.detail.extrapackages != null && request.detail.extrapackages.Count > 0 ? request.detail.extrapackages.Sum(s => (double)s.Amount) : 0;
                
                B2BTrackingVoucherRequest model_request = new B2BTrackingVoucherRequest()
                {
                    project_type = 1,
                    service_id=request.detail.hotelID,
                    total_order_amount_before = (double)TotalMoney + TotalEX,
                    user_id=0,
                    voucher_name=request.voucher_name
                };
                var response = await _HotelService.TrackingVoucher(model_request);
                double total_discount = 0;
                double percent = Convert.ToDouble(response.value); // Giá trị giảm của voucher. Có thể là % hoặc vnđ                  

                foreach (var room in request.detail.rooms)
                {
                    foreach (var rate in room.packages)
                    {
                        int nights = Convert.ToInt32((DateTime.ParseExact(rate.departure_date, "dd/MM/yyyy", null) - DateTime.ParseExact(rate.arrival_date, "dd/MM/yyyy", null)).TotalDays);
                        switch (response.type)
                        {
                            case "percent":
                                //Tinh số tiền giảm theo %
                                total_discount += ((double)rate.amount * Convert.ToDouble(percent / 100) * nights);
                                break;
                            case "vnd":
                                total_discount += (percent * nights); //Math.Min(Convert.ToDouble(voucher.LimitTotalDiscount), total_fee_not_luxury) ;
                                break;

                            default: break;

                        }
                    }
                }
                total_discount = Math.Round(total_discount, 0);
                response.discount = total_discount;
                response.total_order_amount_after= response.total_order_amount_before- total_discount;
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = response
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
        public async Task<IActionResult> GetVoucherList(B2BVoucherListRequest request)
        {
            try
            {
                if (request.hotel_id == null || request.hotel_id.Trim() == "")
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Dữ liệu gửi lên không chính xác"
                    });
                }
                var response = await _HotelService.GetVoucherList(request);
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = response
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
        public IActionResult CheckRequestHotel(List<RoomOrderData> model, double discount)
        {
            ViewBag.discount = discount;
            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelSurchage(string hotel_id)
        {
            var surcharge = await _HotelService.GetHotelSurcharge(hotel_id);
            return new JsonResult(new
            {
                isSuccess = true,
                data = surcharge
            });
        }

        public IActionResult HotelByLocation()
        {
            return View();
        }

        //[HttpPost]
        //public async Task<IActionResult> HotelByLocationAreaDetail(HotelExclusiveDetailRequest request_model)
        //{
        //    try
        //    {
        //        request_model.fromdate = DateTime.Now.AddDays(1);
        //        request_model.todate = DateTime.Now.AddDays(2);
        //        var result_data = await _HotelService.ListHotelExclusiveDetail(request_model);
        //        if (result_data != null)
        //        {
        //            return new JsonResult(new
        //            {
        //                isSuccess = true,
        //                data = result_data
        //            });
        //        }
        //        return new JsonResult(new
        //        {
        //            isSuccess = false
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResult(new
        //        {
        //            isSuccess = false,
        //            message = ex.Message
        //        });
        //    }
        //}
        [HttpPost]
        public async Task<IActionResult> HotelByLocationAreaDiscount(B2BVoucherListRequest request, double price)
        {
            try
            {
                if (request.hotel_id == null || request.hotel_id.Trim() == "" || price <= 0)
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Dữ liệu gửi lên không chính xác",
                        data = price
                    });
                }
                var response = await _HotelService.GetVoucherList(request);
                var amount = price;
                string discount_value = "";
                string code = "";
                if (response != null && response.Count > 0)
                {
                    code = response[0].code;
                    switch (response[0].unit)
                    {
                        case "percent":
                            {
                                amount = price - Math.Round((price * (double)response[0].price_sales / 100), 0);
                                discount_value = "-" + ((double)response[0].price_sales).ToString("N0") + "%";
                            }
                            break;
                        default:
                            {
                                amount = price - (double)response[0].price_sales;
                                discount_value = "-" + Math.Round((double)response[0].price_sales / 1000, 0) + "K";
                            }
                            break;
                    }
                }
                return new JsonResult(new
                {
                    isSuccess = true,
                    data = amount,
                    discount = discount_value,
                    code = code
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message,
                    data = price
                });
            }
        }
        [HttpPost]
        public IActionResult HotelListing(string title)
        {
            ViewBag.Title = title;
            try
            {

            }
            catch (Exception ex)
            { 
            
            }
            return View();
        }
       
        public IActionResult Listing(string name, int type = 0, int index = 1, int size = 30,int? committype=0)
        {
            ViewBag.name = name;
            ViewBag.type = type;
            ViewBag.index = index;
            ViewBag.size = size;
            ViewBag.committype = committype;
            switch (committype)
            {
                default:
                    {
                        ViewBag.Title = "Khách sạn giá sốc chỉ có trên Adavigo";
                        ViewBag.Avatar = "/images/icons/fire.png";
                    }break;
                case 1:
                    {
                        ViewBag.Title = "Khách sạn chiến lược của Adavigo";
                        ViewBag.Avatar = "/images/icons/hotel.png";
                    }
                    break;
            }
            ViewBag.SearchModel = new HotelSearchParamModel()
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
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> ListingItems(string name, string location = null, string stars = "", double? min_price = -1, double? max_price = -1, int? page_index = 1, int? page_size = 30)
        {
            ViewBag.Data = await _HotelService.GetAllHotelByLocation(name,0,  location, stars,min_price,max_price,page_index,page_size);
            ViewBag.Location = name;
            string url_base = @"{
            ""arrivalDate"": ""2025-02-23"",
            ""departureDate"": ""2025-02-23"",
            ""hotelID"": 107,
            ""hotelName"": ""Sunset Beach Phú Quốc"",
            ""productType"": ""0"",
            ""rooms"": [
                {
                    ""room"": 1,
                    ""number_adult"": 2,
                    ""number_child"": 0,
                    ""number_infant"": 0
                }
            ],
                ""isVinHotel"": false,
                ""telephone"": """",
                ""email"": """"
            }";
            var data_url = JsonConvert.DeserializeObject<dynamic>(url_base);
            data_url.arrivalDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy");
            data_url.departureDate = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy");

            ViewBag.URLBase = data_url;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> ListingSlideItems(string location, int index = 1, int size = 30)
        {
            ViewBag.Data = await _HotelService.GetHotelByLocation("",1, location, null,null,null, index, size);
            ViewBag.Location = location;
            string url_base = @"{
            ""arrivalDate"": ""2025-02-23"",
            ""departureDate"": ""2025-02-23"",
            ""hotelID"": 107,
            ""hotelName"": ""Sunset Beach Phú Quốc"",
            ""productType"": ""0"",
            ""rooms"": [
                {
                    ""room"": 1,
                    ""number_adult"": 2,
                    ""number_child"": 0,
                    ""number_infant"": 0
                }
            ],
                ""isVinHotel"": false,
                ""telephone"": """",
                ""email"": """"
            }";
            var data_url = JsonConvert.DeserializeObject<dynamic>(url_base);
            data_url.arrivalDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy");
            data_url.departureDate = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy");

            ViewBag.URLBase = data_url;
            return View();
        }
    }
}
