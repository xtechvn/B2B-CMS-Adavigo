using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Helpers;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.AllCode;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.Models.Flights;
using ADAVIGO_FRONTEND.Models.Flights.GetAirlineByCode;
using ADAVIGO_FRONTEND.Models.Flights.GetBankListOnePay;
using ADAVIGO_FRONTEND.Models.Flights.GetBookingBySessionId;
using ADAVIGO_FRONTEND.Models.Flights.GetGroupClass;
using ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId;
using ADAVIGO_FRONTEND.Models.Flights.GetOrderDetail;
using ADAVIGO_FRONTEND.Models.Flights.GetPrice;
using ADAVIGO_FRONTEND.Models.Flights.Payment;
using ADAVIGO_FRONTEND.Models.Flights.SaveBooking;
using ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher;
using ADAVIGO_FRONTEND.Models.News;
using ADAVIGO_FRONTEND.Models.News.FindArticle;
using ADAVIGO_FRONTEND.Models.News.GetCategory;
using ADAVIGO_FRONTEND.Models.News.GetDetail;
using ADAVIGO_FRONTEND.Models.News.GetListByCategoryId;
using ADAVIGO_FRONTEND.Models.News.GetListByTag;
using ADAVIGO_FRONTEND.Models.SystemLog;
using ADAVIGO_FRONTEND.Services.CacheService;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace ADAVIGO_FRONTEND.Models.Services
{
    public class B2CFlightService : BaseService
    {
        private readonly ICacheService _cacheService;

        public B2CFlightService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor, ICacheService cacheService) : base(apiConnector, httpContextAccessor)
        {
            _cacheService = cacheService;
        }


        public async Task<List<FareData>> GetPriceOfListFareData(List<FareData> request)
        {
            try
            {
                var priceList = request.Select(f => f.TotalPrice);
                string combinedString = string.Join(",", priceList);

                // get adavigo price range
                GetPriceRequest getPriceRequest = new GetPriceRequest();
                getPriceRequest.price = 0;
                getPriceRequest.client_type = _UserManager.ClientType;
                //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                getPriceRequest.price_range = combinedString;
                var adavigoPrice = await GetPrice(getPriceRequest);

                // adavigo price adult
                var priceAdtList = request.Select(f => f.FareAdt + f.TaxAdt + f.FeeAdt);
                string combinedAdtString = string.Join(",", priceAdtList);

                GetPriceRequest getPriceAdtRequest = new GetPriceRequest();
                getPriceAdtRequest.price = 0;
                getPriceAdtRequest.client_type = _UserManager.ClientType;
                //getPriceAdtRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                getPriceAdtRequest.price_range = combinedAdtString;
                var adavigoAdtPrice = await GetPrice(getPriceAdtRequest);

                if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                {
                    for (var i = 0; i < adavigoPrice.data.Count; i++)
                    {
                        request[i].AdavigoPrice = adavigoPrice.data[i];
                        request[i].AdavigoPriceAdt = adavigoAdtPrice.data[i];
                    }
                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetPrice, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<FareData>> GetFareDataInfo(List<FareData> request)
        {
            try
            {
                List<GetGroupClassRequest> requestList = new List<GetGroupClassRequest>();

                foreach (var item in request)
                {
                    var expirationTime = DateTimeOffset.Now.AddDays(1);

                    var airlineCaches = _cacheService.GetData<List<GetAirlineByCodeResponse>>(CacheKeys.Airlines);
                    if (airlineCaches != null)
                    {
                        var airline = airlineCaches.FirstOrDefault(a => a.code == item.Airline);
                        if (airline != null)
                        {
                            item.AirlineObj = airline;
                        }
                    }
                    else
                    {
                        var listAirlines = await GetAllAirline();
                        if (listAirlines.data.Count > 0)
                        {
                            var airline = listAirlines.data.FirstOrDefault(a => a.code == item.Airline);
                            if (airline != null)
                                item.AirlineObj = airline;
                        }
                        _cacheService.SetData<IEnumerable<GetAirlineByCodeResponse>>(CacheKeys.Airlines, listAirlines.data, expirationTime);
                    }

                    // get group class infomation
                    if (item.ListFlight.Count > 0)
                    {
                        foreach (var f in item.ListFlight)
                        {
                            var groupClassRequest = new GetGroupClassRequest();
                            groupClassRequest.air_line = f.Airline;
                            groupClassRequest.class_code = f.FareClass;
                            groupClassRequest.fare_type = f.GroupClass;

                            requestList.Add(groupClassRequest);
                        }

                    }
                }

                // get list group class
                var getListGroupClass = await GetListGroupClass(requestList);
                if (getListGroupClass.data.Count > 0)
                {
                    for (int i = 0; i < request.Count; i++)
                    {
                        var item = request[i];
                        item.ListFlight[0].GroupClassObj = getListGroupClass.data[i];
                    }
                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetFareDataInfo", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<GetAirlineByCodeResponse>> GetAirlineByCode(string code)
        {
            try
            {
                BaseObjectResponse<GetAirlineByCodeResponse> result = null;
                var j_param = new Dictionary<string, string>
                        {
                            {"code", code}
                        };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetAirlineByCode;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<GetAirlineByCodeResponse>>(stringResult);

                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetAirlineByCode, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<List<GetAirlineByCodeResponse>>> GetAllAirline()
        {
            try
            {
                BaseObjectResponse<List<GetAirlineByCodeResponse>> result = null;
                var j_param = new Dictionary<string, string>
                        {
                            {"code", "-1"}
                        };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetAirlineByCode;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetAirlineByCodeResponse>>>(stringResult);

                // send error log
                await SendLogTele(result.status, url, token, result.msg);

                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetAllAirline", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<GetGroupClassResponse>> GetGroupClass(GetGroupClassRequest requestObj)
        {
            try
            {
                BaseObjectResponse<GetGroupClassResponse> result = null;
                var j_param = new Dictionary<string, string>
                        {
                            {"air_line", requestObj.air_line},
                            {"class_code", requestObj.class_code},
                            {"fare_type", requestObj.fare_type}
                        };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetGroupClass;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<GetGroupClassResponse>>(stringResult);

                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetGroupClass, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<List<GetGroupClassResponse>>> GetListGroupClass(List<GetGroupClassRequest> requestObj)
        {
            try
            {
                BaseObjectResponse<List<GetGroupClassResponse>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);

                // Đặt dữ liệu trong phần thân của request bằng StringContent
                var requestContent = new StringContent($"token={token}", Encoding.UTF8, "application/x-www-form-urlencoded");

                var url = SystemConstants.AdavigoApiRoutes.GetListGroupClass;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, token);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetGroupClassResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetListGroupClass, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<List<GetPriceResponse>>> GetPrice(GetPriceRequest requestObj)
        {
            try
            {
                BaseObjectResponse<List<GetPriceResponse>> result = null;
                var j_param = new Dictionary<string, string>
                        {
                            {"price", requestObj.price.ToString()},
                            {"client_type", requestObj.client_type.ToString()},
                            {"price_range", requestObj.price_range.ToString()},
                        };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetPrice;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetPriceResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetPrice, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<List<GetBankListOnePayResponse>>> GetBankListOnePay()
        {
            try
            {
                BaseObjectResponse<List<GetBankListOnePayResponse>> result = null;

                var request = new[]
                {
                    new KeyValuePair<string, string>("token", ApplicationSettings.AdavigoSettings.BankToken)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetBankListOnePay;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetBankListOnePayResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, ApplicationSettings.AdavigoSettings.BankToken, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetBankListOnePay, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<PaymentResponse> Payment(PaymentRequest requestObj)
        {
            try
            {
                PaymentResponse result = null;
                var j_param = new PaymentRequest()
                {
                    payment_type = requestObj.payment_type,
                    return_url = ApplicationSettings.AdavigoSettings.OnePayUrl,
                    client_id = _UserManager.ClientID.ToString(),
                    bank_code = requestObj.bank_code,
                    order_detail = requestObj.order_detail,
                    booking_verify = requestObj.booking_verify,
                    booking_order = requestObj.booking_order,
                    session_id = requestObj.session_id,
                    amount = requestObj.amount,
                    order_id = requestObj.order_id,
                    event_status = requestObj.event_status,
                };

                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                    new KeyValuePair<string, string>("source_payment_type", "0")
                };

                var url = SystemConstants.AdavigoApiRoutes.Payment;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<PaymentResponse>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.Payment, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<SaveBookingResponse> SaveBooking(SaveBookingRequest requestObj)
        {
            try
            {
                SaveBookingResponse result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.SaveBooking;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<SaveBookingResponse>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.SaveBooking, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<GetOrderByClientIdResponse> GetOrderByClientId(GetOrderByClientIdRequest requestObj, long id, long type)
        {
            try
            {
                GetOrderByClientIdResponse result = null;
                var j_param = new GetOrderByClientIdRequest()
                {
                    source_type = requestObj.source_type,
                    client_id = (int)id,
                    pageNumb = requestObj.pageNumb,
                    PageSize = requestObj.PageSize,
                    keyword = requestObj.keyword,
                    type = type
                };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                    new KeyValuePair<string, string>("source_payment_type", "1")

                };

                var url = SystemConstants.AdavigoApiRoutes.GetOrderByClientId;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<GetOrderByClientIdResponse>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetOrderByClientId, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseObjectResponse<List<GetOrderDetailResponse>>> GetOrderDetail(GetOrderDetailRequest requestObj,int type)
        {
            try
            {
                BaseObjectResponse<List<GetOrderDetailResponse>> result = null;
                var j_param = new GetOrderDetailRequest()
                {
                    order_id = requestObj.order_id,
                    client_id = _UserManager.ClientID,
                    type = type,
                };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.GetOrderDetail;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetOrderDetailResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetOrderDetail, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        // get data from api 14
        public async Task<BaseObjectResponse<List<GetBookingBySessionIdResponse>>> GetBookingBySessionId(GetBookingBySessionIdRequest requestObj)
        {
            try
            {
                BaseObjectResponse<List<GetBookingBySessionIdResponse>> result = null;
                var j_param = new GetBookingBySessionIdRequest()
                {
                    client_id = requestObj.client_id,
                    session_id = requestObj.session_id
                };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                    new KeyValuePair<string, string>("source_booking_type", "0")
                };

                var url = SystemConstants.AdavigoApiRoutes.GetBookingBySessionId;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetBookingBySessionIdResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetBookingBySessionId, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        // get order detail info by session
        public async Task<BaseObjectResponse<List<GetOrderDetailResponse>>> GetBookingBySessionIdOrder(GetBookingBySessionIdRequest requestObj)
        {
            try
            {
                BaseObjectResponse<List<GetOrderDetailResponse>> result = null;
                var j_param = new GetBookingBySessionIdRequest()
                {
                    client_id = requestObj.client_id,
                    session_id = requestObj.session_id
                };
                var data = JsonConvert.SerializeObject(j_param);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                    new KeyValuePair<string, string>("source_booking_type", "1")
                };

                var url = SystemConstants.AdavigoApiRoutes.GetBookingBySessionId;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<GetOrderDetailResponse>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetBookingBySessionId, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseResponse> LogTele(SystemLogObj logObj)
        {
            try
            {
                BaseResponse result = null;

                SystemLogRequest requestObj = new SystemLogRequest();
                requestObj.Log = JsonConvert.SerializeObject(logObj);
                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.LogTele;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseResponse>(stringResult);

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task SendLogTele(int status, string url, string tokenRequest, string message)
        {
            try
            {
                if (status != SystemConstants.AdavigoSuccessStatus)
                {
                    SystemLogObj logObj = new SystemLogObj();
                    logObj.Url = url;
                    logObj.Token = tokenRequest;
                    logObj.Message = message;
                    logObj.Status = status;

                    await LogTele(logObj);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task SendExceptionLogTele(string url, string message)
        {
            try
            {
                SystemLogObj logObj = new SystemLogObj();
                logObj.Url = url;
                logObj.Message = message;
                logObj.Status = ApplicationSettings.AdavigoSettings.FailStatus;

                await LogTele(logObj);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public AdavigoSettingsResponse GetAdavigoSettings()
        {
            AdavigoSettingsResponse result = new AdavigoSettingsResponse();
            result.Domain_Url = ApplicationSettings.AdavigoSettings.Domain_Url;
            result.Url = ApplicationSettings.AdavigoSettings.Url;
            result.LoginVersion = ApplicationSettings.AdavigoSettings.LoginVersion;
            return result;
        }

        public async Task<List<FareData>> GetCommonFareDataInfo(List<FareData> request)
        {
            try
            {
                var priceList = request.Select(f => f.TotalPrice);
                string combinedString = string.Join(",", priceList);

                // adavigo price adult
                var priceAdtList = request.Select(f => f.FareAdt + f.TaxAdt + f.FeeAdt);
                string combinedAdtString = string.Join(",", priceAdtList);
                combinedString = combinedString + "," + combinedAdtString;
                // get adavigo price range
                GetPriceRequest getPriceRequest = new GetPriceRequest();
                getPriceRequest.price = 0;
                getPriceRequest.client_type = _UserManager.ClientType;
                //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                getPriceRequest.price_range = combinedString;
                var adavigoPrice = await GetPrice(getPriceRequest);

                if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                {
                    for (var i = 0; i < (adavigoPrice.data.Count / 2); i++)
                    {
                        request[i].AdavigoPrice = adavigoPrice.data[i];
                        var adtIndex = (adavigoPrice.data.Count / 2) + i;
                        request[i].AdavigoPriceAdt = adavigoPrice.data[adtIndex];
                    }
                }

                request = await GetFareDataInfo(request);

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetCommonFareDataInfo", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<FareData>> GetAdavigoPrices(List<FareData> request)
        {
            try
            {
                var priceList = request.Where(f => f.TotalPrice > 0).Select(f => f.TotalPrice).ToList();
                string combinedString = string.Join(",", priceList);

                // get adavigo price range
                GetPriceRequest getPriceRequest = new GetPriceRequest();
                getPriceRequest.price = 0;
                //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                getPriceRequest.client_type = _UserManager.ClientType;
                getPriceRequest.price_range = combinedString;
                var adavigoPrice = await GetPrice(getPriceRequest);

                if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                {
                    for (var i = 0; i < adavigoPrice.data.Count; i++)
                    {
                        request[i].AdavigoPrice = adavigoPrice.data[i];
                    }
                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetAdavigoPrices", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<FareData>> GetAdavigoAdtPrices(List<FareData> request)
        {
            try
            {
                // adavigo price adult
                var priceAdtList = request.Where(f => (f.FareAdt + f.TaxAdt + f.FeeAdt) > 0).Select(f => f.FareAdt + f.TaxAdt + f.FeeAdt).ToList();
                string combinedAdtString = string.Join(",", priceAdtList);
                // get adavigo price range
                GetPriceRequest getPriceRequest = new GetPriceRequest();
                getPriceRequest.price = 0;
                getPriceRequest.client_type = _UserManager.ClientType;
                //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                getPriceRequest.price_range = combinedAdtString;
                var adavigoPrice = await GetPrice(getPriceRequest);

                if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                {
                    for (var i = 0; i < adavigoPrice.data.Count; i++)
                    {
                        request[i].AdavigoPriceAdt = adavigoPrice.data[i];
                    }
                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetAdavigoAdtPrices", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<FareData>> GetCommonAirlines(List<FareData> request)
        {
            try
            {
                foreach (var item in request)
                {
                    var expirationTime = DateTimeOffset.Now.AddDays(1);

                    var airlineCaches = _cacheService.GetData<List<GetAirlineByCodeResponse>>(CacheKeys.Airlines);
                    if (airlineCaches != null)
                    {
                        var airline = airlineCaches.FirstOrDefault(a => a.code == item.Airline);
                        if (airline != null)
                        {
                            item.AirlineObj = airline;
                        }
                    }
                    else
                    {
                        var listAirlines = await GetAllAirline();
                        if (listAirlines.data.Count > 0)
                        {
                            var airline = listAirlines.data.FirstOrDefault(a => a.code == item.Airline);
                            if (airline != null)
                                item.AirlineObj = airline;
                        }
                        _cacheService.SetData<IEnumerable<GetAirlineByCodeResponse>>(CacheKeys.Airlines, listAirlines.data, expirationTime);
                    }

                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetCommonAirlines", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<FareData>> GetCommonGroupClass(List<FareData> request)
        {
            try
            {
                List<GetGroupClassRequest> requestList = new List<GetGroupClassRequest>();

                foreach (var item in request)
                {
                    // get group class infomation
                    if (item.ListFlight.Count > 0)
                    {
                        foreach (var f in item.ListFlight)
                        {
                            var groupClassRequest = new GetGroupClassRequest();
                            groupClassRequest.air_line = f.Airline;
                            groupClassRequest.class_code = f.FareClass;
                            groupClassRequest.fare_type = f.GroupClass;

                            requestList.Add(groupClassRequest);
                        }

                    }
                }

                // get list group class
                var getListGroupClass = await GetListGroupClass(requestList);
                if (getListGroupClass.data != null && getListGroupClass.data.Count > 0)
                {
                    for (int i = 0; i < request.Count; i++)
                    {
                        var item = request[i];
                        item.ListFlight[0].GroupClassObj = getListGroupClass.data[i];
                    }
                }

                return request;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele("GetCommonGroupClass", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<TrackingVoucherResponse> TrackingVoucher(TrackingVoucherRequest requestObj)
        {
            try
            {
                TrackingVoucherResponse result = null;
                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.TrackingVoucher;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<TrackingVoucherResponse>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.TrackingVoucher, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        #region news
        public async Task<BaseObjectResponse<GetCategoryObjResponse>> GetNewsCategory()
        {
            try
            {
                BaseObjectResponse<GetCategoryObjResponse> result = null;
                var token = ApplicationSettings.AdavigoSettings.NewsCategoryToken;
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetNewsCategory;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<GetCategoryObjResponse>>(stringResult);
                // send log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsCategory, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<GetListByCategoryIdResponse>> GetNewsByCategoryId(GetListByCategoryIdRequest requestObj)
        {
            try
            {
                BaseObjectResponse<GetListByCategoryIdResponse> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetNewsByCategoryId;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<GetListByCategoryIdResponse>>(stringResult);

                if (result.status != 0)
                {
                    await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsByCategoryId, "API Call Not Success Token [" + token + "]: " + stringResult);

                }
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsByCategoryId, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<GetListByCategoryIdResponse> GetNewsByCategoryIdV2(GetListByCategoryIdRequest requestObj)
        {
            try
            {
                GetListByCategoryIdResponse result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetNewsByCategoryIdV2;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<GetListByCategoryIdResponse>(stringResult);
                if (result.status != 0)
                {
                    await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsByCategoryIdV2, "API Call Not Success Token [" + token + "]: " + stringResult);

                }
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsByCategoryIdV2, ex.Message);
                throw new Exception(ex.Message);
            }
        }


        public async Task<BaseObjectResponse<List<ArticleResponse>>> GetMostViewedArticles()
        {
            try
            {
                BaseObjectResponse<List<ArticleResponse>> result = null;

                var token = ApplicationSettings.AdavigoSettings.NewsCategoryToken;

                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetMostViewedArticles;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<ArticleResponse>>>(stringResult);

                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetMostViewedArticles, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<GetNewDetailResponse>> GetNewsDetail(GetNewDetailRequest requestObj)
        {
            try
            {
                BaseObjectResponse<GetNewDetailResponse> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetNewsDetail;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<GetNewDetailResponse>>(stringResult);
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsDetail, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseDataPaginationObjectResponse<List<ArticleResponse>>> FindArticle(FindArticleRequest requestObj)
        {
            try
            {
                BaseDataPaginationObjectResponse<List<ArticleResponse>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.FindArticle;

                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseDataPaginationObjectResponse<List<ArticleResponse>>>(stringResult);
                await SendLogTele(result.status, url, token, result.msg);

                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.FindArticle, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseDataPaginationObjectResponse<List<ArticleResponse>>> GetNewsByTag(GetListByTagRequest requestObj)
        {
            try
            {
                BaseDataPaginationObjectResponse<List<ArticleResponse>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, ApplicationSettings.AdavigoSettings.PrivateKey);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.GetNewsByTag;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseDataPaginationObjectResponse<List<ArticleResponse>>>(stringResult);
                await SendLogTele(result.status, url, token, result.msg);

                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetNewsByTag, ex.Message);
                throw new Exception(ex.Message);
            }
        }


        #endregion news 

        public async Task<BaseObjectResponse<List<AllCodeModel>>> GetAllCode(string type)
        {
            try
            {
                BaseObjectResponse<List<AllCodeModel>> result = null;
                var j_param = new Dictionary<string, string>
                        {
                            {"type", type},

                        };
                var data = JsonConvert.SerializeObject(j_param);
                string Keyapi_manual = "1372498309AAH0fVJAdavigofnZQFg5Qaqro47y1o5mIIcwVkR3k";
                var token = AdavigoHelper.Encode(data, Keyapi_manual);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token)
                };

                var url = SystemConstants.AdavigoApiRoutes.GetAllCode;
                var stringResult = await _ApiConnector.ExecutePostAsync(url, request);

                result = JsonConvert.DeserializeObject<BaseObjectResponse<List<AllCodeModel>>>(stringResult);
                // send error log
                await SendLogTele(result.status, url, token, result.msg);
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(SystemConstants.AdavigoApiRoutes.GetAllCode, ex.Message);
                throw new Exception(ex.Message);
            }
        }
    }
}
