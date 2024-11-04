using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND_B2C.Models;

namespace ADAVIGO_FRONTEND.Models.Tour.V2
{
    public class TourConfirmBookingResponse : BaseObjectResponse<string>
    {
        public string order_no { get; set; }
        public string order_id { get; set; }

    }
}
