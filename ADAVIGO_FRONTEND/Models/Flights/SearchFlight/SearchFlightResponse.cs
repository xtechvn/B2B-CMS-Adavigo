using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchFlight
{
    public class SearchFlightResponse : BaseDatacomResponse
    {
        public string FlightType { get; set; }
        public string Session { get; set; }
        public int Itinerary { get; set; }
        public List<FareData> ListFareData { get; set; }

        public SearchFlightResponse()
        {
            ListFareData = new List<FareData>();
        }
    }
}
