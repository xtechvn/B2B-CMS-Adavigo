using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetBankListOnePay
{
    public class GetBankListOnePayResponse
    {
        public int id { get; set; }
        public string bankName { get; set; }
        public string code { get; set; }
        public int type { get; set; }
        public string logo { get; set; }
    }
}
