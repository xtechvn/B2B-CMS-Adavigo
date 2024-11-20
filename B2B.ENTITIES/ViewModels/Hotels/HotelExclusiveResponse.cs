using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class HotelExclusiveResponse
    {
        public string hotel_id { get; set; }
        public string name { get; set; }
        public double star { get; set; }
        public long review_count { get; set; }
        public float review_point { get; set; }
        public string review_rate { get; set; }
        public string country { get; set; }
        public string street { get; set; }
        public string state { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public string hotel_type { get; set; }
        public List<string> type_of_room { get; set; }
        public List<string> room_name { get; set; }
        public List<string> img_thumb { get; set; }
        public List<FilterGroupAmenities> amenities { get; set; }
        public double min_price { get; set; }
        public int room_id { get; set; }
        public bool is_refundable { get; set; }
        public bool is_instantly_confirmed { get; set; }
        public bool is_vin_hotel { get; set; }
        public bool is_commit { get; set; }
        public int confirmed_time { get; set; }
        public int hotel_group_type { get; set; }
        public double? price { get; set; }
        public double? total_profit { get; set; }
        public int? position { get; set; }

    }
    public class FilterGroup
    {
        public string key { get; set; }
        public string description { get; set; }
    }
    public class FilterGroupAmenities : FilterGroup
    {
        public string icon { get; set; }

    }
}
