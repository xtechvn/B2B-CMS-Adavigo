using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND.Models.Flights.GetOrderByClientId;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.SaveBooking
{
    public class SaveBookingResponse :BaseResponse
    {
        public BookingFlyMongoDbModel data { get; set; }
    }
    public class BookingFlyMongoDbModel
    {
        public int account_client_id { get; set; }

        public int is_checkout { get; set; }
        public int booking_id { get; set; }
        public string voucher_name { get; set; }
        public string session_id { get; set; }
        public string? utmmedium { get; set; }
        public string? utm_source { get; set; }
    }
}
