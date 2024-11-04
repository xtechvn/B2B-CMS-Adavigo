using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.TourOrders
{
    public class TourOrdersListingRequest
    {
        public int account_id { get; set; }
        public int pageindex { get; set; }
        public int pagesize { get; set; }
        public string textsearch { get; set; }
    }
}
