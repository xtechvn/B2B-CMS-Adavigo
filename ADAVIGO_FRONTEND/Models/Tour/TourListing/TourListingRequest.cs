using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.TourListing
{
    public class TourListingRequest
    {
        public int pageindex { get; set; }
        public int pagesize { get; set; }
        public int tourtype { get; set; }
        public int startpoint { get; set; }
        public int endpoint { get; set; }
        public int tour_id { get; set; }
        public int clienttype { get; set; }
    }
}
