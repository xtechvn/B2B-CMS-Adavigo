using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using ADAVIGO_FRONTEND.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.TrackingVoucher
{
    public class B2BVoucherListRequest
    {
        public long user_id { get; set; }
        public string hotel_id { get; set; }
    }
}
