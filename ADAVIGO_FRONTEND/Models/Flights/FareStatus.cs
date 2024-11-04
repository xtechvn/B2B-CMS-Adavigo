using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class FareStatus
    {
        public bool Status { get; set; }
        public string Remark { get; set; }
        public double Price { get; set; }
        public double Difference { get; set; }
        public string Session { get; set; }
        public FareData FareData { get; set; }
    }
}
