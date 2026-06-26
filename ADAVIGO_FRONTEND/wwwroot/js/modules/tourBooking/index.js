$(document).ready(function () {
    _tour_booking.init();

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
            _tour_booking.LoadMoreTours();
        }
    });

    $("#input_search").on("keypress", function (e) {
        if (e.which == 13) {
            _tour_booking.getlist(true);
        }
    });

    $(".search-btn button").on("click", function () {
        _tour_booking.getlist(true);
    });

    $(".btn_reset").on("click", function () {
        $("#input_search").val("");
        _tour_booking.getlist(true);
    });
})

const pagesize = typeof CONSTANTS !== 'undefined' && CONSTANTS.PAGE_SIZE ? CONSTANTS.PAGE_SIZE : 20;
var pagenum = 1;
var is_loading = false;
var is_end = false;

var _tour_booking = {
    init: function () {
        _tour_booking.getlist(true);
    },
    LoadMoreTours: function () {
        if (!is_loading && !is_end) {
            pagenum++;
            _tour_booking.getlist(false);
        }
    },
    getlist: function (isReset) {
        if (is_loading) return;

        if (isReset) {
            pagenum = 1;
            is_end = false;
            $('#listOrders').html('');
        }

        is_loading = true;
        $('.search-null').show();

        var model = {
            pageindex: Number(pagenum),
            pagesize: Number(pagesize),
            textsearch: $("#input_search").val()
        };

        $.ajax({
            url: "/TourBooking/GetTourOrdersListing",
            type: "Post",
            data: model,
            success: function (result) {
                $('.search-null').hide();

                if (result.trim() === "" || result.indexOf("empty-row") > -1) {
                    is_end = true;
                    if (isReset) {
                        $('#listOrders').html(result);
                    }
                } else {
                    if (isReset) {
                        $('#listOrders').html(result);
                    } else {
                        $('#listOrders').append(result);
                    }
                }
                is_loading = false;
            },
            error: function () {
                is_loading = false;
                $('.search-null').hide();
            }
        });
    }
}