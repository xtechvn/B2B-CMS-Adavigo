using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class SaveHotelPaymentResponse
    {
        public string url { get; set; }
        public string order_no { get; set; }
        public long order_id { get; set; }
        public string content { get; set; }
    }
}
