using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.FavouritesTour
{
    public class FavouritesTourResponse
    {
        public long Id { get; set; }
        public string tourname { get; set; }
        public double price { get; set; }
        public int? status { get; set; }
        public int? days { get; set; }
        public double? oldprice { get; set; }
        public string avatar { get; set; }
        public int? star { get; set; }
        public int? tourtype { get; set; }
        public int startpoint { get; set; }
        public string startpoint1 { get; set; }
        public string startpoint2 { get; set; }
        public string startpoint3 { get; set; }
        public string groupendpoint1 { get; set; }
        public string groupendpoint2 { get; set; }
        public string groupendpoint3 { get; set; }
        public string groupidendpoint { get; set; }
        public string groupidendpoint2 { get; set; }
        public string groupidendpoint3 { get; set; }
        public string tourtypename { get; set; }
        public string organizingname { get; set; }
        public string location_key { get; set; }
        public string listimage { get; set; }
        public long TotalRow { get; set; }
    }
}
