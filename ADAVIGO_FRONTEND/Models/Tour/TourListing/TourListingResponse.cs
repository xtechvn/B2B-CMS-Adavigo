using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND_B2C.Models;

namespace ADAVIGO_FRONTEND.Models.Tour.TourListing
{
    public class TourListingResponse
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
        public int packages { get; set; }

    }
    public class TourListingResponseExtension : BaseObjectResponse<List<TourListingResponse>>
    {
        public List<string> listimages { get; set; }

    }
    public class TourPaymentModel
    {
        public long orderId { get; set; }
        public long tourId { get; set; }
        public string tourName { get; set; }
        public double totalAmount { get; set; }

        public int totalNights { get; set; }
        public int numberOfAdult { get; set; }
        public int numberOfChild { get; set; }
        public string firstName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public string country { get; set; }
        public string address { get; set; }
        public string note { get; set; }
        public string startDate { get; set; }
        public string voucherName { get; set; }
        public long packageId { get; set; }
        public string bookingId { get; set; }


    }
}
