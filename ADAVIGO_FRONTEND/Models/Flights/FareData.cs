using ADAVIGO_FRONTEND.Models.Flights.GetAirlineByCode;
using ADAVIGO_FRONTEND.Models.Flights.GetPrice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights
{
    public class FareData
    {
        public int FareDataId { get; set; }
        public string Airline { get; set; }
        public GetAirlineByCodeResponse AirlineObj { get; set; }
        public int Itinerary { get; set; }
        public int Leg { get; set; }
        public bool Promo { get; set; }
        public string Currency { get; set; }
        public string System { get; set; }
        public string FareType { get; set; }
        public double CacheAge { get; set; }
        public int Availability { get; set; }
        public int Adt { get; set; }
        public int Chd { get; set; }
        public int Inf { get; set; }
        public double FareAdt { get; set; }
        public double FareChd { get; set; }
        public double FareInf { get; set; }
        public double TaxAdt { get; set; }
        public double TaxChd { get; set; }
        public double TaxInf { get; set; }
        public double FeeAdt { get; set; }
        public double FeeChd { get; set; }
        public double FeeInf { get; set; }
        public double ServiceFeeAdt { get; set; }
        public double ServiceFeeChd { get; set; }
        public double ServiceFeeInf { get; set; }
        public double TotalNetPrice { get; set; }
        public double TotalServiceFee { get; set; }
        public double TotalDiscount { get; set; }
        public double TotalCommission { get; set; }
        public double TotalPrice { get; set; }
        public GetPriceResponse AdavigoPrice { get; set; }
        public GetPriceResponse AdavigoPriceAdt { get; set; }
        public List<Flight> ListFlight { get; set; }

        public FareData()
        {
            ListFlight = new List<Flight>();
            AirlineObj = new GetAirlineByCodeResponse();
            AdavigoPrice = new GetPriceResponse();
        }
    }
}
