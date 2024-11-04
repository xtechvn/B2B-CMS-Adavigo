using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetPrice
{
    public class GetPriceRequest
    {
        public double price { get; set; }
        public int client_type { get; set; }
        public string price_range { get; set; }
        public GetPriceRequest()
        {
            client_type = ApplicationSettings.AdavigoSettings.ClientType;
        }
    }
}
