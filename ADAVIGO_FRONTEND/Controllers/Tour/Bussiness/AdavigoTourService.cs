using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Helpers;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.Models.SystemLog;
using ADAVIGO_FRONTEND.Models.Tour.FavouritesTour;
using ADAVIGO_FRONTEND.Models.Tour.ListTourByType;
using ADAVIGO_FRONTEND.Models.Tour.TourBooking;
using ADAVIGO_FRONTEND.Models.Tour.TourDetail;
using ADAVIGO_FRONTEND.Models.Tour.TourListing;
using ADAVIGO_FRONTEND.Models.Tour.TourLocation;
using ADAVIGO_FRONTEND.Models.Tour.TourOrders;
using ADAVIGO_FRONTEND.Models.Tour.V2;
using ADAVIGO_FRONTEND.ViewModels;
using ADAVIGO_FRONTEND_B2C.Infrastructure.Utilities.Constants;
using LIB.ENTITIES.ViewModels.Hotels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Tour.Bussiness
{
    public class AdavigoTourService : BaseService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AdavigoTourService(HttpClient httpClient,IConfiguration configuration, ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(configuration["API:Domain"]);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.Timeout = TimeSpan.FromSeconds(120);
            _configuration=configuration;
        }


        public async Task<BaseObjectResponse<TourLocationResponse>> GetTourLocation(TourLocationRequest requestObj)
        {
            try
            {
                BaseObjectResponse<TourLocationResponse> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data, _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetTourLocation;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<TourLocationResponse>>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetTourLocation, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetTourLocation, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<TourListingResponseExtension> SearchTour(TourListingRequest requestObj)
        {
            try
            {
                TourListingResponseExtension result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.SearchTour;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<TourListingResponseExtension>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.SearchTour, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.SearchTour, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseObjectResponse<List<FavouritesTourResponse>>> GetFavouritesTour(FavouritesTourRequest requestObj)
        {
            try
            {
                BaseObjectResponse<List<FavouritesTourResponse>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetFavouritesTour;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<List<FavouritesTourResponse>>>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetFavouritesTour, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetFavouritesTour, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseObjectResponse<List<ListTourByTypeResponse>>> GetListTourByType(ListTourByTypeRequest requestObj)
        {
            try
            {
                BaseObjectResponse<List<ListTourByTypeResponse>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetListTourByType;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<List<ListTourByTypeResponse>>>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetListTourByType, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                   
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetListTourByType, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseObjectResponse<TourDetailResponseExtend>> GetTourDetail(TourDetailRequest requestObj)
        {
            try
            {
                BaseObjectResponse<TourDetailResponseExtend> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetTourDetail;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<TourDetailResponseExtend>>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetTourDetail, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetListTourByType, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<TourBookingResponse> SaveBooking(TourBookingRequest requestObj)
        {
            try
            {
                TourBookingResponse result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.SaveBooking;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<TourBookingResponse>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.SaveBooking, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.ConfirmTour, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<TourConfirmBookingResponse> ConfirmBooking(TourConfirmBookingRequest requestObj)
        {
            try
            {
                TourConfirmBookingResponse result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.ConfirmBooking;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<TourConfirmBookingResponse>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.ConfirmBooking, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.ConfirmBooking, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<TourOrderListingResponse> GetTourOrdersListing(TourOrdersListingRequest requestObj)
        {
            try
            {
                TourOrderListingResponse result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetOrderListing;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<TourOrderListingResponse>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetOrderListing, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                  
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetOrderListing, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseObjectResponse<TourOrderDetailResponse>> GetTourOrderDetail(TourOrdersDetailRequest requestObj)
        {
            try
            {
                BaseObjectResponse<TourOrderDetailResponse> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetOrderDetail;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<TourOrderDetailResponse>>(stringResult);
                    if (result.status != 0)
                    {
                        await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetOrderDetail, "API Call Not Success Token [" + token + "]: " + stringResult);

                    }
                   
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetOrderDetail, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<SaveHotelPaymentResponse> SaveTourPayment(PaymentHotelModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(TourConstants.AdavigoApiRoutes.TOUR_PAYMENT, new
                {
                    payment_type = model.payment_type,
                    return_url = "/home",
                    client_id = _UserManager.ClientID,
                    bank_code = model.bank_code,
                    booking_id = model.booking_id,
                    amount = model.amount,
                    order_id = model.order_id, // -1:tạo mới
                    event_status = model.event_status ,//0: Tạo mới
                    system_type = 0
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
        public async Task<BaseObjectResponse<List<TourLocationResponseModel>>> GetLocationStart(TourLocationRequestModel requestObj)
        {
            try
            {
                BaseObjectResponse<List<TourLocationResponseModel>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetLocationStart;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<List<TourLocationResponseModel>>>(stringResult);
                    //if (result.status != 0)
                    //{
                    //    await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetLocationStart, "API Call Not Success Token [" + token + "]: " + stringResult);

                    //}
                    
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetLocationStart, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<BaseObjectResponse<List<TourLocationResponseModel>>> GetLocationEnd(TourLocationRequestModel requestObj)
        {
            try
            {
                BaseObjectResponse<List<TourLocationResponseModel>> result = null;

                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = TourConstants.AdavigoApiRoutes.GetLocationEnd;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseObjectResponse<List<TourLocationResponseModel>>>(stringResult);
                    //if (result.status != 0)
                    //{
                    //    await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetLocationEnd, "API Call Not Success Token [" + token + "]: " + stringResult);

                    //}
                    
                }
                return result;
            }
            catch (Exception ex)
            {
                await SendExceptionLogTele(TourConstants.AdavigoApiRoutes.GetLocationStart, ex.Message);
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
        public async Task<BaseResponse> LogTele(SystemLogObj logObj)
        {
            try
            {
                BaseResponse result = null;

                SystemLogRequest requestObj = new SystemLogRequest();
                requestObj.Log = JsonConvert.SerializeObject(logObj);
                var data = JsonConvert.SerializeObject(requestObj);

                var token = AdavigoHelper.Encode(data,  _configuration["SecretKey:b2b"]);
                var request = new[]
                {
                    new KeyValuePair<string, string>("token", token),
                };

                var url = SystemConstants.AdavigoApiRoutes.LogTele;
                HttpResponseMessage response = await _httpClient.PostAsync(url, new FormUrlEncodedContent(request));

                var stringResult = "";
                if (response.IsSuccessStatusCode)
                {
                    stringResult = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<BaseResponse>(stringResult);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
