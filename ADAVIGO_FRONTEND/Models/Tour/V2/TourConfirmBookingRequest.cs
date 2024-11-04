namespace ADAVIGO_FRONTEND.Models.Tour.V2
{
    public class TourConfirmBookingRequest
    {
        public string booking_id { get; set; }
        public string order_no { get; set; }
        public string order_id { get; set; }
        public long account_client_id { get; set; }
    }
}
