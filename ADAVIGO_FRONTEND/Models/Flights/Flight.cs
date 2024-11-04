using ADAVIGO_FRONTEND.Models.Flights.GetGroupClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Flight
    {
        public int FlightId { get; set; }
        public string Airline { get; set; }
        public string Operating { get; set; }
        public int Leg { get; set; }
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string StartDt { get; set; }
        public string EndDt { get; set; }
        public string FlightNumber { get; set; }
        public int StopNum { get; set; }
        public bool HasDownStop { get; set; }
        public int Duration { get; set; }
        public bool NoRefund { get; set; }
        public string GroupClass { get; set; }
        public GetGroupClassResponse GroupClassObj { get; set; }
        public string FareClass { get; set; }
        public string FareBasis { get; set; }
        public int SeatRemain { get; set; }
        public bool Promo { get; set; }
        public string FlightValue { get; set; }

        public List<Segment> ListSegment { get; set; }
        public Flight()
        {
            ListSegment = new List<Segment>();
            GroupClassObj = new GetGroupClassResponse();
        }
    }
}
