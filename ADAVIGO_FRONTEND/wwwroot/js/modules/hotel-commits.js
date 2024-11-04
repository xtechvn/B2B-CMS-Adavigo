
$(document).ready(function () {
    hotel_commits.Initialization()

})
function CheckPrice() {
    setTimeout(function () {
        var finished = hotel_commits.Data.length > 0 && hotel_commits.Data.some((x) => x.finished == undefined) ? false : true;
        if (hotel_commits.Data.length > 0 && finished) {
            $('#list-article-commit').addClass('box-placeholder')
            $('#list-article-commit').addClass('placeholder')
            hotel_commits.RenderSorted()
        }
        else {
            CheckPrice();
        }
    }, 1000)
}
var hotel_commits = {
    Data: [],
    Nights:1,
    Initialization: function () {

        $('#list-article-commit').addClass('box-placeholder')
        $('#list-article-commit').addClass('placeholder')
        $('#list-article-commit-commit-label').hide()
        hotel_commits.dateSinglePicker($('.date-range-fromdate'))
        hotel_commits.dateSinglePicker($('.date-range-todate'))
        hotel_commits.RenderLocation()
        var str = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.Exclusive)
        if (str) {
            var input = JSON.parse(str)
            $('.date-range-fromdate').data('daterangepicker').setStartDate(input.fromdate);
            $('.date-range-todate').data('daterangepicker').setStartDate(input.todate);
            hotel_commits.RenderListing(input)
          
        } else {
            var today = new Date()
            var fromdate = ("0" + today.getDate()).slice(-2) + '/' + ("0" + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
            var tommorow = new Date()
            tommorow.setDate(tommorow.getDate() + 1);
            var todate = ("0" + tommorow.getDate()).slice(-2) + '/' + ("0" + (tommorow.getMonth() + 1)).slice(-2) + '/' + tommorow.getFullYear()
            $('.date-range-fromdate').data('daterangepicker').setStartDate(fromdate);
            $('.date-range-todate').data('daterangepicker').setStartDate(todate);
            var input = {
                id: $('#listing-filter-location').find(':selected').val().split('-')[0],
                type: $('#listing-filter-location').find(':selected').val().split('-')[1],
                name: $('#listing-filter-location').find(':selected').text(),
                fromdate: $('.date-range-fromdate').val(),
                todate: $('.date-range-todate').val(),
            }
            hotel_commits.RenderListing(input)

        }
        hotel_commits.DynamicBind()
         CheckPrice()
    },
    DynamicBind: function () {
        $("body").on('click', ".search-location", function () {
            $('#list-article-commit').addClass('box-placeholder')
            $('#list-article-commit').addClass('placeholder')
            var element = $(this)
            var input = {
                id: element.attr('data-id'),
                type: element.attr('data-type'),
                name: element.attr('data-name'),
                fromdate: $('.date-range-fromdate').val(),
                todate: $('.date-range-todate').val(),
            }
            $('.commit-location-select').removeClass('active')
            element.addClass('active')
            hotel_commit_listing.Data = []
            hotel_commit_listing.RenderListing(input)
            CheckPrice()
        });
        $("body").on('click', ".hotel-commit-name", function () {
            var element = $(this)
            hotel_commits.searchHotel(element.closest('.hotel-commit-item'))

        });
        $("body").on('apply.daterangepicker', ".date-range-fromdate", function (ev, picker) {
            hotel_commits.OnApplyStartDateOfBookingRange($('.date-range-fromdate'), $('.date-range-todate'));

        });
    },
    RenderLocation: function () {
        var html = ''
        _ajax_caller.post('/hotel/GetHotelExclusiveFilter', {}, function (result) {
            if (result.isSuccess) {
                $(result.data).each(function (index, item) {
                    html += `<option value="${item.id} - ${item.type}">${item.name}</option>`
                });
            }
            $('#listing-filter-location').html(html)

            $('#listing-filter-location').select2({
                //minimumResultsForSearch: Infinity
            });
            var str = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.Exclusive)
            if (str) {
                var input = JSON.parse(str)
                let long_name = input.name;
                let $element = $('#listing-filter-location')
                let val = $element.find("option:contains('" + long_name + "')").val()
                $element.val(val).trigger('change.select2');
            }
        });
      
       
    },
    RenderListing: function (input) {
        sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.Exclusive, JSON.stringify(input))
        let input_2 = JSON.parse(JSON.stringify(input));
        input_2.fromdate = hotel_commits.ConvertToDateDotnet(input_2.fromdate)
        input_2.todate = hotel_commits.ConvertToDateDotnet(input_2.todate)
        var arrival_date_split = input.fromdate.split('/')
        var departure_date_split = input.todate.split('/')
        var arrival_date_day = new Date(arrival_date_split[2], parseInt(arrival_date_split[1] - 1), arrival_date_split[0], 0, 0, 0, 0);
        var departure_date_day = new Date(departure_date_split[2], parseInt(departure_date_split[1] - 1), departure_date_split[0], 0, 0, 0, 0);
        const diffTime = Math.abs(departure_date_day - arrival_date_day);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        hotel_commits.Nights = diffDays;

        _ajax_caller.post('/hotel/GetHotelCommit', { request_model: input_2 }, function (result) {
            var html = ''

            if (result.isSuccess) {
                hotel_commits.Data = result.data
                $(result.data).each(function (index, item) {
                    html += hotel_constants.HTML.CommitArticle
                        //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                        .replaceAll('{city}', item.street)
                        .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                        .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                        .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                        .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commits.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                        .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                        .replaceAll('{hotel_id}', item.hotel_id)
                        .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                        .replaceAll('{hotel_hotel_type}', item.is_vin_hotel )
                        .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                //    if (count >= hotel_constants.CONSTATNTS.ExclusiveLimit) return false
                });

                $('#list-article-commit').html(html);
                hotel_commits.CalucateDetail(input_2, diffDays)
                $('#list-article-commit').removeClass('box-placeholder')
                $('#list-article-commit').removeClass('placeholder')
            }
            else {
                $('#list-article-commit').html(html);

            }
        });
    },
    CalucateDetail: function (input_2, diffDays) {
        $('.hotel-commit-item').each(function (index, item) {
            var element = $(this)
            var input = JSON.parse(JSON.stringify(input_2))
            input.hotelid = element.attr('data-id')
            input.is_vin_hotel = element.attr('data-hotel-type') =='true'

            _ajax_caller.post('/hotel/GetHotelCommitDetail', { request_model: input }, function (result_detail) {
                if (result_detail.isSuccess) {
                    var min_price = result_detail.data.min_price;
                    element.attr('data-amount', min_price)
                    var show_price = hotel_commits.Comma(Math.round(min_price / diffDays, 0))
                    element.find('.price-new').html(min_price <= 0 ? 'Giá liên hệ' : show_price + ' đ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    if (min_price > 0) element.find('.gray').show()
                    hotel_commits.Data.find(x => x.hotel_id == input.hotelid).min_price = min_price
                }
                else {
                    element.find('.price-new').html('Giá liên hệ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    hotel_commits.Data.find(x => x.hotel_id == input.hotelid).min_price = min_price
                }
                hotel_commits.Data.find(x => x.hotel_id == input.hotelid).finished = "finished"
            })
            
        });

    },
    searchHotel: function (element) {
        let fromDate = ConvertToDate($('.date-range-fromdate').val());
        let toDate = ConvertToDate($('.date-range-todate').val());

        let room_datas = [{
            room: 1,
            number_adult: 1,
            number_child: 0,
            number_infant: 0
        }];
        var obj = {
            arrivalDate: ConvertJsDateToString(fromDate, "YYYY-MM-DD"),
            departureDate: ConvertJsDateToString(toDate, "YYYY-MM-DD"),
            hotelID: element.attr('data-id'),
            hotelName: element.attr('data-name'),
            isVinHotel: element.attr('data-hotel-type'),
            rooms: room_datas,
            productType:0
        };
        var filter = JSON.stringify(obj);
        localStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.CACHE_OBJECT_SEARCH);
        localStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.CACHE_SUGGEST_SEARCH);

        var str = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.Exclusive)
        if (str) {
            var input = JSON.parse(str)
            room_datas = input.room
        } 

       

        window.location.href = `/hotel?filter=${encodeURIComponent(filter)}`;


    },
   
    RenderSorted: function () {
        var diffDays = hotel_commits.Nights
      
        var has_price_commit = hotel_commits.Data.filter(x => x.min_price > 0 && x.is_commit == true)
        has_price_commit = has_price_commit.sort((a, b) => (a.min_price - b.min_price));
        var no_price_commit = hotel_commits.Data.filter(x => x.min_price <= 0 && x.is_commit == true)
        var html_commit=''
        $(has_price_commit).each(function (index, item) {
            var html_star = ''
            for (var i = 0; i < item.star; i++) {
                html_star += hotel_constants.HTML.Star
            }
            html_commit += hotel_constants.HTML.CommitArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commits.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                .replaceAll('{amount_number}', item.min_price)

        });
        $(no_price_commit).each(function (index, item) {
            var html_star = ''
            for (var i = 0; i < item.star; i++) {
                html_star += hotel_constants.HTML.Star
            }
            html_commit += hotel_constants.HTML.CommitArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commits.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                .replaceAll('{amount_number}', item.min_price)

        });
        
       
        $('#list-article-commit').html(html_commit);
        $('#list-article-commit').removeClass('box-placeholder')
        $('#list-article-commit').removeClass('placeholder')
        $('.hotel-commit-item').each(function (index, item) {
            var item_element = $(this)
            item_element.find('.price-new').removeClass('box-placeholder')
            item_element.find('.price-new').removeClass('placeholder')
        });
    },
    dateSinglePicker: function (element) {
        $(element).daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            locale: hotel_commits.local_date_picker
        });
    },
    local_date_picker: {
        "format": 'DD/MM/YYYY',//HH:mm:SS
        "applyLabel": "Áp dụng",
        "cancelLabel": "Xóa",
        "daysOfWeek": [
            "CN",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7"
        ],
        "monthNames": [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12"
        ],
        "firstDay": 1
    },
    Comma: function (number) { //function to add commas to textboxes
        number = ('' + number).replace(/[^0-9.,]+/g, '');
        number += '';
        number = number.replaceAll(',', '');
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;
    },
    GetDayText: function (date, donetdate = false) {
        if (donetdate) {
            return ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear();
        }
        return date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);

    },
    ConvertToDateDotnet: function (text) {
        var split_date = text.split('/')
        return split_date[1] + '/' + split_date[0] + '/' + split_date[2]
    },
    OnApplyStartDateOfBookingRange: function (start_date_element, end_date_element) {

        var today = new Date();
        var yyyy = today.getFullYear();
        var yyyy_max = yyyy + 3;
        var max_range = '31/12/' + yyyy_max;
        var element_date = start_date_element.data('daterangepicker').startDate._d
        element_date.setDate(element_date.getDate() + 1);

        var min_range = ("0" + element_date.getDate()).slice(-2) + '/' + ("0" + (element_date.getMonth() + 1)).slice(-2) + '/' + element_date.getFullYear()
        end_date_element.daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            minDate: min_range,
            maxDate: max_range,
            locale: hotel_commits.local_date_picker
        }, function (start, end, label) {


        });
        if (element_date > today) {
            end_date_element.data('daterangepicker').setStartDate(start_date_element.val());
        }
    },
}
    