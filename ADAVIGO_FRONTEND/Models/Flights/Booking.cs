using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Booking
    {
        public string Status { get; set; }
        public bool AutoIssue { get; set; }
        public string Airline { get; set; }
        public string BookingCode { get; set; }
        public string GdsCode { get; set; }
        public string Flight { get; set; }
        public string Route { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public string BookingImage { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string ExpiryDt { get; set; }
        public int ExpiryTime { get; set; }
        public double ResponseTime { get; set; }
        public string System { get; set; }
        public double Price { get; set; }
        public double Difference { get; set; }
        public string Session { get; set; }
        public FareData FareData { get; set; }
        public List<Ticket> ListTicket { get; set; }

        public Warning Warnings { get; set; }
        public List<Passenger> ListPassenger { get; set; }

        public Booking()
        {
            FareData = new FareData();
            ListTicket = new List<Ticket>();
            Warnings = new Warning();
            ListPassenger = new List<Passenger>();
        }

    }
}
