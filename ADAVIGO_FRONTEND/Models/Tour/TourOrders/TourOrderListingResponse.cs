using System.Collections.Generic;
using ADAVIGO_FRONTEND.Models.Common;

namespace ADAVIGO_FRONTEND.Models.Tour.TourOrders
{
    public class TourOrderListingResponse : BaseObjectResponse<List<TourOrderListingResponseData>>
    {
        public int total { get; set; }
    }
    public class TourOrderListingResponseData
    {
        public int orderId { get; set; }
        public string orderNo { get; set; }
        public string tourId { get; set; }
        public string tourName { get; set; }
        public string amount { get; set; }
        public string orderStatus { get; set; }
        public string orderStatusName { get; set; }

    }
}
