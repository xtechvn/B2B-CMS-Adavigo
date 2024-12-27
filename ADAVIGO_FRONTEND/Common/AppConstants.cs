namespace ADAVIGO_FRONTEND.Common
{
    public static class CONST_API_ENDPOINTS
    {
        /// <summary>
        /// Get lịch sử ký quỹ
        /// </summary>
        public const string GET_DEPOSIT_HISTORY = "api/b2b/deposit/history";

        /// <summary>
        /// Lấy ra danh sách tổng số tiền đã ký quỹ theo từng dịch vụ của 1 client
        /// </summary>
        public const string GET_AMOUNT_DEPOSIT = "api/b2b/deposit/amount";

        /// <summary>
        /// Lấy thông tin ngân hàng bên Onepay
        /// </summary>
        public const string GET_ALL_ONEPAY_BANK = "api/onepay/get-all-bankonepay-data.json";
        public const string GET_ADAVIGO_BANK_LIST = "api/b2b/hotel/get-bank-account";

        /// <summary>
        /// API Thanh toán
        /// </summary>
        public const string PAYMENT_CHECKOUT_OLD = "api/payment/checkout.json";
        public const string PAYMENT_CHECKOUT = "api/b2b/trans/payment/checkout.json";

        /// <summary>
        /// Cập nhật phân bổ quỹ
        /// </summary>
        public const string TRANFER_FUND = "api/b2b/fund/transfer-fund.json";

        /// <summary>
        /// Lấy danh sách tin bài thuộc mục lịch bay và khuyến mãi
        /// </summary>
        public const string GET_NEWS_FEEDS = "api/news/get-list-by-categoryid.json";

        /// <summary>
        /// Lấy danh các khách sạn Vin đang cung cấp
        /// </summary>
        public const string GET_VINPEARL_HOTEL = "api/room/vin/vinpearl/get-hotel.json";

        /// <summary>
        /// API lưu thông tin nạp tiền của client b2b
        /// </summary>
        public const string INSERT_DEPOSIT_HISTORY = "api/insert-deposithistory.json";

        /// <summary>
        /// API tracking tìm kiếm thông tin khách sạn theo mã khách sạn
        /// </summary>
        public const string SEARCH_HOTEL_INFO_BY_CODE = "api/room/vin/vinpearl/tracking-hotel-availability.json";
        public const string SEARCH_MANUAL_HOTEL_INFO_BY_CODE = "api/room/hotel-manual/tracking-hotel-availability.json";

        /// <summary>
        /// API lấy các trường sử dụng để filter khách sạn
        /// </summary>
        public const string GET_FILTER_HOTEL = "api/room/vin/vinpearl/get-filter-hotel.json";

        /// <summary>
        /// API lấy giá về tay thấp nhất trong danh sách khách sạn
        /// </summary>
        public const string GET_HOTEL_MIN_PRICE = "api/room/vin/vinpearl/get-searched-min-price.json";

        /// <summary>
        /// API lấy danh sách các phòng thuộc khách sạn kèm theo giá thấp nhất (WF C.1)
        /// </summary>
        public const string GET_HOTEL_ROOM_LIST = "api/room/vin/vinpearl/get-hotel-rooms.json";

        public const string GET_HOTEL_ROOM_MANUAL_LIST = "api/room/hotel-manual/get-hotel-rooms.json";
        
        /// <summary>
        /// API danh sách tất cả các gói thuộc 1 phòng:
        /// </summary>
        public const string GET_ROOM_PACKAGE_LIST = "api/room/vin/vinpearl/get-room-packages.json";

        public const string GET_ROOM_MANUAL_PACKAGE_LIST = "api/room/hotel-manual/get-room-packages.json";

        /// <summary>
        /// API danh sách tất cả các gói thuộc 1 phòng:
        /// </summary>
        public const string GET_OTHER_PACKAGE_LIST_OF_ROOM = "api/room/vin/vinpearl/get-room-detail-availability.json";

        /// <summary>
        /// API tracking tìm kiếm thông tin khách sạn theo mã khách sạn
        /// </summary>
        public const string HOTEL_LIST = "api/hotel/get-list.json";

        /// <summary>
        /// API cập nhật hình ảnh bằng chứng chuyển khoản
        /// </summary>
        public const string PROOF_TRANS = "api/b2b/payment/update-proof-trans.json";

        /// <summary>
        /// SAVE BOOKING HOTEL
        /// </summary>
        public const string SAVE_HOTEL_BOOKING = "api/b2b/hotel/save-booking.json";
        /// <summary>
        /// SAVE REQUYEST BOOKING HOTEL
        /// </summary>
        public const string SAVE_REQUYEST_HOTEL_BOOKING = "api/b2b/hotel/request-hotel-booking.json";

        /// <summary>
        /// SAVE_HOTEL_PAYMENT
        /// </summary>
        public const string HOTEL_PAYMENT = "api/b2b/hotel/payment/checkout.json";

        /// <summary>
        /// Lịch sử booking
        /// </summary>
        public const string BOOKING_LISTING = "/api/order/get-order-by-client-id.json";
        /// <summary>
        /// Lịch sử request booking
        /// </summary>
        public const string REQUEST_HOTEL_BOOKING_LISTING = "/api/b2b/hotel/get-list-request-hotel-booking-clientid.json";
        public const string REQUEST_DETAIL_HOTEL_BOOKING = "/api/b2b/hotel/get-detail-request-hotel-booking-id.json";
        public const string UPDATE_REQUEST_HOTEL_BOOKING = "/api/b2b/hotel/update-request-hotel-booking-id.json";

        /// <summary>
        /// Lịch sử booking
        /// </summary>
        public const string BOOKING_DETAIL = "api/b2b/order/history/hotel-order-detail.json";

        public const string USER_DETAIL = "api/b2b/client/get-detail.json";
        public const string USER_UPDATE = "api/b2b/client/update-detail.json";
        public const string USER_CHANGEPASS = "api/b2b/Account/change-password.json";
        public const string USER_RESET_PASSWORD = "api/client/reset-password.json";
        public const string USER_MAIL_RESET_PASSWORD = "api/b2c/Mail/send-mail-reset-password.json";
        public const string INSER_CLIENTB2B = "/api/b2b/client/inser-clientB2B.json";
        public const string GetListAccountClient = "/api/b2b/Account/list-account-client.json";
        public const string Update_Account_Client = "/api/b2b/Account/update-account-client.json";

        public const string LOCATION_PROVINCE = "api/b2b/location/province.json";
        public const string LOCATION_DISTRICT = "api/b2b/location/district.json";
        public const string LOCATION_WARD = "api/b2b/location/ward.json";



        public const string EXCLUSIVE_HOTEL_BY_LOCATION = "api/b2b/hotel/search-by-location";
        public const string EXCLUSIVE_HOTEL_BY_LOCATION_POSITION = "api/b2b/hotel/search-by-location-position";
        public const string EXCLUSIVE_HOTEL_BY_LOCATION_DETAIL = "api/b2b/hotel/search-by-location-detail";
        public const string EXCLUSIVE_HOTEL_GET_LOCATION_LIST = "api/b2b/hotel/get-hotel-location";

        public const string COMMIT_HOTEL = "api/b2b/hotel/commit";
        public const string COMMIT_HOTEL_LOCATION = "api/b2b/hotel/hotel-commit-location";
        public const string COMMIT_HOTEL_DETAIL = "api/b2b/hotel/commit-detail";
        /// <summary>
        /// Thanh toán bằng ký quỹ
        /// </summary>
        public const string CHECK_FUND_AVAILABLE = "/api/b2b/payment/check-fund-available";
        public const string CONFIRM_PAYMENT_WITH_FUND = "/api/b2b/payment/confirm-fund-payment";

        // Comment

        public const string GET_COMMENT_LISTING = "/api/comment/get-list.json";
        public const string ADD_COMMENT = "/api/comment/add.json";

        public const string TrackingVoucher = "api/Voucher/b2b/apply.json";
        public const string GetVoucherList = "api/Voucher/b2b/get-list";
        public const string GetHotelSurcharge = "api/b2b/hotel/get-surcharge.json";


    }

    public enum ENUM_API_RESULT
    {
        SUCCESS = 0,
        FAILED = 1,
        ERROR = 2
    }

    public enum ENUM_PAYMENT_TYPE
    {
        CHUYEN_KHOAN_NGAN_HANG = 1,
        ATM_TK_NH = 2,
    }

    public enum ENUM_FUND_TYPE
    {
        VIN_HOTEL_ORDER = 1,
        HOTEL_ORDER = 2,
        PLANE_TICKET = 3,
        BUS_TRAVEL = 4,
        TOUR_TRAVEL = 5
    }

    public enum ENUM_TRAN_TYPE
    {
        RECHARGE_FUND = 1,
        ALLOCATE_FUND = 2,
        SERVICE_PAYMENT = 3
    }
}
