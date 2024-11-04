using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchMinFare
{
    public class SearchMinFareResponse : BaseDatacomResponse
    {
        public FareData MinFlight { get; set; }
    }
}
