using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetGroupClass
{
    public class GetGroupClassResponse
    {
        public int id { get; set; }
        public string airline { get; set; }
        public string classCode { get; set; }
        public string fareType { get; set; }
        public string detailVi { get; set; }
        public string detailEn { get; set; }
        public string description { get; set; }
    }
}
