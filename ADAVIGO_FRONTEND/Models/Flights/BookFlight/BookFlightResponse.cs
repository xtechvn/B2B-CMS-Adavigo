using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.BookFlight
{
    public class BookFlightResponse : BaseDatacomResponse
    {
        public int BookingId { get; set; }
        public string OrderCode { get; set; }
        public List<Booking> ListBooking { get; set; }

        public BookFlightResponse()
        {
            ListBooking = new List<Booking>();
        }
    }
}
