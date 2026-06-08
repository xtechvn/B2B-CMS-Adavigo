using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Helpers;
using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.Flights.GetAirlineByCode;
using ADAVIGO_FRONTEND.Services.CacheService;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.ViewModels;
using Newtonsoft.Json.Linq;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class B2BFlightService : BaseService
    {
        private readonly ICacheService _cacheService;

        public B2BFlightService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor, ICacheService cacheService) : base(apiConnector, httpContextAccessor)
        {
            _cacheService = cacheService;
        }
        public async Task<List<FlightWarehouseBookingViewModel>> GetList(GetListFlightWarehouseModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(SystemConstants.AdavigoApiRoutes.GetlistFl, model);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<FlightWarehouseBookingViewModel>>(jsonData["data"].ToString());
                }
                
            }
            catch (Exception ex)
            {
               
                throw new Exception(ex.Message);
            }
            return null;
        }  
        public async Task<FlightWarehouseBookingDetail> GetDetail(int id)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(SystemConstants.AdavigoApiRoutes.GetDetailFl, new {id=id});

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<FlightWarehouseBookingDetail>(jsonData["data"].ToString());
                }
                
            }
            catch (Exception ex)
            {
               
                throw new Exception(ex.Message);
            }
            return null;
        }
    }
}
