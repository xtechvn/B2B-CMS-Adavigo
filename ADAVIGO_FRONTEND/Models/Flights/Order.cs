using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Order
    {
        public string startPoint { get; set; }
        public string endPoint { get; set; }
        public string startime { get; set; }
        public string startDistrict { get; set; }
        public string endTime { get; set; }
        public string endDistrict { get; set; }
        public string flightNumber { get; set; }
        public string paymentStatus { get; set; }
        public double amount { get; set; }
        public string bookingId { get; set; }
        public string airlineLogo { get; set; }
        public string leg { get; set; }
        public int duration { get; set; }
    }
}
