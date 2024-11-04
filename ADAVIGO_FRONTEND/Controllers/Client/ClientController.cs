using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Client;
using B2B.Utilities.Contants;
using ENTITIES.ViewModels.Client;
using LIB.Utilities.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Client
{
    public class ClientController : Controller
    {

        private readonly IConfiguration Configuration;
        private readonly ClientService clientService;
        public ClientController(IConfiguration _Configuration)
        {
            Configuration = _Configuration;
            clientService = new ClientService(_Configuration);
        }

        [HttpGet]
        [Route("login")]
        public IActionResult Login([FromQuery(Name = "url")] string currentURL = null)
        {
            ClientLogOnViewModel model = new ClientLogOnViewModel();
            model.return_url = currentURL;
            return View(model);
        }

        [HttpPost]
        [Route("login")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(ClientLogOnViewModel model)
        {
            try
            {
                string issuer = Configuration["Authentication:Issuer"];
                string audience = Configuration["Authentication:Audience"];
                string password_hash = EncryptionHelper.MD5Hash(model.Password);
                var loginResult = await clientService.checkLogIn(model.Email, password_hash, issuer, audience);

                string jwtToken = loginResult["token"];
                //Save token in session object
                HttpContext.Session.SetString(JWTConstants.AccessTokenKey, jwtToken);

                // Save Cookie                   
                Response.Cookies.Append(
                    JWTConstants.AccessTokenKey,
                    jwtToken,
                    new CookieOptions()
                    {
                        Path = "/",
                        HttpOnly = false,
                        Secure = false,
                        Expires = DateTime.Now.AddDays(30)
                    }
                );
                return Redirect(model.return_url ?? "/Home");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
            }
            return View(model);
        }

        [HttpGet]
        [Route("ForgotPassword")]
        public IActionResult ForgotPassword()
        {
            ClientForgetPasswordViewModel model = new ClientForgetPasswordViewModel();
            return View(model);
        }

        [HttpPost("ForgotPassword")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ClientForgetPasswordViewModel model)
        {
            try
            {
                var IsSuccess = true;
                await clientService.SendMailResetPassword(model.Email);
                if (IsSuccess)
                {
                    ViewBag.SuccessMessage = "Gửi email thành công";
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(nameof(ClientForgetPasswordViewModel.Email), ex.Message);
            }
            return View(model);
        }

        [HttpGet]
        [Route("flights/account")]
        public IActionResult ResetPassword(string forgotPassword = null)
        {
            ClientMailTokenModel model = null;
            try
            {
                forgotPassword = forgotPassword.Replace(' ', '+');
                var tokenData = CommonHelper.Decode(forgotPassword, Configuration["API:SecretKeyOther"]);
                model = JsonConvert.DeserializeObject<ClientMailTokenModel>(tokenData);
                model.token = forgotPassword;
            }
            catch
            {

            }
            return View(model);
        }

        [HttpPost("flights/client/reset-password")]
        public async Task<IActionResult> ResetPassword(AccountResetPasswordModel model)
        {
            try
            {
                var client_id = await clientService.ResetPassword(model);
                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Đặt lại mật khẩu thành công",
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

        [HttpGet]
        public IActionResult Logoff()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete(JWTConstants.AccessTokenKey);
            return Ok(new { status = (int)ResponseType.SUCCESS });
        }
    }
}
