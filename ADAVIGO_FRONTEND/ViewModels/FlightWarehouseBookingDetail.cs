using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class FlightWarehouseBookingDetail
    {
        public FlightWarehouseBookingModel Booking { get; set; }
        public List<FlightWarehouseSegmentModel> Segments { get; set; }
    }
}
