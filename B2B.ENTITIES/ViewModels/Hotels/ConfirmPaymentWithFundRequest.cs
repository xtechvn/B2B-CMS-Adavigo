using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class ConfirmPaymentWithFundRequest
    {
        public long order_id { get; set; }
        public long client_id { get; set; }
        public int clientType { get; set; }
        public long service_type { get; set; }
        public string booking_id { get; set; }
    }
}
