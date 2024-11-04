$(document).ready(function () {
    hotel_commit_listing.Initialization()

})

function CheckPriceCommit() {
    setTimeout(function () {
        var finished = hotel_commit_listing.Data.length > 0 && hotel_commit_listing.Data.some((x) => x.finished == undefined) ? false : true;
        if (hotel_commit_listing.Data.length > 0 && finished) {
            $('#list-article-commit').addClass('box-placeholder')
            $('#list-article-commit').addClass('placeholder')
            hotel_commit_listing.RenderSorted()
        }
        else {
            CheckPrice();
        }
    }, 1000)
}
var hotel_commit_listing = {
    Data: [],
    Nights:1,
    Initialization: function () {
        $('#list-article-commit').addClass('box-placeholder')
        $('#list-article-commit').addClass('placeholder')
        hotel_commit_listing.RenderLocation()
        $('#hotel_fund_data_holder').find('.list-article').css('overflow', 'hidden')
        $('#hotel_fund_data_holder').find('.list-article').css('max-height', '450px')
        $('#hotel_fund_data_holder').find('.list-article').css('overflow-x', 'hidden')
        hotel_commit_listing.DynamicBind()
        CheckPriceCommit()

    },
    DynamicBind: function () {
        $("body").on('click', ".commit-location-select", function () {
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
            CheckPriceCommit()

        });
        $("body").on('click', ".hotel-commit-name", function () {
            var element = $(this)
            hotel_commit_listing.searchHotel(element.closest('.hotel-commit-item'))

        });
        $("body").on('click', ".view-more-commit", function () {
            hotel_commit_listing.ViewMorecommit()
        });
    },
    RenderLocation: function () {
        var html = ''
        $(hotel_constants.CONSTATNTS.CommitLocation).each(function (index, item) {

            html += `<a href="javascript:;" class="commit-location-select ${(index <= 0 ? 'active' : '')}" data-id="${item.id}" data-type="${item.type}"data-name="${item.name}" title="javascript:;">${item.name}</a>`
            if (index <= 0) {
                input = {
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    fromdate: $('.date-range-fromdate').val(),
                    todate: $('.date-range-todate').val(),
                }
            }
        });
        $('#list-location-commit').html(html)
        $('#list-location-commit').removeClass('box-placeholder')
        $('#list-location-commit').removeClass('placeholder')
        hotel_commit_listing.RenderListing(input)

        //_ajax_caller.post('/hotel/GetHotelCommitLocation', {id:'-1'}, function (result) {
        //    if (result.isSuccess) {
        //        var count = 0
        //        $(result.data).each(function (index, item) {
        //            html += `<a href="javascript:;" class="commit-location-select ${(index <= 0 ? 'active' : '')}" data-id="${item.id}" data-type="1"data-name="${item.name}" title="javascript:;">${item.name}</a>`
        //            if (index <= 0) {
        //                input = {
        //                    id: item.id,
        //                    type:1,
        //                    name: item.name,
        //                    fromdate: $('.date-range-fromdate').val(),
        //                    todate: $('.date-range-todate').val(),
        //                }
        //            }
        //        });
        //        $('#list-location-commit').html(html)
        //        $('#list-location-commit').removeClass('box-placeholder')
        //        $('#list-location-commit').removeClass('placeholder')
        //        hotel_commit_listing.RenderListing(input)

        //    }
        //    else {
        //        $(hotel_constants.CONSTATNTS.ExclusiveLocation).each(function (index, item) {

        //            html += `<a href="javascript:;" class="commit-location-select ${(index <= 0 ? 'active' : '')}" data-id="${item.id}" data-type="${item.type}"data-name="${item.name}" title="javascript:;">${item.name}</a>`
        //            if (index <= 0) {
        //                input = {
        //                    id: item.id,
        //                    type: item.type,
        //                    name: item.name,
        //                    fromdate: $('.date-range-fromdate').val(),
        //                    todate: $('.date-range-todate').val(),
        //                }
        //            }
        //        });
        //        $('#list-location-commit').html(html)
        //        $('#list-location-commit').removeClass('box-placeholder')
        //        $('#list-location-commit').removeClass('placeholder')
        //        hotel_commit_listing.RenderListing(input)

        //    }
        //});
      

    },
    RenderListing: function (input) {
        let input_2 = JSON.parse(JSON.stringify(input));
        $('#list-article-commit').addClass('box-placeholder')
        $('#list-article-commit').addClass('placeholder')
        input_2.fromdate = hotel_commit_listing.ConvertToDateDotnet(input_2.fromdate)
        input_2.todate = hotel_commit_listing.ConvertToDateDotnet(input_2.todate)
        var arrival_date_split = input.fromdate.split('/')
        var departure_date_split = input.todate.split('/')
        var arrival_date_day = new Date(arrival_date_split[2], parseInt(arrival_date_split[1] - 1), arrival_date_split[0], 0, 0, 0, 0);
        var departure_date_day = new Date(departure_date_split[2], parseInt(departure_date_split[1] - 1), departure_date_split[0], 0, 0, 0, 0);

        const diffTime = Math.abs(departure_date_day - arrival_date_day);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        hotel_commit_listing.Nights = diffDays;

        _ajax_caller.post('/hotel/GetHotelCommit', { request_model: input_2 }, function (result) {
            var html = ''
            if (result.isSuccess) {
                var count = 0
                $(result.data).each(function (index, item) {
                    html += hotel_constants.HTML.CommitArticle
                        //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                        .replaceAll('{city}', item.street)
                        .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                        .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                        .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                        .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commit_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                        .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                        .replaceAll('{hotel_id}', item.hotel_id)
                        .replaceAll('{star}', hotel_constants.RenderStar(item.star))

                        .replaceAll('{hotel_hotel_type}', item.is_vin_hotel )
                        .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                    count++
                    hotel_commit_listing.Data.push(item)
                    if (count >= hotel_constants.CONSTATNTS.CommitLimit) return false
                });

                $('#list-article-commit').html(html);
                hotel_commit_listing.CalucateDetail(input_2, diffDays)
                $('#list-article-commit').removeClass('box-placeholder')
                $('#list-article-commit').removeClass('placeholder')
                //if (!result.data || result.data.length <= 0) {
                //    $('#hotel_listings_commit').hide();
                //}

            }
            else {
                //$('#hotel_listings_commit').hide();
                $('#list-article-commit').html('');


            }
        });

    },
    CalucateDetail: function (input_2, diffDays) {
        $('.hotel-commit-item').each(function (index, item) {
            var element = $(this)
            var input = JSON.parse(JSON.stringify(input_2))
            input.hotelid = element.attr('data-id')
            _ajax_caller.post('/hotel/GetHotelCommitDetail', { request_model: input }, function (result_detail) {
                if (result_detail.isSuccess) {
                    var min_price = result_detail.data.min_price;
                    element.attr('data-amount', min_price)
                    var show_price = hotel_commit_listing.Comma(Math.round(min_price / diffDays, 0))
                    element.find('.price-new').html(min_price <= 0 ? 'Giá liên hệ' : show_price + ' đ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    if (min_price > 0) element.find('.gray').show()
                    hotel_commit_listing.Data.find(x => x.hotel_id == input.hotelid).min_price = min_price

                } else {
                    element.find('.price-new').html('Giá liên hệ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    hotel_commit_listing.Data.find(x => x.hotel_id == input.hotelid).min_price = 0

                }
                hotel_commit_listing.Data.find(x => x.hotel_id == input.hotelid).finished = "finished"

               var divArr = $('.hotel-commit-item')
                divArr.sort(function (a, b) {
                    if (!isNaN($(a).attr('data-amount')) && parseFloat($(a).attr('data-amount'))>0) return parseFloat($(a).attr('data-amount')) < parseFloat($(b).attr('data-amount')) ? -1 : 1;
                    else {
                        return 1
                    }
                })
                $('#list-article-commit').html(divArr)
            })

        });
      
    },
     
    RenderSorted: function () {
        var diffDays =hotel_commit_listing.Nights
       var has_price = hotel_commit_listing.Data.filter(x => x.min_price > 0 && x.is_commit != true)
        has_price = has_price.sort((a, b) => (a.min_price - b.min_price));
        var no_price = hotel_commit_listing.Data.filter(x => x.min_price <= 0 && x.is_commit != true)
        var has_price_commit = hotel_commit_listing.Data.filter(x => x.min_price > 0 && x.is_commit == true)
        var no_price_commit = hotel_commit_listing.Data.filter(x => x.min_price <= 0 && x.is_commit == true)
        var html=''
        var html_commit =''
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
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commit_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
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
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commit_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
        });
        $(has_price).each(function (index, item) {
            var html_star = ''
            for (var i = 0; i < item.star; i++) {
                html_star += hotel_constants.HTML.Star
            }
            html += hotel_constants.HTML.CommitArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commit_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
        });
        $(no_price).each(function (index, item) {
            var html_star = ''
            for (var i = 0; i < item.star; i++) {
                html_star += hotel_constants.HTML.Star
            }
            html += hotel_constants.HTML.CommitArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_commit_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
        });

        if (html_commit.trim() != '') {
            $('#list-article-commit-commit-label').show()
            $('#list-article-commit-commit').html(html_commit);
            $('#list-article-commit-commit').removeClass('box-placeholder')
            $('#list-article-commit-commit').removeClass('placeholder')
        }
        else {
            $('#list-article-commit').html(html);

            
        }
        $('#list-article-commit').removeClass('box-placeholder')
        $('#list-article-commit').removeClass('placeholder')
       
        $('.hotel-commit-item').each(function (index, item) {
            var item_element = $(this)
            item_element.find('.price-new').removeClass('box-placeholder')
            item_element.find('.price-new').removeClass('placeholder')
        });

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
            productType: 0

        };
        $('#input__search-hotel-id').val(element.attr('data-id'))
        $('#input__search-hotel-type').val(element.attr('data-hotel-type') == 'true' ? '1' : '0')
        $('.hotel_tab_type').each(function (index, item) {
            var element_2 = $(this)
            if (element.attr('data-hotel-type') == 'true' && element_2.attr('data-id') == '1') {
                $('.hotel_tab_type').removeClass('active')
                element_2.addClass('active')
                return false
            }
            if (element.attr('data-hotel-type') == 'false' && element_2.attr('data-id') == '0') {
                $('.hotel_tab_type').removeClass('active')
                element_2.addClass('active')
                return false
            }
        })
        $('#input__suggest-hotel').val(element.attr('data-name'))

        $('html,body').scrollTop(0);

        $('.btn__filter_hotel').click()
        //obj.address = "";
        //obj.telephone = "";
        //obj.email = "";
        //window.location.href = `/hotel/detail?filter=${encodeURIComponent(JSON.stringify(obj))}`;

    },
    ViewMorecommit: function () {
        var element = undefined
        $('.commit-location-select').each(function (index, item) {
            var element_2 = $(this)
            if (element_2.hasClass('active')) {
                element = element_2
                return false
            }
        })
        var room_datas = []
        var input = {}

        $('#block_room_search_content .line-bottom').each(function () {
            let seft2 = $(this);

            room_datas.push({
                room: seft2.data('room'),
                number_adult: seft2.find('.adult').find('.qty_input').val(),
                number_child: seft2.find('.child').find('.qty_input').val(),
                number_infant: seft2.find('.infant').find('.qty_input').val()
            })
        });
        if (element != undefined) {
            input = {
                id: element.attr('data-id'),
                type: element.attr('data-type'),
                name: element.attr('data-name'),
                fromdate: $('.date-range-fromdate').val(),
                todate: $('.date-range-todate').val(),
                room: room_datas
            }
        }
        else {
            var element = $('.commit-location-select')
            input = {
                id: element.attr('data-id'),
                type: element.attr('data-type'),
                name: element.attr('data-name'),
                fromdate: $('.date-range-fromdate').val(),
                todate: $('.date-range-todate').val(),
                room: room_datas
            }
        }
        sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.Exclusive, JSON.stringify(input));
        window.location.href = '/Hotel/HotelCommit'

    }
}
