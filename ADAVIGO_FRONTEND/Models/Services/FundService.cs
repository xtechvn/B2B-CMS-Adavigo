using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class FundService : BaseService
    {
        public FundService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }

        public async Task<GenericGridViewModel<DepositHistoryViewMdel>> GetDepositHistory(FundHistorySearchModel model)
        {
            try
            {
                DateTime from_date = DateTime.ParseExact(model.from_date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime to_date = DateTime.ParseExact(model.to_date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_DEPOSIT_HISTORY, new
                {
                    page = model.page_index,
                    size = model.page_size,
                    service_type = model.service_type ?? 0,
                    clientid = _UserManager.ClientID,
                    from_date= from_date.ToString(),
                    to_date= to_date.ToString()
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    GenericGridViewModel<DepositHistoryViewMdel> gridModel = JsonConvert.DeserializeObject<GenericGridViewModel<DepositHistoryViewMdel>>(jsonData["data"].ToString());
                    return gridModel;
                }
                return new GenericGridViewModel<DepositHistoryViewMdel>();
            }
            catch
            {
                throw;
            }
        }

    }
}
