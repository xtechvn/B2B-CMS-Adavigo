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
    public class FundHotelViewComponent : ViewComponent
    {
        private readonly HomeService _HomeService;
        private readonly FundService _FundService;

        public FundHotelViewComponent(HomeService homeService, FundService fundService)
        {
            _HomeService = homeService;
            _FundService = fundService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var models = new FundManageViewModel();
            try
            {
                var fund_datas = await _HomeService.GetAmountDeposit();
                var fund_history = await _FundService.GetDepositHistory(new FundHistorySearchModel
                {
                    page_index = 1,
                    page_size = 10,
                    from_date=DateTime.Now.AddYears(-1).ToString("dd/MM/yyyy"),
                    to_date=DateTime.Now.ToString("dd/MM/yyyy"),
                    service_type=1
                });

                if (fund_history != null && fund_history.ListData != null && fund_history.ListData.Any())
                {
                    models.fund_history = fund_history.ListData;
                }

                if (fund_datas != null && fund_datas.Any())
                {
                    models.fund_balance_total = fund_datas.Sum(s => s.account_blance);
                    models.fund_list = fund_datas;
                }
            }
            catch
            {

            }
            return View(models);
        }
    }
}
