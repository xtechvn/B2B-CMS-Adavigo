var _hotel = {
    CACHE_OBJECT_SEARCH: "CACHE_OBJECT_SEARCH",
    CACHE_SUGGEST_SEARCH: "CACHE_SUGGEST_SEARCH",
    CACHE_DETAIL_HOTEL: "CACHE_DETAIL_HOTEL",

    suggestInputHotel: function (query) {

        var hotel_type = $('.hotel_tab_type.active').data('id');

        if (query == null || query == '') {
            $('#input__suggest-hotel').parents('.form-search').removeClass('active');
            return;
        };
        $('.hotel_tab_type').each(function (index, item) {
            var element = $(item)
            if (element.hasClass('active')) {
                search_type = element.attr('data-id')
            }
        })

        _ajax_caller.get('/hotel/GetSuggestHotel', { textSearch: query, limit: 20, search_type: search_type }, function (result) {
            let html_data = "";
            if (result.isSuccess) {
                if (result.data.length > 0) {
                    result.data.forEach((item) => {
                        let arr_des = [];
                        if (item.state && item.state != null && item.state != "") arr_des.push(item.state);
                        if (item.city && item.city != null && item.city != "") arr_des.push(item.city);

                        var logo_image = "";
                        if (item.product_type == 0) {
                            logo_image =
                                `<a class="thumb_img thumb_5x5" href="#">
                                   <img src="${item.imagethumb}" alt="#">
                                </a>`;
                        } else {
                            logo_image =
                                `<a class="thumb_img thumb_5x5" href="#" style="background:#e9e9e9">
                                   <img src="/images/icons/location.svg" style="width:50%; height:50%; margin:auto" />
                                </a>`;
                        }

                        switch (item.product_type) {
                            case 0: {
                                html_data += `
                                <div class="article-itemt" data-id="${item.hotelid}" data-type="${item.product_type}">
                                    <div class="article-thumb">
                                       ${logo_image}
                                    </div>
                                    <div class="article-content">
                                        <h3 class="title_new">
                                            <a href="#">${item.name}</a>
                                        </h3>
                                        <div class="des">${(item.street != null && item.street != undefined ? item.street : '')}</div>
                                        <div class="tag">
                                           ${(item.typeofroom && item.typeofroom != null ? `<a>${item.typeofroom}</a>` : "")}</a>
                                        </div>
                                    </div>
                                </div>`;
                            } break;
                            case 1: {
                                html_data += `
                                <div class="article-itemt" data-id="${item.hotelid}" data-type="${item.product_type}">
                                    <div class="article-thumb">
                                       ${logo_image}
                                    </div>
                                    <div class="article-content">
                                        <h3 class="title_new">
                                            <a href="#">${item.name}</a>
                                        </h3>
                                        <div class="des"></div>
                                        <div class="tag">
                                        </div>
                                    </div>
                                </div>`;
                            } break;
                            case 2: {
                                html_data += `
                                <div class="article-itemt" data-id="${item.hotelid}" data-type="${item.product_type}">
                                    <div class="article-thumb">
                                       ${logo_image}
                                    </div>
                                    <div class="article-content">
                                        <h3 class="title_new">
                                            <a href="#">${item.name}</a>
                                        </h3>
                                        <div class="des">${item.city}</div>
                                        <div class="tag">
                                           
                                        </div>
                                    </div>
                                </div>`;
                            } break;
                        }
                    });
                } else {
                    html_data = `<div class="article-itemt">
                        <div class="article-thumb">
                          <a class="thumb_img thumb_5x5" href="#" style="background:#e9e9e9">
                            <img src="/images/icons/location.svg" style="width:50%; height:50%; margin:auto" />
                          </a>
                        </div>
                        <div class="article-content">
                            <h3 class="title_new">
                                <a>Hệ thống không tìm thấy kết quả</a>
                            </h3>
                            <div class="des">Vui lòng nhập chính xác thông tin tìm kiếm</div>
                        </div>
                    </div>`;
                }

                $('#block__suggest-hotel').children().html(html_data);
                $('#input__suggest-hotel').parents('.form-search').addClass('active');

            } else {
                $('#input__suggest-hotel').parents('.form-search').removeClass('active');
            }
        });
    },

    changeSearchRoom: function () {
        let arr = [];
        let room = $('#collapseGuest').find('.sl_giohang_room .qty_input').val();
        let adult = 0;
        let baby = 0;
        let infant = 0;

        $('#block_room_search_content .line-bottom').each(function () {
            let seft = $(this);
            adult += parseInt(seft.find('.adult .qty_input').val());
            baby += parseInt(seft.find('.baby .qty_input').val());
            infant += parseInt(seft.find('.infant .qty_input').val());
        });

        if (room > 0) arr.push(`${room} Phòng`);
        if (adult > 0) arr.push(`${adult} Người lớn`);
        if (baby > 0) arr.push(`${baby} Trẻ em`);
        if (infant > 0) arr.push(`${infant} Em bé`);

        $('#text__search_room').text(arr.join(', '));
    },

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

    searchHotel: function () {
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
            _msgalert.error("Mỗi phòng phải có ít nhất một người lớn.");
            return;
        }

        var hotel_search_type = parseInt($('.hotel_tab_type.active').data('id'));

        var obj = {
            arrivalDate: ConvertJsDateToString(fromDate, "YYYY-MM-DD"),
            departureDate: ConvertJsDateToString(toDate, "YYYY-MM-DD"),
            hotelID: $('#input__search-hotel-id').val(),
            hotelName: $('#input__suggest-hotel').attr('keyword') == undefined ? $('#input__suggest-hotel').val() : $('#input__suggest-hotel').attr('keyword'),
            productType: $('#input__search-hotel-type').val(),
            rooms: room_datas,
            isVinHotel: hotel_search_type == 1 ? true : false,
        };

        //if (obj.hotelID === "" && hotel_search_type == 1) {
        //    _msgalert.error("Bạn phải chọn khách sạn, điểm đến");
        //    return;
        //}

        if (obj.arrivalDate === "" || obj.departureDate === "") {
            _msgalert.error("Bạn phải chọn ngày nhận phòng và trả phòng");
            return;
        }

        if (obj.rooms.length <= 0) {
            _msgalert.error("Bạn phải nhập thông tin phòng và số lượng người lớn");
            return;
        }

        $('#hotel_fund_data_holder').hide();
        $('#hotel_fund_data_holder').hide();
        $('#hotel_listing_holder').show();

        let place_hoder_grid = `<div class="article-itemt bg-white pd-16 radius10 mb16 box-placeholder">
                <div class="article-thumb">
                    <a class="thumb_img thumb_5x4" href="#">
                        <img src="images/graphics/thumb1x1.jpg" alt="">
                        <span class="like">
                            <svg class="icon-svg">
                                <use xlink:href="images/icons/icon.svg#heart">
                                </use>
                            </svg>
                        </span>
                    </a>
                </div>
                <div class="article-content">
                    <div class="row flex-end">
                        <div class="col-sm-8">
                            <div class="tag-title flex">
                                <span class="blue">GIÁ ĐỘC QUYỀN</span>
                            </div>
                            <h3 class="title_new">
                                <a href="#">InterContinental Phú Quốc Long Beach Resort</a>
                            </h3>
                            <div class="on-star">
                                <div class="star">
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#star">
                                        </use>
                                    </svg>
                                </div>
                                <a href="#" class="lbl">Khu nghỉ dưỡng</a>
                            </div>
                            <div class="number-vote">
                                <span class="point">9,7</span>
                                <span>Tuyệt vời (177 đánh giá)</span>
                            </div>
                            <ul class="service">
                                <li>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#address">
                                        </use>
                                    </svg> Gành dầu, Phú quốc
                                </li>
                                <li>
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#bed">
                                        </use>
                                    </svg> Biệt thự 2 phòng ngủ
                                </li>
                                <li class="color-green">
                                    <svg class="icon-svg">
                                        <use xlink:href="images/icons/icon.svg#dinner">
                                        </use>
                                    </svg> Bữa sáng miễn phí
                                </li>
                                <li class="gray">
                                    <img src="images/icons/lightning2.svg" alt=""> Xác nhận ngay
                                </li>
                            </ul>
                        </div>
                        <div class="col-sm-4">
                            <div class="price text-right">
                                <div class="sale">-2%</div>
                                <div class="price-old">2.648.104 đ</div>
                                <div class="price-new">2.571.000 đ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        $('#hotel__filter_listing').html(place_hoder_grid);

        _ajax_caller.post('/hotel/SearchHotel', { model: obj }, function (result) {
            $('#hotel_result_title').html(obj.hotelName);
            $('#hotel__filter_listing').html(result);

            let strSearchObj = localStorage.getItem(_hotel.CACHE_SUGGEST_SEARCH);
            let arrSearchObj = strSearchObj && strSearchObj != null ? JSON.parse(strSearchObj) : [];

            if (arrSearchObj && arrSearchObj != null) {
                let model_search = arrSearchObj.find(x => x.searchType == hotel_search_type);
                let model_search_index = arrSearchObj.indexOf(model_search);
                if (model_search_index > -1) arrSearchObj.splice(model_search_index, 1);
            }

            arrSearchObj.push({
                hotelName: obj.hotelName,
                hotelID: obj.hotelID,
                productType: obj.productType,
                searchType: hotel_search_type,
                arrivalDate: ConvertJsDateToString(fromDate, "DD/MM/YYYY"),
                departureDate: ConvertJsDateToString(toDate, "DD/MM/YYYY"),
            });

            localStorage.setItem(_hotel.CACHE_SUGGEST_SEARCH, JSON.stringify(arrSearchObj));
            localStorage.setItem(_hotel.CACHE_OBJECT_SEARCH, JSON.stringify(obj));

            _hotel.changeImageUrl();
            _hotel.loadPriceData();
            _hotel.loadFilterData();
            $('.item_vin_filter').prop('disabled', false);
            $('.item_vin_filter').removeClass('gray');
            
        });
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
        let filter_grid = $('#hotel__filter_options');
        filter_grid.addClass('placeholder');
        _ajax_caller.get("/hotel/GetHotelFilter", { cacheId: cache_id }, function (result) {
            filter_grid.html(result);
            filter_grid.removeClass('placeholder');
            if (filter_grid.children().length > 0) {
                _hotel.initSlideRange();
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
            _hotel.applyDaterange(fromDateElement, toDateElement, start, end);
        }).on('apply.daterangepicker', function (ev, picker) {
            _hotel.applyDaterange(fromDateElement, toDateElement, picker.startDate, picker.endDate);
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
        let objSearch = localStorage.getItem(_hotel.CACHE_OBJECT_SEARCH);

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

var _IntervalSuggestHotel = null;
$('#input__suggest-hotel').keyup(function (e) {
    let query = e.target.value;
    if (query == null || query == '') {
        $('#input__suggest-hotel').parents('.form-search').removeClass('active');
        return;
    } else {
        $("#input__search-hotel-id").val("");
        $("#input__search-hotel-type").val(0);
    }

    if (e.which === 13) {
        _hotel.suggestInputHotel(query);
    } else {
        clearInterval(_IntervalSuggestHotel);
        _IntervalSuggestHotel = setInterval(function () {
            _hotel.suggestInputHotel(query);
            clearInterval(_IntervalSuggestHotel);
        }, 200);
    }
}).focus(function () {
    $(this).select();
});

$('#block__suggest-hotel').on('click', '.article-itemt', function () {
    let seft = $(this);
    let id = seft.data('id');
    var text = seft.find('.title_new a').text();
    var keyword = seft.find('.title_new a span').text();
    if (!id || id == null || id == "") {
        keyword=text
    }

    let type = seft.data('type');
    var text = seft.find('.title_new a').text();
    var keyword = seft.find('.title_new a span').text();
    $('#input__suggest-hotel').attr('keyword', keyword);
    $('#input__suggest-hotel').val(text);
    $('#input__search-hotel-id').val(id);
    $('#input__search-hotel-type').val(type);
    $('#input__suggest-hotel').parents('.form-search').removeClass('active');
    $('.item_vin_filter').prop('disabled', false);
    $('.item_vin_filter').removeClass('gray');

});

$('.btn__filter_hotel').click(function () {
    _hotel.searchHotel();
});

$(".tab-menu a").click(function (event) {
    $(".tab-menu a").removeClass("active");
    if (!$(this).hasClass("active")) {
        $(this).addClass("active");
    } else {
        $(this).removeClass("active");
    }
    event.preventDefault();

    //var tab = $(this).data("id");
    //if (tab == 0) {
    //    $('.item_vin_filter').show();
    //    $('.item_normal_filter').hide();
    //} else {
    //    $('.item_vin_filter').hide();
    //    $('.item_normal_filter').show();
    //}
});

$('#collapseGuest').on('click', '.giam_sl', function () {
    let seft = $(this);
    let inputElement = seft.parent().siblings('input');
    let current_value = parseInt(inputElement.val());
    let is_room = seft.closest('.sl_giohang_room').length > 0;
    let is_adult = seft.closest('.adult').length > 0;
    //let room = 1;
    //$('#block_room_search_content .line-bottom').each(function () {
    //    let seft2 = $(this);
    //    if (seft2.data('room') > 1) {
    //        room = seft2.data('room');
    //    } 
    //});
    if (current_value >= 0) {
        if (is_room || is_adult) {
            if (current_value > 1) {
                inputElement.val(current_value - 1);
                if (is_room) $('#block_room_search_content .line-bottom:last').remove();
            }
        } else {
            if (current_value <= 0) {
                inputElement.val(current_value);
            } else {
                inputElement.val(current_value - 1);
            }
        }
    }

    _hotel.changeSearchRoom();
});

$('#collapseGuest').on('click', '.tang_sl', function () {
    let seft = $(this);
    let inputElement = seft.parent().siblings('input');
    let current_value = parseInt(inputElement.val());
    let is_room = seft.closest('.sl_giohang_room').length > 0;
    //var room = 1;
    //$('#block_room_search_content .line-bottom').each(function () {
    //    let seft2 = $(this); 
    //    if (seft2.data('room') > 1) {
    //        room = seft2.data('room');
    //    }
    //});
    if (is_room) {
        if (current_value < 9) {
            inputElement.val(current_value + 1);
            _hotel.appendRoomSearch(current_value + 1);
        }
    } else {
        inputElement.val(current_value + 1);


    }

    _hotel.changeSearchRoom();
});

$('.hotel.tab-menu .hotel_tab_type').click(function () {
    let seft = $(this);
    let hotel_search_type = parseInt(seft.data('id'));

    let strSearchObj = localStorage.getItem(_hotel.CACHE_SUGGEST_SEARCH);
    let arrSearchObj = (strSearchObj && strSearchObj != null) ? JSON.parse(strSearchObj) : [];
    let model_search = arrSearchObj.find(x => x.searchType == hotel_search_type);

    if (model_search) {
        //$('#input__suggest-hotel').val(model_search.hotelName);
        $('#input__suggest-hotel').val(model_search.keyword);
        $('#input__search-hotel-id').val(model_search.hotelID);
        $('#input__search-hotel-type').val(model_search.productType);
    } else {
        $('#input__suggest-hotel').val("");
        $('#input__search-hotel-id').val("");
        $('#input__search-hotel-type').val(0);
    }
    setTimeout(function () {
        $('.tab-content .flex-row').show()

    }, 1000);
});

$(document).ready(function () {
    //let strSearchObj = localStorage.getItem(_hotel.CACHE_SUGGEST_SEARCH);
    //let arrSearchObj = (strSearchObj && strSearchObj != null) ? JSON.parse(strSearchObj) : [];
    //let model_search = arrSearchObj.find(x => x.searchType == 0);
    //if (model_search && model_search != null) {
    //    $('#input__suggest-hotel').val(model_search.keyword);
    //    $('#input__search-hotel-id').val(model_search.hotelID);
    //    $('#input__search-hotel-type').val(model_search.productType);
    //}
    var filter = _hotel.getUrlParameter('filter')
    if (filter) {
        var json_obj = JSON.parse(filter)
        if (json_obj != undefined) {
            $('#input__suggest-hotel').val(json_obj.hotelName);
            $('#input__search-hotel-id').val(json_obj.hotelID);
            $('#input__search-hotel-type').val(json_obj.productType);
        }
    }
    _hotel.initDateRange('.date-range-fromdate', '.date-range-todate');
    _ui_common.toggleFocusOut('#collapseGuest');
    _ui_common.toggleFocusOut('#block__suggest-hotel');

    let quick_search = $("#hotel_quick_search").val();
    if (quick_search > 0) {
        _hotel.searchHotel();
    }
    $('#fund_hotel_holder').find('.head-title').hide()
    $('#fund_hotel_holder').find('.gray').hide()
    $('#fund_hotel_holder').find('.align-center').hide()
    $('#fund_hotel_holder').find('.fund-list').hide()
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

    $('.item_vin_filter').prop('disabled', true);
    $('.item_vin_filter').addClass('gray');

});
