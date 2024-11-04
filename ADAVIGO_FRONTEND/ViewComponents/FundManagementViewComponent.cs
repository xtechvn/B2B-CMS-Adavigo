using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class FundManagementViewComponent : ViewComponent
    {
        private readonly HomeService _HomeService;
        private readonly FundService _FundService;

        public FundManagementViewComponent(HomeService homeService, FundService fundService)
        {
            _HomeService = homeService;
            _FundService = fundService;
        }

        public async Task<IViewComponentResult> InvokeAsync(bool is_home_page = false)
        {
            var models = new FundManageViewModel();
            List<int> service_type_has_fund = new List<int>() { 1, 2, 3 };
            try
            {
                var fund_datas = await _HomeService.GetAmountDeposit();
                var fund_history = await _FundService.GetDepositHistory(new FundHistorySearchModel
                {
                    page_index = 1,
                    page_size = 10,
                    from_date=DateTime.Now.AddYears(-1).ToString("dd/MM/yyyy"),
                    to_date=DateTime.Now.ToString("dd/MM/yyyy")

                });

                if (fund_history != null && fund_history.ListData != null && fund_history.ListData.Any())
                {
                    models.fund_history = fund_history.ListData;
                }

                if (fund_datas != null && fund_datas.Any())
                {
                    fund_datas = fund_datas.Where(x => service_type_has_fund.Contains(x.service_type));
                    models.fund_balance_total = fund_datas.Sum(s => s.account_blance);
                    models.fund_list = fund_datas;
                }
                ViewBag.IsHomePage = is_home_page;
            }
            catch
            {

            }
            return View(models);
        }
    }
}
