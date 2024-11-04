using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetGroupClass
{
    public class GetGroupClassRequest
    {
        public string air_line { get; set; }
        public string class_code { get; set; }
        public string fare_type { get; set; }
    }
}
