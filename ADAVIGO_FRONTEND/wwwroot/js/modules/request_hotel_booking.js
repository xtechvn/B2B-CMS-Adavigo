var _request_hotel_booking = {
    grid_element: "#grid_data_listing",
    grid_detail_element: "#grid_data_detail",
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
    GetDetailRequestBooking: function (id, RequestNo) {
   
        _ajax_caller.post('/Booking/DetailRequestHotelBooking', { id: id, RequestNo: RequestNo }, function (result) {
            $(_request_hotel_booking.grid_detail_element).html(result);
            $(_request_hotel_booking.grid_element).addClass('hidden');
            $(_request_hotel_booking.grid_detail_element).removeClass('hidden');
        });
    },
    Filter: function () {
        let objSearch = {
            RequestId: $('#search_request_code').val(),
            PageIndex: 1,
            PageSize: 15
        };

        this.SearchParam = objSearch;
        this.Search(objSearch);
    }
}

$(document).ready(function () {
    _request_hotel_booking.Init();
    $('#search_request_code').keyup(function (event) {
        if (event.keyCode === 13) {
            _request_hotel_booking.Filter();
        }
    })
    
});
