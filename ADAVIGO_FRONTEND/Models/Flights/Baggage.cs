using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Baggage
    {
        public string Airline { get; set; }
        public string Value { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Currency { get; set; }
        public double Leg { get; set; }
        public string Route { get; set; }
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public string StatusCode { get; set; }
        public bool Confirmed { get; set; }

    }
}
