using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class HotelExclusiveDetailResponse
    {
        public string hotel_id { get; set; }
        public string name { get; set; }
        public int number_of_roooms { get; set; }
        public DateTime check_in_time { get; set; }
        public DateTime check_out_time { get; set; }
        public decimal star { get; set; }
        public int review_count { get; set; }
        public string review_rate { get; set; }
        public string country { get; set; }
        public string street { get; set; }
        public string state { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public string hotel_type { get; set; }
        public IEnumerable<string> type_of_room { get; set; }
        public decimal min_price { get; set; }
        public bool is_refundable { get; set; }
        public bool is_instantly_confirmed { get; set; }
        public string confirmed_time { get; set; }
        public IEnumerable<string> img_thumb { get; set; }

        public string detail_token { get; set; }

    }
}
