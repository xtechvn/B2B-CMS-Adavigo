using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetBaggage
{
    public class GetBaggageRequest : AuthenRequest
    {
        public List<FareDataInfo> ListFareData { get; set; }

        public GetBaggageRequest()
        {
            ListFareData = new List<FareDataInfo>();
        }
    }
}
