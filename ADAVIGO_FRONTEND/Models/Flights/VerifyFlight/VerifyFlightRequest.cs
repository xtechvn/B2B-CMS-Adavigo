using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.VerifyFlight
{
    public class VerifyFlightRequest : AuthenRequest
    {
        public List<FareDataInfo> ListFareData { get; set; }

        public VerifyFlightRequest()
        {
            ListFareData = new List<FareDataInfo>();
        }
    }
}
