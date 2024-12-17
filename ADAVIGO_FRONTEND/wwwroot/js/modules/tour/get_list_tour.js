$(document).ready(function () {
    Listing_tour_search.Initialization()
    $('#search_request_code').keyup(function (event) {
        if (event.keyCode === 13) {
            Listing_tour_search.Filter();
        }
    })
})
var Listing_tour_search = {
    Initialization: function () {
        var model = {
            pageindex: 1,
            pagesize: 20,
            textsearch: null,
        }
        Listing_tour_search.ListingTour(model)
    },
    ListingTour: function (model) {

        _ajax_caller.post('/tour/SearchOrderTour', { "request": model }, function (result) {

            $('#grid_data_listing').html(result)
         
        });
    },
    Filter: function () {
        var model = {
            pageindex: 1,
            pagesize: 20,
            textsearch: $('#search_request_code'.value()),
        }
        Listing_tour_search.ListingTour(model);
    },
    OnPaging: function (value) {
        var model = {
            pageindex: value,
            pagesize: 20,
            textsearch: $('#search_request_code'.value()),
        }
        Listing_tour_search.ListingTour(model);
    },
    Detail: function (id) {
        _ajax_caller.post('/tour/OrderDetailTour', { id: id }, function (result) {
            //console.log('vao');
            $('#grid_detail_element').html(result);
            $('#grid_detail_element').removeClass('hidden');

            $('#grid_data_listing').addClass('hidden');
        });
    },
    BackToListing: function () {
        $('#grid_data_listing').removeClass('hidden');
        $('#grid_detail_element').addClass('hidden');
    },

}