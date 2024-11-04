using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class FareDataInfo
    {
        public string Session { get; set; }
        public int FareDataId { get; set; }
        public List<FlightInfo> ListFlight { get; set; }
        public bool AutoIssue { get; set; }
        public string CACode { get; set; }
        public string VIPText { get; set; }

        public FareDataInfo()
        {
            ListFlight = new List<FlightInfo>();
        }

    }
}
