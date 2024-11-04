using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.IssueTicket
{
    public class IssueTicketResponse : BaseDatacomResponse
    {
        public string BookingImage { get; set; }
        public List<Ticket> ListTicket { get; set; }

        public IssueTicketResponse()
        {
            ListTicket = new List<Ticket>();
        }
    }
}
