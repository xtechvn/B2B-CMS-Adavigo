using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetAirlineByCode
{
    public class GetAirlineByCodeResponse
    {
        public string code { get; set; }
        public string nameVi { get; set; }
        public string nameEn { get; set; }
        public string airLineGroup { get; set; }
        public string logo { get; set; }

    }
}
