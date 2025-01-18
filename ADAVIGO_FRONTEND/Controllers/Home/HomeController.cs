using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using B2B.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Home
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly HomeService _HomeService;
        private readonly string _KeyEncodeParam;
        private List<int> service_type_has_fund = new List<int>() { 1, 2, 3 };

        public HomeController(HomeService homeService, IConfiguration configuration)
        {
            _HomeService = homeService;
            _KeyEncodeParam = configuration["KeyEncodeParam"];
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult FundManager()
        {
            return ViewComponent("FundManagement");
        }

        public IActionResult FundHotel()
        {
            return ViewComponent("FundHotel");
        }

        public async Task<IActionResult> PopupTranferFund()
        {

            var models = await _HomeService.GetAmountDeposit();
            if (models != null && models.Any())
            {
                models = models.Where(x => service_type_has_fund.Contains(x.service_type));
            }
            return View(models);
        }

        public IActionResult PopupAddFund(FundDataModel model)
        {
            return View(model);
        }

        public async Task<IActionResult> TranferBalance(FundTranferModel input)
        {
            try
            {
                var data = await _HomeService.TranferAmountDeposit(input);
                if (data)
                {
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Trích quỹ thành công"
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Trích quỹ thất bại"
                    });
                }
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

        public async Task<IActionResult> FundPaymentMethod(int service_type, decimal amount)
        {
            var model = new BankPaymentViewModel();
            try
            {
                model.tran_code = await _HomeService.InsertDepositHistory(service_type, amount);
                model.service_type = service_type;
                model.amount = amount;
            }
            catch
            {

            }
            return View(model);
        }

        public IActionResult PopupPaymentConfirm(BankPaymentModel model)
        {
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> PaymentCheckout(PaymentInsertModel model)
        {
            try
            {
                var isSuccess = await _HomeService.PaymentCheckout(model);
                if (isSuccess)
                {
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Khởi tạo xác nhận thanh toán thành công"
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Khởi tạo xác nhận thanh toán thất bại"
                    });
                }
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

        public IActionResult ConfirmSuccessPayment(string transNo)
        {
            var model = new BankPaymentModel
            {
                tran_code = transNo
            };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> InsertConfirmPayment(PaymentConfirmModel model)
        {
            try
            {
                var isSuccess = await _HomeService.UpdateTransProof(model.Base64Image, model.TransNo);
                if (isSuccess)
                {
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Khởi tạo thành công"
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Khởi tạo thất bại"
                    });
                }
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
        public async Task<IActionResult> HomeSummary()
        {
            ViewBag.Data = await _HomeService.HomeSummary();
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetNewsDetail(int article_id)
        {
            var data = await _HomeService.GetNewsDetail(article_id);
            return new JsonResult(new
            {
                isSuccess = (data != null && data.id>0),
                data = data
            });
        }
    }
}
