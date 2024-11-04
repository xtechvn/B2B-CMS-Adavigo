using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderDetail
{
    public class GetOrderDetailResponse
    {
        public string bookingCode { get; set; }
        public int? paymentType { get; set; }
        public string paymentTypeName { get; set; }
        public string createTime { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public List<Passenger> passenger { get; set; }
        public string startPoint { get; set; }
        public string startDistrict { get; set; }
        public string startime { get; set; }
        public string endPoint { get; set; }
        public string endDistrict { get; set; }
        public string endtime { get; set; }
        public string flightNumber { get; set; }
        public int clientId { get; set; }
        public string orderNo { get; set; }
        public bool? paymentStatus { get; set; }
        public string paymentStatusName { get; set; }
        public string bookingId { get; set; }
        public double amount { get; set; }
        public string airlineLogo { get; set; }
        public string airlineName_Vi { get; set; }
        public string sessionid { get; set; }
        public int leg { get; set; }
        public bool is_lock { get; set; }
        public double discount { get; set; }
        public int voucherId { get; set; }
        public string voucher_code { get; set; }
        public int orderId { get; set; }

        public GetOrderDetailResponse()
        {
            passenger = new List<Passenger>();
        }

    }
}
