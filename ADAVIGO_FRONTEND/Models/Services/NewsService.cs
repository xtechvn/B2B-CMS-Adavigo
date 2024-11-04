using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class NewsService : BaseService
    {
        public NewsService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<NewsApiDataModel>> GetNewsList()
        {
            try
            {
                var token = "OmYiIDZWKRUTOm4QBxV/c3I8";
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_NEWS_FEEDS, token);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<NewsApiDataModel>>(jsonData["data_list"].ToString());
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
