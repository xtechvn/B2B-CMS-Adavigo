using LIB.Utilities.Common;

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using ADAVIGO_FRONTEND.ViewModels;
using Microsoft.Extensions.Configuration;
using B2B.Utilities.Common;
using System.Linq;
using LIB.Utilities.Contants;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using ADAVIGO_FRONTEND.Common;

namespace ADAVIGO_FRONTEND.Models.Services
{
    public class CommentService : BaseService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _context;



        public CommentService(ApiConnector apiConnector,IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
            _configuration = configuration;
            _context = httpContextAccessor;
        }


        public async Task<List<CommentViewModel>> GetListCommentsAsync(int requestId)
        {
            try
            {
                using HttpClient httpClient = new HttpClient();
                var j_param = new Dictionary<string, object>
        {
            { "request_id", requestId }
        };

                var data_product = JsonConvert.SerializeObject(j_param);
                var token = CommonHelper.Encode(data_product, _configuration["DataBaseConfig:key_api:b2b"]);

                var request = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("token", token)
        });

                //var url = "https://localhost:44396" + "/api/comment/get-list.json";
                var response = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.GET_COMMENT_LISTING, token);

                if (!string.IsNullOrEmpty(response))
                {
                    //var stringResult = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonConvert.DeserializeObject<ApiResponse<List<CommentViewModel>>>(response);

                    if (apiResponse != null && apiResponse.Status == 0 && apiResponse.Data != null)
                    {
                        return apiResponse.Data; // Trả về danh sách comment
                    }
                }


                return new List<CommentViewModel>(); // Nếu không thành công, trả về danh sách rỗng
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"GetListComments Error: {ex}");
                return new List<CommentViewModel>();
            }
        }




        public async Task<CommentViewModel> AddCommentAsync(int requestId, int userid, int type, string content, List<string> attachFileUrls, List<string> attachFileNames, int createdBy)
        {
            try
            {

                // Chuẩn bị dữ liệu gọi API lưu comment
                var commentData = new
                {
                    request_id = requestId,
                    userid = userid,
                    type = (int)AttachmentType.Addservice_Comment,
                    content,
                    attach_files = attachFileUrls.Zip(attachFileNames, (url, name) => new { url, name }),
                    created_by = createdBy,
                    user_type = 0,
                };

                var data_product = JsonConvert.SerializeObject(commentData);
                var token = CommonHelper.Encode(data_product, _configuration["DataBaseConfig:key_api:b2b"]);

                var request = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("token", token)
        });
                using var httpClient = new HttpClient();

                //var url = "https://localhost:44396" + "/api/comment/add.json";
                var response = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.ADD_COMMENT, token);

                if (!string.IsNullOrEmpty(response))
                {
                    var result = JsonConvert.DeserializeObject<ApiResponse<CommentViewModel>>(response);


                    if (result != null && result.Status == 0 && result.Data != null)
                    {
                        return result.Data; // Trả về thông tin comment vừa thêm
                    }
                }



                return null; // Thất bại
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"AddComment Error: {ex}");
                return null;
            }
        }
    }
}
