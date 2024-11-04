using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetPrice
{
    public class GetPriceResponse
    {
        public double price { get; set; }
        public double amount { get; set; }
        public int price_id { get; set; }
        public double profit { get; set; }
    }
}
