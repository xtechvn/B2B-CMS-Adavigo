using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.VerifyFlight
{
    public class VerifyFlightResponse: BaseDatacomResponse
    {
        public List<FareStatus> ListFareStatus { get; set; }
        public VerifyFlightResponse()
        {
            ListFareStatus = new List<FareStatus>();
        }
    }
}
