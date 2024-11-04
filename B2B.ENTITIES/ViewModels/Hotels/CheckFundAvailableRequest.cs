using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class CheckFundAvailableRequest
    {
        public long client_id {  get; set; }
        public int service_type {  get; set; }
        public string booking_id {  get; set; }
    }
}
