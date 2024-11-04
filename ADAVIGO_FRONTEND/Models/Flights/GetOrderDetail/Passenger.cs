using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderDetail
{
    public class Passenger
    {
        public int id { get; set; }
        public string name { get; set; }
        public string membershipCard { get; set; }
        public string personType { get; set; }
        public string birthday { get; set; }
        public bool gender { get; set; }
        public int orderId { get; set; }
    }
}
