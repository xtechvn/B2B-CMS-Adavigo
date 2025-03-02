$(document).ready(function () {
    hotel_home_listing.Initialization()
})
var hotel_home_listing = {
    Loading:false,
    Initialization: function () {
        hotel_home_listing.DynamicBind()
        $('#hotel-listing .col-main').addClass('placeholder')
        hotel_home_listing.RenderHotelByLocation(1)
        $('#hotel-listing-viewmore').remove()
    },
    DynamicBind: function () {
        $('body').on('click', '#hotel-listing-viewmore', function (e) {
            var element = $(this)
            var index_value = 1;
            var index = element.attr('data-index')
            if (index == undefined || isNaN(parseInt(index)) || parseInt(index) < 1) {
                index_value = 1
            } else {
                index_value = parseInt(index)
            }
            element.attr('data-index', ++index_value)
            hotel_home_listing.AddLoading()

            hotel_home_listing.RenderHotelByLocation(index_value)
        });
        $('body').on('click', '.filter-listing-location', function (e) {
            var element = $(this)
            $('.filter-listing-location').prop('checked', false)
            element.prop('checked', true)
            element.attr('data-index', '1')
            hotel_home_listing.AddLoading()
            hotel_home_listing.RenderHotelByLocation(1)

        });
        $('body').on('change', '.filter-listing-star', function (e) {
            hotel_home_listing.RenderHotelByLocation(1)

        });
        $('body').on('click', '#filter-hotel-clear', function (e) {
            $('.filter-listing-star').prop('checked', false)
            $('.filter-listing-location').each(function (index, item) {
                var element_checkbox = $(this)
                element_checkbox.prop('checked', false)
            })
            try {
                var rangeSlider = document.getElementById('slider-range-price');
                rangeSlider.noUiSlider.set([0, hotel_home_listing.GetMaxSliderPriceValue()]);
                
            } catch {

            }
            hotel_home_listing.AddLoading()
            hotel_home_listing.RenderHotelByLocation(1)
        });
    },
    AddLoading: function () {
        $('#hotel-listing .col-300').addClass('placeholder')
        $('#hotel-listing .col-main').addClass('placeholder')
        $('#hotel-listing .col-300').addClass('box-placeholder')
        $('#hotel-listing .col-main').addClass('box-placeholder')
    },
    RemoveLoading: function () {
        $('#hotel-listing .col-300').removeClass('placeholder')
        $('#hotel-listing .col-main').removeClass('placeholder')
        $('#hotel-listing .col-300').removeClass('box-placeholder')
        $('#hotel-listing .col-main').removeClass('box-placeholder')
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
    RenderHotelByLocation: function (index = 1) {
        if (hotel_home_listing.Loading == true) {
            return
        }
        hotel_home_listing.Loading=true
        hotel_home_listing.AddLoading()
        //$('#hotel-listing-viewmore').hide()
        //$('#hotel-listing-viewmore').prop('disabled', true)
        //$('#hotel-listing-viewmore').find('.viewmore-text').html('Vui lòng chờ')
        $('#hotel-listing').find('.list-items-detail').remove()
        var stars = []
        $('.filter-listing-star').each(function (index, item) {
            var element_star = $(this)
            if (element_star.is(':checked')) {
                stars.push(parseInt(element_star.val()))
            }
        })
        var input = {
            location: hotel_home_listing.GetFilterLocationName(),
            page_index: index,
            page_size: 30,
            stars: stars.join(","),
            min_price: $('#price-slider-range-value1').val(),
            max_price: $('#price-slider-range-value2').val()
        }
        _ajax_caller.post('/hotel/ListingItems', input, function (result) {
            if (result != undefined && result.trim() != '') {
                if (index <= 1) {
                    $('#hotel-listing').find('.col-main').find('.list-article').html(result)
                } else {
                    $('#hotel-listing').find('.col-main').find('.list-article').append(result)
                }
                hotel_home_listing.RenderHotelPriceVoucher($('#hotel-listing'))
                $('#hotel-listing-search-null').hide()
                hotel_home_listing.SliderPrice()

            } else if (index <= 1) {
                $('#hotel-listing').find('.col-main').find('.list-article').html('')
                $('#hotel-listing-search-null').show()

            }
            //if (result.trim() != '') $('#hotel-listing-viewmore').show()
            //$('#hotel-listing-viewmore').prop('disabled', false)
            //$('#hotel-listing-viewmore').find('.viewmore-text').html('Xem thêm')
            //var count = $('#hotel-listing .list-items-detail').val()
            //if (parseInt(count) == undefined || isNaN(parseInt(count)) || parseInt(count) < 30) {
            //    $('#hotel-listing-viewmore').hide()
            //} else {
            //    $('#hotel-listing-viewmore').show()
            //}
            hotel_home_listing.RemoveLoading()
            hotel_home_listing.Loading = false
        });
    },
    RenderHotelPriceVoucher: function (element) {
        element.find('.article-hotel-item').each(function (index, item) {
            var element_detail = $(this)
            var input = {
                hotel_id: element_detail.attr('data-id'),
            }
            var price = element_detail.find('.bottom-content').find('.price').attr('data-price')
            _ajax_caller.post('/hotel/HotelByLocationAreaDiscount', { request: input, price: price }, function (result) {
                if (result != undefined && result.isSuccess == true && result.data != undefined && result.data > 0 && (result.code != undefined && result.code.trim() != '')) {
                    element_detail.find('.block-code').show()
                    element_detail.find('.block-code').removeClass('placeholder')
                    element_detail.find('.block-code').find('.block-code-text').html('Mã:')
                    element_detail.find('.block-code').find('.code').html((result.code != undefined) ? result.code : '')
                    element_detail.find('.block-code').find('.sale').html((result.discount != undefined) ? result.discount : '')
                    element_detail.find('.block-code').find('.price-new').html(_global.Comma(result.data) + '  đ')
                }
                else {
                    element_detail.find('.block-code').hide()
                }

            });
        })


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

        if (rangeSlider.noUiSlider) {
            let currentValue = rangeSlider.noUiSlider.get(); // Get current value

            rangeSlider.noUiSlider.updateOptions({
                range: {
                    'min': minPrice,
                    'max': maxPrice
                }
            });

            // Ensure the value is within the new range before setting it
            let newValue = Math.max(minPrice, Math.min(maxPrice, currentValue));
            rangeSlider.noUiSlider.set(newValue);
            return
        }

        else {
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
            rangeSlider.noUiSlider.on('update', function (values, handle) {
                if (isNaN(parseFloat(values[0]))) {
                    return
                }
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
                // hotel_home_listing.FilterHotel()
            });
            rangeSlider.noUiSlider.on('set', function (values, handle) {
                if (isNaN(parseFloat(values[0]))) {
                    return
                }
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
                if (hotel_home_listing.Loading == false) {
                    hotel_home_listing.RenderHotelByLocation(1)

                }
            });
        }


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
   
}