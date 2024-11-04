using System;
using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class HotelViewModel
    {
    }

    public class HotelESSuggestModel
    {
        public string id { get; set; }
        public string hotelid { get; set; }
        public string hoteltype { get; set; }
        public string imagethumb { get; set; }
        public string name { get; set; }
        public string keyword { get; set; }
        public string city { get; set; }
        public string street { get; set; }
        public string typeofroom { get; set; }
        public string state { get; set; }
        public string groupname { get; set; }
        public int product_type { get; set; }
    }

    public class HotelSearchParamModel
    {
        public string arrivalDate { get; set; }
        public string departureDate { get; set; }
        public string hotelID { get; set; }
        public string hotelName { get; set; }
        public string productType { get; set; }
        public int quickSearch { get; set; }
        public string isVinHotel { get; set; }
        public IEnumerable<RoomData> rooms { get; set; }
    }

    public class HotelPackageParamModel
    {
        public DateTime arrival_date { get; set; }
        public DateTime departure_date { get; set; }
        public string hotel_id { get; set; }
        public string product_type { get; set; }
        public string room_id { get; set; }
        public bool isVinHotel { get; set; }
        public IEnumerable<RoomData> rooms { get; set; }
    }

    public class RoomData
    {
        public int room { get; set; }
        public int number_adult { get; set; }
        public int number_child { get; set; }
        public int number_infant { get; set; }
    }

    public class HotelDataModel
    {
        public IEnumerable<HotelGridInfoModel> hotels { get; set; }
        public string cacheId { get; set; }
        public string message { get; set; }
        public int night_time { get; set; }
        public bool isVinHotel { get; set; }
    }

    public class HotelPriceDataModel
    {
        public string hotel_id { get; set; }
        public decimal min_price { get; set; }
    }

    public class HotelGridInfoModel
    {
        public string hotel_id { get; set; }
        public string name { get; set; }
        public int number_of_roooms { get; set; }
        public DateTime check_in_time { get; set; }
        public DateTime check_out_time { get; set; }
        public decimal star { get; set; }
        public int review_count { get; set; }
        public string review_rate { get; set; }
        public string country { get; set; }
        public string street { get; set; }
        public string state { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public string hotel_type { get; set; }
        public IEnumerable<string> type_of_room { get; set; }
        public decimal min_price { get; set; }
        public bool is_refundable { get; set; }
        public bool is_instantly_confirmed { get; set; }
        public string confirmed_time { get; set; }
        public IEnumerable<string> img_thumb { get; set; }

        public string detail_token { get; set; }
    }

    public class RoomDetailViewModel : HotelSearchParamModel
    {
        public string address { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
    }

    public class HotelRoomGridModel
    {
        public IEnumerable<HotelRoomDataModel> rooms { get; set; }
        public string cache_id { get; set; }
        public string surcharge { get; set; }
        public int night_time { get; set; }
    }

    public class HotelRoomDataModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public int max_adult { get; set; }
        public int max_child { get; set; }
        public decimal min_price { get; set; }
        public decimal remainming_room { get; set; }
        public IEnumerable<ImageThumbModel> img_thumb { get; set; }
    }

    public class HotelPackageDataModel : HotelRoomDataModel
    {
        public IEnumerable<RoomPackageRateModel> rates { get; set; }
        public IEnumerable<string> package_includes { get; set; }
        public int night_time { get; set; }
        public int view_type { get; set; }
        public string guid_popup { get; set; }
    }
    
    public class RoomPackageRateModel
    {
        public string id { get; set; }
        public string allotment_id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public decimal profit { get; set; }
        public decimal total_profit { get; set; }
        public decimal total_price { get; set; }
        public string guarantee_policy { get; set; }
        public IEnumerable<string> cancel_policy { get; set; }
        public IEnumerable<RateDetailPackage> package_includes { get; set; }
    }
    public class RateDetailPackage
    {
        public string id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string packageType { get; set; }

    }
    public class RoomPackagePopupModel
    {
        public string name { get; set; }
        public string guarantee_policy { get; set; }
        public IEnumerable<string> cancel_policy { get; set; }
        public IEnumerable<string> package_includes { get; set; }
    }


    public class FilterDataViewModel
    {
        public IEnumerable<FilterOptionItemModel> star { get; set; }
        public IEnumerable<FilterOptionItemModel> refundable { get; set; }
        public IEnumerable<FilterOptionItemModel> amenities { get; set; }
        public IEnumerable<FilterOptionItemModel> type_of_room { get; set; }
        public IEnumerable<FilterOptionItemModel> hotel_type { get; set; }
        public FilterRangePriceModel price_range { get; set; }
        public bool IsNoCacheData { get; set; }
    }

    public class FilterOptionItemModel
    {
        public string key { get; set; }
        public string description { get; set; }
    }

    public class FilterRangePriceModel
    {
        public decimal max { get; set; }
        public decimal min { get; set; }
    }

    public class RoomPackageDetailModel
    {
        public int room_number { get; set; }
        public string room_id { get; set; }
        public string room_name { get; set; }
        public string package_id { get; set; }
        public string package_code { get; set; }
        public string package_name { get; set; }
        public decimal amount { get; set; }
        public decimal root_amount { get; set; }
        public string arrival_date { get; set; }
        public string departure_date { get; set; }
        public string allotment_id { get; set; }
        public int adult { get; set; }
        public int child { get; set; }
        public int infant { get; set; }
    }

    public class MultiplePackageRoomModel
    {
        public IEnumerable<RoomPackageDetailModel> rooms { get; set; }
        public string cacheId { get; set; }
        public string arrivalDate { get; set; }
        public string departureDate { get; set; }
    }

    public class MultiplePackageRoomSearchModel
    {
        public int night_time { get; set; }
        public DateTime arrival_date { get; set; }
        public DateTime departure_date { get; set; }
        public string hotel_id { get; set; }
        public string room_id { get; set; }
        public string is_vin_hotel { get; set; }
    }

    public class HotelOrderDataModel
    {
        public string hotelID { get; set; }
        public string hotelName { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public string arrivalDate { get; set; }
        public string departureDate { get; set; }
        public int numberOfAdult { get; set; }
        public int numberOfChild { get; set; }
        public int numberOfInfant { get; set; }
        public IEnumerable<RoomOrderData> rooms { get; set; }
        public string orderToken { get; set; }
        public string bookingID { get; set; }
    }

    public class RoomOrderData
    {
        public string room_number { get; set; }
        public string room_id { get; set; }
        public string room_code { get; set; }
        public string room_name { get; set; }
        public int adult { get; set; }
        public int child { get; set; }
        public int infant { get; set; }
        public IEnumerable<string> package_includes { get; set; }
        public IEnumerable<PackageOrderData> packages { get; set; }
    }

    public class PackageOrderData
    {
        public string package_id { get; set; }
        public string package_code { get; set; }
        public decimal amount { get; set; }
        public decimal profit { get; set; }
        public string arrival_date { get; set; }
        public string departure_date { get; set; }
        public string allotment_id { get; set; }
        public IEnumerable<string> package_includes { get; set; }
    }

    public class PaymentHotelModel
    {
        public int payment_type { get; set; }
        public string bank_name { get; set; }
        public string short_name { get; set; }
        public string bank_code { get; set; }
        public string bank_account { get; set; }
        public string booking_id { get; set; }
        public decimal amount { get; set; }
        public long order_id { get; set; }
        public string order_no { get; set; }
        public int event_status { get; set; }
    }

    public class HotelPaymentModel
    {
        public string hotelID { get; set; }
        public string hotelName { get; set; }
        public DateTime arrivalDate { get; set; }
        public DateTime departureDate { get; set; }
        public int numberOfRoom { get; set; }
        public int numberOfAdult { get; set; }
        public int numberOfChild { get; set; }
        public int numberOfInfant { get; set; }
        public decimal totalMoney { get; set; }
        public string bookingID { get; set; }
        public string orderID { get; set; }
    }
}
