using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.Payment
{
    public class OrderDetail
    {
        public double price_id { get; set; }
        public double amount { get; set; }
        public int quantity { get; set; }
        public string booking_code { get; set; }
        public string flight_name_from { get; set; }
        public string flight_name_to { get; set; }
        public string from_airport { get; set; }
        public string to_airport { get; set; }
        public string up_time_air { get; set; }
        public string to_time_air { get; set; }
        public string total_time_air { get; set; }
        public string flight_code { get; set; }
        public string seat_class { get; set; }
        public string plane_name { get; set; }
        public string baggage_weight { get; set; }
    }
}
