using ADAVIGO_FRONTEND.Models.Flights.BookFlight;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetBookingBySessionId
{
    public class GetBookingBySessionIdResponse
    {
        public string id { get; set; }
        public string session_id { get; set; }
        public int client_id { get; set; }
        public int booking_id { get; set; }

        public BookFlightResponse booking_data { get; set; }
        public BookFlightRequest booking_order { get; set; }
        public BookingSession booking_session { get; set; }
        public DateTime create_date { get; set; }
    }
}
