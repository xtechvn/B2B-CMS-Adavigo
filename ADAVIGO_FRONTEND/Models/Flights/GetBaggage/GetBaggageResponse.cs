using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetBaggage
{
    public class GetBaggageResponse: BaseDatacomResponse
    {
        public List<Baggage> ListBaggage { get; set; }
        public GetBaggageResponse()
        {
            ListBaggage = new List<Baggage>();
        }
    }
}
