using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher
{
    public class B2BTrackingVoucherRequest
    {
        public string voucher_name { get; set; }
        public string token { get; set; }
        public long user_id { get; set; }
        public int service_id { get; set; }
        public int project_type { get; set; }
        public double total_order_amount_before { get; set; }

    }
}
