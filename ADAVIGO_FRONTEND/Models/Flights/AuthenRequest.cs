using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class AuthenRequest
    {
        public string HeaderUser { get; set; }
        public string HeaderPass { get; set; }
        public string AgentAccount { get; set; }
        public string AgentPassword { get; set; }
        public string ProductKey { get; set; }
        public string Currency { get; set; }
        public string Language { get; set; }
        public string IpRequest { get; set; }

        public AuthenRequest()
        {
            HeaderUser = ApplicationSettings.DataComSettings.HeaderUser;
            HeaderPass = ApplicationSettings.DataComSettings.HeaderPass;
            AgentAccount = ApplicationSettings.DataComSettings.AgentAccount;
            AgentPassword = ApplicationSettings.DataComSettings.AgentPassword;
            ProductKey = ApplicationSettings.DataComSettings.ProductKey;
        }
    }
}
