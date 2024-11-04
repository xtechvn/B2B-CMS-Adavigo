using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class HotelExclusiveDetailRequest : HotelExclusiveRequest
    {
        public string hotelid { get; set; }
        public bool? is_vin_hotel { get; set; }

    }
}
