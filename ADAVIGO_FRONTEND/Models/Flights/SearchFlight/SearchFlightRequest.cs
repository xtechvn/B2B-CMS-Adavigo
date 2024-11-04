using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchFlight
{
    public class SearchFlightRequest : AuthenRequest
    {
        public int Adt { get; set; }
        public int Chd { get; set; }
        public int Inf { get; set; }
        public string ViewMode { get; set; }
        public List<FlightRequest> ListFlight { get; set; }

        public SearchFlightRequest()
        {
            ListFlight = new List<FlightRequest>();
        }
    }
}
