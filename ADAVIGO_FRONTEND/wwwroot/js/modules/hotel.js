var _hotel_search = {
    CACHE_OBJECT_SEARCH: "CACHE_OBJECT_SEARCH",
    CACHE_SUGGEST_SEARCH: "CACHE_SUGGEST_SEARCH",
    CACHE_DETAIL_hotel_search: "CACHE_DETAIL_hotel_search",

    changeImageUrl: function () {
        $('#hotel__filter_listing .article-itemt').each(function () {
            var item = $(this);
            var list_image = [];

            item.find('img.img_rechange_url').each(function () {
                list_image.push($(this).data('url'));
            });

            var hotel_type = parseInt($('.hotel_tab_type.active').data('id'));

            if (hotel_type == 0) {
                for (var i = 0; i < list_image.length; i++) {
                    item.find(`img.img_rechange_url:eq(${i})`).attr('src', `${list_image[i]}`);
                }
            } else {
                _ajax_caller.post("/hotel/GetBlockedImageUrl", { url_images: list_image }, function (result) {
                    let data_images = result.data;
                    for (var i = 0; i < data_images.length; i++) {
                        item.find(`img.img_rechange_url:eq(${i})`).attr('src', data_images[i]);
                    }
                });
            }
        });
    },

    CacheSearchData: function () {
        let fromDate = ConvertToDate($('.date-range-fromdate').val());
        let toDate = ConvertToDate($('.date-range-todate').val());

        let room_datas = [];
        let valid_room = true;
        $('#block_room_search_content .line-bottom').each(function () {
            let seft = $(this);
            let num_adult = parseInt(seft.find('.adult .qty_input').val());
            if (num_adult <= 0) valid_room = false;

            room_datas.push({
                room: seft.data('room'),
                number_adult: num_adult,
                number_child: parseInt(seft.find('.baby .qty_input').val()),
                number_infant: parseInt(seft.find('.infant .qty_input').val())
            });
        });

        if (!valid_room) {
            return;
        }
        var hotel_search_type = 0
        $('.hotel_tab_type').each(function () {
            var tab_type = $(this)
            if (tab_type.hasClass('active')) {
                hotel_search_type = tab_type.attr('data-id')
                return false
            }

        });
        var obj = {
            arrivalDate: ConvertJsDateToString(fromDate, "DD/MM/YYYY"),
            departureDate: ConvertJsDateToString(toDate, "DD/MM/YYYY"),
            hotelID: $('#input__search-hotel-id').val(),
            hotelName: $('#input__suggest-hotel').attr('keyword') == undefined || $('#input__suggest-hotel').attr('keyword').trim() == '' ? $('#input__suggest-hotel').val() : $('#input__suggest-hotel').attr('keyword'),
            productType: $('#input__search-hotel-type').val(),
            rooms: room_datas,
            isVinHotel: hotel_search_type == 1 ? true : false,
        };

        if (obj.arrivalDate === "" || obj.departureDate === "") {
            return;
        }

        if (obj.rooms.length <= 0) {
            return;
        }

        localStorage.removeItem(_hotel.CACHE_OBJECT_SEARCH);
        localStorage.setItem(_hotel.CACHE_OBJECT_SEARCH, JSON.stringify(obj));

       
    },

    initSlideRange: function () {
        $('.noUi-handle').on('click', function () {
            $(this).width(50);
        });

        let min = parseInt($('#hotel__filter_min_value').val());
        let max = parseInt($('#hotel__filter_max_value').val());

        if (max <= 0) max = 10000000;
        if (min >= max) min = 0;
        var rangeSlider = document.getElementById('slider-range');
        var moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            // prefix: 'VNĐ'
        });

        noUiSlider.create(rangeSlider, {
            start: [min, max],
            step: 1,
            range: {
                'min': [min],
                'max': [max]
            },
            format: moneyFormat,
            connect: true
        });

        // Set visual min and max values and also update value hidden form inputs
        rangeSlider.noUiSlider.on('update', function (values, handle) {
            document.getElementById('slider-range-value1').innerHTML = values[0];
            document.getElementById('slider-range-value2').innerHTML = values[1];
            document.getElementsByName('min-value').value = moneyFormat.from(values[0]);
            document.getElementsByName('max-value').value = moneyFormat.from(values[1]);
        });
    },

    loadPriceData: function () {
         var hotel_type = parseInt($('.hotel_tab_type.active').data('id'));
        if (hotel_type == 0) {
            $(`#hotel__filter_listing .article-itemt .price-new`).removeClass('placeholder');
            return;
        };

        let cache_id = $('#hotel_grid_cache_search').val();
        let fromDate = ConvertToDate($('.date-range-fromdate').val());
        let toDate = ConvertToDate($('.date-range-todate').val());
        const diffTime = Math.abs(toDate - fromDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var nights = diffDays <= 1 ? 1 : diffDays
        _ajax_caller.get("/hotel/GetHotelPrice", { cacheId: cache_id }, function (result) {
            if (result.isSuccess) {
                if (result.data.length <= 0) return;
                for (let item of result.data) {
                    let item_element = $(`#hotel__filter_listing .article-itemt[data-id="${item.hotel_id}"] .price-new`);
                    if (item.min_price > 0) {
                        item_element.html(`${Math.round(item.min_price / nights).toLocaleString()} đ`)
                        $(`#hotel__filter_listing .article-itemt[data-id="${item.hotel_id}"] .per-nights`).show()
                    } else {
                        item_element.html(`Giá liên hệ`)

                    }
                    item_element.removeClass('placeholder');
                }
            }
        });
    },

    loadFilterData: function () {
        let cache_id = $('#hotel_grid_cache_search').val();
        let filter_grid = $('.col-left');
        filter_grid.addClass('placeholder');
        _ajax_caller.get("/hotel/GetHotelFilter", { cacheId: cache_id }, function (result) {
            filter_grid.html(result);
            filter_grid.removeClass('placeholder');
            if (filter_grid.children().length > 0) {
                _hotel_search.initSlideRange();
            }
        });
    },

    initDateRange: function (fromDateElement, toDateElement) {
        var str_start_date = $(`${fromDateElement}`).val();
        var str_end_date = $(`${toDateElement}`).val();

        $(`${fromDateElement},${toDateElement}`).daterangepicker({
            autoUpdateInput: false,
            autoApply: true,
            minDate: new Date(),
            startDate: moment(str_start_date, 'DD/MM/YYYY').toDate(),
            endDate: moment(str_end_date, 'DD/MM/YYYY').toDate(),
            locale: {
                "format": 'DD/MM/YYYY',
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
            }
        }, function (start, end, label) {
            _hotel_search.applyDaterange(fromDateElement, toDateElement, start, end);
        }).on('apply.daterangepicker', function (ev, picker) {
            _hotel_search.applyDaterange(fromDateElement, toDateElement, picker.startDate, picker.endDate);
        }).on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
    },

    applyDaterange: function (fromDateElement, toDateElement, startDate, endDate) {
      //  console.log(startDate);
       // console.log(endDate);

        $(fromDateElement).val(startDate.format('DD/MM/YYYY')).change();
        $(toDateElement).val(endDate.format('DD/MM/YYYY')).change();

        $(fromDateElement).data('daterangepicker').setStartDate(startDate);
        $(fromDateElement).data('daterangepicker').setEndDate(endDate);

        $(toDateElement).data('daterangepicker').setStartDate(startDate);
        $(toDateElement).data('daterangepicker').setEndDate(endDate);

        var day_count = Math.round((endDate - startDate) / 86400000 - 1) ;
        $(fromDateElement).closest('.date-w').find('.note .day_count').html(day_count);
    },

    appendRoomSearch: function (room_number) {

        let box_input_group = `
        <div class="sl_giohang">
            <div class="input-group-prepend">
                <button class="giam_sl minus-btn">-</button>
            </div>
            <input type="text" class="qty_input" value="0" min="0" disabled>
            <div class="input-group-prepend">
                <button class="tang_sl plus-btn">+</button>
            </div>
        </div>`;

        let box_input_group_adult = `
        <div class="sl_giohang">
            <div class="input-group-prepend">
                <button class="giam_sl minus-btn">-</button>
            </div>
            <input type="text" class="qty_input" value="1" min="0" disabled>
            <div class="input-group-prepend">
                <button class="tang_sl plus-btn">+</button>
            </div>
        </div>`;

        let html_room = `
        <div class="line-bottom mb8 pb8" data-room="${room_number}">
            <div class="bold mb5">Phòng ${room_number}</div>
            <div class="row">
                <div class="col-4 text-center adult">
                    ${box_input_group_adult}
                    <div class="color-gray txt_13">Người lớn</div>
                </div>
                <div class="col-4 text-center baby">
                    ${box_input_group}
                    <div class="color-gray txt_13">Trẻ em <br>(4-12 tuổi)</div>
                </div>
                <div class="col-4 text-center infant">
                    ${box_input_group}
                    <div class="color-gray txt_13">Em bé <br>(0-4 tuổi)</div>
                </div>
            </div>
        </div>`;

        $('#block_room_search_content').append(html_room);
    },

    redirectToDetail: function (element) {
        let seft_parent = $(element).closest('.article-itemt');
        let objSearch = localStorage.getItem(_hotel_search.CACHE_OBJECT_SEARCH);

        let obj = JSON.parse(objSearch);
        obj.hotelID = seft_parent.data('id');
        obj.hotelName = seft_parent.find('.hotel_name').val();
        obj.address = seft_parent.find('.hotel_address').val();
        obj.telephone = seft_parent.find('.hotel_phone').val();
        obj.email = seft_parent.find('.hotel_email').val();

        //_ajax_caller.post('/hotel/GetTokenDetail', { model: obj }, function (result) {
        //    window.location.href = `/hotel/detail?token=${result.data}`;
        //});

        window.location.href = `/hotel/detail?filter=${encodeURIComponent(JSON.stringify(obj))}`;
    },
    getUrlParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }
};



