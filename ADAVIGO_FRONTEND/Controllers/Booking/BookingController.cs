using ADAVIGO_FRONTEND.Models.Flights;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using B2B.Utilities.Common;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Utilities.Contants;
using static ADAVIGO_FRONTEND_B2C.Infrastructure.Utilities.Constants.TourConstants;
using System.Configuration;
using Microsoft.Extensions.Configuration;
using Caching.RedisWorker;

namespace ADAVIGO_FRONTEND.Controllers.Booking
{
    [Authorize]
    public class BookingController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly BookingService _BookingService;
        private readonly ISubscriber _subscriber;
        private readonly RedisConn _redisService;

        private readonly CommentService _commentService;
        private readonly AccountService _AccountService;

        public BookingController(BookingService bookingService, AccountService AccountService, RedisConn redisService, IConfiguration configuration, CommentService commentService)
        {
            _BookingService = bookingService;
            _redisService = redisService;
            _configuration = configuration;

            var connection = ConnectionMultiplexer.Connect(_configuration["Redis:Host"] + ":" + _configuration["Redis:Port"]);
            _subscriber = connection.GetSubscriber();
            _commentService = commentService;
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
                    if(data.Status == (int)RequestStatus.DA_XU_LY && data.Rooms != null && data.Rooms.Where(s=> (int)s.IsRoomAvailable == RoomAvailableStatus.CON_PHONG).ToList().Count > 0)
                    {
                        ViewBag.bt = true;
                    }
                    var amunt_Rooms = data.Rooms != null ? data.Rooms.Sum(s => s.TotalAmount) : 0;
                    var amunt_ExtraPackages = data.ExtraPackages != null ? data.ExtraPackages.Sum(s => s.Amount) : 0;
                    ViewBag.Amount = amunt_Rooms + amunt_ExtraPackages;
                    ViewBag.StatusName = data.StatusName;
                    ViewBag.Status = data.Status;
                    var thoigianConLai = (((DateTime)data.Rooms[0].CreatedDate).AddMinutes(60) - DateTime.Now ).TotalMilliseconds;
                  if (thoigianConLai < 0)
                    {
                        ViewBag.Status = (int)RequestStatus.HUY;
                        ViewBag.StatusName = "Hủy";
                        ViewBag.bt = false;
                    }
                    ViewBag.thoigianConLai = thoigianConLai;
                    ViewBag.endtime = ((DateTime)data.Rooms[0].CreatedDate).AddMinutes(60); ;
                }

                return View(data);
            }
            else
            {
                return View();
            }
        }


        public async Task<IActionResult> CommentRequest(int id)
        {
            var data = new CommentComponentViewModel();
            try
            {
                ViewBag.id = id;

                if (id > 0)
                {
                    var comments = await _commentService.GetListCommentsAsync(id);

                    data.RequestId = id;
                    data.Comments = comments ?? new List<CommentViewModel>();
                }
                //@await Component.InvokeAsync("Comment", new { requestId = ViewBag.id })
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("CommentRequest - RequestHotelBookingController: " + ex.ToString());
            }
            return PartialView(data);

        }
        [HttpGet]
        public async Task GetCommentsStream(int requestId)
        {
            Response.Headers.Add("Content-Type", "text/event-stream");

            var dataQueue = new ConcurrentQueue<string>();

            _subscriber.Subscribe($"COMMENT_{requestId}", (channel, message) =>
            {
                dataQueue.Enqueue(message);
            });

            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                while (dataQueue.TryDequeue(out var message))
                {
                    var data = $"data: {message}\n\n";
                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
                    await Response.Body.WriteAsync(buffer, 0, buffer.Length);
                    await Response.Body.FlushAsync();
                }

                await Task.Delay(100); // Giảm tải CPU
            }
        }


        //// Load danh sách comment ban đầu
        [HttpPost]
        public async Task<IActionResult> LoadComments(int requestId)
        {
            try
            {
                var comments = await _commentService.GetListCommentsAsync(requestId);

                return Ok(new
                {
                    status = comments != null ? 1 : 0,
                    data = comments
                });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"LoadComments Error: {ex}");
                return Ok(new { status = 0, msg = "Failed to load comments." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddComment([FromForm] int requestId, [FromForm] string content, [FromForm] List<IFormFile> attachFiles)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(content) && (attachFiles == null || !attachFiles.Any()))
                {
                    return BadRequest(new { status = 1, msg = "Vui lòng nhập nội dung hoặc đính kèm file." });
                }
                int userid = 0;

                var TaskModel = _AccountService.GetDetail();
                var Account = TaskModel.Result;
                if (Account.GroupPermission == (int)GroupPermissionType.ADMIN)
                {
                    if (Account.ParentId > 0)
                    {
                        userid = Account.ParentId;

                    }
                    else
                    {
                        userid = Account.id;
                    }
                }
                else
                {
                    userid = Account.id;
                }



                var type = 0;

                var createdBy = userid;
                var fileUrls = new List<string>();
                var fileNames = new List<string>();

                // Kiểm tra file và upload
                if (attachFiles != null && attachFiles.Any())
                {
                    long totalSize = attachFiles.Sum(f => f.Length);
                    if (totalSize > 25 * 1024 * 1024) // 25MB
                    {
                        return BadRequest(new { status = 1, msg = "Tổng dung lượng file vượt quá 25MB." });
                    }

                    foreach (var file in attachFiles)
                    {
                        var fileUrl = await UpLoadHelper.UploadFileOrImage(file, requestId, 35);
                        if (!string.IsNullOrEmpty(fileUrl))
                        {
                            fileUrls.Add(fileUrl);
                            fileNames.Add(file.FileName);
                        }
                    }
                }

                // Lưu comment vào database
                var newComment = await _commentService.AddCommentAsync(requestId, userid, type, content, fileUrls, fileNames, createdBy);

                if (newComment != null)
                {
                    return Ok(new { status = 0, msg = "Thêm comment thành công.", data = newComment });
                }

                return BadRequest(new { status = 1, msg = "Thêm comment không thành công." });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"AddComment Error: {ex}");
                return StatusCode(500, new { status = 1, msg = "Thêm comment không thành công." });
            }
        }
    }
}
