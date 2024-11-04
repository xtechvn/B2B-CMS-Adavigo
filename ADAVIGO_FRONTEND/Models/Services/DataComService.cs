using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.Flights.BookFlight;
using ADAVIGO_FRONTEND.Models.Flights.GetBaggage;
using ADAVIGO_FRONTEND.Models.Flights.GetGroupClass;
using ADAVIGO_FRONTEND.Models.Flights.GetPrice;
using ADAVIGO_FRONTEND.Models.Flights.IssueTicket;
using ADAVIGO_FRONTEND.Models.Flights.SearchFlight;
using ADAVIGO_FRONTEND.Models.Flights.SearchMinFare;
using ADAVIGO_FRONTEND.Models.Flights.SearchMonth;
using ADAVIGO_FRONTEND.Models.Flights.VerifyFlight;
using ADAVIGO_FRONTEND.Models.Flights;
using ADAVIGO_FRONTEND.Services.CacheService;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using ADAVIGO_FRONTEND.Models.Configs;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class DataComService
    {
        private readonly HttpClient _httpClient;
        private readonly B2CFlightService _adavigoService;
        private readonly ICacheService _cacheService;
        protected readonly SystemUserModel _UserManager;

        public DataComService(HttpClient httpClient, B2CFlightService adavigoService, ICacheService cacheService, IHttpContextAccessor httpContextAccessor
            )
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(ApplicationSettings.DataComSettings.Url);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _adavigoService = adavigoService;
            _cacheService = cacheService;

            var claimsIdentity = httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            var address = claimsIdentity.FindFirst(nameof(SystemUserModel.Address));
            var phone = claimsIdentity.FindFirst(nameof(SystemUserModel.Phone));
            _UserManager = new SystemUserModel
            {
                ClientID = int.Parse(claimsIdentity.FindFirst(nameof(SystemUserModel.ClientID)).Value),
                ClientType = int.Parse(claimsIdentity.FindFirst(nameof(SystemUserModel.ClientType)).Value),
                ClientName = claimsIdentity.FindFirst(nameof(SystemUserModel.ClientName)).Value,
                Phone = phone != null ? phone.Value : string.Empty,
                Address = address != null ? address.Value : string.Empty
            };
        }

        public async Task<SearchFlightResponse> SearchFlight(SearchFlightRequest request)
        {
            SearchFlightResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchFlight, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<SearchFlightResponse>(stringResult);
                    if (result.ListFareData != null && result.ListFareData.Count > 0)
                    {
                        //result.ListFareData = await _adavigoService.GetCommonFareDataInfo(result.ListFareData);
                    }

                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.SearchFlight, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<SearchMinFareResponse> SearchMinFare(SearchMinFareRequest request)
        {
            SearchMinFareResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchMinFare, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<SearchMinFareResponse>(stringResult);

                    // get airline infomations
                    if (result != null && result.MinFlight != null)
                    {
                        var airline = await _adavigoService.GetAirlineByCode(result.MinFlight.Airline);
                        result.MinFlight.AirlineObj = airline.data;

                        // get adavigo price
                        GetPriceRequest getPriceRequest = new GetPriceRequest();
                        getPriceRequest.price = result.MinFlight.TotalPrice;
                        getPriceRequest.client_type = _UserManager.ClientType;
                        //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                        getPriceRequest.price_range = result.MinFlight.TotalPrice.ToString();
                        var adavigoPrice = await _adavigoService.GetPrice(getPriceRequest);

                        if (adavigoPrice != null && adavigoPrice.data.Count > 0)
                            result.MinFlight.AdavigoPrice = adavigoPrice.data[0];


                        // get group class infomation
                        if (result.MinFlight.ListFlight.Count > 0)
                        {
                            foreach (var f in result.MinFlight.ListFlight)
                            {
                                var groupClassRequest = new GetGroupClassRequest();
                                groupClassRequest.air_line = f.Airline;
                                groupClassRequest.class_code = f.FareClass;
                                groupClassRequest.fare_type = f.GroupClass;

                                var groupClass = await _adavigoService.GetGroupClass(groupClassRequest);
                                f.GroupClassObj = groupClass.data;
                            }
                        }
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.SearchMinFare, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<FareData>> SearchListMinFare(List<SearchMinFareRequest> request)
        {
            List<FareData> result = new List<FareData>();
            try
            {
                List<Task<HttpResponseMessage>> taskList = new List<Task<HttpResponseMessage>>();
                if (request.Count > 0)
                {
                    foreach (var item in request)
                    {
                        var requestJson = JsonConvert.SerializeObject(item);
                        var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                        var response = _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchMinFare, requestContent);
                        taskList.Add(response);
                    }

                    // async http client requests
                    var listResponse = await Task.WhenAll(taskList);

                    foreach (var item in listResponse)
                    {
                        if (item.IsSuccessStatusCode)
                        {
                            var stringResult = await item.Content.ReadAsStringAsync();

                            var resultItem = JsonConvert.DeserializeObject<SearchMinFareResponse>(stringResult);

                            // get airline infomations
                            if (resultItem != null && resultItem.MinFlight != null)
                            {

                                result.Add(resultItem.MinFlight);
                            }
                        }
                    }

                    var priceList = result.Select(f => f.TotalPrice);
                    string combinedString = string.Join(",", priceList);

                    // get adavigo price range
                    GetPriceRequest getPriceRequest = new GetPriceRequest();
                    getPriceRequest.price = 0;
                    getPriceRequest.client_type = _UserManager.ClientType;
                    //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                    getPriceRequest.price_range = combinedString;
                    var adavigoPrice = await _adavigoService.GetPrice(getPriceRequest);

                    if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                    {
                        for (var i = 0; i < adavigoPrice.data.Count; i++)
                        {
                            result[i].AdavigoPrice = adavigoPrice.data[i];
                        }
                    }

                    result = await _adavigoService.GetFareDataInfo(result);

                }
                return result;

            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele("SearchListMinFare", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<FareData>> SearchListMinFareDateRange(List<SearchMinFareRequest> request)
        {
            List<FareData> result = new List<FareData>();
            try
            {
                List<Task<HttpResponseMessage>> taskList = new List<Task<HttpResponseMessage>>();
                if (request.Count > 0)
                {
                    foreach (var item in request)
                    {
                        var requestJson = JsonConvert.SerializeObject(item);
                        var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                        var response = _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchMinFare, requestContent);
                        taskList.Add(response);
                    }

                    // async http client requests
                    var listResponse = await Task.WhenAll(taskList);

                    foreach (var item in listResponse)
                    {
                        if (item.IsSuccessStatusCode)
                        {
                            var stringResult = await item.Content.ReadAsStringAsync();

                            var resultItem = JsonConvert.DeserializeObject<SearchMinFareResponse>(stringResult);

                            // get airline infomations
                            if (resultItem != null && resultItem.MinFlight != null)
                            {
                                result.Add(resultItem.MinFlight);
                            }
                        }
                    }

                    var priceList = result.Where(f => f.TotalPrice > 0).Select(f => f.TotalPrice).ToList();
                    string combinedString = string.Join(",", priceList);

                    // get adavigo price range
                    GetPriceRequest getPriceRequest = new GetPriceRequest();
                    getPriceRequest.price = 0;
                    getPriceRequest.client_type = _UserManager.ClientType;
                    //getPriceRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                    getPriceRequest.price_range = combinedString;
                    var adavigoPrice = await _adavigoService.GetPrice(getPriceRequest);

                    if (adavigoPrice != null && adavigoPrice.data != null && adavigoPrice.data.Count > 0)
                    {
                        for (var i = 0; i < adavigoPrice.data.Count; i++)
                        {
                            result[i].AdavigoPrice = adavigoPrice.data[i];
                        }
                    }

                }
                return result;

            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele("SearchListMinFareDateRange", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<GetBaggageResponse> GetBaggage(GetBaggageRequest request)
        {
            GetBaggageResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.GetBaggage, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<GetBaggageResponse>(stringResult);
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.GetBaggage, ex.Message);
                throw new Exception(ex.Message);
            }
        }
        public async Task<VerifyFlightResponse> VerifyFlight(VerifyFlightRequest request)
        {
            VerifyFlightResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.VerifyFlight, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<VerifyFlightResponse>(stringResult);
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.VerifyFlight, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<BookFlightResponse> BookFlight(BookFlightRequest request)
        {
            BookFlightResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.BookFlight, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<BookFlightResponse>(stringResult);
                    if (!result.Status)
                    {
                        await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.BookFlight, result.Message);
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.BookFlight, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<IssueTicketResponse> IssueTicket(IssueTicketRequest request)
        {
            IssueTicketResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.IssueTicket, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<IssueTicketResponse>(stringResult);
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.IssueTicket, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        // search list min fare by months
        public async Task<List<SearchMonthResponse>> SearchListMinFareMonths(List<SearchMonthRequest> request)
        {
            List<SearchMonthResponse> result = new List<SearchMonthResponse>();
            try
            {
                List<Task<HttpResponseMessage>> taskList = new List<Task<HttpResponseMessage>>();
                if (request.Count > 0)
                {
                    foreach (var item in request)
                    {
                        var requestJson = JsonConvert.SerializeObject(item);
                        var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                        var response = _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchMonth, requestContent);
                        taskList.Add(response);
                    }

                    // async http client requests
                    var listResponse = await Task.WhenAll(taskList);

                    foreach (var item in listResponse)
                    {
                        if (item.IsSuccessStatusCode)
                        {
                            var stringResult = await item.Content.ReadAsStringAsync();

                            var resultItem = JsonConvert.DeserializeObject<SearchMonthResponse>(stringResult);
                            result.Add(resultItem);
                        }
                    }
                }

                return result;

            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele("SearchListMinFareMonths", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<SearchMonthResponse> SearchMinFareMonth(SearchMonthRequest request)
        {
            SearchMonthResponse result = null;
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SystemConstants.DataComApiRoutes.SearchMonth, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var stringResult = await response.Content.ReadAsStringAsync();

                    result = JsonConvert.DeserializeObject<SearchMonthResponse>(stringResult);

                    // filter min fare each date
                    List<double> priceAdtList = new List<double>();
                    if (result != null && result.ListMinPrice != null && result.ListMinPrice.Count > 0)
                    {

                        foreach (var item in result.ListMinPrice)
                        {
                            var minFareValue = item.ListFareData.Min(r => r.FareAdt);
                            var minFare = item.ListFareData.FirstOrDefault(r => r.FareAdt == minFareValue);
                            item.ListFareData = new List<FareData>();
                            item.ListFareData.Add(minFare);
                            priceAdtList.Add(minFareValue);
                        }
                    }

                    // adavigo price adult
                    string combinedAdtString = string.Join(",", priceAdtList);

                    GetPriceRequest getPriceAdtRequest = new GetPriceRequest();
                    getPriceAdtRequest.price = 0;
                    getPriceAdtRequest.client_type = _UserManager.ClientType;
                    //getPriceAdtRequest.client_type = ApplicationSettings.AdavigoSettings.ClientType;
                    getPriceAdtRequest.price_range = combinedAdtString;
                    var adavigoAdtPrice = await _adavigoService.GetPrice(getPriceAdtRequest);


                    if (adavigoAdtPrice != null && adavigoAdtPrice.data != null && adavigoAdtPrice.data.Count > 0)
                    {
                        for (var i = 0; i < adavigoAdtPrice.data.Count; i++)
                        {
                            result.ListMinPrice[i].ListFareData[0].AdavigoPriceAdt = adavigoAdtPrice.data[i];
                        }
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                await _adavigoService.SendExceptionLogTele(SystemConstants.DataComApiRoutes.SearchMonth, ex.Message);
                throw new Exception(ex.Message);
            }
        }

    }

}
