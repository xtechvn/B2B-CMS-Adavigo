using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.TourLocation
{
    public class TourLocationRequest
    {
        public string tour_type { get; set; }
        public string start_point { get; set; }
        public string is_page_load { get; set; }
    }
}
