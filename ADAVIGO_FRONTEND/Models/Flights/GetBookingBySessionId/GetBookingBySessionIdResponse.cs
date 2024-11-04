using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetBookingBySessionId
{
    public class GetBookingBySessionIdRequest
    {
        public string session_id { get; set; }
        public int client_id { get; set; }
    }
}
