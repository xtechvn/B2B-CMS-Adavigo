using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.Login
{
    public class LoginResponse 
    {
        public string userName { get; set; }
        public string avatar { get; set; }
        public string clientName { get; set; }
        public string clientId { get; set; }
        public string clientType { get; set; }
        public string phone { get; set; }
        public DateTime birthday { get; set; }
        public string provinceId { get; set; }
        public string districtId { get; set; }
        public string wardId { get; set; }
        public string address { get; set; }
        public int gender { get; set; }

    }
}
