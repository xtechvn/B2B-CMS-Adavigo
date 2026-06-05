$(document).ready(function () {
    index_b2b.init();
});
var index_b2b = {
    init: function () {
        this.GetListFl();
    },
    GetListFl: function () {
        var obj = {
            BookingCode: $('#search-booking-code').val(),
            DeparturePoint: $('#search-departure').val() ? $('#search-departure').val().toString() : '',
            ArrivalPoint: $('#search-arrival').val() ? $('#search-arrival').val().toString() : '',
            Airline: $('#search-airline').val(),
            Date: $('#Date').val(),
            FundType: $('#search-fund-type').val(),
            pageIndex: 1,
            pageSize: 10
        };
        _ajax_caller.post("/Flights/Search", { searchModel: obj }, function (result) {
            $('#grid-data-b2b').html(result);
        });
    },
};