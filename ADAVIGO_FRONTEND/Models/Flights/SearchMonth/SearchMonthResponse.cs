using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchMonth
{
    public class SearchMonthResponse
    {
        public List<SearchMonthItemResponse> ListMinPrice { get; set; }
        public string Max { get; set; }
        public string Min { get; set; }
        public SearchMonthResponse()
        {
            ListMinPrice = new List<SearchMonthItemResponse>();
        }
    }
}
