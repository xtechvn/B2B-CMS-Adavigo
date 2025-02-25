﻿$(document).ready(function () {
    hotel_home_listing.Initialization()
})
var hotel_home_listing = {
    Initialization: function () {
        hotel_home_listing.DynamicBind()
        hotel_home_listing.RenderHotelByLocation($('#hotel-listing'), '', 0)
       
    },
    DynamicBind: function () {
        $('body').on('click', '#hotel-listing-viewmore', function (e) {
            var element = $(this)
            var index_value = 1;
            var index = element.attr('data-index')
            if (index == undefined || isNaN(parseInt(index)) || parseInt(index) < 1) {
                index_value = 0
            } else {
                index_value = parseInt(index)
            }
            element.attr('data-index', ++index_value)

            hotel_home_listing.RenderHotelByLocation($('#hotel-listing'), hotel_home_listing.GetFilterLocationName(), hotel_home_listing.GetFilterLocationType(), index_value)
        });
        $('body').on('click', '.filter-listing-location', function (e) {
            var element = $(this)
            $('.filter-listing-location').prop('checked', false)
            element.prop('checked', true)
            element.attr('data-index', '1')

            setTimeout(function () {
                hotel_home_listing.RenderHotelByLocation($('#hotel-listing'), hotel_home_listing.GetFilterLocationName(), hotel_home_listing.GetFilterLocationType(), 1)
            }, 2000);

        });
        $('body').on('change', '.filter-listing-star', function (e) {
            hotel_home_listing.FilterHotel()

        });
        $('body').on('click', '#filter-hotel-clear', function (e) {
            $('.filter-listing-star').prop('checked',false)
            var rangeSlider = document.getElementById('slider-range-price');
            rangeSlider.noUiSlider.set([0, hotel_home_listing.GetMaxSliderPriceValue()]);
            hotel_home_listing.FilterHotel()
        });
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
            committype: hotel_home_listing.GetHotelCommitType()
        }
        _ajax_caller.post('/hotel/ListingItems', input, function (result) {
            if (result != undefined) {
                if (index <= 1) {
                    element.find('.col-main').find('.list-article').html(result)
                } else {
                    element.find('.col-main').find('.list-article').append(result)
                }
                hotel_home_listing.RenderHotelPrice(element)

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
            var result = _ajax_caller.POSTSynchorus('/hotel/HotelByLocationAreaDetail', { request_model: input });
            if (result != undefined && result.isSuccess == true && result.data != undefined && result.data.min_price != undefined) {
                element_detail.find('.bottom-content').find('.price').removeClass('placeholder')
                element_detail.find('.bottom-content').find('.price-old').removeClass('placeholder')
                element_detail.find('.bottom-content').find('.price').html(_global.Comma(result.data.min_price) + ' VND')
                element_detail.find('.bottom-content').find('.price').attr('data-price', result.data.min_price)
                element_detail.find('.bottom-content').find('.price-old').html('')

                hotel_home_listing.RenderHotelPriceVoucher(element_detail)
            }
            if (result.data == undefined || parseFloat(result.data.min_price) == undefined || parseFloat(result.data.min_price) <= 0) {
                element_detail.hide()
            }
            element_detail.attr('data-completed', '1')
        })
        hotel_home_listing.SliderPrice()

    },
    RenderHotelPriceVoucher: function (element_detail) {
        var input = {
            hotel_id: element_detail.attr('data-id'),
        }
        var price = element_detail.find('.bottom-content').find('.price').attr('data-price')
        var result= _ajax_caller.POSTSynchorus('/hotel/HotelByLocationAreaDiscount', { request: input, price: price });
        if (result != undefined && result.isSuccess == true && result.data != undefined && result.data > 0) {
            element_detail.find('.block-code').removeClass('placeholder')
            element_detail.find('.block-code').find('.block-code-text').html('Mã:')
            element_detail.find('.block-code').find('.code').html((result.code != undefined) ? result.code : '')
            element_detail.find('.block-code').find('.sale').html((result.discount != undefined) ? result.discount : '')
            element_detail.find('.block-code').find('.price-new').html(_global.Comma(result.data) + ' VND')
        } else {
            element_detail.find('.block-code').hide()
        }
    },
    GetHotelCommitType: function () {
        return 0
    },
    SliderPrice: function () {
        let minPrice = 0;
        let maxPrice = hotel_home_listing.GetMaxSliderPriceValue()

        var rangeSlider = document.getElementById('slider-range-price');
        var moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            // prefix: 'VNĐ'
        });
        noUiSlider.create(rangeSlider, {
            start: [minPrice, maxPrice],
            step: 1,
            range: {
                'min': [minPrice],
                'max': [maxPrice]
            },
            format: moneyFormat,
            connect: true
        });

        // Set visual min and max values and also update value hidden form inputs
        rangeSlider.noUiSlider.on('update', function (values, handle) {
            var min = parseFloat(values[0].replaceAll(',', ''))
            var max = parseFloat(values[1].replaceAll(',', ''))
            document.getElementById('price-slider-range-value1').innerHTML = values[0];
            document.getElementById('price-slider-range-value2').innerHTML = values[1];
            document.getElementsByName('price-min-value').value = moneyFormat.from(
                values[0]);
            document.getElementsByName('price-max-value').value = moneyFormat.from(
                values[1]);
            $('#price-slider-range-value1').val(min)
            $('#price-slider-range-value2').val(max)
            hotel_home_listing.FilterHotel()
          
        });
    },
    GetMaxSliderPriceValue: function () {
        let maxPrice = 0;
        $('#hotel-listing').find('.article-hotel-item').each(function (index, item) {
            var element = $(this)
            var price = element.find('.bottom-content').find('.price').attr('data-price')
            if (parseFloat(price) != undefined && !isNaN(parseFloat(price)) && parseFloat(price) > maxPrice) {
                maxPrice = parseFloat(price)
            }
        })
        return maxPrice
    },
    FilterHotel: function () {
        var stars = []
        $('.filter-listing-star').each(function (index, item) {
            var element_star = $(this)
            if (element_star.is(':checked')) {
                stars.push(parseInt(element_star.val()))
            }
        })
        var min= $('#price-slider-range-value1').val()
        var max = $('#price-slider-range-value2').val()
      
        $('#hotel-listing').find('.article-hotel-item').each(function (index, item) {
            var element = $(this)
            var price = element.find('.bottom-content').find('.price').attr('data-price')
            var star = element.attr('data-star')
            if (parseFloat(price) != undefined && !isNaN(parseFloat(price)) && parseFloat(price) >= min && parseFloat(price) <= max
                && (stars.length <= 0 || (parseInt(star) != undefined && !isNaN(parseInt(star)) && stars.includes(parseInt(star))))) {
                element.show()
            } else {
                element.hide()
            }
        })
    }
}