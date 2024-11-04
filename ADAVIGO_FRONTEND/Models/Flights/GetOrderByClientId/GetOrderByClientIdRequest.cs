using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId
{
    public class GetOrderByClientIdRequest
    {
        public int source_type { get; set; }
        public int client_id { get; set; }
        public int pageNumb { get; set; }
        public int PageSize { get; set; }
        public string keyword { get; set; }
        public long type { get; set; }
        public GetOrderByClientIdRequest()
        {
            source_type = ApplicationSettings.AdavigoSettings.SourceType;
        }
    }
}
