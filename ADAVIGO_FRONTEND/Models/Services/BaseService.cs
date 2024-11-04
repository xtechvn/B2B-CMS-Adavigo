using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Configs;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class BaseService
    {
        protected readonly ApiConnector _ApiConnector;
        protected readonly SystemUserModel _UserManager;
        public BaseService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor)
        {
            var claimsIdentity = httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            var address = claimsIdentity.FindFirst(nameof(SystemUserModel.Address));
            var phone = claimsIdentity.FindFirst(nameof(SystemUserModel.Phone));
            _UserManager = new SystemUserModel
            {
                ClientID = int.Parse(claimsIdentity.FindFirst(nameof(SystemUserModel.ClientID)).Value),
                ClientType = int.Parse(claimsIdentity.FindFirst(nameof(SystemUserModel.ClientType)).Value),
                ClientName = claimsIdentity.FindFirst(nameof(SystemUserModel.ClientName)).Value,
                Phone = phone != null ? phone.Value : string.Empty,
                Address = address != null ? address.Value : string.Empty
            };
            _ApiConnector = apiConnector;
        }
        public SystemUserModel GetLoggedUser() {
            return _UserManager;
        }
    }
}
