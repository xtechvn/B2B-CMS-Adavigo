using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class HotelExclusiveRequest
    {
        public int id { get; set; }
        public int type { get; set; }
        public int client_type { get; set; }
        public string name { get; set; }
        public int position_type { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
    }
}
