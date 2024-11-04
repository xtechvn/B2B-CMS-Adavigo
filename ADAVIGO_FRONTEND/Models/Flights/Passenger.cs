using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class Passenger
    {
        public int Index { get; set; }
        public int ParentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Type { get; set; }
        public bool Gender { get; set; }
        public string Birthday { get; set; }
        public string Nationality { get; set; }
        public string PassportNumber { get; set; }
        public string PassportExpirationDate { get; set; }
        public string Membership { get; set; }
        public bool Wheelchair { get; set; }
        public bool Vegetarian { get; set; }
        public List<Baggage> ListBaggage { get; set; }
        public List<Seat> ListSeat { get; set; }

        public Passenger()
        {
            ListBaggage = new List<Baggage>();
            ListSeat = new List<Seat>();
        }
    }
}
