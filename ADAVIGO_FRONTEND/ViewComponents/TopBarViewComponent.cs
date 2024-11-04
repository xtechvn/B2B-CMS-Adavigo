using ADAVIGO_FRONTEND.Models.Configs;
using ADAVIGO_FRONTEND.Models.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class TopBarViewComponent : ViewComponent
    {
        private readonly AccountService _AccountService;
        public TopBarViewComponent(AccountService AccountService)
        {
            _AccountService = AccountService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;
            var ParentId = claimsIdentity.FindFirst(nameof(SystemUserModel.ParentId));
           
            ViewBag.ParentId = ParentId;
            return View();
        }
    }
}
