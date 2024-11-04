using ADAVIGO_FRONTEND.Infrastructure.Utilities.Helpers;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.Models.Flights;
using ADAVIGO_FRONTEND.Models.Flights.BookFlight;
using ADAVIGO_FRONTEND.Models.Flights.GetBaggage;
using ADAVIGO_FRONTEND.Models.Flights.GetBookingBySessionId;
using ADAVIGO_FRONTEND.Models.Flights.GetGroupClass;
using ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId;
using ADAVIGO_FRONTEND.Models.Flights.GetOrderDetail;
using ADAVIGO_FRONTEND.Models.Flights.GetPrice;
using ADAVIGO_FRONTEND.Models.Flights.IssueTicket;
using ADAVIGO_FRONTEND.Models.Flights.Login;
using ADAVIGO_FRONTEND.Models.Flights.Payment;
using ADAVIGO_FRONTEND.Models.Flights.Register;
using ADAVIGO_FRONTEND.Models.Flights.SaveBooking;
using ADAVIGO_FRONTEND.Models.Flights.SearchFlight;
using ADAVIGO_FRONTEND.Models.Flights.SearchMinFare;
using ADAVIGO_FRONTEND.Models.Flights.SearchMonth;
using ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher;
using ADAVIGO_FRONTEND.Models.Flights.VerifyFlight;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.Models.SystemLog;
using ADAVIGO_FRONTEND.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Utilities.Contants;

