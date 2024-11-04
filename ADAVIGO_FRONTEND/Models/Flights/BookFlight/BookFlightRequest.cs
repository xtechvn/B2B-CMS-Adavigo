using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.BookFlight
{
    public class BookFlightRequest : AuthenRequest
    {
        public string BookType { get; set; }
        public bool UseAgentContact { get; set; }
        public Contact Contact { get; set; }
        public List<Passenger> ListPassenger { get; set; }
        public List<FareDataInfo> ListFareData { get; set; }
        public string Remark { get; set; }
        public string AccountCode { get; set; }
        public List<Flight> ListFlight { get; set; }

        public BookFlightRequest()
        {
            Contact = new Contact();
            ListPassenger = new List<Passenger>();
            ListFareData = new List<FareDataInfo>();
            ListFlight = new List<Flight>();
        }
    }
}
