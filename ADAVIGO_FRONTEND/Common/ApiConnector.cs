using LIB.ENTITIES.ViewModels.Hotels;
using LIB.Utilities.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Common
{
    public class ApiConnector
    {
        private HttpClient _HttpClient;
        private const string CONST_TOKEN_PARAM = "token";
        public readonly string _ApiSecretKey;
        public readonly string _ApiSecretKeyOther;
        private readonly string API_UPLOAD_IMAGE;

        public ApiConnector(IConfiguration _configuration)
        {
            _HttpClient = new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
            })
            {
                BaseAddress = new Uri(_configuration["API:Domain"])
            };

            _ApiSecretKey = _configuration["API:SecretKey"];
            _ApiSecretKeyOther = _configuration["API:SecretKeyOther"];
            API_UPLOAD_IMAGE = _configuration["API_UPLOAD_IMAGE"];
        }

        public async Task<string> ExecutePostAsync(string apiEndPoint, object paramData, int secretkeyType = 0)
        {
            try
            {
                string token = CommonHelper.Encode(JsonConvert.SerializeObject(paramData), secretkeyType == 0 ? _ApiSecretKey : _ApiSecretKeyOther);
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>(CONST_TOKEN_PARAM, token),

                });
                var response_api = await _HttpClient.PostAsync(apiEndPoint, content);
                return await response_api.Content.ReadAsStringAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> ExecutePostAsync(string apiEndPoint, KeyValuePair<string, string>[] keyValuePairs)
        {
            try
            {
                var content = new FormUrlEncodedContent(keyValuePairs);
                var response_api = await _HttpClient.PostAsync(apiEndPoint, content);
                return await response_api.Content.ReadAsStringAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> ExecutePostAsync(string apiEndPoint, string token)
        {
            try
            {
                // string tokendecode = CommonHelper.Decode(token, secretkeyType == 0 ? _ApiSecretKey : _ApiSecretKeyOther);
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>(CONST_TOKEN_PARAM, token),
                });
                var response_api = await _HttpClient.PostAsync(apiEndPoint, content);
                return await response_api.Content.ReadAsStringAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> UploadBase64ImageAsync(string base64String, string fileExtension)
        {
            try
            {
                var _HttpClient = new HttpClient(new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
                })
                {
                    BaseAddress = new Uri(API_UPLOAD_IMAGE)
                };

                //string tokentest = "DHQlLQ1UK1YdNCBFc0ZcLw8LHBAAfQgQHjEELQJ3GmUbPQETMyh1CXktGS00NSoxNncqCiwZRjgoUwYQLycvIR8/EQB+NxcnTAEBKxcwBRcZGR0NSxF2DyQSAkYgCwopAjt3eDYcIgkRbxdHNRkBFAQldDh6AA8EVEA+MCAxBC0EURplIToCMxotAxAgFAwfODAvNTcDHiUQJl8VKB1wGT0IJU85DnZBQCwcIxBaZjEFAh41fh4oGwA3AT0JIVxbAmUwAQYQfl0bfSs/DE1bVThsHDUzLGA9PwADImNZG048JXwgIHMsUTUyDDdHRgZ/DDRqAyMJEBciYlkAH05kBAQTNiMZPjgdZyARVn04VWArBARRbwMxfT5BdAgAY3I7EgQCCXlEJgx8MkEABD4tOghSR3k6Hn0ILg1ELSwXHzcDAikQCUl2VCAPIgc/KCYhQFtkDQglbwIUFxoTXH0iOl1EeThEV3AJNhVcECg7EQVdIzQFTSh8Sm4XDgI/IhoWChpvJwoCDHQ6axsVOxNkWhw8My4rdCBGP2AqKDAhADAmPAEDaEAeFRBIKTkNWi1TJQx7WxxRchkkACs7ABMlJldlPS9eOmAqIw4zASIHGQo9Ly1BUw4LIC06WiwaG3Flfx0kagJmGD8hDz50JgQHHRM3BwwyHHgDFW8SUQxsKj8cL0AaKi4lKWl0GhQiQG4aIVIMaDwAJBULWww4LgFqIzoVOR4NdRIjMRpIfAopMhpaLF82NT8BAlAcMWFLGwYUICEQASAzOT8KB3IpAQFYSTNrYCsVPUASAR0SfU1FJUMENwAKJQd4LywmFj9zYB1HCxIBCyRQJgUiKi0zBwANJXQoKRg2KVEoNXsnPwYPeBonCTEwBB82FQNZDwZGTiNlIAdeAyQHPA8pGzR3OwNjASweMmE3YjdOYzt3eDYXEhkveiZ7QRscLgBZF1VvITYTVVgrVUtSNQIkGzQ=";
                //string tokendecode1 = CommonHelper.Decode(tokentest, _ApiSecretKey);
                //string tokendecode2 = CommonHelper.Decode(tokentest, _ApiSecretKeyOther);

                string token = CommonHelper.Encode(JsonConvert.SerializeObject(new
                {
                    data_file = base64String,
                    extend = fileExtension
                }), _ApiSecretKey);

                var content = new StringContent(JsonConvert.SerializeObject(new { token = token }), Encoding.UTF8, "application/json");

                var response_api = await _HttpClient.PostAsync("images/upload-payment", content);
                return await response_api.Content.ReadAsStringAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> UploadBlockedImageUrl(string url_images)
        {
            try
            {
                var _HttpClient = new HttpClient(new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
                })
                {
                    BaseAddress = new Uri(API_UPLOAD_IMAGE)
                };

                //var token_test = "OmM0My5AbEBDK0UNE0F/bm4gNDdsMi4sNSQvNm8hMS4lNCI2HS0WDjZVEQ5BaygubnN0cGhuc3Budm1xZXJ2I3l5cx55T1N2HE0AAydsIyV4JWxjInFyeXghIGF7ICMed3YGdkNRdAMiUm9rKzEmbSw1JTExe25uIzQibiIuLzUnXTpUETFeHRZRMW8iLS4xJTksMW8oLm1zYXJ4bnBwbQRhGAR6B05QCyZsInV5d2xldnYnbCByJDBuIHUkdHJWKx9Se1VLPAtweXV3cnB2CnAfbysxJW05NzUxMnttHC8PEm5SFg1GIC81bzE2LjU0ITVvIi4uJCcpLDJvK1xhSFFyCFZSA2p2biNzc3JkICR1bHZwdGFudXQnIm9SfRtSbgAdUQd1dnYndHJzZh57dHl1dHJichpwHG8oQylWCTdFCRAIam4gNDJpIj4vNiQvNWwxIywlNCI1bFAiFRQnWRQQHCwubnNxdXh+cHNudm5wcDQmc3VxdW9SeRlSbgUYVFdoeHZzd2lwZSB0dnl5I3lkc3gecHR1B3dJUHcIIlJvaysxJmM5";
                //var data_code = CommonHelper.Decode(token_test, _ApiSecretKey);

                string token = CommonHelper.Encode(JsonConvert.SerializeObject(new
                {
                    urls = url_images
                }), _ApiSecretKey);

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>(CONST_TOKEN_PARAM, token),
                });

                var response_api = await _HttpClient.PostAsync("images/convert-image-url", content);

                return await response_api.Content.ReadAsStringAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<string> GetVietQRCode(string account_number, string bank_code, string order_no, double amount)
        {
            try
            {
                var options = new RestClientOptions("https://api.vietqr.io");
                var client = new RestClient(options);
                var request = new RestRequest("/v2/generate", Method.Post);
                request.AddHeader("x-client-id", "ba09d2bf-7f59-442f-8c26-49a8d48e78d7");
                request.AddHeader("x-api-key", "a479a45c-47d5-41c1-9f83-990d65cd832a");
                request.AddHeader("Content-Type", "application/json");
                var body = "{ \"accountNo\": \""
                    + account_number
                    + "\", \"accountName\": \"CTCP TM VA DV QUOC TE DAI VIET\", \"acqId\": \""
                    + (bank_code.Length > 6 ? bank_code.Substring(0, 6) : bank_code)
                    + "\", \"addInfo\": \""
                    + order_no
                    + " THANH TOAN\", \"amount\": \"" + Math.Round(amount, 0)
                    + "\", \"template\": \"compact\" }";
                request.AddStringBody(body, DataFormat.Json);
                RestResponse response = await client.ExecuteAsync(request);
                return response.Content;

            }
            catch
            {

            }
            return null;
        }
        public async Task<List<VietQRBankDetail>> GetVietQRBankList()
        {
            try
            {
                var options = new RestClientOptions("https://api.vietqr.io");
                var client = new RestClient(options);
                var request = new RestRequest("/v2/banks", Method.Get);
                RestResponse response = await client.ExecuteAsync(request);

                var jsonData = JObject.Parse(response.Content);
                var status = int.Parse(jsonData["code"].ToString());
                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<VietQRBankDetail>>(jsonData["data"].ToString());
                }

            }
            catch
            {
                throw;
            }
            return null;
        }

    }
}
