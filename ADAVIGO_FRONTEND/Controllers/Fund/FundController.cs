using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Controllers.Fund
{
    [Authorize]
    public class FundController : Controller
    {
        private readonly FundService _FundService;

        public FundController(FundService fundService)
        {
            _FundService = fundService;
        }

        public IActionResult History()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SearchHistory(FundHistorySearchModel model)
        {
            model.from_date ??= DateTime.Now.AddYears(-1).ToString("dd/MM/yyyy");
            model.to_date ??= DateTime.Now.ToString("dd/MM/yyyy");
            var data = await _FundService.GetDepositHistory(model);
            return View(data);
        }
    }
}
