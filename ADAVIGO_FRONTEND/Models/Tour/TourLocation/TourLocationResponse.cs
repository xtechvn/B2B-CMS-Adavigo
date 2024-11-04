using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.TourLocation
{
    public class TourLocationResponse
    {
        public List<TourLocationResponseLocation> start_point { get; set; }
        public List<TourLocationResponseLocation> end_point { get; set; }
        public int? start_point_default { get; set; }

    }
    public class TourLocationResponseLocation
    {
        public int id { get; set; }
        public string name { get; set; }
        public int location_type { get; set; }
    }
}
