var _hotel = {
    CACHE_OBJECT_SEARCH: "CACHE_OBJECT_SEARCH",
    CACHE_SUGGEST_SEARCH: "CACHE_SUGGEST_SEARCH",
    CACHE_DETAIL_HOTEL: "CACHE_DETAIL_HOTEL",

    suggestInputHotel: function (query) {

        if (query == null || query == '') {
            $('#input__suggest-hotel').parents('.form-search').removeClass('active');
            return;
        };
        var search_type = 0
        $('.hotel_tab_type').each(function (index, item) {
            var element = $(item)
            if (element.hasClass('active')) {
                search_type = element.attr('data-id')
            }
        })

        _ajax_caller.get('/hotel/GetSuggestHotel', { textSearch: query, limit: 30, search_type: search_type }, function (result) {
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
                                        <div class="des">${(item.street != null && item.street != undefined ? item.street : item.address)}</div>
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

    initDateRange: function (fromDateElement, toDateElement) {
        $(`${fromDateElement},${toDateElement}`).daterangepicker({
            autoUpdateInput: false,
            autoApply: true,
            minDate: new Date(),
            startDate: moment().add(1, 'day'),
            endDate: moment().add(2, 'day'),
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
        console.log(startDate);
        console.log(endDate);

        $(fromDateElement).val(startDate.format('DD/MM/YYYY')).change();
        $(toDateElement).val(endDate.format('DD/MM/YYYY')).change();

        $(fromDateElement).data('daterangepicker').setStartDate(startDate);
        $(fromDateElement).data('daterangepicker').setEndDate(endDate);

        $(toDateElement).data('daterangepicker').setStartDate(startDate);
        $(toDateElement).data('daterangepicker').setEndDate(endDate);

        var day_count = Math.round((endDate - startDate) / 86400000) - 1;
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
        var hotel_search_type =0
        $('.hotel_tab_type').each(function () {
            var tab_type = $(this)
            if (tab_type.hasClass('active')) {
                hotel_search_type = tab_type.attr('data-id')
                return false
            }

        });
        var obj = {
            arrivalDate: ConvertJsDateToString(fromDate, "YYYY-MM-DD"),
            departureDate: ConvertJsDateToString(toDate, "YYYY-MM-DD"),
            hotelID: $('#input__search-hotel-id').val(),
            hotelName: $('#input__suggest-hotel').attr('keyword'),
            productType: $('#input__search-hotel-type').val(),
            rooms: room_datas,
            isVinHotel: hotel_search_type == 1 ? true : false,
        };

        if (obj.arrivalDate === "" || obj.departureDate === "") {
            _msgalert.error("Bạn phải chọn ngày nhận phòng và trả phòng");
            return;
        }

        if (obj.rooms.length <= 0) {
            _msgalert.error("Bạn phải nhập thông tin phòng và số lượng người lớn");
            return;
        }

        var filter = JSON.stringify(obj);
        localStorage.removeItem(_hotel.CACHE_OBJECT_SEARCH);
        var hotel_id = $('#input__search-hotel-id').val()
        if (hotel_id != null && hotel_id != undefined && hotel_id.trim() != '' && !hotel_id.includes(',')) {
            let objSearch = JSON.parse(JSON.stringify(obj));
            objSearch.hotelID = hotel_id;
            objSearch.hotelName = $('#input__suggest-hotel').val();
            localStorage.setItem(_hotel.CACHE_OBJECT_SEARCH, JSON.stringify(objSearch));
            window.location.href = `/hotel/detail?filter=${encodeURIComponent(JSON.stringify(objSearch))}`;
        } else {
            localStorage.setItem(_hotel.CACHE_OBJECT_SEARCH, JSON.stringify(objSearch));
            window.location.href = `/hotel?filter=${encodeURIComponent(filter)}`;
        }

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
};

var _IntervalSuggestHotel = null;
$('#input__suggest-hotel').keyup(function (e) {
    let query = e.target.value;
    if (query == null || query == '') {
        $('#input__suggest-hotel').parents('.form-search').removeClass('active');
        return;
    };

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
        keyword = text
    }
    let type = seft.data('type');
    $('#input__suggest-hotel').val(text);
    $('#input__suggest-hotel').attr('keyword', keyword);

    $('#input__search-hotel-id').val(id);
    $('#input__search-hotel-type').val(type);
    $('#input__suggest-hotel').parents('.form-search').removeClass('active');
    $('.item_vin_filter').prop('disabled', false);
    $('.item_vin_filter').removeClass('gray');

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
            if (current_value >1) {
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

function ConvertDatetimeInputToHTMLDate(text) {
    var split = text.split('-')
    return split[2] + '/' + split[1] + '/' + split[0]
}

$(document).ready(function () {
    $('.item_vin_filter').prop('disabled', true);
    $('.item_vin_filter').addClass('gray');
    let strSearchObj = localStorage.getItem(_hotel.CACHE_OBJECT_SEARCH);
    if (strSearchObj) {
        var model_search = JSON.parse(strSearchObj)
        $('#input__suggest-hotel').val(model_search.hotelName);
        $('#input__suggest-hotel').attr('placeholder', model_search.hotelName);
        $('#input__search-hotel-id').val(model_search.hotelID);
        $('#input__search-hotel-type').val(model_search.productType);
        $('.date-range-fromdate').val(ConvertDatetimeInputToHTMLDate(model_search.arrivalDate))
        $('.date-range-todate').val(ConvertDatetimeInputToHTMLDate(model_search.departureDate))
        $('.item_vin_filter').prop('disabled', false)
        $('.item_vin_filter').removeClass('gray')
    }
    var search_object = localStorage.getItem(_hotel.CACHE_OBJECT_SEARCH);


   
    _hotel.initDateRange('.date-range-fromdate', '.date-range-todate');
    _ui_common.toggleFocusOut('#collapseGuest');
    _ui_common.toggleFocusOut('#block__suggest-hotel');
    

    $('.btn__filter_hotel').off('click');
    $('.btn__filter_hotel').click(function (e) {
        e.preventDefault()
        _hotel.searchHotel();
    });
    $('.hotel_tab_type').click(function (e) {
        setTimeout(function () {
            $('.tab-content .flex-row').show()

        }, 1000);

    });
});
