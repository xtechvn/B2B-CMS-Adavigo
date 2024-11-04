const CONSTANTS = {
    FLIGHTS: {
        PLACES: [
            { id: 1, name: 'Hà Nội', code: 'HAN', text: 'Hà Nội - HAN' },
            { id: 2, name: 'Hồ Chí Minh', code: 'SGN', text: 'Hồ Chí Minh - SGN' },
            { id: 3, name: 'Đà Nẵng', code: 'DAD', text: 'Đà Nẵng - DAD' },
            { id: 4, name: 'Điện Biên Phủ', code: 'DIN', text: 'Điện Biên Phủ - DIN' },
            { id: 5, name: 'Hải Phòng', code: 'HPH', text: 'Hải Phòng - HPH' },
            { id: 6, name: 'Thanh Hóa', code: 'THD', text: 'Thanh Hóa - THD' },
            { id: 7, name: 'Vinh', code: 'VII', text: 'Vinh - VII' },
            { id: 8, name: 'Quảng Bình', code: 'VDH', text: 'Quảng Bình - VDH' },
            { id: 9, name: 'Quảng Nam', code: 'VCL', text: 'Quảng Nam - VCL' },
            { id: 10, name: 'Huế', code: 'HUI', text: 'Huế - HUI' },
            { id: 11, name: 'PleiKu', code: 'PXU', text: 'PleiKu - PXU' },
            { id: 12, name: 'Phú Yên', code: 'TBB', text: 'Phú Yên - TBB' },
            { id: 13, name: 'Buôn Mê Thuột', code: 'BMV', text: 'Buôn Mê Thuột - BMV' },
            { id: 14, name: 'Nha Trang', code: 'CXR', text: 'Nha Trang- CXR' },
            { id: 15, name: 'Qui Nhơn', code: 'UIH', text: 'Qui Nhơn - UIH' },
            { id: 16, name: 'Đà Lạt', code: 'DLI', text: 'Đà Lạt - DLI' },
            { id: 17, name: 'Cần Thơ', code: 'VCA', text: 'Cần Thơ - VCA' },
            { id: 18, name: 'Kiên Giang', code: 'VKG', text: 'Kiên Giang - VKG' },
            { id: 19, name: 'Cà Mau', code: 'CAH', text: 'Cà Mau - CAH' },
            { id: 20, name: 'Phú Quốc', code: 'PQC', text: 'Phú Quốc - PQC' },
            { id: 21, name: 'Côn Đảo', code: 'VCS', text: 'Côn Đảo - VCS' },
            { id: 22, name: 'Vân Đồn', code: 'VDO', text: 'Vân Đồn - VDO' },
        ],

        MIN_FARE_MONTH_PLACES: [
            { id: 1, name: 'Hà Nội', code: 'HAN', text: 'Hà Nội - HAN' },
            { id: 2, name: 'Hồ Chí Minh', code: 'SGN', text: 'Hồ Chí Minh - SGN' },
            { id: 3, name: 'Phú Quốc', code: 'PQC', text: 'Phú Quốc - PQC' },
            { id: 4, name: 'Nha Trang', code: 'CXR', text: 'Nha Trang- CXR' },
            { id: 5, name: 'Đà Nẵng', code: 'DAD', text: 'Đà Nẵng - DAD' },
            { id: 6, name: 'Đà Lạt', code: 'DLI', text: 'Đà Lạt - DLI' },
        ],

        APIS: {
            searchMinFare: "/api/flights/searchMinFare",
            searchFlight: "/api/flights/searchFlight",
            getBaggage: "/api/flights/getBaggage",
            verifyFlight: "/api/flights/verifyFlight",
            bookFlight: "/api/flights/bookFlight",
            payment: "/api/flights/payment",
            getBankListOnePay: "/api/flights/getBankListOnePay",
            getFareDataInfo: "/api/flights/getFareDataInfo",
            getCommonFareDataInfo: "/api/flights/getCommonFareDataInfo",
            getAdavigoAdtPrices: "/api/flights/getAdavigoAdtPrices",
            getAdavigoPrices: "/api/flights/getAdavigoPrices",
            getCommonAirlines: "/api/flights/getCommonAirlines",
            getCommonGroupClass: "/api/flights/getCommonGroupClass",
            getPrice: "/api/flights/getPrice",
            login: "/api/flights/login",
            register: "/api/flights/register",
            saveBooking: "/api/flights/saveBooking",
            getOrderByClientId: "/api/flights/getOrderByClientId",
            getOrderDetail: "/api/flights/getOrderDetail",
            getLocations: "/api/flights/getLocations",
            getHotels: "/api/flights/getHotels",
            getTopTrending: "/api/flights/getTopTrending",
            getFlashSale: "/api/flights/getFlashSale",
            getBookingBySessionId: "/api/flights/getBookingBySessionId",
            getBookingBySessionIdOrder: "/api/flights/getBookingBySessionIdOrder",
            logTele: "/api/flights/logTele",
            searchListMinFare: "/api/flights/searchListMinFare",
            searchListMinFareMonths: "/api/flights/searchListMinFareMonths",
            searchMinFareMonth: "/api/flights/searchMinFareMonth",
            searchListMinFareDateRange: "/api/flights/searchListMinFareDateRange",
            getGroupHot: "/api/flights/getGroupHot",
            getSummerTour: "/api/flights/getSummerTour",
            getPriceOfListFareData: "/api/flights/getPriceOfListFareData",
            getAdavigoSettings: "/api/flights/getAdavigoSettings",
            changePassword: "/api/flights/changePassword",
            trackingVoucher: "/api/flights/trackingVoucher",
            getVietQRCode: "/api/flights/getVietQRCode"          
        },

        MVC: {
            customerInfo: "/flights/customerInfo",
            payment: "/flights/payment",
            notification: "/flights/notification",
            orderHistory: "/flights/orderHistory",
            orderDetail: "/flightBooking/orderDetail",
            flightList: "/flights/flightlist",
            index: "/",
            getAdavigoSettings: "/flights/GetAdavigoSettings",
            changePassword: "/flights/ChangePassword",
            updateInfomation: "/flights/UpdateInfomation",
            sendMailResetPassword: "/flights/SendMailResetPassword",
            resetpassword: "/flights/Resetpassword",
        },

        MODAL: {
            authen: "authenModal",
            customerInfoConfirm: "customerInfoConfirm",
            myModalBankTransfer: "myModalBankTransfer",
            successModal: "successModal",
            errorModal: "errorModal",
            myModalBaggage: "myModalBaggage",
            myModalExpired: "myModalExpired",
            myModalEndPrice: "myModalEndPrice",
            myModalChangePrice: "myModalChangePrice",
            myModalStop: "myModalStop",
            myModalResetPasswordSuccess: "myModalResetPasswordSuccess",
            supportModal: "supportModal",
            modalSearchFlightMobile: "modalSearchFlightMobile",
            modalFilterFlightMobile: "modalFilterFlightMobile",
            modalSeat: "modalSeat",
            modalCustomer: "modalCustomer",
            modalFlightDetailPrice: "modalFlightDetailPrice",


        },

        PAYMENT_TYPE: {
            transfer: {
                id: 1,
                text: "transfer",
                textVi: "Chuyển khoản ngân hàng"
            },
            atm: {
                id: 2,
                text: "atm"
            },
            visa: {
                id: 3,
                text: "visa"
            },
            qr: {
                id: 4,
                text: "qr"
            },
            hold: {
                id: 6,
                text: "hold",
                textVi: "Giữ chỗ"
            }
        },
    },
    LOCATIONS: {
        APIS: {
            getProvinces: "/api/location/getProvinces",
            getDistrictByProvinceId: "/api/location/getDistrictByProvinceId",
            getWardByDistrictId: "/api/location/getWardByDistrictId",
        },

    },

    NEWS: {
        APIS: {
            getNewsCategory: "/api/news/getNewsCategory",
            getNewsByCategoryId: "/api/news/getNewsByCategoryId",
            getNewsByCategoryIdV2: "/api/news/getNewsByCategoryIdV2",
            getMostViewedArticles: "/api/news/getMostViewedArticles",
            getNewsByTag: "/api/news/getNewsByTag",
            findArticle: "/api/news/findArticle",
        },

        MVC: {
            news: "/tin-tuc",
            search: "/tim-kiem"
        },
        PAGE_SIZE: 15,
        RECRUITMENT: {
            CATEGORY_ID: 32,
            PATH: "/tuyen-dung"
        }
    },

    FLIGHT_BOOKING: {
        MVC: {
            index: "/flightBooking",
            orderDetail: "/flightBooking/orderDetail",
        }, 
    },

    VINWONDER: {
        APIS: {
            getServices: "/api/vinwonder/getServices",
            filterServices: "/api/vinwonder/filterServices",
            getVinArticles: "/api/vinwonder/getVinArticles",     
            saveVinBooking: "/api/vinwonder/saveVinBooking",        
            payment: "/api/vinwonder/payment",
            getVinwonderHistory: "/api/vinwonder/getVinwonderHistory",
            getSaveVinwonderData: "/api/vinwonder/getSaveVinwonderData",
            getVinOrderDetail: "/api/vinwonder/getVinOrderDetail",
            getVinBookingByBookingId: "/api/vinwonder/getVinBookingByBookingId",
            getVinPrice: "/api/vinwonder/getVinPrice",          
            getSiteFromAdavigo: "/api/vinwonder/getSiteFromAdavigo"          
            
        },

        MVC: {
            index: "/vinwonder",
            details: "/vinwonder/details",
            customerInfo: "/vinwonder/customerInfo",
            payment: "/vinwonder/payment",
            notification: "/vinwonder/notification",
            orderDetail: "/vinwonder/orderDetail",
        },

        CHANNEL_CODE: "OTA",
        TYPE_CODE: {
            NL: "NL",
            TE: "TE",
            NCT: "NCT"
        },

        MODAL: {
            detailTicketModal: "detailTicketModal",
            deleteCartItemModal: "deleteCartItemModal",
            modalSelectOtherDateOrSite:"modalSelectOtherDateOrSite"
        },

        SITES: [
            { id: 1, name: 'VinKE & Aquarium Times City', code: 1, link: 'vinke-vinpearl-aquarium',image :"linkanh" },
            { id: 2, name: 'VinWonders Nam Hội An', code: 2, link: 'vinwonders-nam-hoi-an' },
            { id: 3, name: 'VinWonders Phú Quốc', code: 3, link: 'vinwonders-phu-quoc' },
            { id: 5, name: 'VinWonders Nha Trang', code: 5, link: 'vinwonders-nha-trang' },
            { id: 6, name: 'VinWonders Hòn Tằm', code: 6, link: 'vinwonders-hon-tam' },
        ],

        TEXT: {
            addToCartSuccess: "Thêm vào giỏ hàng thành công!",
            haveNoCartItem: "Giỏ hàng của bạn còn trống!",
            noCheckedCartItem : "Vui lòng chọn ít nhất 1 đơn hàng để tiếp tục!"
        },

        PRICE_UNIT_TYPE: {
            VND: 2,
            PERCENT:1
        }
    },

    PAGE_SIZE: 20,
    DOMAIN: window.location.origin,
    DOMAIN_URL: "https://adavigo.com",
    LOGIN_VERSION: "v1",
    STORAGE: {
        COUNTER_KEY: 'my-counter',
        Search: 'dataFlightSearch',
        Info: 'infoStep2',
        ListFareData: 'listFareData',
        ContactInfo: 'contactInfo',
        Booked: 'booked',
        Booking: 'booking',
        Voucher: "voucher",
        Issue: 'issue',
        User: 'user',
        CheckOutResponse: "checkOutResponse",
        OrderId: "orderId",
        Payment: "payment",
        Path: "Path",
        NewsCategoryId: "newsCategoryId",
        SearchHistory: "searchHistory",
        VIN: {
            SearchVinwonder: "SearchVinwonder",
            Cart: "Cart",
            PaymentCart: "PaymentCart",
            SaveData: "SaveData",
            BookingId: "BookingId",
            OrderId:"VinOrderId"
        }
    },

    RESPONSE_STATUS: {
        success: 0,
        error: 2
    },
    TIMER: 15,

    AGES: {
        ADT: "ADT",
        CHD: "CHD",
        INF: "INF",
    },

    MODAL_TYPES: {
        success: "success",
        error: "error"
    },

    NODATA: "Không có kết quả tìm kiếm!",
    TOOLTIP_CONTENT: "Phí này giúp Adavigo duy trì và nâng cao chất lượng dịch vụ như cải thiện dịch vụ khách hàng 24/7, nâng cấp trải nghiệm  ứng dụng và hỗ trợ hoàn hủy, mua thêm các dịch vụ sau đặt vé được tốt hơn",
    TEXT: {
        warning: "Cảnh báo",
        noEndDate: "Chưa có ngày về",
        errorBaggage: {
            title: "Hành lý ký gửi!",
            message: "Vui lòng nhập thông tin hành khách trước khi chọn mua thêm hành lý. Xin cảm ơn!"
        },
        validate: {
            required: "Vui lòng nhập thông tin!",
            email: "Vui lòng nhập đúng định dạng email!"
        },

        error: {
            password: "Mật khẩu phải từ 6-32 ký tự"
        },

        filterPrice: {
            default: "Giá cơ bản cho 1 người lớn",
            tax: "Giá gồm thuế, phí 1 người lớn"
        }

    },

    PACIFIC_AIRLINE: {
        operating: "BL",
        path: "/images/logo/pacific_airline.png",
        name: "Pacific Airlines",
        value: "VN-BL"
    },

    VIETNAM_AIRLINE: {
        code: "VN"
    },

    FARE_CLASSES: [
        {
            id: 0,
            name: "Phổ thông"
        },
        {
            id: 1,
            name: "Thương gia"
        },
    ]

}





