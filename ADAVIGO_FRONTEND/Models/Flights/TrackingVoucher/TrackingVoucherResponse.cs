using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher
{
    public class TrackingVoucherResponse :BaseResponse
    {
        public string expire_date { get; set; }
        public long user_id { get; set; }
        public int service_id { get; set; }
        public double total_order_amount_before { get; set; }
        public double total_order_amount_after { get; set; }
        public double discount { get; set; }
        public string voucher_name { get; set; }

    }
}