namespace ADAVIGO_FRONTEND.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly DataComService _dataComService;
        private readonly B2CFlightService _adavigoService;
        private readonly HotelService _hotelService;
        private readonly AccountService _AccountService;
        public FlightsController(DataComService dataComService, B2CFlightService adavigoService, HotelService hotelService, AccountService AccountService)
        {
            _dataComService = dataComService;
            _adavigoService = adavigoService;
            _hotelService = hotelService;
            _AccountService = AccountService;
        }

        [HttpPost]
        [Route("searchFlight")]
        public async Task<IActionResult> SearchFlight(SearchFlightRequest request)
        {
            var result = await _dataComService.SearchFlight(request);

            return Ok(result);
        }

        [HttpGet]
        [Route("getAdavigoSettings")]
        public IActionResult GetAdavigoSettings()
        {
            var result = _adavigoService.GetAdavigoSettings();
            return Ok(result);
        }

        [HttpPost]
        [Route("getFareDataInfo")]
        public async Task<IActionResult> GetFareDataInfo(List<FareData> request)
        {
            var result = await _adavigoService.GetFareDataInfo(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("getCommonFareDataInfo")]
        public async Task<IActionResult> GetCommonFareDataInfo(List<FareData> request)
        {
            var result = await _adavigoService.GetCommonFareDataInfo(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getAdavigoPrices")]
        public async Task<IActionResult> GetAdavigoPrices(List<FareData> request)
        {
            var result = await _adavigoService.GetAdavigoPrices(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("getAdavigoAdtPrices")]
        public async Task<IActionResult> GetAdavigoAdtPrices(List<FareData> request)
        {
            var result = await _adavigoService.GetAdavigoAdtPrices(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getCommonAirlines")]
        public async Task<IActionResult> GetCommonAirlines(List<FareData> request)
        {
            var result = await _adavigoService.GetCommonAirlines(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getCommonGroupClass")]
        public async Task<IActionResult> GetCommonGroupClass(List<FareData> request)
        {
            var result = await _adavigoService.GetCommonGroupClass(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getPriceOfListFareData")]
        public async Task<IActionResult> GetPriceOfListFareData(List<FareData> request)
        {
            var result = await _adavigoService.GetPriceOfListFareData(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("searchMinFare")]
        public async Task<IActionResult> SearchMinFare(SearchMinFareRequest request)
        {
            var result = await _dataComService.SearchMinFare(request);
            return Ok(result);
        }


        [HttpPost]
        [Route("searchListMinFare")]
        public async Task<IActionResult> SearchListMinFare(List<SearchMinFareRequest> request)
        {
            var result = await _dataComService.SearchListMinFare(request);
            return Ok(result);
        }


        [HttpPost]
        [Route("searchListMinFareDateRange")]
        public async Task<IActionResult> SearchListMinFareDateRange(List<SearchMinFareRequest> request)
        {
            var result = await _dataComService.SearchListMinFareDateRange(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("searchListMinFareMonths")]
        public async Task<IActionResult> SearchListMinFareMonths(List<SearchMonthRequest> request)
        {
            var result = await _dataComService.SearchListMinFareMonths(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("searchMinFareMonth")]
        public async Task<IActionResult> SearchMinFareMonth(SearchMonthRequest request)
        {
            var result = await _dataComService.SearchMinFareMonth(request);
            return Ok(result);
        }

        [HttpGet]
        [Route("getAirlineByCode")]
        public async Task<IActionResult> GetAirlineByCode([FromQuery] string code)
        {
            var result = await _adavigoService.GetAirlineByCode(code);
            return Ok(result);
        }

        [HttpPost]
        [Route("getGroupClass")]
        public async Task<IActionResult> GetGroupClass(GetGroupClassRequest request)
        {
            var result = await _adavigoService.GetGroupClass(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("getListGroupClass")]
        public async Task<IActionResult> GetListGroupClass(List<GetGroupClassRequest> request)
        {
            var result = await _adavigoService.GetListGroupClass(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("getPrice")]
        public async Task<IActionResult> GetPrice(GetPriceRequest request)
        {
            var result = await _adavigoService.GetPrice(request);
            return Ok(result);
        }

        [HttpGet]
        [Route("getBankListOnePay")]
        public async Task<IActionResult> GetBankListOnePay()
        {
            var result = await _adavigoService.GetBankListOnePay();
            return Ok(result);
        }

        [HttpPost]
        [Route("getBaggage")]
        public async Task<IActionResult> GetBaggage(GetBaggageRequest request)
        {
            var result = await _dataComService.GetBaggage(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("verifyFlight")]
        public async Task<IActionResult> VerifyFlight(VerifyFlightRequest request)
        {
            var result = await _dataComService.VerifyFlight(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("bookFlight")]
        public async Task<IActionResult> BookFlight(BookFlightRequest request)
        {
            var result = await _dataComService.BookFlight(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("issueTicket")]
        public async Task<IActionResult> IssueTicket(IssueTicketRequest request)
        {
            var result = await _dataComService.IssueTicket(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("payment")]
        public async Task<IActionResult> Payment(PaymentRequest request)
        {
            var result = await _adavigoService.Payment(request);
            return Ok(result);
        }

        [HttpPost]
        [Route("saveBooking")]
        public async Task<IActionResult> SaveBooking(SaveBookingRequest request)
        {
            var result = await _adavigoService.SaveBooking(request);
            return Ok(result);
        }


        [HttpPost]
        [Route("getOrderByClientId")]
        public async Task<IActionResult> GetOrderByClientId(GetOrderByClientIdRequest request)
        {
            long id = 0;
            long type = 0;
            var TaskModel = _AccountService.GetDetail();
            var Account = TaskModel.Result;
            if (Account.GroupPermission == (int)GroupPermissionType.ADMIN)
            {
                if (Account.ParentId > 0)
                {
                    id = Account.ParentId;
                    type = 1;
                }
                else
                {
                    id = Account.id;
                }
            }
            else
            {
                id = Account.id;
            }
            var result = await _adavigoService.GetOrderByClientId(request, id, type);
            return Ok(result);
        }

        [HttpPost]
        [Route("getOrderDetail")]
        public async Task<IActionResult> GetOrderDetail(GetOrderDetailRequest request)
        {

            int type = 0;
            var TaskModel = _AccountService.GetDetail();
            var Account = TaskModel.Result;
            if (Account.GroupPermission == (int)GroupPermissionType.ADMIN)
            {
                type = 1;
            }

            var result = await _adavigoService.GetOrderDetail(request, type);
            return Ok(result);
        }

        [HttpPost]
        [Route("getBookingBySessionId")]
        public async Task<IActionResult> GetBookingBySessionId(GetBookingBySessionIdRequest request)
        {
            var result = await _adavigoService.GetBookingBySessionId(request);

            return Ok(result);
        }


        [HttpPost]
        [Route("getBookingBySessionIdOrder")]
        public async Task<IActionResult> GetBookingBySessionIdOrder(GetBookingBySessionIdRequest request)
        {
            var result = await _adavigoService.GetBookingBySessionIdOrder(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("logTele")]
        public async Task<IActionResult> LogTele(SystemLogObj request)
        {
            var result = await _adavigoService.LogTele(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("trackingVoucher")]
        public async Task<IActionResult> TrackingVoucher(TrackingVoucherRequest request)
        {
            var result = await _adavigoService.TrackingVoucher(request);

            return Ok(result);
        }

        [HttpPost]
        [Route("getVietQRCode")]
        public async Task<IActionResult> GetVietQRCode(PaymentHotelModel request)
        {
            var result = await _hotelService.GetVietQRCode(request);
            var resonse = new BaseObjectResponse<string>()
            {
                data = result
            };
            return Ok(resonse);
        }
    }
}
