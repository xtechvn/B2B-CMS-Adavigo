using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Ticket
    {
        public int Index { get; set; }
        public string Airline { get; set; }
        public string BookingCode { get; set; }
        public string ConjTktNum { get; set; }
        public string TicketNumber { get; set; }
        public string TicketType { get; set; }
        public string TicketRelated { get; set; }
        public string RelatedType { get; set; }
        public string ServiceType { get; set; }
        public string ServiceCode { get; set; }
        public DateTime IssueDate { get; set; }
        public int PassengerIndex { get; set; }
        public string PassengerName { get; set; }
        public string PassengerType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Gender { get; set; }
        public double Fare { get; set; }
        public double Tax { get; set; }
        public double Fee { get; set; }
        public double Penalty { get; set; }
        public double Amount { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }
        public string Currency { get; set; }
        public string EquivCurrency { get; set; }
        public int Sequence { get; set; }
        public string AgentCode { get; set; }
        public string MasterSignIn { get; set; }
        public string SignIn { get; set; }
        public string Remark { get; set; }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }
        public string TicketDetails { get; set; }
        public string TicketImage { get; set; }
        public string BookingFile { get; set; }
        public List<Segment> ListSegment { get; set; }

        public Ticket()
        {
            ListSegment = new List<Segment>();
        }
    }
}
