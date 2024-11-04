using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class LocationService : BaseService
    {
        public LocationService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<ProvinceModel>> GetProvinceList()
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.LOCATION_PROVINCE, "OmMiLixVJwgMYQtbUhA4");

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<ProvinceModel>>(jsonData["data"].ToString());
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<DistrictModel>> GetDistrictList(string provinceId)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.LOCATION_DISTRICT, new
                {
                    provinceId = provinceId
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<DistrictModel>>(jsonData["data"].ToString());
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<WardModel>> GetWardList(string districtId)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.LOCATION_WARD, new
                {
                    districtId = districtId
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<WardModel>>(jsonData["data"].ToString());
                }

                return null;
            }
            catch
            {
                throw;
            }
        }
    }
}
