const flightServices = {
    getListSearchMinFare: function (StartPointCode, EndPointCode, DepartDate) {    
        var data = {
            "FlightRequest": {
                "StartPoint": StartPointCode,
                "EndPoint": EndPointCode,
                "DepartDate": DepartDate,
                "Airline": ""
            }
        }

        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchMinFare, data)
    },

    getAllListSearchFareOneWay: function (StartPointCode, EndPointCode, DepartDate, searchObj) {
        var data = {
            "Adt": searchObj.Adt,
            "Chd": searchObj.Child,
            "Inf": searchObj.Baby,
            "ViewMode": "",
            "ListFlight": [
                {
                    "StartPoint": StartPointCode,
                    "EndPoint": EndPointCode,
                    "DepartDate": DepartDate,
                    "Airline": ""
                }
            ]
        }

        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchFlight, data)
    },

    getAllListSearchFareTwoWay: function (StartPointGo, EndPointGo, DepartDateGo, StartPointArrival, EndPointArrival, DepartDateArrival, searchObj) {
        var data = {
            "Adt": searchObj.Adt,
            "Chd": searchObj.Child,
            "Inf": searchObj.Baby,
            "ViewMode": "",
            "ListFlight": [
                {
                    "StartPoint": StartPointGo,
                    "EndPoint": EndPointGo,
                    "DepartDate": DepartDateGo,
                    "Airline": ""
                },
                {
                    "StartPoint": StartPointArrival,
                    "EndPoint": EndPointArrival,
                    "DepartDate": DepartDateArrival,
                    "Airline": ""
                }
            ]
        }

        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchFlight, data)
    },

    getBaggageFareChosen: function (listFareData) {
        var data = {
            "ListFareData": listFareData,
        }
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getBaggage, data)   
    },

    verifyFlight: function (listFareData) {
        var data = {
            "ListFareData": listFareData,
        }
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.verifyFlight, data)
    },

    bookFlight: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.bookFlight, request)
    },

    payment: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.payment, request)
    },

    getBankListOnePay: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getBankListOnePay)
    },

    getFareDataInfo: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getFareDataInfo, request)
    },

    getCommonFareDataInfo: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getCommonFareDataInfo, request)
    },

    getCommonGroupClass: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getCommonGroupClass, request)
    },
    getCommonAirlines: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getCommonAirlines, request)
    },
    getAdavigoAdtPrices: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getAdavigoAdtPrices, request)
    },

    getAdavigoPrices: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getAdavigoPrices, request)
    },

    getPriceOfListFareData: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getPriceOfListFareData, request)
    },

    getPrice: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getPrice, request)
    },
    register: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.register, request)
    },

    login: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.login, request)
    },

    saveBooking: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.saveBooking, request)
    },

    getOrderByClientId: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getOrderByClientId, request)
    },

    getOrderDetail: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getOrderDetail, request)
    },

    getLocations: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getLocations)
    },

    getHotels: function (destinationId) {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getHotels + "/" + destinationId)
    },

    getTopTrending: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getTopTrending)
    },

    getFlashSale: function (request) {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getFlashSale)
    },

    getBookingBySessionId: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getBookingBySessionId, request)
    },

    getBookingBySessionIdOrder: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getBookingBySessionIdOrder, request)
    },

    logTele: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.logTele, request);
    },

    searchListMinFare: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchListMinFare, request);
    },

    searchListMinFareMonths: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchListMinFareMonths, request);
    },

    searchMinFareMonth: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchMinFareMonth, request);
    },
    
    searchListMinFareDateRange: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.searchListMinFareDateRange, request);
    },

    getGroupHot: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getGroupHot)
    },

    getSummerTour: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getSummerTour)
    },

    getAdavigoSettings: function () {
        return ajaxServices.get(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.MVC.getAdavigoSettings)
    },

    changePassword: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.MVC.changePassword, request)
    },

    resetpassword: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.MVC.resetpassword, request)
    },

    updateInfomation: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.MVC.updateInfomation, request)
    },

    sendMailResetPassword: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.MVC.sendMailResetPassword, request)
    },

    trackingVoucher: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.trackingVoucher, request)
    },

    getVietQRCode: function (request) {
        return ajaxServices.post(CONSTANTS.DOMAIN + CONSTANTS.FLIGHTS.APIS.getVietQRCode, request)
    },
    
}

