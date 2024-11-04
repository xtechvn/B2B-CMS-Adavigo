using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchMonth
{
    public class SearchMonthRequest  :AuthenRequest
    {
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public string Airline { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

    }
}
