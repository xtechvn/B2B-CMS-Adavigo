using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class BaseDatacomResponse
    {
        public bool Status { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorValue { get; set; }
        public string ErrorField { get; set; }
        public string Message { get; set; }
        public string Language { get; set; }

    }
}
