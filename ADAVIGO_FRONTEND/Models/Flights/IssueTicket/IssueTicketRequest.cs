using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.IssueTicket
{
    public class IssueTicketRequest : AuthenRequest
    {
        public string Airline { get; set; }
        public string BookingCode { get; set; }
        public string BookingPcc { get; set; }
        public string System { get; set; }
        public double TotalPrice { get; set; }
        public string FareQuoteSession { get; set; }
        public string Tourcode { get; set; }
        public bool SendEmail { get; set; }
        public List<Passenger> ListPassenger { get; set; }
        public IssueTicketRequest()
        {
            ListPassenger = new List<Passenger>();
        }
    }
}
