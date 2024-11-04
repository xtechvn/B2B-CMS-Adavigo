using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId
{
    public class GetOrderByClientIdData
    {
        public int orderId { get; set; }
        public int clientId { get; set; }
        public string orderNo { get; set; }
        public string order_status_name { get; set; }
        public string color_code { get; set; }
        public int orderStatus { get; set; }
        public double orderAmount { get; set; }

        public List<Order> list_Order { get; set; }
        public GetOrderByClientIdData()
        {
            list_Order = new List<Order>();
        }

    }
}
