using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.Payment
{
    public class PaymentRequest
    {
        public string payment_type { get; set; }
        public string return_url { get; set; }
        public string client_id { get; set; }
        public string bank_code { get; set; }
        public string order_detail { get; set; }
        public string booking_verify { get; set; }
        public string booking_order { get; set; }
        public string session_id { get; set; }
        public double amount { get; set; }
        public int order_id { get; set; }
        public int event_status { get; set; }
    }
}
