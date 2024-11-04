using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderDetail
{
    public class GetOrderDetailRequest
    {
        public int order_id { get; set; }
        public int client_id { get; set; }
        public int type { get; set; }
    }
}
