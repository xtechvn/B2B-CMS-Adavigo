using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SearchMonth
{
    public class SearchMonthItemResponse
    {
        public DateTime DepartDate { get; set; }
        public List<FareData> ListFareData { get; set; }
    }
}
