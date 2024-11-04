using ADAVIGO_FRONTEND.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.Payment
{
    public class PaymentResponse : BaseResponse
    {
        public string url { get; set; }
        public string order_no { get; set; }
        public string content { get; set; }
        public int order_id { get; set; }
    }
}
