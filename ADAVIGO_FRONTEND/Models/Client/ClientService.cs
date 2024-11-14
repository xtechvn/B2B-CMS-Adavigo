using ADAVIGO_FRONTEND.Common;
using B2B.Utilities.Common;
using B2B.Utilities.Contants;
using ENTITIES.ViewModels.Client;
using LIB.Utilities.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Client
{
    public class ClientService
    {
        private readonly IConfiguration configuration;
        protected readonly ApiConnector _ApiConnector;

        public ClientService(IConfiguration _configuration)
        {
            configuration = _configuration;
            _ApiConnector = new ApiConnector(_configuration);
        }

        public async Task<Dictionary<string, string>> checkLogIn(string username, string password, string issuer, string audience, int exprire_day = 30)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            result.Add("status", ResponseType.FAILED.ToString());
            result.Add("msg", "Đăng nhập thất bại");
            result.Add("token", "");
            try
            {
                string url_api = configuration["API:Domain"] + configuration["API:GetAccountB2B"];
                string token = CommonHelper.Encode(JsonConvert.SerializeObject(new
                {
                    UserName = username,
                    Password = password
                }), configuration["DataBaseConfig:key_api:api_manual"]);

                var connect_api_us = new ConnectApi(url_api, token);
                var response_api = await connect_api_us.CreateHttpRequest();

                // Nhan ket qua tra ve                            
                var JsonParent = JObject.Parse(response_api);
                result["status"] = JsonParent["status"].ToString();
                if (JsonParent["status"].ToString() == ((int)ResponseType.SUCCESS).ToString())
                {
                    ClientB2BModel client_b2b = JsonConvert.DeserializeObject<ClientB2BModel>(JsonParent["data"].ToString());
                    result["token"] = GenerateTokenJwt(GetUserClaims(client_b2b), issuer, audience);
                    return result;
                }
                else
                {
                    throw new Exception(JsonParent["msg"].ToString());
                }
            }
            catch (Exception ex)
            {
                //LogService.addLogTelegram("ClientService - checkLogIn error: " + ex.ToString());
                throw;
            }
        
        }

        private static IEnumerable<Claim> GetUserClaims(ClientB2BModel user)
        {
            IEnumerable<Claim> claims = new Claim[]
            {
                new Claim("CLIENTID", user.ClientId.ToString()),
                new Claim("ClientType", user.ClientType.ToString()),
                new Claim(ClaimTypes.Name, user.ClientName ?? String.Empty),
                new Claim("USERNAME", user.UserName ?? String.Empty),
                new Claim("AVATAR", user.Avatar ?? String.Empty),
                new Claim("ClientName", user.ClientName ?? String.Empty),
                new Claim("Phone", user.phone ?? String.Empty),
                new Claim("Address", user.address ?? String.Empty),
                new Claim("Email", user.email ?? String.Empty),
                new Claim("ParentId", user.ParentId.ToString() ?? String.Empty),
            };
            return claims;
        }
        private static string GenerateTokenJwt(IEnumerable<Claim> claims, string issuer, string audience, int exprire_day = 30)
        {

            var secretBytes = Encoding.UTF8.GetBytes(JWTConstants.SecretKey);
            var key = new SymmetricSecurityKey(secretBytes);
            var algorithm = SecurityAlgorithms.HmacSha256;

            var signingCredentials = new SigningCredentials(key, algorithm);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                expires: DateTime.UtcNow.AddDays(exprire_day),
                //Using HS256 Algorithm to encrypt Token - JRozario
                signingCredentials: signingCredentials);
                
             var tokenJson = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenJson;
        }

        public async Task<bool> SendMailResetPassword(string mail)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_MAIL_RESET_PASSWORD, new
                {
                    template_type = 2,
                    email = mail
                }, 1);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return true;
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

        public async Task<bool> ResetPassword(AccountResetPasswordModel data)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.USER_RESET_PASSWORD, new
                {
                    email = data.email,
                    password = data.password_new,
                    re_password = data.password_new,
                    token = data.token,
                }, 1);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return true;
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
    }
}
