using ADAVIGO_FRONTEND.Common;
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
    public class BookingService : BaseService
    {
        public BookingService(ApiConnector apiConnector, IHttpContextAccessor httpContextAccessor) : base(apiConnector, httpContextAccessor)
        {
        }


        public async Task<GenericGridViewModel<BookingModel>> GetBookingList(BookingSearchModel model, long id, long type)
        {
            try
            {
                var gridModel = new GenericGridViewModel<BookingModel>()
                {
                    CurrentPage = model.page_index,
                    PageSize = model.page_size,
                };

                string token = CommonHelper.Encode(JsonConvert.SerializeObject(new
                {
                    start_date = model.from_date,
                    end_date = model.to_date,
                    account_client_id = id,
                    page = model.page_index,
                    size = model.page_size,
                    type = type,
                    keyword = model.code
                }), _ApiConnector._ApiSecretKey);

                var keyParams = new[] {
                    new KeyValuePair<string, string>("token", token),
                    new KeyValuePair<string, string>("source_payment_type", "0"),
                };

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.BOOKING_LISTING, keyParams);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    gridModel.ListData = JsonConvert.DeserializeObject<IEnumerable<BookingModel>>(jsonData["data"].ToString());
                    gridModel.TotalRecord = int.Parse(jsonData["total_order"].ToString());
                    gridModel.TotalPage = (int)Math.Ceiling((double)gridModel.TotalRecord / gridModel.PageSize);
                }

                return gridModel;
            }
            catch
            {
                throw;
            }
        }

        public async Task<BookingDetailModel> GetBookingDetail(long id, long account_client_id, long type)
        {
            try
            {
                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.BOOKING_DETAIL, new
                {
                    order_id = id,
                    account_client_id = account_client_id,
                    type = type
                });

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<BookingDetailModel>(jsonData["data"].ToString());
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
        public async Task<GenericGridViewModel<RequestViewModel>> GetListRequestHotelBooking(RequestSearchModel model)
        {
            try
            {
                var gridModel = new GenericGridViewModel<RequestViewModel>()
                {
                    CurrentPage = model.PageIndex,
                    PageSize = model.PageSize,
                };

                string token = CommonHelper.Encode(JsonConvert.SerializeObject(model), _ApiConnector._ApiSecretKey);

                var keyParams = new[] {
                    new KeyValuePair<string, string>("token", token),

                };

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.REQUEST_HOTEL_BOOKING_LISTING, keyParams);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    gridModel.ListData = JsonConvert.DeserializeObject<IEnumerable<RequestViewModel>>(jsonData["data"].ToString());
                    gridModel.TotalRecord = int.Parse(jsonData["total_row"].ToString());
                    gridModel.TotalPage = (int)Math.Ceiling((double)gridModel.TotalRecord / gridModel.PageSize);
                }

                return gridModel;
            }
            catch
            {
                throw;
            }
        }
        public async Task<DetailRequestModel> GetDetailRequestHotelBooking(long id)
        {
            try
            {
                var model = new
                {
                    id = id
                };

                string token = CommonHelper.Encode(JsonConvert.SerializeObject(model), _ApiConnector._ApiSecretKey);

                var keyParams = new[] {
                    new KeyValuePair<string, string>("token", token),

                };

                var result = await _ApiConnector.ExecutePostAsync(CONST_API_ENDPOINTS.REQUEST_DETAIL_HOTEL_BOOKING, keyParams);

                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ENUM_API_RESULT.SUCCESS)
                {
                    var Data = JsonConvert.DeserializeObject<DetailRequestModel>(jsonData["data"].ToString());
                    return Data;
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
