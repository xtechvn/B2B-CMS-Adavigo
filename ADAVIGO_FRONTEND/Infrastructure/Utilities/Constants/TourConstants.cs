using ADAVIGO_FRONTEND_B2C.Models.Tour;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND_B2C.Infrastructure.Utilities.Constants
{
    public class TourConstants
    {
        public class AdavigoApiRoutes
        {
            public const string GetTourLocation = "/api/tour/location.json";
            //public const string SearchTour = "/api/b2b/tour/search-tour.json";
            public const string GetFavouritesTour = "/api/b2b/tour/get-list-favorite-tour.json";
            public const string GetListTourByType = "/api/b2b/tour/list-tour.json";
            public const string GetTourStartPointImage = "/api/b2b/tour/get-tour-image-by-start-point.json";
            public const string GetTourDetail = "/api/b2b/tour/tour-detail";
            public const string ConfirmTour = "/api/booking/tour.json";
            public const string GetOrderListing = "/api/b2b/tour/order-list-tour-by-accountid.json";
            public const string GetOrderDetail = "/api/b2b/tour/order-tour-detail-by-id.json";
            public const string GetLocationStart = "/api/b2b/tour/location-start";
            public const string GetLocationEnd = "/api/b2b/tour/location-end";
            public const string SearchTour = "/api/b2b/tour/search-tour";
            public const string SaveBooking = "/api/b2b/tour/save-booking";
            public const string ConfirmBooking = "/api/b2b/payment/tour-booking";
            public const string TOUR_PAYMENT = "api/b2b/tour/payment/checkout.json";

        }
        public class Data
        {
            public const string provinceJson = "[ {\"id\":1, \"name\":\"ha-noi\"} ,{\"id\":2, \"name\":\"ha-giang\"} ,{\"id\":3, \"name\":\"cao-bang\"} ,{\"id\":4, \"name\":\"bac-kan\"} ,{\"id\":5, \"name\":\"tuyen-quang\"} ,{\"id\":6, \"name\":\"lao-cai\"} ,{\"id\":7, \"name\":\"dien-bien\"} ,{\"id\":8, \"name\":\"lai-chau\"} ,{\"id\":9, \"name\":\"son-la\"} ,{\"id\":10, \"name\":\"yen-bai\"} ,{\"id\":11, \"name\":\"hoa-binh\"} ,{\"id\":12, \"name\":\"thai-nguyen\"} ,{\"id\":13, \"name\":\"lang-son\"} ,{\"id\":14, \"name\":\"quang-ninh\"} ,{\"id\":15, \"name\":\"bac-giang\"} ,{\"id\":16, \"name\":\"phu-tho\"} ,{\"id\":17, \"name\":\"vinh-phuc\"} ,{\"id\":18, \"name\":\"bac-ninh\"} ,{\"id\":19, \"name\":\"hai-duong\"} ,{\"id\":20, \"name\":\"hai-phong\"} ,{\"id\":21, \"name\":\"hung-yen\"} ,{\"id\":22, \"name\":\"thai-binh\"} ,{\"id\":23, \"name\":\"ha-nam\"} ,{\"id\":24, \"name\":\"nam-dinh\"} ,{\"id\":25, \"name\":\"ninh-binh\"} ,{\"id\":26, \"name\":\"thanh-hoa\"} ,{\"id\":27, \"name\":\"nghe-an\"} ,{\"id\":28, \"name\":\"ha-tinh\"} ,{\"id\":29, \"name\":\"quang-binh\"} ,{\"id\":30, \"name\":\"quang-tri\"} ,{\"id\":31, \"name\":\"thua-thien-hue\"} ,{\"id\":32, \"name\":\"da-nang\"} ,{\"id\":33, \"name\":\"quang-nam\"} ,{\"id\":34, \"name\":\"quang-ngai\"} ,{\"id\":35, \"name\":\"binh-dinh\"} ,{\"id\":36, \"name\":\"phu-yen\"} ,{\"id\":37, \"name\":\"khanh-hoa\"} ,{\"id\":38, \"name\":\"ninh-thuan\"} ,{\"id\":39, \"name\":\"binh-thuan\"} ,{\"id\":40, \"name\":\"kon-tum\"} ,{\"id\":41, \"name\":\"gia-lai\"} ,{\"id\":42, \"name\":\"dak-lak\"} ,{\"id\":43, \"name\":\"dak-nong\"} ,{\"id\":44, \"name\":\"lam-dong\"} ,{\"id\":45, \"name\":\"binh-phuoc\"} ,{\"id\":46, \"name\":\"tay-ninh\"} ,{\"id\":47, \"name\":\"binh-duong\"} ,{\"id\":48, \"name\":\"dong-nai\"} ,{\"id\":49, \"name\":\"ba-ria---vung-tau\"} ,{\"id\":50, \"name\":\"ho-chi-minh\"} ,{\"id\":51, \"name\":\"long-an\"} ,{\"id\":52, \"name\":\"tien-giang\"} ,{\"id\":53, \"name\":\"ben-tre\"} ,{\"id\":54, \"name\":\"tra-vinh\"} ,{\"id\":55, \"name\":\"vinh-long\"} ,{\"id\":56, \"name\":\"dong-thap\"} ,{\"id\":57, \"name\":\"an-giang\"} ,{\"id\":58, \"name\":\"kien-giang\"} ,{\"id\":59, \"name\":\"can-tho\"} ,{\"id\":60, \"name\":\"hau-giang\"} ,{\"id\":61, \"name\":\"soc-trang\"} ,{\"id\":62, \"name\":\"bac-lieu\"} ,{\"id\":63, \"name\":\"ca-mau\"} ]";
            public const string slugJson = "[ {\"id\":1, \"name\":\"tour-noi-dia\"},{\"id\":2, \"name\":\"tour-quoc-te\"},{\"id\":3, \"name\":\"tour-yeu-thich\"},{\"id\":4, \"name\":\"tour-le-tet\"}]";
        }

    }
    public enum TourType
    {
        TOUR_IN_COUNTRY=1,
        INBOUND=2,
        OUTBOUND=3
    }
}
