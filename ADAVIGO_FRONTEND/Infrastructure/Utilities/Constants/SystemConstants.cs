namespace ADAVIGO_FRONTEND.Infrastructure.Utilities.Constants
{
    public class SystemConstants
    {
        public const int AdavigoSuccessStatus = 0;
        public const int CacheDay = 1;
        public class DataComApiRoutes
        {
            public const string SearchFlight = "/flights/searchflight";
            public const string SearchMinFare = "/flights/searchminfare";
            public const string GetBaggage = "/flights/getbaggage";
            public const string VerifyFlight = "/flights/verifyflight";
            public const string BookFlight = "/flights/bookflight";
            public const string IssueTicket = "/flights/issueticket";
            public const string SearchMonth = "/flights/searchmonth";
        }

        public class AdavigoApiRoutes
        {
            public const string GetAirlineByCode = "/api/fly/get-airline-by-code.json";
            public const string GetGroupClass = "/api/fly/get-group-class.json";
            public const string GetListGroupClass = "/api/fly/get-list-group-class.json";
            public const string GetPrice = "/api/flyticket/get-price.json";
            public const string GetBankListOnePay = "/api/onepay/get-all-bankonepay-data.json";
            public const string Payment = "/api/payment/checkout.json";
            public const string PaymentVin = "/api/payment/vinwonder/checkout.json";
            public const string Register = "/api/b2c/Account/insert.json";
            public const string Login = "/api/b2c/account/login.json";
            public const string SaveBooking = "/api/booking/flight/save-booking.json";
            public const string GetOrderByClientId = "/api/order/get-order-by-client-id.json";
            public const string GetOrderDetail = "/api/order/get-order-detail.json";
            public const string GetBookingBySessionId = "/api/Booking/flight/get-booking-by-session-id.json";
            public const string LogTele = "/api/LogManager/insert-app-log-tele.json";
            public const string GetLocation = "/api/v1/location/hot";
            public const string GetHotel = "/api/v1/hotels";
            public const string GetPost = "/api/v1/posts";
            public const string GetGroupHot = "/api/v1/group-hot";
            public const string GetProduct = "/api/v1/products";
            public const string ChangePassword = "/api/b2c/account/change-password.json";
            public const string GetProvinces = "/api/AllCode/province.json";
            public const string GetDistrictByProvinceId = "/api/AllCode/district.json";
            public const string GetWardByDistrictId = "/api/AllCode/ward.json";
            public const string UpdateInfomation = "/api/b2c/Account/update-infomation.json";
            public const string SendMailResetPassword = "/api/b2c/Mail/send-mail-reset-password.json";
            public const string ResetPassword = "/api/Client/reset-password.json";
            public const string GetNewsCategory = "/api/b2c/news/get-category.json";
            public const string GetNewsByCategoryId = "/api/b2c/news/get-list-by-categoryid-order.json";
            public const string GetNewsByCategoryIdV2 = "/api/b2c/news/get-list-detail-by-categoryid.json";
            public const string GetMostViewedArticles = "/api/b2c/news/get-most-viewed-article.json";
            public const string GetNewsDetail = "/api/b2c/news/get-detail.json";
            public const string FindArticle = "/api/b2c/news/find-article.json";
            public const string GetNewsByTag = "/api/b2c/news/get-list-by-tag-order.json";
            public const string TrackingVoucher = "/api/voucher/b2c/apply.json";
            public const string GetHomeVinImages = "https://static-image.adavigo.com/Images/vin-wonder-images";
            public const string GetVinSites = "/api/b2c/news/get-product-category-by-parent-id.json";
            public const string GetVinArticles = "/api/b2c/vinwonder/get-detail-by-location-code.json";
            public const string SaveVinBooking = "/api/b2c/vinwonder/save-booking.json";
            public const string GetVinwonderHistory = "/api/b2c/vinwonder/get-vinwonder-by-account-client";
            public const string GetSaveVinwonderData = "/api/b2c/vinwonder/get-booking-by-id.json";
            public const string GetVinOrderDetail = "/api/b2c/vinwonder/get-order-detail.json";
            public const string GetVinBookingByBookingId = "/api/b2c/vinwonder/get-booking-by-booking-id.json";
            public const string GetVinPrice = "/api/b2c/vinwonder/get-price.json";
            public const string GetAllCode = "/api/AllCode/service/get-allcode.json";
          
        }

        public class VinwonderRoutes
        {
            public const string GetToken = "/api/v1/ota/token";
            public const string GetSite = "/api/v1/ota/sites";
            public const string GetServices = "/api/v1/ota/services";
            public const string GetRateService = "/api/v1/ota/rateservice";
            public const string GetSession = "/api/v1/ota/sessions";
            public const string LockSlot = "/api/v1/ota/lockslot";
            public const string Confirmbooking = "/api/v1/ota/confirmbooking";       
        }

        public class VinwonderTypeCode
        {
            public const string TE = "TE";
            public const string NL = "NL";
            public const string NCT = "NCT";
        }

        public class ArticleTypes
        {
            public const int Article = 0;
            public const int Video = 1;
        }
    }
}
