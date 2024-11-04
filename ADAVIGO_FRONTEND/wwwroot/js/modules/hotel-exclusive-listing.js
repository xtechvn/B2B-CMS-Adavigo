$(document).ready(function () {
    hotel_exclusive_listing.Initialization()

})

function CheckPrice() {
    setTimeout(function () {
        var finished = hotel_exclusive_listing.Data.length > 0 && hotel_exclusive_listing.Data.some((x) => x.finished == undefined) ? false : true;
        if (hotel_exclusive_listing.Data.length > 0 && finished) {
            $('#list-article-exclusive').addClass('box-placeholder')
            $('#list-article-exclusive').addClass('placeholder')
            hotel_exclusive_listing.RenderSorted()
        }
        else {
            CheckPrice();
        }
    }, 1000)
}
var hotel_exclusive_listing = {
    Data: [],
    Nights:1,
    Initialization: function () {
        $('#list-article-exclusive').addClass('box-placeholder')
        $('#list-article-exclusive').addClass('placeholder')
        hotel_exclusive_listing.RenderLocation()
        $('#hotel_fund_data_holder').find('.list-article').css('overflow', 'hidden')
        $('#hotel_fund_data_holder').find('.list-article').css('max-height', '450px')
        $('#hotel_fund_data_holder').find('.list-article').css('overflow-x', 'hidden')
        hotel_exclusive_listing.DynamicBind()
        CheckPrice()

    },
    DynamicBind: function () {
        $("body").on('click', ".exclusive-location-select", function () {
            $('#list-article-exclusive').addClass('box-placeholder')
            $('#list-article-exclusive').addClass('placeholder')
            var element = $(this)
            var input = {
                id: element.attr('data-id'),
                type: element.attr('data-type'),
                name: element.attr('data-name'),
                fromdate: $('.date-range-fromdate').val(),
                todate: $('.date-range-todate').val(),
            }
            $('.exclusive-location-select').removeClass('active')
            element.addClass('active')
            hotel_exclusive_listing.Data = []
            hotel_exclusive_listing.RenderListing(input)
            CheckPrice()

        });
        $("body").on('click', ".hotel-exclusive-name", function () {
            var element = $(this)
            hotel_exclusive_listing.searchHotel(element.closest('.hotel-exclusive-item'))

        });
        $("body").on('click', ".view-more-exclusive", function () {
            hotel_exclusive_listing.ViewMoreExclusive()
        });
    },
    RenderLocation: function () {
        var html = ''
        var input = {}
        $(hotel_constants.CONSTATNTS.ExclusiveLocation).each(function (index, item) {

            html += `<a href="javascript:;" class="exclusive-location-select ${(index <= 0 ? 'active' : '')}" data-id="${item.id}" data-type="${item.type}"data-name="${item.name}" title="javascript:;">${item.name}</a>`
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
        $('#list-location-exclusive').html(html)
        $('#list-location-exclusive').removeClass('box-placeholder')
        $('#list-location-exclusive').removeClass('placeholder')

        hotel_exclusive_listing.RenderListing(input)
    },
    RenderListing: function (input) {
        let input_2 = JSON.parse(JSON.stringify(input));

        input_2.fromdate = hotel_exclusive_listing.ConvertToDateDotnet(input_2.fromdate)
        input_2.todate = hotel_exclusive_listing.ConvertToDateDotnet(input_2.todate)
        var arrival_date_split = input.fromdate.split('/')
        var departure_date_split = input.todate.split('/')
        var arrival_date_day = new Date(arrival_date_split[2], parseInt(arrival_date_split[1] - 1), arrival_date_split[0], 0, 0, 0, 0);
        var departure_date_day = new Date(departure_date_split[2], parseInt(departure_date_split[1] - 1), departure_date_split[0], 0, 0, 0, 0);

        const diffTime = Math.abs(departure_date_day - arrival_date_day);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        hotel_exclusive_listing.Nights = diffDays;
        var htmlp1 = ""
        var htmlp2 = ""
        var htmlp3 = ""
        var htmlp4 = ""
        var htmlp5 = ""
        var htmlp6 = ""
        var htmlp7 = ""
        var htmlp8 = ""

        var htmlerr = `<div class="o-media__body px-0 mx-0" style="width: 250px;">
                    <div class="o-vertical-spacing">
                        <h3 class="blog-post__headline">
                            <span class="skeleton-box" style="width:55%;"></span>
                        </h3>
                        <p>
                            <span class="skeleton-box" style="width:80%;"></span>
                            <span class="skeleton-box" style="width:90%;"></span>
                            <span class="skeleton-box" style="width:83%;"></span>
                            <span class="skeleton-box" style="width:80%;"></span>
                        </p>
                        <div class="blog-post__meta">
                            <span class="skeleton-box" style="width:70px;"></span>
                        </div>
                    </div>
                </div>`
        //ko theo vị trí
        //_ajax_caller.post('/hotel/GetExclusiveHotel', { request_model: input_2 }, function (result) {
        //    var html = ''
        //    if (result.isSuccess) {
        //        var count = 0
        //        $(result.data).each(function (index, item) {
        //            html += hotel_constants.HTML.ExclusiveArticle
        //                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
        //                .replaceAll('{city}', item.street)
        //                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
        //                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
        //                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
        //                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
        //                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
        //                .replaceAll('{hotel_id}', item.hotel_id)
        //                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
        //                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel )
        //                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
        //            count++
        //            hotel_exclusive_listing.Data.push(item)
        //            if (count >= hotel_constants.CONSTATNTS.ExclusiveLimit) return false
        //        });

        //        $('#list-article-exclusive').html(html);
        //        hotel_exclusive_listing.CalucateDetail(input_2, diffDays)
        //        $('#list-article-exclusive').removeClass('box-placeholder')
        //        $('#list-article-exclusive').removeClass('placeholder')
        //    }
        //    else {
        //        $('#list-article-exclusive').html(html);

        //    }
        //});

        //theo vị trí
        _ajax_caller.post('/hotel/GetExclusiveHotelPosition', { request_model: input_2 }, function (result) {
            var htmlp1 = ""
            var htmlp2 = ""
            var htmlp3 = ""
            var htmlp4 = ""
            var htmlp5 = ""
            var htmlp6 = ""
            var htmlp7 = ""
            var htmlp8 = ""
            var html = ''
            var htmlerr = `<div class="o-media__body px-0 mx-0" style="width: 250px;">
                    <div class="o-vertical-spacing">
                        <h3 class="blog-post__headline">
                            <span class="skeleton-box" style="width:55%;"></span>
                        </h3>
                        <p>
                            <span class="skeleton-box" style="width:80%;"></span>
                            <span class="skeleton-box" style="width:90%;"></span>
                            <span class="skeleton-box" style="width:83%;"></span>
                            <span class="skeleton-box" style="width:80%;"></span>
                        </p>
                        <div class="blog-post__meta">
                            <span class="skeleton-box" style="width:70px;"></span>
                        </div>
                    </div>
                </div>`
            if (result.isSuccess) {
                var count = 0
                $(result.data).each(function (index, item) {
                    count++
                    switch (parseFloat(item.position)) {
                        case 1: {
                            htmlp1 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 2: {
                            htmlp2 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 3: {
                            htmlp3 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 4: {
                            htmlp4 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 5: {
                            htmlp5 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 6: {
                            htmlp6 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 7: {
                            htmlp7 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        case 8: {
                            htmlp8 = hotel_constants.HTML.ExclusiveArticle
                                //.replaceAll('{city}', item.city == null || item.city == undefined ? (item.state == null || item.state == undefined ? item.street : item.state) : item.city)
                                .replaceAll('{city}', item.street)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                                .replaceAll('{hotel_id}', item.hotel_id)
                                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
                            break;
                        }
                        default: {

                        }
                            break;

                    }
              
                  
                    hotel_exclusive_listing.Data.push(item)
                    if (count >= hotel_constants.CONSTATNTS.ExclusiveLimit) return false
                });
                html = (htmlp1 == "" ? htmlerr : htmlp1) + (htmlp2 == "" ? htmlerr : htmlp2) + (htmlp3 == "" ? htmlerr : htmlp3) + (htmlp4 == "" ? htmlerr : htmlp4) + (htmlp5 == "" ? htmlerr : htmlp5) + (htmlp6 == "" ? htmlerr : htmlp6) + (htmlp7 == "" ? htmlerr : htmlp7) + (htmlp8 == "" ? htmlerr : htmlp8)

                $('#list-article-exclusive').html(html);
                hotel_exclusive_listing.CalucateDetail(input_2, diffDays)
                $('#list-article-exclusive').removeClass('box-placeholder')
                $('#list-article-exclusive').removeClass('placeholder')
            }
            else {
                $('#list-article-exclusive').html(html);

            }
        });
    },
    CalucateDetail: function (input_2, diffDays) {
        $('.hotel-exclusive-item').each(function (index, item) {
            var element = $(this)
            var input = JSON.parse(JSON.stringify(input_2))
            input.hotelid = element.attr('data-id')
            _ajax_caller.post('/hotel/GetExclusiveHotelDetail', { request_model: input }, function (result_detail) {
                if (result_detail.isSuccess) {
                    var min_price = result_detail.data.min_price;
                    element.attr('data-amount', min_price)
                    var show_price = hotel_exclusive_listing.Comma(Math.round(min_price / diffDays, 0))
                    element.find('.price-new').html(min_price <= 0 ? 'Giá liên hệ' : show_price + ' đ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    if (min_price > 0) element.find('.gray').show()
                    hotel_exclusive_listing.Data.find(x => x.hotel_id == input.hotelid).min_price = min_price

                } else {
                    element.find('.price-new').html('Giá liên hệ')
                    element.find('.price-new').removeClass('box-placeholder')
                    element.find('.price-new').removeClass('placeholder')
                    hotel_exclusive_listing.Data.find(x => x.hotel_id == input.hotelid).min_price = 0

                }
                hotel_exclusive_listing.Data.find(x => x.hotel_id == input.hotelid).finished = "finished"

               var divArr = $('.hotel-exclusive-item')
                divArr.sort(function (a, b) {
                    if (!isNaN($(a).attr('data-amount')) && parseFloat($(a).attr('data-amount'))>0) return parseFloat($(a).attr('data-amount')) < parseFloat($(b).attr('data-amount')) ? -1 : 1;
                    else {
                        return 1
                    }
                })
/*                $('#list-article-exclusive').html(divArr)*/
            })

        });
      
    },
     
    RenderSorted: function () {
        var diffDays =hotel_exclusive_listing.Nights
        var has_price = hotel_exclusive_listing.Data.filter(x => x.min_price > 0 )
        has_price = has_price.sort((a, b) => (a.min_price - b.min_price));
        var no_price = hotel_exclusive_listing.Data.filter(x => x.min_price <= 0 )
        
        var html=''
       
        $(has_price).each(function (index, item) {
            var html_star = ''
            for (var i = 0; i < item.star; i++) {
                html_star += hotel_constants.HTML.Star
            }
            html += hotel_constants.HTML.ExclusiveArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
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
            html += hotel_constants.HTML.ExclusiveArticle
                .replaceAll('{city}', item.street)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{name}', item.name == null || item.name == undefined ? '' : item.name)
                .replaceAll('{thumb}', item.img_thumb == null || item.img_thumb == undefined || item.img_thumb.length <= 0 ? '/images/graphics/thumb1.jpg' : item.img_thumb[0])
                .replaceAll('{amount}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'Giá liên hệ' : hotel_exclusive_listing.Comma(Math.round(item.min_price / diffDays, 0)) + ' đ')
                .replaceAll('{display}', item.min_price == null || item.min_price == undefined || item.min_price <= 0 ? 'display:none;' : '')
                .replaceAll('{hotel_id}', item.hotel_id)
                .replaceAll('{star}', hotel_constants.RenderStar(item.star))
                .replaceAll('{hotel_hotel_type}', item.is_vin_hotel)
                .replaceAll('{hotel_type}', item.hotel_type == null || item.hotel_type == undefined || item.hotel_type.trim() == '' ? 'Khách sạn' : item.hotel_type)
        });

       
        $('#list-article-exclusive').html(html);

        $('#list-article-exclusive').removeClass('box-placeholder')
        $('#list-article-exclusive').removeClass('placeholder')
        $('.hotel-exclusive-item').each(function (index, item) {
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
    ViewMoreExclusive: function () {
        var element = undefined
        $('.exclusive-location-select').each(function (index, item) {
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
            var element = $('.exclusive-location-select')
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
        window.location.href = '/Hotel/HotelExclusives'

    }
}
