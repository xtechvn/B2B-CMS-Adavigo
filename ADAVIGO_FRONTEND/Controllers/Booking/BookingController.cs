using ADAVIGO_FRONTEND.Models.Flights;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Utilities.Contants;
using static ADAVIGO_FRONTEND_B2C.Infrastructure.Utilities.Constants.TourConstants;

namespace ADAVIGO_FRONTEND.Controllers.Booking
{
    [Authorize]
    public class BookingController : Controller
    {
        private readonly BookingService _BookingService;
        private readonly AccountService _AccountService;

        public BookingController(BookingService bookingService, AccountService AccountService)
        {
            _BookingService = bookingService;
            _AccountService = AccountService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Search(BookingSearchModel model)
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
            var data = await _BookingService.GetBookingList(model, id, type);
            return View(data);
        }

        public async Task<IActionResult> Detail(long id)
        {

            long account_client_id = 0;
            long type = 0;
            var TaskModel = _AccountService.GetDetail();
            var Account = TaskModel.Result;
            if (Account.GroupPermission == (int)GroupPermissionType.ADMIN)
            {
                if (Account.ParentId > 0)
                {
                    account_client_id = Account.ParentId;
                    type = 1;
                }
                else
                {
                    account_client_id = Account.id;
                }
            }
            else
            {
                account_client_id = Account.id;
            }
            var data = await _BookingService.GetBookingDetail(id, account_client_id, type);
            return View(data);
        }
        public async Task<IActionResult> RequestHotelBooking()
        {
            return View();
        }
        public async Task<IActionResult> GetListRequestHotelBooking(RequestSearchModel model)
        {

            var TaskModel = _AccountService.GetDetail();
            var Account = TaskModel.Result;

            model.ClientId = Account.id;
            var data = await _BookingService.GetListRequestHotelBooking(model);
            return View(data);
        }
        public async Task<IActionResult> DetailRequestHotelBooking(long BookingId)
        {
            if(BookingId!= 0)
            {
                ViewBag.bt = false;
                ViewBag.Status = 0;
               var data = _BookingService.GetDetailRequestHotelBooking(BookingId).Result;
                if (data != null)
                {
                    ViewBag.RequestNo = data.RequestNo;
                    if(data.Status != (int)RequestStatus.HOAN_THANH && data.Status != (int)RequestStatus.HUY){
                        ViewBag.bt = true;
                    }
                    var amunt_Rooms = data.Rooms != null ? data.Rooms.Sum(s => s.TotalAmount) : 0;
                    var amunt_ExtraPackages = data.ExtraPackages != null ? data.ExtraPackages.Sum(s => s.Amount) : 0;
                    ViewBag.Amount = amunt_Rooms + amunt_ExtraPackages;
                    ViewBag.StatusName = data.StatusName;
                    ViewBag.Status = data.Status;
                    var thoigianConLai = (((DateTime)data.Rooms[0].CreatedDate).AddMinutes(15) - DateTime.Now ).TotalMilliseconds;
                  if (thoigianConLai < 0)
                    {
                        ViewBag.Status = (int)RequestStatus.HUY;
                        ViewBag.StatusName = "Hủy";
                        ViewBag.bt = false;
                    }
                    ViewBag.thoigianConLai = thoigianConLai;
                }

                return View(data);
            }
            else
            {
                return View();
            }
        }
    }
}
