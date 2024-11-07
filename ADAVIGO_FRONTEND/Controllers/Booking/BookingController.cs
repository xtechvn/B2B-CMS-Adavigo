using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Utilities.Contants;

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
        public async Task<IActionResult> DetailRequestHotelBooking(int id,string RequestNo)
        {
            ViewBag.RequestNo = RequestNo;
            var data = await _BookingService.GetDetailRequestHotelBooking(id);
            if(data != null)
            {
                var amunt_Rooms = data.Rooms != null ? data.Rooms.Sum(s => s.TotalAmount) : 0;
                var amunt_ExtraPackages = data.ExtraPackages != null ? data.ExtraPackages.Sum(s => s.Amount) : 0;
                ViewBag.Amount = amunt_Rooms + amunt_ExtraPackages;
            }
            
            return View(data);
        }
    }
}
