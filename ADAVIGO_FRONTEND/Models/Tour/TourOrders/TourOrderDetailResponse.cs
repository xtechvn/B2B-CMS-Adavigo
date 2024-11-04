using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.TourOrders
{
    public class TourOrderDetailResponse
    {
        public long orderId { get; set; }
        public long id { get; set; }
        public string orderNo { get; set; }
        public double amount { get; set; }
        public DateTime createTime { get; set; }
        public DateTime startDate { get; set; }
        public double orderAmount { get; set; }
        public int orderStatus { get; set; }
        public int paymentStatus { get; set; }
        public string orderStatusName { get; set; }
        public string paymentStatusName { get; set; }
        public string tourProductName { get; set; }
        public string dateDeparture { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string note { get; set; }
        public string clientName { get; set; }
        public int totalChildren { get; set; }
        public int totalAdult { get; set; }
        public int totalBaby { get; set; }
    }
}
