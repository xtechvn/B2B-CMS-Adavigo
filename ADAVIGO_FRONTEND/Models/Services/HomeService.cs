using ADAVIGO_FRONTEND.Common;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class HomeService : BaseService
    {
        public HomeService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<FundDataModel>> GetAmountDeposit()
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_AMOUNT_DEPOSIT, new
                {
                    client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<FundDataModel>>(jsonData["data"].ToString());
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

        public async Task<bool> TranferAmountDeposit(FundTranferModel entity)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.TRANFER_FUND, new
                {
                    from_fund_type = entity.from_fund_type,
                    to_fund_type = entity.to_fund_type,
                    amount_move = entity.amount_move,
                    client_id = _UserManager.ClientID
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return true;
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<BankDataModel>> GetAllOnePayBank(string token = "ShFEWV1JGgkSCHBjZBISNyEkRltUW0US")
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_ALL_ONEPAY_BANK, token);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<BankDataModel>>(jsonData["data"].ToString());
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

        public async Task<string> InsertDepositHistory(int serviceType, decimal price)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.INSERT_DEPOSIT_HISTORY, new
                {
                    UserId = _UserManager.ClientID,
                    Price = price,
                    ServiceType = serviceType,
                    TransType = (int)ENUM_TRAN_TYPE.RECHARGE_FUND
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    var jDataObject = JObject.Parse(jsonData["data"].ToString());
                    return jDataObject["transNo"].ToString();
                }
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> PaymentCheckout(PaymentInsertModel model)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.PAYMENT_CHECKOUT, new
                {
                    payment_type = (int)ENUM_PAYMENT_TYPE.CHUYEN_KHOAN_NGAN_HANG,
                    user_id = _UserManager.ClientID,
                    trans_no = model.trans_no,
                    bank_name = model.bank_name
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return true;
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> UpdateTransProof(string Base64Image, string TranNo)
        {
            try
            {
                string image_proof_link = string.Empty;

                var arrBase64 = Base64Image.Split(';');
                var strBase64 = arrBase64[1].Split(',')[1];
                var fileExtension = arrBase64[0].Split('/')[1];

                var resultUpload = await _ApiConnector.UploadBase64ImageAsync(strBase64, fileExtension);

                var jsonUploadData = JObject.Parse(resultUpload);
                var isNumberStatus = int.TryParse(jsonUploadData["status"].ToString(), out int statusUpload);

                if (isNumberStatus && statusUpload == (int)ENUM_API_RESULT.SUCCESS)
                    image_proof_link = jsonUploadData["url_path"].ToString();
                else
                    throw new Exception(jsonUploadData["message"].ToString());

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.PROOF_TRANS, new
                {
                    user_id = _UserManager.ClientID,
                    trans_no = TranNo,
                    link_proof = image_proof_link
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                    return true;
                else
                    throw new Exception(jsonData["msg"].ToString());
            }
            catch
            {
                throw;
            }
        }
       

    }
}
