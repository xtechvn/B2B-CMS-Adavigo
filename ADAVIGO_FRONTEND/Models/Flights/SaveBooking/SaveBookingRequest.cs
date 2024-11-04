using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SaveBooking
{
    public class SaveBookingRequest
    {
        public string booking_data { get; set; }
        public string booking_order { get; set; }
        public string booking_session { get; set; }
        public string voucher_name { get; set; }
        public int client_id { get; set; }
        public string utmmedium { get; set; }
        public string utm_source { get; set; }
    }
}
