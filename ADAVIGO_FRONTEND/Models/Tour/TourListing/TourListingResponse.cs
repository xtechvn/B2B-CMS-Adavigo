using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ADAVIGO_FRONTEND.Models.Common;
using ADAVIGO_FRONTEND_B2C.Models;
using Newtonsoft.Json;

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
    public class TourListingResponseV2
    {

        public long id { get; set; }


        public string tourName { get; set; }

   
        public string avatar { get; set; }


        public int? days { get; set; }

  
        public int? star { get; set; }


        public int? status { get; set; }

      
        public long tourDepartureId { get; set; }


        public DateTime? startDate { get; set; }


        public DateTime? endDate { get; set; }


        public int? total { get; set; }

 
        public int bookedQuantity { get; set; }

        public int availableQuantity { get; set; }

    
        public DateTime? dookingDeadline { get; set; }


        public decimal? minPrice { get; set; }

 
        public string destinationNames { get; set; }


        public int? goTransportType { get; set; }

        public string goTransportName { get; set; }

        public string goTransportProvider { get; set; }


        public string goTransportCode { get; set; }


        public DateTime? goDepartureDate { get; set; }


        public string goStartPoint { get; set; }


        public string goStartPointName { get; set; }


        public string goEndPoint { get; set; }


        public string goEndPointName { get; set; }


        public int? returnTransportType { get; set; }


        public string returnTransportName { get; set; }


        public string returnTransportProvider { get; set; }


        public string returnTransportCode { get; set; }


        public DateTime? returnDepartureDate { get; set; }


        public string returnStartPoint { get; set; }


        public string returnStartPointName { get; set; }


        public string returnEndPoint { get; set; }

        public string returnEndPointName { get; set; }


        public int? remainDay { get; set; }


        public int totalRow { get; set; }
        public int isAllowDepositOnline { get; set; }
        public int isAllowReserveOnline { get; set; }

    }
    public class TourListingResponseExtensionV2 : BaseObjectResponse<List<TourListingResponseV2>>
    {
        public List<string> listimages { get; set; }

    }
}
