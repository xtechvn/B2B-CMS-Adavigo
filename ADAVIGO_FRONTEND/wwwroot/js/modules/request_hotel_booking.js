var _request_hotel_booking = {
    grid_element: "#grid_data_listing",
    Init: function () {
        let objSearch = {
            PageIndex: 1,
            PageSize: 15
        };

        this.SearchParam = objSearch;
        this.Search(objSearch);
    },
    Search: function (input) {
        _ajax_caller.post('/Booking/GetListRequestHotelBooking', { model: input }, function (result) {
            $(_request_hotel_booking.grid_element).html(result);
        });
    },
    OnPaging: function (value) {
        var objSearch = this.SearchParam;
        objSearch.PageIndex = value;
        this.Search(objSearch);
    },
}

$(document).ready(function () {
    _request_hotel_booking.Init();
});
