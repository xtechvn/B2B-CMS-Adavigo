using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Segment
    {
        public int Id { get; set; }
        public string Airline { get; set; }
        public string MarketingAirline { get; set; }
        public string OperatingAirline { get; set; }
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public DateTime StartTime { get; set; }
        public string StartTimeZoneOffset { get; set; }
        public DateTime EndTime { get; set; }
        public string EndTimeZoneOffset { get; set; }
        public string StartTm { get; set; }
        public string EndTm { get; set; }
        public string FlightNumber { get; set; }
        public int Duration { get; set; }
        public string Class { get; set; }
        public string Cabin { get; set; }
        public string FareBasis { get; set; }
        public int Seat { get; set; }
        public string Plane { get; set; }
        public string StartTerminal { get; set; }
        public string EndTerminal { get; set; }
        public bool HasStop { get; set; }
        public string StopPoint { get; set; }
        public double StopTime { get; set; }
        public bool DayChange { get; set; }
        public bool StopOvernight { get; set; }
        public bool ChangeStation { get; set; }
        public bool ChangeAirport { get; set; }
        public bool LastItem { get; set; }
        public string HandBaggage { get; set; }
        public string AllowanceBaggage { get; set; }

    }
}
