using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher;
using ADAVIGO_FRONTEND.ViewModels;
using ENTITIES.ViewModels.Hotel;
using ENTITIES.ViewModels.Payment;
using LIB.ENTITIES.ViewModels.Hotels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class HotelService : BaseService
    {
        private readonly string API_UPLOAD_IMAGE;
        private string _KeyEncodeParam;
        private string _ElasticHost;
        private List<BankingAccountQRModel> BANK_ACCOUNT;

        public HotelService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration) : base(apiConnector, httpContextAccessor)
        {
            _KeyEncodeParam = configuration["KeyEncodeParam"];
            _ElasticHost = configuration["DataBaseConfig:Elasticsearch"];
            API_UPLOAD_IMAGE = configuration["API_UPLOAD_IMAGE"];
            BANK_ACCOUNT = new List<BankingAccountQRModel>()
            {
                new BankingAccountQRModel()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "19131835226016",
                    BankId = "Techcombank",
                    Branch = "Đông Đô",
                    Bin="970407",
                    Image="https://static-image.adavigo.com/uploads/images/banklogo/TCB.png",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 1,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
                new BankingAccountQRModel()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "371704070000023",
                    BankId = "HDBank",
                    Bin="970437",
                    Image="https://static-image.adavigo.com/uploads/images/banklogo/HDB.png",
                    Branch = "Hà Nội",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 2,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
                new BankingAccountQRModel()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "113600558866",
                    BankId = "VietinBank",
                    Branch = "Tràng An",
                    Bin="970415",
                    Image="https://static-image.adavigo.com/uploads/images/banklogo/ICB.png",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 3,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
            };
        }

        public async Task<IEnumerable<HotelESSuggestModel>> GetHotelList(string hotelName, int search_type)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.HOTEL_LIST, new
                {
                    txtsearch = hotelName.Trim(),
                    search_type = search_type,
                    clientType = _UserManager.ClientType,

                    client_id = _UserManager.ClientID

                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<HotelESSuggestModel>>(jsonData["data"].ToString());
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }

        //public async Task<IEnumerable<HotelSuggestViewModel>> GetSuggestHotel(string input, int limit)
        //{

        //    try
        //    {
        //        var nodes = new Uri[] { new Uri(_ElasticHost) };
        //        var connectionPool = new StaticConnectionPool(nodes);
        //        var connectionSettings = new ConnectionSettings(connectionPool).DisableDirectStreaming().DefaultIndex("people");
        //        var elasticClient = new ElasticClient(connectionSettings);

        //        var searchRequest = new SearchRequest<HotelSuggestViewModel>("product")
        //        {
        //            From = 0,
        //            Size = limit,
        //            Query = new BoolQuery
        //            {
        //                Should = new List<QueryContainer>
        //                {
        //                    new WildcardQuery() { Field ="name.keyword", Value = $"*{input.ToLower()}*"},
        //                    new WildcardQuery() { Field ="name.keyword", Value = $"*{input.ToUpper()}*"},
        //                    new WildcardQuery() { Field ="name.keyword", Value = $"*{input.First().ToString().ToUpper()}{input.Substring(1).ToLower()}*"}
        //                }
        //            }
        //        };

        //        var response = await elasticClient.SearchAsync<HotelSuggestViewModel>(searchRequest);
        //        return response.Documents.ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}

        public async Task<HotelDataModel> SearchHotel(HotelSearchParamModel model)
        {
            try
            {
                var startDate =DateTime.MinValue;
                var endDate = DateTime.MinValue;

                try
                {
                    startDate = DateTime.ParseExact(model.arrivalDate, "dd/MM/yyyy", null);
                    endDate = DateTime.ParseExact(model.departureDate, "dd/MM/yyyy", null);
                }
                catch
                {

                    throw;

                }
                if (startDate==DateTime.MinValue || endDate == DateTime.MinValue)
                {
                    return null;
                }
                var dataModel = new HotelDataModel()
                {
                    night_time = (int)(endDate - startDate).TotalDays,
                    isVinHotel = Convert.ToBoolean(model.isVinHotel)
                };

                var endpoints = Convert.ToBoolean(model.isVinHotel) ? CONST_API_ENDPOINTS.SEARCH_HOTEL_INFO_BY_CODE : CONST_API_ENDPOINTS.SEARCH_MANUAL_HOTEL_INFO_BY_CODE;

                var result = await _ApiConnector.ExecutePostAsync(endpoints, new
                {
                    arrivalDate = Convert.ToBoolean(model.isVinHotel) ? startDate.ToString("yyyy-MM-dd") : startDate.ToString(),
                    departureDate = Convert.ToBoolean(model.isVinHotel) ? endDate.ToString("yyyy-MM-dd") : endDate.ToString(),
                    hotelID = model.hotelID,
                    hotelName = model.hotelName,
                    numberOfRoom = model.rooms.Count(),
                    numberOfAdult = model.rooms.Sum(s => s.number_adult),
                    numberOfChild = model.rooms.Sum(s => s.number_child),
                    numberOfInfant = model.rooms.Sum(s => s.number_infant),
                    product_type = model.productType,
                    clientType = _UserManager.ClientType,
                    isVinHotel = model.isVinHotel,
                    client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    dataModel.hotels = JsonConvert.DeserializeObject<List<HotelGridInfoModel>>(jsonData["data"].ToString());
                    dataModel.cacheId = jsonData["cache_id"] != null ? jsonData["cache_id"].ToString() : String.Empty;
                }
                dataModel.message = jsonData["msg"] != null ? jsonData["msg"].ToString() : String.Empty;
                return dataModel;
            }
            catch
            {
                throw;
            }
        }

        public async Task<FilterDataViewModel> GetHotelFilter(string cacheId)
        {
            try
            {
                var dataModel = new HotelDataModel();
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_FILTER_HOTEL, new
                {
                    cache_id = cacheId
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<FilterDataViewModel>(jsonData["data"].ToString());
                }
                else
                {
                    throw new Exception(jsonData["msg"].ToString());
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<HotelPriceDataModel>> GetHotelPrice(string cacheId)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_HOTEL_MIN_PRICE, new
                {
                    cache_id = cacheId,
                    clientType = _UserManager.ClientType,

                    client_id = _UserManager.ClientID

                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<HotelPriceDataModel>>(jsonData["data"].ToString());
                }
                else
                {
                    throw new Exception(jsonData["msg"].ToString());
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetBlockedImageUrl(IEnumerable<string> urls)
        {
            try
            {
                var result = await _ApiConnector.UploadBlockedImageUrl(string.Join(",", urls));

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    var datas = JsonConvert.DeserializeObject<IEnumerable<string>>(jsonData["data"].ToString());
                    return datas.Where(s => !string.IsNullOrEmpty(s)).Select(image => image.Contains("https://") ? image : $"{API_UPLOAD_IMAGE}{image}");
                }
            }
            catch
            {

            }
            return urls;
        }

        public async Task<HotelRoomGridModel> GetHotelRoomList(HotelSearchParamModel model)
        {
            try
            {
                var resultModel = new HotelRoomGridModel();

                var endpoints = Convert.ToBoolean(model.isVinHotel) ? CONST_API_ENDPOINTS.GET_HOTEL_ROOM_LIST : CONST_API_ENDPOINTS.GET_HOTEL_ROOM_MANUAL_LIST;
                var startDate = DateTime.ParseExact(model.arrivalDate, "dd/MM/yyyy", null);
                var endDate = DateTime.ParseExact(model.departureDate, "dd/MM/yyyy", null);
                var result = await _ApiConnector.ExecutePostAsync(endpoints, new
                {
                    arrivalDate = Convert.ToBoolean(model.isVinHotel) ? startDate.ToString("yyyy-MM-dd") : startDate.ToString(),
                    departureDate = Convert.ToBoolean(model.isVinHotel) ? endDate.ToString("yyyy-MM-dd") : endDate.ToString(),
                    numberOfRoom = model.rooms.Count(),
                    hotelID = model.hotelID,
                    numberOfAdult = model.rooms.Sum(s => s.number_adult),
                    numberOfChild = model.rooms.Sum(s => s.number_child),
                    numberOfInfant = model.rooms.Sum(s => s.number_infant),
                    clientType = _UserManager.ClientType,

                    client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    resultModel.cache_id = jsonData["cache_id"].ToString();
                    resultModel.surcharge = jsonData["surcharge"].ToString();
                    resultModel.rooms = JsonConvert.DeserializeObject<IEnumerable<HotelRoomDataModel>>(jsonData["data"].ToString());
                    //resultModel.night_time = (int)(Convert.ToDateTime(model.departureDate) - Convert.ToDateTime(model.arrivalDate)).TotalDays;
                    return resultModel;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<HotelPackageDataModel> GetRoomPagekageList(string cacheId, string roomId, string arrivalDate, string departureDate, bool isVinHotel)
        {
            try
            {
                var endpoints = isVinHotel ? CONST_API_ENDPOINTS.GET_ROOM_PACKAGE_LIST : CONST_API_ENDPOINTS.GET_ROOM_MANUAL_PACKAGE_LIST;
                var result = await _ApiConnector.ExecutePostAsync(endpoints, new
                {
                    cache_id = cacheId,
                    roomID = roomId,
                    arrivalDate = (arrivalDate != null && arrivalDate.Contains("/")) ? DateTime.ParseExact(arrivalDate, "dd/MM/yyyy", null).ToString():null,
                    departureDate = (departureDate != null && departureDate.Contains("/")) ? DateTime.ParseExact(departureDate, "dd/MM/yyyy", null).ToString() : null,
                    clientType = _UserManager.ClientType,
                    client_id = _UserManager.ClientID
                });
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<HotelPackageDataModel>(jsonData["data"].ToString());
                }
                else
                {
                    throw new Exception(jsonData["msg"].ToString());
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> GetOtherRoomPagekageList(HotelPackageParamModel model)
        {
            try
            {
                var resultModel = new HotelRoomGridModel();

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_HOTEL_ROOM_LIST, new
                {
                    arrivalDate = model.arrival_date.ToString("yyyy-MM-dd"),
                    departureDate = model.departure_date.ToString("yyyy-MM-dd"),
                    numberOfRoom = 1,
                    hotelID = model.hotel_id,
                    numberOfAdult = model.rooms.Sum(s => s.number_adult),
                    numberOfChild = model.rooms.Sum(s => s.number_child),
                    numberOfInfant = model.rooms.Sum(s => s.number_infant),
                    clientType = _UserManager.ClientType,
                    client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return jsonData["cache_id"].ToString();
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> SaveHotel(string model)
        {
            try
            {
                var jdata = JObject.Parse(model);
                jdata.Add("account_client_id", _UserManager.ClientID);
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.SAVE_HOTEL_BOOKING, jdata);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return jsonData["data"].ToString();
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }

        public async Task<SaveHotelPaymentResponse> SaveHotelPayment(PaymentHotelModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.HOTEL_PAYMENT, new
                {
                    payment_type = model.payment_type,
                    return_url = "/home",
                    client_id = _UserManager.ClientID,
                    bank_code = model.bank_code,
                    booking_id = model.booking_id,
                    amount = model.amount,
                    order_id = model.order_id, // -1:tạo mới
                    event_status = model.event_status //0: Tạo mới
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    //return jsonData["order_no"].ToString();
                    return JsonConvert.DeserializeObject<SaveHotelPaymentResponse>(JsonConvert.SerializeObject(jsonData));
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }

        public async Task<object> ReadImportFile(IFormFile file)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.FirstOrDefault();
                        var Cells = worksheet.Cells;

                        var startRow = 3;
                        var endRow = worksheet.Dimension.Rows;
                        var data = new List<object>();
                        for (int row = startRow; row <= endRow; row++)
                        {
                            data.Add(new
                            {
                                room = Cells[row, 1].Value,
                                name = Cells[row, 2].Value,
                                birthday = Cells[row, 3].Value
                            });
                        }
                        return data;
                    }
                }
            }
            catch
            {
                throw new Exception("File không đúng định dạng");
            }
        }
        //public async Task<List<HotelExclusiveResponse>> ListHotelExclusive(HotelExclusiveRequest model)
        //{

        //    try
        //    {
        //        model.client_type = _UserManager.ClientType;

        //        var endpoints = CONST_API_ENDPOINTS.EXCLUSIVE_HOTEL_BY_LOCATION;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<HotelExclusiveResponse>>(jsonData["data"].ToString());
        //        }
        //        else
        //        {
        //            throw new Exception(jsonData["msg"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        //public async Task<HotelExclusiveDetailResponse> ListHotelExclusiveDetail(HotelExclusiveDetailRequest model)
        //{

        //    try
        //    {
        //        model.client_type = _UserManager.ClientType;

        //        var endpoints = CONST_API_ENDPOINTS.EXCLUSIVE_HOTEL_BY_LOCATION_DETAIL;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return (JsonConvert.DeserializeObject<List<HotelExclusiveDetailResponse>>(jsonData["data"].ToString())).FirstOrDefault();
        //        }

        //    }
        //    catch
        //    {

        //    }
        //    return null;
        //}

        //public async Task<List<HotelExclusiveFilterResponse>> GetHotelExclusiveFilter()
        //{
        //    try
        //    {
        //        var dataModel = new HotelDataModel();
        //        var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.EXCLUSIVE_HOTEL_GET_LOCATION_LIST, new
        //        {
        //            confirm = 1
        //        });

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<HotelExclusiveFilterResponse>>(jsonData["data"].ToString());
        //        }
        //        else
        //        {
        //            throw new Exception(jsonData["msg"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        public async Task<CheckFundAvailableResponse> CheckFundPaymentAvailable(CheckFundAvailableRequest request)
        {
            try
            {
                request.client_id = _UserManager.ClientID;
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.CHECK_FUND_AVAILABLE, request);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<CheckFundAvailableResponse>(JsonConvert.SerializeObject(jsonData));
                }
            }
            catch
            {
            }
            return null;
        }
        public async Task<ConfirmPaymentWithFundResponse> ConfirmPaymentWithFund(ConfirmPaymentWithFundRequest request)
        {
            try
            {
                request.service_type = 1;
                request.client_id = _UserManager.ClientID;
                request.clientType = _UserManager.ClientType;
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.CONFIRM_PAYMENT_WITH_FUND, request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ConfirmPaymentWithFundResponse>(JsonConvert.SerializeObject(jsonData));
                }
            }
            catch
            {
            }
            return null;
        }
        public async Task<string> GetVietQRCode(PaymentHotelModel model)
        {
            try
            {
                var selected = BANK_ACCOUNT.FirstOrDefault(x => x.Bin == model.bank_code);
                string bank_code = model.bank_code;
                // if (selected_bank != null) bank_code = selected_bank.bin;
                var result = await _ApiConnector.GetVietQRCode(model.bank_account, bank_code, model.order_no, Convert.ToDouble(model.amount));
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["code"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return jsonData["data"]["qrDataURL"].ToString();
                }
            }
            catch
            {
            }
            return null;
        }

        public async Task<List<BankingAccount>> GetBankAccount(string token = "ShFEWV1JGgkSCHBjZBISNyEkRltUW0US")
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_ADAVIGO_BANK_LIST, token);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<BankingAccount>>(jsonData["data"].ToString());
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }
        //public async Task<List<HotelExclusiveResponse>> GetHotelCommit(HotelExclusiveRequest model)
        //{

        //    try
        //    {
        //        model.client_type = _UserManager.ClientType;

        //        var endpoints = CONST_API_ENDPOINTS.COMMIT_HOTEL;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<HotelExclusiveResponse>>(jsonData["data"].ToString());
        //        }
        //        else
        //        {
        //            throw new Exception(jsonData["msg"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        //public async Task<List<HotelCommitLocationResponse>> GetHotelCommitLocation()
        //{

        //    try
        //    {
        //        var model = new
        //        {
        //            time = DateTime.Now
        //        };
        //        var endpoints = CONST_API_ENDPOINTS.COMMIT_HOTEL_LOCATION;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<HotelCommitLocationResponse>>(jsonData["data"].ToString());
        //        }
        //        else
        //        {
        //            throw new Exception(jsonData["msg"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        //public async Task<HotelExclusiveDetailResponse> GetHotelCommitDetail(HotelExclusiveDetailRequest model)
        //{

        //    try
        //    {
        //        model.client_type = _UserManager.ClientType;

        //        var endpoints = CONST_API_ENDPOINTS.COMMIT_HOTEL_DETAIL;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return (JsonConvert.DeserializeObject<List<HotelExclusiveDetailResponse>>(jsonData["data"].ToString())).FirstOrDefault();
        //        }

        //    }
        //    catch
        //    {

        //    }
        //    return null;
        //}
        //public async Task<List<HotelExclusiveResponse>> ListHotelExclusivePosition(HotelExclusiveRequest model)
        //{

        //    try
        //    {
        //        model.client_type = _UserManager.ClientType;

        //        var endpoints = CONST_API_ENDPOINTS.EXCLUSIVE_HOTEL_BY_LOCATION_POSITION;

        //        var result = await _ApiConnector.ExecutePostAsync(endpoints, model);

        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ENUM_API_RESULT.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<HotelExclusiveResponse>>(jsonData["data"].ToString());
        //        }
        //        else
        //        {
        //            throw new Exception(jsonData["msg"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        public async Task<string> SaveRequestHotel(BookingHotelB2BViewModel model)
        {
            try
            {
                model.account_client_id = _UserManager.ClientID;
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.SAVE_REQUYEST_HOTEL_BOOKING, model);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return jsonData["data"].ToString();
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }
        public async Task<B2BTrackingVoucherResponse> TrackingVoucher(B2BTrackingVoucherRequest model)
        {
            try
            {
                model.user_id = _UserManager.ClientID;
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.TrackingVoucher, model);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return JsonConvert.DeserializeObject<B2BTrackingVoucherResponse>(result);
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }
        public async Task<List<B2BVoucherListResponse>> GetVoucherList(B2BVoucherListRequest model)
        {
            try
            {
                model.user_id = _UserManager.ClientID;

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GetVoucherList, model);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return JsonConvert.DeserializeObject<List<B2BVoucherListResponse>>(jsonData["data"].ToString());

            }
            catch
            {
            }
            return new List<B2BVoucherListResponse>();
        }
        public async Task<List<HotelSurchargeGridModel>> GetHotelSurcharge(string hotel_id)

        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GetHotelSurcharge, new
                {
                    hotelID = hotel_id




                });
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return JsonConvert.DeserializeObject<List<HotelSurchargeGridModel>>(jsonData["data"].ToString());

            }
            catch
            {
            }
            return new List<HotelSurchargeGridModel>();
        }
        #region v2:
        public async Task<List<HotelExclusiveResponse>> GetHotelByLocation(string name, int type, int hotel_position,int index=1,int size=30)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GetHotelListByLocationArea, new
                {
                    type = type,
                    client_type = _UserManager.ClientType,
                    fromdate = DateTime.Now.AddDays(1),
                    todate = DateTime.Now.AddDays(2),
                    name = name,
                    hotel_position= hotel_position,
                    index,
                    size
                });
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return JsonConvert.DeserializeObject<List<HotelExclusiveResponse>>(jsonData["data"].ToString());

            }
            catch
            {
            }
            return new List<HotelExclusiveResponse>();
        }

        #endregion


    }
}
