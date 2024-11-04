using ADAVIGO_FRONTEND.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId
{
    public class GetOrderByClientIdResponse :BaseResponse
    {
        public List<GetOrderByClientIdData> data { get; set; }
        public int total_order { get; set; }

        public GetOrderByClientIdResponse()
        {
            data = new List<GetOrderByClientIdData>();
        }
    }
}
