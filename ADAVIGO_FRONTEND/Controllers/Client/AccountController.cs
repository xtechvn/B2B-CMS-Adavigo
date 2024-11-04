using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.Utilities.Common;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Client
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly AccountService _AccountService;
        private readonly LocationService _LocationService;
        private readonly HomeService _HomeService;
        private readonly B2CFlightService _adavigoService;


        public AccountController(AccountService accountService, LocationService locationService, HomeService homeService, B2CFlightService adavigoService)
        {
            _AccountService = accountService;
            _LocationService = locationService;
            _HomeService = homeService;
            _adavigoService = adavigoService;
        }

        public async Task<IActionResult> Index()
        {
            var TaskModel = _AccountService.GetDetail();
            var TaskProvince = _LocationService.GetProvinceList();
            var TaskBank = _HomeService.GetAllOnePayBank();

            await Task.WhenAll(TaskModel, TaskProvince, TaskBank);

            var model = TaskModel.Result;
            ViewBag.Provinces = TaskProvince.Result;
            ViewBag.Banks = TaskBank.Result;

            return View(model);
        }

        public async Task<IActionResult> GetDistrictOfProvince(string provinceId)
        {
            var districts = await _LocationService.GetDistrictList(provinceId);
            return new JsonResult(new
            {
                data = districts
            });
        }

        public async Task<IActionResult> GetWardOfDistrict(string districtId)
        {
            var wards = await _LocationService.GetWardList(districtId);
            return new JsonResult(new
            {
                data = wards
            });
        }

        [HttpPost]
        public async Task<IActionResult> Update(AccountModel model)
        {
            try
            {
                var client_id = await _AccountService.Update(model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Cập nhật thành công",
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
        public async Task<IActionResult> ChangePass(AccountChangePassModel model)
        {
            try
            {
                var client_id = await _AccountService.ChangePass(model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Cập nhật mật khẩu thành công",
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
        public async Task<IActionResult> listAccount()
        {
            var allcode = _adavigoService.GetAllCode(AllCodeType.ACCOUNT_CLIENT_STATUS).Result;
            var allcode_PERMISSION_B2B = _adavigoService.GetAllCode(AllCodeType.GROUP_PERMISSION_B2B).Result;
            ViewBag.allcode = allcode.data;
            ViewBag.allcode_PERMISSION_B2B = allcode_PERMISSION_B2B.data;

            return View();
        }
        public async Task<IActionResult> GetlistAccount(string inputSearch, long Type, long Status, long PageIndex, long PageSize)
        {
            var TaskModel = _AccountService.GetDetail();
            var model = TaskModel.Result;
            var data = await _AccountService.GetListAccountClient(model.id, Type, Status, PageIndex, PageSize, inputSearch);
            ViewBag.Pindex = PageIndex;
            ViewBag.Psize = PageSize;

            if(data!=null && data.Count > 0)
            {
                ViewBag.Total = (int)Math.Ceiling((double)data[0].TotalRow /PageSize );
            }
            return PartialView(data);
        }
        public async Task<IActionResult> PopupAccount(int id)
        {
            try
            {
                var allcode_PERMISSION_B2B = _adavigoService.GetAllCode(AllCodeType.GROUP_PERMISSION_B2B).Result;
                ViewBag.allcode_PERMISSION_B2B = allcode_PERMISSION_B2B.data;
                if (id != 0)
                {
                    var TaskModel = _AccountService.GetAccountDetail(id);
                    var model = TaskModel.Result;

                    return View(model);

                }

            }
            catch
            {
                throw;
            }
            return View();
        }
        public async Task<IActionResult> SetUpAccount(AccountViewModel Model)
        {
            try
            {
                var TaskModel = _AccountService.GetDetail();
                var model_Account = TaskModel.Result;
                Model.AccountId = model_Account.id;
                Model.ClientType = model_Account.client_type;
               

                if (Model.id != 0)
                {
                    var AccountDetail = _AccountService.GetAccountDetail(Model.id);
                    var AccountDetailModel = TaskModel.Result;
                    if(AccountDetailModel.Password != Model.Password)
                    {
                        Model.Password = EncryptionHelper.MD5Hash(Model.Password);
                        Model.PasswordBackup = EncryptionHelper.MD5Hash(Model.PasswordBackup);
                    }
                    var update =await _AccountService.UpdateAccountClient(Model);
                    if (update.status == (int)ENUM_API_RESULT.SUCCESS)
                    {
                        return new JsonResult(new
                        {
                            isSuccess = true,
                            message = "Cập nhật thành công",
                        });
                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            isSuccess = false,
                            message = update.msg,
                        });
                    }
                   
                }
                else
                {
                    Model.Password = EncryptionHelper.MD5Hash(Model.Password);
                    Model.PasswordBackup = EncryptionHelper.MD5Hash(Model.PasswordBackup);
                    var SetUpAccount = await _AccountService.InsertClientB2B(Model);
                   if(SetUpAccount.status == (int)ENUM_API_RESULT.SUCCESS)
                    {
                        return new JsonResult(new
                        {
                            isSuccess = true,
                            message = "Thêm mới thành công",
                        });
                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            isSuccess = false,
                            message = SetUpAccount.msg,
                        });
                    }
                   
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
    }
}
