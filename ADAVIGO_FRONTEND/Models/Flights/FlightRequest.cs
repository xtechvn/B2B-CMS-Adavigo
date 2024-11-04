using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class FlightRequest
    {
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public string DepartDate { get; set; }
        public string Airline { get; set; }
    }
}