$(document).ready(function () {
    var filter = _hotel_search.getUrlParameter('filter')
    if (filter) {
        var json_obj = JSON.parse(filter)
        if (json_obj != undefined) {
            $('#input__suggest-hotel').val(json_obj.hotelName);
            $('#input__search-hotel-id').val(json_obj.hotelID);
            $('#input__search-hotel-type').val(json_obj.productType);
        }
    }
    _hotel_search.initDateRange('.date-range-fromdate', '.date-range-todate');
    _ui_common.toggleFocusOut('#collapseGuest');
    _ui_common.toggleFocusOut('#block__suggest-hotel');

    let quick_search = $("#hotel_quick_search").val();


    $('#fund_hotel_search_holder').find('.head-title').hide()
    $('#fund_hotel_search_holder').find('.gray').hide()
    $('#fund_hotel_search_holder').find('.align-center').hide()
    $('#fund_hotel_search_holder').find('.fund-list').hide()
    $('#hotel_fund_data_holder').find('.col-300').hide()
    //$('#hotel_fund_data_holder').hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 200) {
            $('#to_top').fadeIn();
            $('.wrap-search').addClass('sticky');
        } else {
            $('#to_top').fadeOut();
            $('.wrap-search').removeClass('sticky');
        }
    });

    //$('.item_vin_filter').prop('disabled', true);
    //$('.item_vin_filter').addClass('gray');
    _hotel_search.changeImageUrl();
    _hotel_search.loadPriceData();
    _hotel_search.loadFilterData();
    _hotel_search.CacheSearchData();
});
