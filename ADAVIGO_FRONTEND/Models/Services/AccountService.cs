using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.Utilities.Common;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class AccountService : BaseService
    {
        public AccountService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }

        public async Task<AccountModel> GetDetail()
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_DETAIL, new
                {
                    account_client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    var data = JsonConvert.DeserializeObject<AccountModel>(jsonData["data"].ToString());
                    data.id = _UserManager.ClientID;
                    return data;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> Update(AccountModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_UPDATE, new
                {
                    account_client_id = model.id,
                    name = model.name,
                    country = model.country,
                    provinced_id = model.provinced_id,
                    district_id = model.district_id,
                    ward_id = model.ward_id,
                    address = model.address,
                    account_number = model.account_number,
                    account_name = model.account_name,
                    bank_name = model.bank_name,
                    indentifer_id = model.indentifer_id
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return model.id;
                }
                else
                {
                    throw new Exception(jsonData["msg"].ToString());
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> ChangePass(AccountChangePassModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_CHANGEPASS, new
                {
                    account_client_id = _UserManager.ClientID,
                    password_old = EncryptionHelper.MD5Hash(model.password_old),
                    password_new = EncryptionHelper.MD5Hash(model.password_new),
                    client_type = _UserManager.ClientType,
                    confirm_password_new = EncryptionHelper.MD5Hash(model.confirm_password_new),
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return 1;
                }
                else
                {
                    throw new Exception(jsonData["msg"].ToString());
                }
            }
            catch
            {
                throw;
            }
        }
        public async Task<BaseObjectResponse<int>> InsertClientB2B(AccountViewModel model)
        {
            try
            {
                
                var data = new BaseObjectResponse<int>();
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.INSER_CLIENTB2B, model);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                data.status = status;
                if (status == (int)ENUM_API_RESULT.SUCCESS) 
                {
                    data.data = int.Parse(jsonData["data"].ToString());
                }
                else
                {
                    data.msg = jsonData["msg"].ToString();
                }
                return data;
            }
            catch
            {
                throw;
            }
        }
        public async Task<List<ListAccountClientModel>> GetListAccountClient(long ClientId , long GroupPermission, long Status,long PageIndex,long PageSize,string inputSearch)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GetListAccountClient, new {
                    ClientId=ClientId,
                    GroupPermission= GroupPermission,
                    Status= Status,
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    TextSearch = inputSearch,
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                   var data = JsonConvert.DeserializeObject<List<ListAccountClientModel>>(jsonData["data"].ToString());
                    return data;
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
        public async Task<AccountModel> GetAccountDetail(int id)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_DETAIL, new
                {
                    account_client_id = id
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    var data = JsonConvert.DeserializeObject<AccountModel>(jsonData["data"].ToString());
                    return data;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }
        public async Task<BaseObjectResponse<int>> UpdateAccountClient(AccountViewModel model)
        {
            try
            {
                var data = new BaseObjectResponse<int>();
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.Update_Account_Client, model);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                data.status = status;
               if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    data.data = int.Parse(jsonData["data"].ToString());
                }
                else
                {
                    data.msg = jsonData["msg"].ToString();
                }
                return data; 
            }
            catch
            {
                throw;
            }
        }
    }
}
