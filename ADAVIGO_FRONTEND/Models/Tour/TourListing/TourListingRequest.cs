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
    public class TourListingRequestV2
    {
        public int pageindex { get; set; }
        public int pagesize { get; set; }
        public int tourtype { get; set; }
        public int startpoint { get; set; }
        public int endpoint { get; set; }
        public string tourname { get; set; }
        public int month { get; set; }
        public string fromdate { get; set; }
        public string todate { get; set; }
        public int? noShopping { get; set; }
        public int? isHoliday { get; set; }
        public int? holdSlot { get; set; }
    }
}
