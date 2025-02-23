$(document).ready(function () {
    hotel_listing.Initialization()
})
var hotel_listing = {
    Initialization: function () {
        hotel_listing.DynamicBind()
        hotel_listing.RenderHotelByLocation($('#hotel-listing'), $('#hotel-listing').attr('data-name'),0)
    },
    DynamicBind: function () {
        $('body').on('click', '#hotel-listing-viewmore', function (e) {
            var element = $(this)
            var index_value = 1;
            var index = element.attr('data-index')
            if (index == undefined || isNaN(parseInt(index)) || parseInt(index) < 1) {
                index_value=0
            } else {
                index_value = parseInt(index)
            }
            element.attr('data-index', ++index_value)

            hotel_listing.RenderHotelByLocation($('#hotel-listing'), hotel_listing.GetFilterLocationName(), hotel_listing.GetFilterLocationType(), index_value)
        });
        $('body').on('click', '.filter-listing-location', function (e) {
            var element = $(this)
            //$('.filter-listing-location').prop('checked', false)
            //element.prop('checked', true)
            //element.attr('data-index', '1')

            //setTimeout(function () {
            //    hotel_listing.RenderHotelByLocation($('#hotel-listing'), hotel_listing.GetFilterLocationName(), hotel_listing.GetFilterLocationType(), 1)
            //}, 2000);
            window.location.href = element.closest('a').attr('href')
          
        });
        //$('body').on('click', '.filter-listing-location', function (e) {
        //    var element = $(this)
        //    $('.filter-listing-location').prop('checked', false)
        //    element.prop('checked', true)
        //    element.attr('data-index', '1')

        //    setTimeout(function () {
        //        hotel_listing.RenderHotelByLocation($('#hotel-listing'), hotel_listing.GetFilterLocationName(), hotel_listing.GetFilterLocationType(), 1)
        //    }, 2000);

        //});
    },
    GetFilterLocationName: function () {
        var index_name = "";
        var location_selected = undefined
        $('.filter-listing-location').each(function (index, item) {
            var element_checkbox = $(this)
            if (element_checkbox.is(':checked')) {
                location_selected = element_checkbox
                return false
            }
        })
        if (location_selected != undefined) {
            index_name = location_selected.val()
        }
        return index_name
    },
    GetFilterLocationType: function () {
        var location_selected = undefined
        var type = -1;
        $('.filter-listing-location').each(function (index, item) {
            var element_checkbox = $(this)
            if (element_checkbox.is(':checked')) {
                location_selected = element_checkbox
                return false
            }
        })
        if (location_selected != undefined) {
            type = location_selected.attr('data-type')
        }
        return type
    },
    RenderHotelByLocation: function (element, name, type = -1, index = 1, size = 30) {
        $('#hotel-listing-viewmore').hide()
        $('#hotel-listing-viewmore').prop('disabled', true)
        $('#hotel-listing-viewmore').find('.viewmore-text').html('Vui lòng chờ')
        var input = {
            name: name,
            type: type,
            index: index,
            size: size,
            committype: hotel_listing.GetHotelCommitType()
        }
        _ajax_caller.post('/hotel/ListingItems', input, function (result) {
            if (result != undefined) {
                if (index <= 1) {
                    element.find('.col-main').find('.list-article').html(result)
                } else {
                    element.find('.col-main').find('.list-article').append(result)
                }
                hotel_listing.RenderHotelPrice(element)

            }
            if (result.trim() != '') $('#hotel-listing-viewmore').show()
            $('#hotel-listing-viewmore').prop('disabled', false)
            $('#hotel-listing-viewmore').find('.viewmore-text').html('Xem thêm')
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
        });
    },
    RenderHotelPrice: function (element) {
        element.find('.article-hotel-item').each(function (index, item) {
            var element_detail = $(this)
            var completed = element_detail.attr('data-completed')
            if (completed != undefined && completed.trim() != '') {
                return true
            }
            var input = {
                hotelid: element_detail.attr('data-id'),
                is_vin_hotel: element_detail.attr('data-isvin')
            }
            _ajax_caller.post('/hotel/HotelByLocationAreaDetail', { request_model: input }, function (result) {
                if (result != undefined && result.isSuccess == true && result.data != undefined && result.data.min_price != undefined) {
                    element_detail.find('.bottom-content').find('.price').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price-old').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price').html(_global.Comma(result.data.min_price) + ' VND')
                    element_detail.find('.bottom-content').find('.price').attr('data-price', result.data.min_price)
                    element_detail.find('.bottom-content').find('.price-old').html('')

                    hotel_listing.RenderHotelPriceVoucher(element_detail)
                }
                if (result.data == undefined || parseFloat(result.data.min_price) == undefined || parseFloat(result.data.min_price) <= 0) {
                    element_detail.find('.bottom-content').find('.price').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price-old').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price').html('Giá liên hệ')
                    element_detail.find('.bottom-content').find('.price').attr('data-price', '0')
                    element_detail.find('.bottom-content').find('.price-old').html('')
                    element_detail.find('.block-code').hide()
                }
                element_detail.attr('data-completed','1')
            });
        })

    },
    RenderHotelPriceVoucher: function (element_detail) {
        var input = {
            hotel_id: element_detail.attr('data-id'),
        }
        var price = element_detail.find('.bottom-content').find('.price').attr('data-price')
        _ajax_caller.post('/hotel/HotelByLocationAreaDiscount', { request: input, price: price }, function (result) {
            if (result != undefined && result.isSuccess == true && result.data != undefined && result.data > 0) {
                element_detail.find('.block-code').removeClass('placeholder')
                element_detail.find('.block-code').find('.block-code-text').html('Mã:')
                element_detail.find('.block-code').find('.code').html((result.code != undefined) ? result.code : '')
                element_detail.find('.block-code').find('.sale').html((result.discount != undefined) ? result.discount : '')
                element_detail.find('.block-code').find('.price-new').html(_global.Comma(result.data) + ' VND')
            }

        });

    },
    GetHotelCommitType: function () {
        var commit_type = $('#hotel-listing').attr('data-commitype')
        if (commit_type == undefined
            || isNaN(parseInt(commit_type))
            || parseInt(commit_type) < 0

        )
        {
            return 0
        }
        else {
            return parseInt(commit_type)
        }
    }
}