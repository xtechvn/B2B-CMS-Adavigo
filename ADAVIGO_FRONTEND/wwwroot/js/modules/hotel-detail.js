﻿
$(document).ready(function () {

    _hotel_detail.initial();
    if ($('#input__hotel_recent') != undefined && $('#input__hotel_recent').length > 0) {
        _hotel_detail.SaveRecent();

    }
    _hotel_detail.LoadingSurcharge()
    $('#hotel-room-filter').closest('.pd-12').hide()
    _hotel_detail.hotel.is_vin_hotel = $('#input__hotel_search_type').val().toLowerCase() === "true" ? true : false
    _hotel_detail.hotel.arrival_date = $('#input__hotel_arrival_date').val()
    _hotel_detail.hotel.departure_date = $('#input__hotel_departure_date').val()
    $('.btn__toggle_room_package').each(function () {
        var seft = $(this);
        let id = seft.data('id');
        let cache = $('#hotel_grid_cache_search').val();
        let night = $('#hotel_grid_cache_night_time').val();
        let room_info = $(seft.data('target'));


        let isToggle = seft.attr('aria-expanded')
        if (isToggle == undefined || !JSON.parse(isToggle)) {
            seft.attr('aria-expanded', true);
            if (room_info.children().length <= 0) {
                let viewType = $('input[name="radio_price_type"]:checked').val();
                _hotel_detail.getRoomPackages(cache, id, night, viewType, function (result) {
                    room_info.html(result);
                });
            }
        }
    })
    if (_hotel_detail.hotel.is_vin_hotel) {
        _hotel_detail.LoadingPackageFilters()

    }

})
var _hotel_detail = {
    static_image: "https://static-image.adavigo.com",
    hotel: {},

    rooms: [],

    packageDate: {
        from: null,
        to: null
    },
    HTML: {
        SurchageItem: `
                                   <tr class="hotel-detail-popup-surcharge-table-td-new">
                                    <td>{count}</td>
                                    <td>
                                        <select class="form-control hotel-detail-popup-surcharge-table-td-id">
                                        {item}
                                        </select>
                                    </td>
                                    <td>
                                       <div style="display:flex;">
                                       <div style=" align-content: center; padding-right: 5px; ">Từ</div>
                                            <input type="text" class="form-control mb-2 hotel-detail-popup-surcharge-table-td-date hotel-detail-popup-surcharge-table-td-fromdate" id="" value="">
                                           <div style=" align-content: center; padding-right: 5px;padding-left: 5px; ">đến</div>
                                            <input type="text" class="form-control mb-2 hotel-detail-popup-surcharge-table-td-date hotel-detail-popup-surcharge-table-td-todate" id="" value="">

                                      </div>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control hotel-detail-popup-surcharge-table-td-nights" disabled readonly value="0">
                                    </td>
                                    <td>
                                        <input type="text" class="form-control hotel-detail-popup-surcharge-table-td-quanity" value="0">
                                    </td>
                                    <td>
                                        <input type="text" class="form-control hotel-detail-popup-surcharge-table-td-price" disabled readonly value="0">

                                    </td>
                                    <td>
                                      <a href="javascript:;" class="delete">
                                            <span class="icon">
                                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.941406" width="24" height="24" rx="12" fill="#F73B2F"></rect>
                                                    <path d="M15.4363 17.1586H10.4793C10.2203 17.1586 10.0059 16.9582 9.98828 16.6992L9.56289 10.3758C9.54414 10.091 9.76914 9.85078 10.0539 9.85078H15.8617C16.1465 9.85078 16.3715 10.0922 16.3527 10.3758L15.9273 16.6992C15.9098 16.9582 15.6953 17.1586 15.4363 17.1586ZM16.8379 8.92852H9.13867C9.13164 8.92852 9.12695 8.92383 9.12695 8.9168V7.57031C9.12695 7.56328 9.13164 7.55859 9.13867 7.55859H16.8379C16.8449 7.55859 16.8496 7.56328 16.8496 7.57031V8.91563C16.8496 8.92266 16.8449 8.92852 16.8379 8.92852Z" fill="white"></path>
                                                    <path d="M15.0383 8.22065H10.9238C10.9168 8.22065 10.9121 8.21597 10.9121 8.20894V6.67847C10.9121 6.67144 10.9168 6.66675 10.9238 6.66675H15.0383C15.0453 6.66675 15.05 6.67144 15.05 6.67847V8.20894C15.05 8.21479 15.0453 8.22065 15.0383 8.22065Z" fill="white"></path>
                                                </svg>
                                            </span>
                                        </a>

                                    </td>
                                </tr>
        
        `,
        SurchageOption: `<option value="{value}" data-id="{id}" data-code="{code}" data-amount="{amount}" data-name="{name}">{name}</option>`,
        SurchageOptionRendered:``,
        SurchageSummary:` <tr id="hotel-detail-popup-surcharge-table-summary" class="bg-white">
                                    <td></td>
                                    <td colspan="2">
                                        <a id="hotel-detail-popup-surcharge-table-add-surcharge" href="javascript:;" class="btn-default blue-line min2">
                                            + Thêm phụ thu
                                        </a>
                                    </td>
                                    
                                    <td></td>
                                    <td class="text-right"><b>Tổng</b></td>
                                    <td id="hotel-detail-popup-surcharge-table-summary-total" class="text-right"><b>0</b></td>
                                                                        <td></td>

                                </tr>`
    },

    changeImageUrl: function () {
        $('#block__detail_hotel_rooms .article-itemt').each(function () {
            var item = $(this);
            var list_image = [];

            item.find('img.img_rechange_url').each(function () {
                list_image.push($(this).data('url'));
            });

            if (_hotel_detail.hotel.is_vin_hotel) {
                _ajax_caller.post("/hotel/GetBlockedImageUrl", { url_images: list_image }, function (result) {
                    if (result.isSuccess) {
                        let data_images = result.data;
                        if (data_images.length > 0) {
                            for (var i = 0; i < data_images.length; i++) {
                                item.find(`img.img_rechange_url:eq(${i})`).attr('src', data_images[i]);
                            }
                        }
                    }
                });
            } else {
                for (var i = 0; i < list_image.length; i++) {
                    item.find(`img.img_rechange_url:eq(${i})`).attr('src', list_image[i].includes('https://') ? list_image[i] : `${_hotel_detail.static_image}${list_image[i]}`);
                }
            }
        });
    },

    removeRoom: function (room_number) {
        _hotel_detail.rooms = _hotel_detail.rooms.filter(x => x.room_number != room_number);
    },

    removePackage: function (room_number, package_id) {
        let room_data = _hotel_detail.rooms.find(x => x.room_number == room_number);
        if (room_data && room_data != null) {
            _hotel_detail.removeRoom(room_number);
            room_data.packages = room_data.packages.filter(x => x.id != package_id);
            _hotel_detail.rooms.push(room_data);
        }
    },
    ReCalucateArrivalDepartureDate: function () {
        var arrival_date = null
        var departure_date = null
        $(_hotel_detail.rooms).each(function (index, item) {
            $(item.packages).each(function (index_package, package_item) {
                if (arrival_date == null) {
                    arrival_date = new Date(package_item.arrival_date)
                }
                if (departure_date == null) {
                    departure_date = new Date(package_item.departure_date)
                }
                if (arrival_date > new Date(package_item.arrival_date)) {
                    arrival_date = new Date(package_item.arrival_date);
                }
                if (departure_date < new Date(package_item.departure_date)) {
                    departure_date = new Date(package_item.departure_date);
                }
               
            })
        })
        _hotel_detail.hotel.arrival_date = ConvertJsDateToString(arrival_date, "DD/MM/YYYY");
        _hotel_detail.hotel.departure_date = ConvertJsDateToString(departure_date, "DD/MM/YYYY");

    },
    initial: function () {
        _hotel_detail.hotel = {
            id: $('#input__hotel_id').val(),
            name: $('#block__detail_hotel_title h2').text().trim(),
            phone: $('#input__hotel_phone').val(),
            email: $('#input__hotel_email').val(),
            arrival_date: $('#input__hotel_arrival_date').val(),
            departure_date: $('#input__hotel_departure_date').val(),
            is_vin_hotel: $('#input__hotel_search_type').val().toLowerCase() === "true" ? true : false,
        };

        var swiperslideBanner = new Swiper(".slide-banner .swiper-container", {
            speed: 1000,
            autoplay: {
                delay: 2000,
            },
            pagination: {
                el: ".slide-banner .swiper-pagination",
            },
        });

        _hotel_detail.changeImageUrl();
        //$('.btn__filter_hotel').prop('disabled', true);
    },

    getRoomPackages: function (cacheId, roomId, nightTime, viewType, callback) {
        _ajax_caller.post('/hotel/GetRoomPackages', {
            cache_id: cacheId,
            room_id: roomId,
            night_time: nightTime,
            view_type: viewType,
            arrival_date: _hotel_detail.hotel.arrival_date,
            departure_date: _hotel_detail.hotel.departure_date,
            isVinHotel: _hotel_detail.hotel.is_vin_hotel
        }, function (result) {
            callback(result);
        });
    },

    openRoomPackageDetailPopup: function (data) {
        _global_popup.showContextPopup("#modal-context-global-second", "max-width:700px", "Chi tiết", "/hotel/PopupRoomPackageDetail", { model: data });
    },

    loadTotalMoney: function () {
        let amount_total = 0;
        var type = $('#hotel-order-voucher-code').attr('data-type')
        var value = parseFloat($('#hotel-order-voucher-code').attr('data-value'))
        let total_discount = 0;
        $('#hotel__detail_grid_selected_room .selected_room_price').each(function () {
            let seft = $(this);
            var amount_room = parseInt(seft.data('amount'))
            var nights = parseInt(seft.data('nights'))
            amount_total += amount_room
            if (value != undefined && !isNaN(value) && type != undefined && type.trim() != '') {
                switch (type) {
                    case 'percent': {
                        total_discount += (amount_room * (value/100) * nights )
                    } break
                    case 'vnd': {
                        total_discount += (value * nights);
                    } break
                }

            }
        });
        total_discount = Math.round(total_discount)
        $('#hotel-order-total-amount-old').html(`${amount_total.toLocaleString()} VNĐ`)
        $('#hotel-order-total-discount').html(`${total_discount.toLocaleString()} VNĐ`)
        $('#hotel__booking_total_amount').html(`${(amount_total - total_discount).toLocaleString()} VNĐ`)

    },

    getRoomOrdered: function () {
        let arrRoom = [];
        $('#hotel__detail_grid_selected_room ul').each(function () {
            let seft = $(this);
            arrRoom.push({
                room_number: seft.data('room'),
                room_id: seft.find('.room-id').val(),
                room_name: seft.find('.room-name').text().trim(),
                package_id: seft.find('.package-id').val(),
                package_name: seft.find('.package-name').val(),
                package_code: seft.find('.package-code').text().trim(),
                amount: parseFloat(seft.find('.selected_room_price').data('amount'))
            });
        });
        return arrRoom;
    },

    initDateRange: function (fromDateElement, toDateElement) {
        var StartDate = ConvertToDate($(fromDateElement).val());
        var Enddate = ConvertToDate($(toDateElement).val());
        $(`${fromDateElement},${toDateElement}`).daterangepicker({
            autoUpdateInput: false,
            autoApply: true,
            minDate: StartDate,
            startDate: StartDate,
            endDate: Enddate,
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
            _hotel_detail.applyDaterange(fromDateElement, toDateElement, start, end);
        }).on('apply.daterangepicker', function (ev, picker) {
            _hotel_detail.applyDaterange(fromDateElement, toDateElement, picker.startDate, picker.endDate);
        }).on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
    },

    applyDaterange: function (fromDateElement, toDateElement, startDate, endDate) {
        $(fromDateElement).val(startDate.format('DD/MM/YYYY')).change();
        $(toDateElement).val(endDate.format('DD/MM/YYYY')).change();

        $(fromDateElement).data('daterangepicker').setStartDate(startDate);
        $(fromDateElement).data('daterangepicker').setEndDate(endDate);

        $(toDateElement).data('daterangepicker').setStartDate(startDate);
        $(toDateElement).data('daterangepicker').setEndDate(endDate);

        var day_count = Math.round((endDate - startDate) / 86400000) - 1;
        $(fromDateElement).closest('.date-w').find('.note .day_count').html(day_count);
    },
    LoadingSurcharge: function () {
        var loading_surcharge = false


        setTimeout(function () {
            while (!loading_surcharge) {
                if ($('#hotel_detail_surcharge').length > 0) {
                    $('#select-tab-1').html($('#hotel_detail_surcharge').html())
                    loading_surcharge = true
                }
            }
        }, 500);


    },
    LoadingPackageFilters: function () {
        var template = ` <a class="cursor-pointer hotel-room-filter-item" href="javascript:;" data-id="@item.id" data-code="@item.code" data-filter="@item.code">@item.name</a>`
        var breakfirst = ` <a class="cursor-pointer hotel-room-filter-item" href="javascript:;" data-id="filter-manual" data-code="BF-IN" data-filter="BF-A-IN,BF-C-IN">Ăn sáng</a>`
        var vinwonder = ` <a class="cursor-pointer hotel-room-filter-item" href="javascript:;" data-id="filter-manual" data-code="VAP-IN" data-filter="VAP-A-IN,VAP-C-IN">Vé vui chơi VinWonder</a>`
        var fullmeal = ` <a class="cursor-pointer hotel-room-filter-item" href="javascript:;" data-id="filter-manual" data-code="VAP-IN" data-filter="BF-A-IN,BF-C-IN,LN-A-IN,LN-C-IN,DN-A-IN,DN-C-IN">Ăn 3 bữa</a>`
        var filter_manual = ['BF-A-IN', 'BF-C-IN', 'VAP-A-IN', 'VAP-C-IN']
        setTimeout(function () {
            var loaded = true
            $('.btn__toggle_room_package').each(function () {
                var seft = $(this);
                let isToggle = JSON.parse(seft.attr('aria-expanded'));
                if (isToggle == undefined || !JSON.parse(isToggle)) {
                    loaded = false
                    return false;
                }

            })
            if (loaded) {
                var html = ''
                html += breakfirst
                html += vinwonder
                html += fullmeal

                $('#hotel-room-filter').html(html)
                $('#hotel-room-filter').closest('.pd-12').show()

            }
            else {
                _hotel_detail.LoadingPackageFilters()
            }
        }, 1000)
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
    ConvertToDateDotnet: function (text) {
        var split_date = text.split('-')
        return split_date[2] + '/' + split_date[1] + '/' + split_date[0]
    },
    checkinput: function () {
        if ($('#cbk__order_multiple_pacekage').is(":checked")) {
            $('#btn__check_order').removeAttr('data-target')
            $('#btn__check_order').removeAttr('data-toggle')
        } else {
            $('#btn__check_order').attr('data-target', '#myModal14')
            $('#btn__check_order').attr('data-toggle', 'modal')
        }
    },
    SaveRecent: function () {
        var detail = {
            hotel_id: $('#input__hotel_recent').attr('data-id'),
            avatar: $('#input__hotel_recent').attr('data-avt'),
            name: $('#input__hotel_recent').attr('data-name'),
            star: $('#input__hotel_recent').attr('data-star'),
            review_count: $('#input__hotel_recent').attr('data-review_count'),
            review_rate: $('#input__hotel_recent').attr('data-review_rate'),
            isVinHotel: $('#input__hotel_recent').attr('data-data-isVinHotel'),
            arrival_date: $('#input__hotel_arrival_date').val(),
            departure_date: $('#input__hotel_departure_date').val(),
            min_price: parseFloat($('.room_detail').first().find('.dynamic_price').attr('data-amount')),
            discount_code: '',
            discount: '',
            amount: ''
        }
        var min_price = $('.room_detail').first().find('.dynamic_price').attr('data-amount')
        if (min_price == undefined || isNaN(parseFloat(min_price)) || parseFloat(min_price)<=0) {
            detail.min_price = 'Giá liên hệ'
        } else {
            detail.min_price = _hotel_detail.Comma(parseFloat(min_price))
        }
        var recents = window.localStorage.getItem('HotelRecent');
        var recents_object = []
        if (recents != undefined && recents.trim() != '') {
            recents_object = JSON.parse(recents)
            recents_object = recents_object.filter(item => item.hotel_id != detail.hotel_id && item.hotel_id != undefined);
        } else {
            recents_object = []
        }
        if (detail.hotel_id != undefined && detail.hotel_id.trim() != '') {
            recents_object = [detail, ...recents_object];
        }
        window.localStorage.setItem('HotelRecent', JSON.stringify(recents_object))

    },
    
};

$(document).on('click', '.btn__toggle_room_package', function () {
    var seft = $(this);
    let id = seft.data('id');
    let cache = $('#hotel_grid_cache_search').val();
    let night = $('#hotel_grid_cache_night_time').val();
    let room_info = $(seft.data('target'));

    let isToggle = seft.attr('aria-expanded')
    if (JSON.parse(isToggle)) {
        seft.attr('aria-expanded', true);
        seft.html('Bỏ chọn');
        //if (room_info.children().length <= 0) {
        //    let viewType = $('input[name="radio_price_type"]:checked').val();
        //    _hotel_detail.getRoomPackages(cache, id, night, viewType, function (result) {
        //        room_info.html(result);
        //        room_info.removeClass('placeholder');
        //        room_info.addClass('show');
        //    });
        //} else {
        //    room_info.addClass('show');
        //    room_info.removeClass('placeholder');
        //}
        room_info.addClass('show');
        room_info.removeClass('placeholder');
    } else {
        seft.html('Chọn phòng');
        room_info.removeClass('show');
        if (room_info.find('.ckb__package:checked').length > 0) {
            let room_tab = $('#block__hotel_room_tab a.active').data('room');
            $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"]`).remove();
            room_info.find('.ckb__package:checked').prop('checked', false);
            _hotel_detail.loadTotalMoney();
        }
    }
    //seft.html('Chọn phòng');
    //room_info.removeClass('show');
    //if (room_info.find('.ckb__package:checked').length > 0) {
    //    let room_tab = $('#block__hotel_room_tab a.active').data('room');
    //    $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"]`).remove();
    //    room_info.find('.ckb__package:checked').prop('checked', false);
    //    _hotel_detail.loadTotalMoney();
    //}
});
$(document).on('click', '.hotel-room-filter-item', function () {
    var seft = $(this);
    if (!seft.hasClass('active')) {
        seft.addClass('active')
    } else {
        seft.removeClass('active')
    }
    setTimeout(function () {
        var filters = []
        $('.hotel-room-filter-item').each(function (index, item) {
            var item = $(this)
            if (item.hasClass('active')) {
                if (item.attr('data-id') == 'filter-manual') {
                    $(item.attr('data-filter').split(',')).each(function (index, item_detail) {
                        filters.push(item_detail)
                    })

                } else {
                    filters.push(item.attr('data-filter'))
                }
            }
        })
        $('.room-package-detail').each(function (index, item) {
            var detail = $(this)
            var package_filter = JSON.parse(JSON.stringify(filters))
            detail.find('.package_include').each(function (index, item) {
                var package = $(this)
                package_filter = package_filter.filter(item => !package.attr('data-code').includes(item))

            })
            if (package_filter.length > 0) {
                detail.hide()
            }
            else {
                detail.show()

            }
        })
        $('.list-room').find('.room_detail').each(function (index, item) {
            var self = $(this)

            var min_price = 0;
            var night = 1;
            self.find('.room-package-detail').each(function (index, item) {
                var detail = $(this)
                if (detail.css('display') == 'none') return
                var amount = parseFloat(detail.find('.dynamic_price').attr('data-amount'))
                if (isNaN(amount)) return
                if ((min_price <= 0 && amount > 0) || (amount > 0 && (min_price <= 0 || min_price > amount))) {
                    min_price = amount
                    night = detail.find('.dynamic_price').attr('data-night')
                }
            })
            if (min_price > 0) {
                self.find('.article-content').find('.price').find('.gray').show()
                //self.find('.article-content').find('.price').find('.btn__toggle_room_package').show()
                self.find('.article-content').find('.dynamic_price').attr('data-amount', min_price)
                self.find('.article-content').find('.dynamic_price').attr('data-night', night)
                self.find('.article-content').find('.dynamic_price').html(_hotel_detail.Comma(Math.round(min_price / night)) + ' đ')
            } else {
                self.find('.article-content').find('.price').find('.gray').hide()
                //self.find('.article-content').find('.price').find('.btn__toggle_room_package').hide()
                self.find('.article-content').find('.dynamic_price').html('Giá liên hệ')

            }

        })

    }, 1000)
});
$('#block__hotel_room_tab').on('click', 'a', function () {
    let seft = $(this);
    $('#block__hotel_room_tab a').removeClass('active');
    seft.addClass('active');
    let room_tab = seft.data('room');

    $('.info-room').removeClass('show');
    $('.ckb__package').prop('checked', false);
    $('.btn__toggle_room_package').removeAttr('aria-expanded');
    $('.btn__toggle_room_package').html('Chọn phòng');

    let exist_room = $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"]`);
    if (exist_room.length > 0) {
        let room_id = exist_room.find('.room-id').val();
        let package_id = exist_room.find('.package-id').val();

        $(`.btn__toggle_room_package[data-id="${room_id}"]`).trigger('click');
        $(`#room-info-${room_id}`).find(`label[data-id="${package_id}"] .ckb__package`).prop('checked', true);
    }
});

$(document).on('click', '.btn__show_popup_room', function () {
    let seft = $(this);

    let img_url = seft.closest('.article-content').siblings('.article-thumb').find('img').attr('src');
    seft.siblings('.popup').find('.article-thumb img').attr('src', img_url);

    let html = seft.siblings('.popup').html();

    let modal = $('#modal-context-global');
    modal.find('.modal-dialog').css("max-width", "700px");
    modal.find('.modal-content .modal-title').html("Thông tin");
    modal.find('.modal-content .modal-body').html(`<div class="article-itemt thumb_210">${html}</div>`);
    modal.modal('show');
});

$(document).on('click', '.btn__show_popup_room_package', function () {
    let seft = $(this);
    let cancel_policies = [];
    let package_includes = [];

    seft.siblings('.cancel_policy').map((idx, element) => {
        cancel_policies.push($(element).val());
    });

    seft.siblings('.package_include').map((idx, element) => {
        package_includes.push($(element).val());
    });

    let obj = {
        name: seft.siblings('.package_name').val(),
        guarantee_policy: seft.siblings('.guarantee_policy').val(),
        cancel_policy: cancel_policies,
        package_includes: package_includes
    }
    _hotel_detail.openRoomPackageDetailPopup(obj);
});

$('#block__detail_hotel_rooms').on('click', '.ckb__package', function () {
    let seft = $(this);
    $('.list-room .ckb__package:checked').prop('checked', false);
    seft.prop('checked', true);

    let option_selected = seft.closest('label.confir_res');

    let room_element = seft.closest('.info-room').siblings();
    let room_id = room_element.find('.btn__toggle_room_package').data('id');
    let room_name = room_element.find('.article-content .hotel_room_name').text().trim();
    let room_code = room_element.find('.btn__toggle_room_package').data('code');

    let package_id = option_selected.data('id');
    let package_code = option_selected.data('code');
    let package_name = option_selected.find('.package_name').text();

    let amount = parseInt(option_selected.data('amount'));
    let profit = parseInt(option_selected.data('profit'));
    let allotment_id = option_selected.find('.allotment_id').val();

    let room_selected = $('#block__hotel_room_tab a.active');
    let room_tab = room_selected.data('room');
    let adult = room_selected.data('adult');
    let child = room_selected.data('child');
    let infant = room_selected.data('infant');
    let nights = seft.closest('.room-package-detail').find('.dynamic_price').data('night')
    let exist_room = $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"]`);
    if (exist_room.length > 0) {
        exist_room.remove();
    }

    let arrivalDate = _hotel_detail.hotel.arrival_date;
    let departureDate = _hotel_detail.hotel.departure_date;

    let pack_includes = [];
    option_selected.siblings('.package_include').map((idx, element) => {
        pack_includes.push($(element).val());
    })

    let pack_policy = [];
    seft.closest('label').next().find('.package_include').map((idx, element) => {
        pack_policy.push($(element).val());
    })

    _hotel_detail.removeRoom(room_tab);
    _hotel_detail.rooms.push({
        room_number: room_tab,
        room_id: room_id,
        room_code: room_code,
        room_name: room_name,
        package_includes: pack_includes,
        adult: adult,
        child: child,
        infant: infant,
        packages: [{
            id: `${package_id}_${arrivalDate}_${departureDate}`,
            package_id: package_id,
            package_code: package_code,
            amount: amount,
            profit: profit,
            arrival_date: arrivalDate,
            departure_date: departureDate,
            allotment_id: allotment_id,
            package_includes: pack_policy
        }]
    });

    let html = `<ul data-room="${room_tab}" data-adult="${adult}" data-child="${child}" data-infant="${infant}">
        <li class="gray mb8">
            <input type="hidden" class="room-id" value="${room_id}" />
            <input type="hidden" class="package-id" value="${package_id}" />
            <input type="hidden" class="package-name" value="${package_name}" />
             Phòng ${room_tab}
        </li>
        <li class="gray mb8"><strong class="room-name">${room_name}</strong></li>
        <li class="gray row mb8 package_item" data-pack="${package_id}_${arrivalDate}_${departureDate}">
          <input type="hidden" class="arrival_date" value="${arrivalDate}" />
          <input type="hidden" class="departure_date" value="${departureDate}" />
          <input type="hidden" class="allotment_id" value="${allotment_id}" />
          <div class="gray col-7">Gói : <strong class="package-code">${package_code}</strong></div>
          <div class="col-5 text-right selected_room_price" data-amount="${amount}" data-profit="${profit}" data-nights="${nights}">
            <strong>${amount.toLocaleString()} đ</strong>
          </div>
        </li>
    </ul>`;

    let room_curent = parseInt(room_tab);
    let room_array = [room_curent];
    $('#hotel__detail_grid_selected_room ul').map((idx, element) => {
        room_array.push(parseInt($(element).data('room')));
    });

    room_array.sort();

    let indexOfCurrentRoom = room_array.indexOf(room_curent);
    let previos_room = room_array[indexOfCurrentRoom - 1];
    let next_room = room_array[indexOfCurrentRoom + 1];

    if (previos_room) {
        let item_previos = $(`#hotel__detail_grid_selected_room ul[data-room="${previos_room}"]`);
        $(html).insertAfter(item_previos);
    } else if (next_room) {
        let item_next = $(`#hotel__detail_grid_selected_room ul[data-room="${next_room}"]`);
        $(html).insertBefore(item_next);
    } else {
        $('#hotel__detail_grid_selected_room').append(html);
    }

    _hotel_detail.loadTotalMoney();
});

$('#block__detail_hotel_rooms').on('click', '.tab-room-link', function () {
    let seft = $(this);
    let tab = seft.data('tab');
    $('#block__detail_hotel_rooms .tab-room-link').removeClass('active');
    seft.addClass('active');
    $("#block__detail_hotel_rooms .room-tab-grid").hide();
    $(`#block__detail_hotel_rooms .room-tab-grid[data-tab="${tab}"]`).show();
});

$('#block__detail_hotel_rooms').on('click', '.add_other_package', function () {
    let seft = $(this);
    let room_number = seft.data('room');
    let item_room_selected = $(`#hotel__detail_grid_selected_room ul[data-room="${room_number}"]`);

    let start_date = item_room_selected.find('.package_item:last').find('.departure_date').val();
    let fd = new Date(start_date);
    let td = moment(new Date(start_date)).add(1, 'd');

    let room_datas = [{
        room: room_number,
        number_adult: item_room_selected.data('adult'),
        number_child: item_room_selected.data('child'),
        number_infant: item_room_selected.data('infant')
    }];

    let obj = {
        arrival_date: fd.toJSON(),
        departure_date: td.toJSON(),
        hotel_id: _hotel_detail.hotel.id,
        isVinHotel: _hotel_detail.hotel.is_vin_hotel,
        product_type: 0,
        room_id: seft.data('id'),
        rooms: room_datas
    };

    _global_popup.showContextPopup("#modal-context-global", "min-width:800px;", "Tìm kiếm", '/hotel/PopupRoomPackagesOfRoom', { model: obj }, function () {
        _hotel_detail.initDateRange('.date-range-fromdate', '.date-range-todate');

        $('#block_other_package_holder').addClass('placeholder');
        _ajax_caller.post('/hotel/GetOtherRoomPackages', { model: obj }, function (result) {
            $('#block_other_package_holder').html(result);
            _hotel_detail.packageDate.from = fd;
            _hotel_detail.packageDate.to = td.toDate();
            $('#block_other_package_holder').removeClass('placeholder');
        });
    });
});

$(document).on('click', '#btn_search_other_package', function () {
    let seft = $(this);
    let room_number = $('#block__detail_hotel_rooms .tab-room-link.active').data('tab');

    let fd = ConvertToDate(seft.siblings('.date-w').find('.date-range-fromdate').val());
    let td = ConvertToDate(seft.siblings('.date-w').find('.date-range-todate').val());

    let item_room_selected = $(`#hotel__detail_grid_selected_room ul[data-room="${room_number}"]`);
    let room_datas = [{
        room: room_number,
        number_adult: item_room_selected.data('adult'),
        number_child: item_room_selected.data('child'),
        number_infant: item_room_selected.data('infant')
    }];

    let obj = {
        arrival_date: fd.toJSON(),
        departure_date: td.toJSON(),
        hotel_id: seft.data('hotel'),
        product_type: 0,
        room_id: seft.data('room'),
        rooms: room_datas,
        isVinHotel: $('#input__hotel_search_type').val()
    };

    $('#block_other_package_holder').html('');
    $('#block_other_package_holder').addClass('placeholder');
    _ajax_caller.post('/hotel/GetOtherRoomPackages', { model: obj }, function (result) {
        $('#block_other_package_holder').html(result);
        _hotel_detail.packageDate.from = fd;
        _hotel_detail.packageDate.to = td;
        $('#block_other_package_holder').removeClass('placeholder');
    });
});

$(document).on('click', '.btn_add_room_package', function () {
    let seft = $(this);
    let room_tab = $('#block__detail_hotel_rooms .tab-room-link.active').data('tab');
    let info_room_element = seft.siblings('.info-room');
    let option_selected = info_room_element.find('input.ckb__package:checked').closest('label.confir_res');;

    if (option_selected.length <= 0) {
        _msgalert.error(`Bạn phải chọn gói để thêm vào phòng.`);
        return;
    }

    let package_id = option_selected.data('id');
    let package_code = option_selected.data('code');
    let package_name = option_selected.find('.package_name').text();
    let amount = parseInt(option_selected.data('amount'));
    let profit = parseInt(option_selected.data('profit'));
    let allotment_id = option_selected.find('.allotment_id').val();

    let from_date = ConvertJsDateToString(_hotel_detail.packageDate.from, "DD/MM/YYYY");
    let to_date = ConvertJsDateToString(_hotel_detail.packageDate.to, "DD/MM/YYYY");

    let arrival_date = ConvertJsDateToString(_hotel_detail.packageDate.from, "YYYY-MM-DD");
    let departure_date = ConvertJsDateToString(_hotel_detail.packageDate.to, "YYYY-MM-DD");
    let nights = info_room_element.find('input.ckb__package:checked').closest('.room-package-detail').find('.dynamic_price').data('night')

    let room_data = _hotel_detail.rooms.find(x => x.room_number == room_tab);

    if (room_data && room_data != null) {
        let pack_data = room_data.packages.find(x => x.package_id == package_id && x.arrival_date == arrival_date && x.departure_date == departure_date);
        if (pack_data == typeof (undefined) || pack_data == null) {
            let pack_policy = [];
            option_selected.next().find('.package_include').map((idx, element) => {
                pack_policy.push($(element).val());
            })

            room_data.packages.push({
                id: `${package_id}_${arrival_date}_${departure_date}`,
                package_id: package_id,
                package_code: package_code,
                amount: amount,
                profit: profit,
                arrival_date: arrival_date,
                departure_date: departure_date,
                allotment_id: allotment_id,
                package_includes: pack_policy
            });
        }
    }

    let html = `<li class="gray row mb8 package_item" data-pack="${package_id}_${arrival_date}_${departure_date}">
          <input type="hidden" class="arrival_date" value="${arrival_date}" />
          <input type="hidden" class="departure_date" value="${departure_date}" />
          <input type="hidden" class="allotment_id" value="${allotment_id}" />
          <div class="gray col-7">Gói : <strong class="package-code">${package_code}</strong></div>
          <div class="col-5 text-right selected_room_price" data-amount="${amount}" data-profit="${profit}" data-nights="${nights}">
            <strong>${amount.toLocaleString()} đ</strong>
          </div>
        </li>`;

    $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"]`).append(html);

    let html_grid = `<div class="bg-agray pd-16 radius10 mb16 txt_16 addition_package">
    <div class="row mb8">
            <div class="col-md-7">
                <div><strong>${package_name}</strong></div>
                <div class="gray">Mã gói: ${package_code}</div>
            </div>
            <div class="col-md-5 text-right">
                <div class="color-green txt_18"><strong>${amount.toLocaleString()} VNĐ</strong></div>
                <div class="gray txt_14">${from_date} - ${to_date}</div>
                <a class="btn-default cursor-pointer choose-room mt16 btn__delete_package" data-pack="${package_id}_${arrival_date}_${departure_date}">Xóa gói</a>
            </div>
        </div>
    </div>`;

    $(html_grid).insertBefore($(`.room-tab-grid[data-tab="${room_tab}"] .add_other_package`));
    _hotel_detail.loadTotalMoney();
    _global_popup.closeContextPopup('#modal-context-global');
    
    _hotel_detail.ReCalucateArrivalDepartureDate()
    hotel_surcharge.RenderSurchargeDate('.hotel-detail-popup-surcharge-table-td-date')

});

$('#block__detail_hotel_rooms').on('click', '.btn__delete_package', function () {
    let seft = $(this);
    let room_tab = $('#block__detail_hotel_rooms .tab-room-link.active').data('tab');
    let package_id = seft.data('pack');

    seft.closest('.addition_package').remove();
    $(`#hotel__detail_grid_selected_room ul[data-room="${room_tab}"] li.package_item[data-pack="${package_id}"]`).remove();

    _hotel_detail.removePackage(room_tab, package_id);
    _hotel_detail.ReCalucateArrivalDepartureDate()
    hotel_surcharge.RenderSurchargeDate('.hotel-detail-popup-surcharge-table-td-date')

    _hotel_detail.loadTotalMoney();
});

$('#block__detail_hotel_rooms').on('click', '.btn_back_to_room_list', function () {
    let seft = $(this);
    let parent = seft.closest('.block_package_addition');
    let checkbox_package = $('#cbk__order_multiple_pacekage');

    parent.addClass('hidden');
    parent.siblings().removeClass('hidden');
    checkbox_package.prop('checked', false);
    checkbox_package.closest('label.confir_res').removeClass('hidden');

    $('#hotel__detail_grid_selected_room ul').each(function () {
        $(this).children('.package_item').not(":eq(0)").remove();
    });

    _hotel_detail.loadTotalMoney();
});


$('#btn__continue_order').click(function () {

    let number_of_room = $('#input__number_room_order').val();
    let arrRoom = _hotel_detail.getRoomOrdered();
    let checkbox_package = $('#cbk__order_multiple_pacekage');

    if (arrRoom.length !== parseInt(number_of_room)) {
        let htmlBody = `<div class="bold txt_16 mb10">Chưa hoàn thành!</div>
                    <div class="gray mb16">Vui lòng nhập đủ thông tin phòng để tiếp tục</div>
                    <button type="button" data-dismiss="modal" class="btn btn-default">Đồng ý</button>`;
        _global_popup.showAlertPopup("width:335px", htmlBody);
    } else {
        sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)

        let isCheckBoxVisible = !checkbox_package.closest('label.confir_res').hasClass('hidden');

        if (isCheckBoxVisible && checkbox_package.is(":checked")) {

            $('#navbar .title-page').html('Khách sạn');
            $('#block__hotel_advisory').hide();

            let obj = {
                rooms: arrRoom,
                cacheId: $('#hotel_grid_cache_search').val(),
                arrivalDate: _hotel_detail.hotel.arrival_date,
                departureDate: _hotel_detail.hotel.departure_date
            };

            _ajax_caller.post('/hotel/MultiplePackageOfRoom', { model: obj }, function (result) {
                var package_addition = $('#block__detail_hotel_rooms .block_package_addition');
                package_addition.html(result);
                package_addition.siblings().addClass('hidden');
                package_addition.removeClass('hidden');
                checkbox_package.closest('label.confir_res').addClass('hidden');
            });

        } else {
            let obj = {
                hotelID: _hotel_detail.hotel.id,
                hotelName: _hotel_detail.hotel.name,
                telephone: _hotel_detail.hotel.phone,
                email: _hotel_detail.hotel.email,
                arrivalDate: _hotel_detail.hotel.arrival_date,
                departureDate: _hotel_detail.hotel.departure_date,
                rooms: _hotel_detail.rooms
            };

            _ajax_caller.post('/hotel/SaveCustomerData', { data: obj }, function (result) {
                if (result.isSuccess) {
                    sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)
                    sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.HotelDetailURL, window.location.href)

                    window.location.href = result.url;
                } else {
                    _msgalert.error(result.message);
                }
            });
        }
    }
});
$('#btn__check_order').click(function () {

    let number_of_room = $('#input__number_room_order').val();
    let arrRoom = _hotel_detail.getRoomOrdered();
    let checkbox_package = $('#cbk__order_multiple_pacekage');

    if (arrRoom.length !== parseInt(number_of_room)) {

        //let htmlBody = `<div class="bold txt_16 mb10">Chưa hoàn thành!</div>
        //            <div class="gray mb16">Vui lòng nhập đủ thông tin phòng để tiếp tục</div>
        //            <button type="button" data-dismiss="modal" class="btn btn-default">Đồng ý</button>`;
        //_global_popup.showAlertPopup("width:335px", htmlBody);

    
    } else {
        sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)

        let isCheckBoxVisible = !checkbox_package.closest('label.confir_res').hasClass('hidden');

        if (isCheckBoxVisible && checkbox_package.is(":checked")) {

            $('#navbar .title-page').html('Khách sạn');
            $('#block__hotel_advisory').hide();

            let obj = {
                rooms: arrRoom,
                cacheId: $('#hotel_grid_cache_search').val(),
                arrivalDate: _hotel_detail.hotel.arrival_date,
                departureDate: _hotel_detail.hotel.departure_date
            };

            _ajax_caller.post('/hotel/MultiplePackageOfRoom', { model: obj }, function (result) {
                var package_addition = $('#block__detail_hotel_rooms .block_package_addition');
                package_addition.html(result);
                package_addition.siblings().addClass('hidden');
                package_addition.removeClass('hidden');
                checkbox_package.closest('label.confir_res').addClass('hidden');
            });
           
      
        } else {
            $('#btn__check_order').attr('data-target', '#myModal14')
            $('#btn__check_order').attr('data-toggle', 'modal')
            let obj = {
                hotelID: _hotel_detail.hotel.id,
                hotelName: _hotel_detail.hotel.name,
                telephone: _hotel_detail.hotel.phone,
                email: _hotel_detail.hotel.email,
                arrivalDate: _hotel_detail.hotel.arrival_date,
                departureDate: _hotel_detail.hotel.departure_date,
                rooms: _hotel_detail.rooms
            };


            var html_btn = ''
            var html_body = ''
            var table_html = ''
            var Amonut_packages = 0;
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            //_hotel_detail.rooms.forEach((item) => {
            //    var html_code = ''
            //    var html_date = ''
            //    var html_amount = ''
            //    var night_number = 0;
            //    var td1 = ` `
            //    html_btn =`<button type="button" id="btn__summit_request_order" class="btn btn-default">Gửi</button>`
            //    item.packages.forEach((item2) => {
            //        html_code += `  <input type="text" class="form-control mb-2" id="" value="${item2.package_code}" disabled>`
            //        html_date += `  <input type="text" class="form-control mb-2" id="" value="${_hotel_detail.ConvertToDateDotnet(item2.arrival_date)} - ${_hotel_detail.ConvertToDateDotnet(item2.departure_date)}" disabled>`
            //        html_amount += `<input type="text" readonly="" class="form-control text-right mb-2" id="" value="${_hotel_detail.Comma(item2.amount)}" disabled>`
            //        Amonut_packages += item2.amount;
            //        night_number += (ConvertToDate(_hotel_detail.ConvertToDateDotnet(item2.departure_date)) - ConvertToDate(_hotel_detail.ConvertToDateDotnet(item2.arrival_date))) / millisecondsPerDay
            //    });
            //    var td2 = `   <td class="text-right"><input type="text" class="form-control text-right" id="" value="${item.room_number}" disabled></td>`
            //    var td3 = `   <td class="text-right"><input type="text" class="form-control text-right" id="" value="${item.room_number}" disabled></td>`
            //    table_html += `  <tr>
            //                        <td>1</td>
            //                       <td style="width: 30%;"><input type="email" class="form-control" id="" value="${item.room_name}" disabled></td>
            //                        <td>
            //                            <div class="flexbox align-center">
            //                                <div>
            //                                   `+ html_code + `
            //                                </div>
            //                            </div>
            //                        </td>
            //                        <td>
            //                           `+ html_date + `
            //                        </td>
            //                        <td class="text-right"><input type="text" class="form-control text-right" id="" value="${night_number}" disabled></td>
            //                        <td class="text-right"><input type="text" class="form-control text-right" id="" value="1" disabled></td>
            //                        <td class="text-right">
            //                        `+ html_amount + `
            //                        </td>

            //                    </tr>
            //                   `

            //});

            var type = $('#hotel-order-voucher-code').attr('data-type')
            var value = parseFloat($('#hotel-order-voucher-code').attr('data-value'))
            let total_discount = 0;
            $('#hotel__detail_grid_selected_room .selected_room_price').each(function () {
                let seft = $(this);
                var amount_room = parseInt(seft.data('amount'))
                var nights = parseInt(seft.data('nights'))
                if (value != undefined && !isNaN(value) && type != undefined && type.trim() != '') {
                    switch (type) {
                        case 'percent': {
                            total_discount += (amount_room * (value / 100) * nights)
                        } break
                        case 'vnd': {
                            total_discount += (value * nights);
                        } break
                    }

                }
            });

            Amonut_packages -= total_discount
            //var html_table2 = `  <tr class="bg-white">
            //                        <td></td>
            //                        <td class="text-left"></td>
            //                        <td></td>
            //                        <td></td>
            //                        <td></td>
            //                        <td class="text-right"><b>Chiết khấu</b></td>
            //                        <td class="text-right"><b>${_hotel_detail.Comma(total_discount)}</b></td>
            //                    </tr>
            //                        <tr class="bg-white">
            //                        <td></td>
            //                        <td class="text-left"></td>
            //                        <td></td>
            //                        <td></td>
            //                        <td></td>
            //                        <td class="text-right"><b>Tổng</b></td>
            //                        <td class="text-right"><b>${_hotel_detail.Comma(Amonut_packages)}</b></td>
            //                    </tr>`

            _ajax_caller.post('/hotel/CheckRequestHotel', { model: _hotel_detail.rooms, discount: total_discount }, function (result) {
                $('#table_body').html(result)
                if (_hotel_detail.rooms.length > 0) {
                    html_btn = `<button type="button" id="btn__summit_request_order" class="btn btn-default">Gửi</button>`
                }
                $('#btn_summit').html(html_btn)
            });
            //$('#table_body').html(table_html + html_table2)
            //$('#btn_summit').html(html_btn)
     
            //_ajax_caller.post('/hotel/SaveRequestData', { data: obj }, function (result) {
            //    if (result.isSuccess) {
            //        sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)
            //        sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.HotelDetailURL, window.location.href)

            //        window.location.href ="/booking/RequestHotelBooking/"+ result.id;
            //    } else {
            //        _msgalert.error(result.message);
            //    }
            //});
        }

        _ajax_caller.post('/hotel/GetHotelSurchage', { hotel_id: _hotel_detail.hotel.id }, function (result) {
            if (result != undefined && result.isSuccess == true && result.data != undefined) {
                var html_option = ''
                $(result.data).each(function (index, item) {
                    //<option value="{value}" data-id="{id}" data-code="{code}" data-amount="{amount}">{name}</option>
                    html_option += _hotel_detail.HTML.SurchageOption
                        .replaceAll('{name}', '[' + item.Code + '] ' + item.Name + ' (' + item.Description + ')')
                        .replaceAll('{id}', item.Id)
                        .replaceAll('{value}', item.Id)
                        .replaceAll('{code}', item.Code)
                        .replaceAll('{amount}', item.Price)

                })
                _hotel_detail.HTML.SurchageOptionRendered = html_option
               
            }
        });
    }
});
$(document).on('click', '#btn__summit_request_order',function () {

    let obj = {
        hotelID: _hotel_detail.hotel.id,
        hotelName: _hotel_detail.hotel.name,
        telephone: _hotel_detail.hotel.phone,
        email: _hotel_detail.hotel.email,
        arrivalDate: _hotel_detail.hotel.arrival_date,
        departureDate: _hotel_detail.hotel.departure_date,
        rooms: _hotel_detail.rooms,
        note: $('#note').val(),
        voucher: undefined,
        extrapackages:[]
    };
    var type = $('#hotel-order-voucher-code').attr('data-type')
    var value = parseFloat($('#hotel-order-voucher-code').attr('data-value'))
    let total_discount = 0;
    $('#hotel__detail_grid_selected_room .selected_room_price').each(function () {
        let seft = $(this);
        var amount_room = parseInt(seft.data('amount'))
        var nights = parseInt(seft.data('nights'))
        if (value != undefined && !isNaN(value) && type != undefined && type.trim() != '') {
            switch (type) {
                case 'percent': {
                    total_discount += (amount_room * (value / 100) * nights)
                } break
                case 'vnd': {
                    total_discount += (value * nights);
                } break
            }

        }
    });
    var total_surcharge = 0;
    $('#hotel-detail-popup-surcharge-table tr').each(function (index, item) {
        var tr = $(this)
        if (tr.attr('id') == 'hotel-detail-popup-surcharge-table-summary')
            return false;
        var selected_option = tr.find('select').find(':selected')
        var price = selected_option.attr('data-amount')
        var nights = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()))
        var quanity = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()))
        total_surcharge += parseFloat(price) * nights * quanity
        var start_date = tr.find('.hotel-detail-popup-surcharge-table-td-fromdate').data('daterangepicker').startDate._d
        var end_date = tr.find('.hotel-detail-popup-surcharge-table-td-todate').data('daterangepicker').startDate._d
        obj.extrapackages.push({
            "Id": 0,
            "PackageId": selected_option.attr('data-code'),
            "PackageCode": selected_option.attr('data-name'),
            "HotelBookingId": 0,
            "HotelBookingRoomId": 0,
            "Amount": (parseFloat(price) * nights * quanity),
            "UnitPrice": (parseFloat(price) * nights * quanity),
            "StartDate": hotel_surcharge.GetDayText(start_date,true),
            "EndDate": hotel_surcharge.GetDayText(end_date, true),
            "Nights": nights,
            "Quantity": quanity,
            "OperatorPrice": parseFloat(price),
            "SalePrice": parseFloat(price)
        })
    })

    if ($('#hotel-order-voucher-code').attr('data-id') != undefined && $('#hotel-order-voucher-code').attr('data-id').trim() != ''
        && $('#hotel-order-voucher-code').hasClass('voucher-applied')) {
        obj.voucher = {
            id: $('#hotel-order-voucher-code').attr('data-id'),
            code: $('#hotel-order-voucher-code').val(),
            discount: total_discount,
        }
    }
    _ajax_caller.post('/hotel/SaveRequestData', { data: obj }, function (result) {
        if (result.isSuccess) {

            $('#myModal14').hide();
            $('#myModal14').removeClass('show');
            $('#myModal14').removeAttr('role');
            var html_myModal15 = `<div class="modal-dialog" style="max-width: 550px;">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close close_modal" data-dismiss="modal">×</button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                    <img class="mb16" src="images/icons/success.png" alt="">
                                    <h4 class="modal-title">Gửi yêu cầu thành công</h4>
                                    <div class="txt_16 mb16">
                                        Chúng tôi sẽ liên hệ lại trong vài phút.<br>
                                        Nếu bạn cần được hỗ trợ ngay, hãy gọi tổng đài hỗ trợ 0936 191 192. Chúng tôi luôn sẵn sàng trả lời bạn từ 8h30 - 17h30, thứ 2 đến thứ 6 hàng tuần.
                                    </div>
                                    <div class="line-bottom mb16"></div>
                                    <div class="d-flex flex-nowrap gap_10">
                                        <a href="/"class="btn btn-default gray full">Quay về trang chủ</a>
                                        <a href="/booking/DetailRequestHotelBooking/?BookingId= ${result.id}" class="btn btn-default full">Theo dõi yêu cầu</a>
                                    </div>
                                </div>
                            </div>
                        </div>`
            $('#myModal15').html(html_myModal15)
            $('#myModal15').show();
            $('#myModal15').addClass('show');
            /* window.location.href = "/booking/DetailRequestHotelBooking/?BookingId=" + result.id;*/
        } else {
            _msgalert.error(result.message);
        }
    });
})
$(document).on('click', '.close_modal', function () {
    $('.homepage').removeClass('modal-open')
    $('.modal-backdrop').removeClass('modal-backdrop fade show')
    $('#myModal15').removeClass('show')
    $('#myModal15').attr('style','display: none;')
});
$('input[name="radio_price_type"]').click(function () {
    let value = $(this).val();
    $('#block__detail_hotel_rooms .list-room .dynamic_price').each(function () {
        let seft = $(this);
        let amount = parseFloat(seft.data('amount'));
        let night = parseFloat(seft.data('night'));
        if (value == 1) {
            seft.html(amount.toLocaleString() + " đ");
            seft.siblings('.gray').find('.night').html(night);
        } else {
            seft.html((amount / night).toLocaleString() + " đ")
            seft.siblings('.gray').find('.night').html("1");
        }
    });
});


$('.slide-image-package').each(function () {
    let seft = $(this);
    let container = seft.find('.swiper-container');
    let next = seft.find('.swiper-button-next');
    let prev = seft.find('.swiper-button-prev');
    let swiperslidedate = new Swiper(container, {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        speed: 1000,
        navigation: {
            nextEl: next,
            prevEl: prev,
        }
    });
});
$('#hotel-order-voucher-apply').click(function () {
    var voucher_code = $('#hotel-order-voucher-code').val()
    if (voucher_code == undefined || voucher_code == null || voucher_code.trim() == '') {
        _msgalert.error('Vui lòng điền vào mã giảm giá');
        return
    }
    if (_hotel_detail.rooms.length < parseInt($('#input__number_room_order').val())) {
        _msgalert.error('Vui lòng chọn thông tin tất cả các phòng trước khi áp dụng Voucher');
        $('#hotel-order-voucher-code').val('')
        $('#hotel-order-voucher-code').removeClass('voucher-applied')
        return
    }
    var request = {
        "voucher_name": voucher_code,
        "service_id": $('#input__hotel_id').val(),
        "token": $('#input__token_order').val(),
        "detail": {
            hotelID: _hotel_detail.hotel.id,
            rooms: _hotel_detail.rooms,
        }

    }
    _ajax_caller.post('/hotel/TrackingVoucher', { "request": request }, function (result) {
        if (result.isSuccess) {
            _msgalert.success('Áp dụng mã Voucher [' + voucher_code + '] thành công');
            $('#hotel-order-voucher-code').prop('disabled', true)
            $('#hotel-order-voucher-code').prop('readonly', true)
            $('#hotel-order-voucher-apply').prop('disabled', true)
            $('#hotel-order-voucher-apply').addClass('gray')
            $('#hotel-order-voucher-apply').prop('disabled', true)
            $('#hotel-order-voucher-apply').addClass('gray')
            $('#hotel-order-voucher-code').addClass('voucher-applied')
            $('#hotel__booking_total_amount').html(_hotel_detail.Comma(result.data.total_order_amount_after) + ' VNĐ')
            $('#hotel-order-total-amount-old').html(_hotel_detail.Comma(result.data.total_order_amount_before) + ' VNĐ')
            $('#hotel-order-total-discount').html('- ' + _hotel_detail.Comma(result.data.total_order_amount_before - result.data.total_order_amount_after) + ' VNĐ')
            $('#hotel-order-voucher-code').attr('data-id', result.data.voucher_id)
            $('#hotel-order-voucher-code').attr('data-discount', (result.data.total_order_amount_before - result.data.total_order_amount_after))
            $('#hotel-order-voucher-code').attr('data-type', result.data.type)
            $('#hotel-order-voucher-code').attr('data-value', result.data.value)
            $('#hotel-order-voucher-popup').attr('data-type', result.data.type)
            $('#hotel-order-voucher-popup').attr('data-value', result.data.value)

        } else {
            _msgalert.error(result.message);
        }
    });
});
$(document).on('click', '#hotel-detail-popup-surcharge-table-add-surcharge', function () {
    $('#hotel-detail-popup-surcharge-table-summary').before(
        _hotel_detail.HTML.SurchageItem.replaceAll('{item}', _hotel_detail.HTML.SurchageOptionRendered).replaceAll('{count}', $('#hotel-detail-popup-surcharge-table tr').length)

    )
    $('.hotel-detail-popup-surcharge-table-td-new select').val('-1').trigger('change')
    hotel_surcharge.RenderSurchargeDate()
    $('.hotel-detail-popup-surcharge-table-td-new').removeClass('hotel-detail-popup-surcharge-table-td-new')

});
$(document).on('click', '#hotel-detail-popup-surcharge-table .delete', function () {
    $(this).closest('tr').remove()
    $('#hotel-detail-popup-surcharge-table tr').each(function (index, item) {
        var element = $(this)
        if (element.attr('id') == 'hotel-detail-popup-surcharge-table-summary') return false
        element.find('td').first().html((index+1))
    })
    hotel_surcharge.CalucateTotalRequestAmount()

});
$(document).on('change', '#hotel-detail-popup-surcharge-table select', function () {
    var element = $(this)
    var tr = element.closest('tr')
    hotel_surcharge.CalucateTotalSurchage(tr)

});
$(document).on('keyup', '#hotel-detail-popup-surcharge-table .hotel-detail-popup-surcharge-table-td-quanity', function () {
    var element = $(this)
    var tr = element.closest('tr')
    hotel_surcharge.CalucateTotalSurchage(tr)

});
$('body').on('apply.daterangepicker', '.hotel-detail-popup-surcharge-table-td-fromdate, .hotel-detail-popup-surcharge-table-td-todate', function () {
    var element = $(this)
    var tr = element.closest('tr')
    hotel_surcharge.CalucateTotalSurchage(tr)

});
var hotel_surcharge = {
    CalucateTotalSurchage: function (tr) {
        var selected_option = tr.find('select').find(':selected')
        var id = selected_option.attr('data-id')
        var code = selected_option.attr('data-code')
        var price = selected_option.attr('data-amount')
        if (tr.find('.hotel-detail-popup-surcharge-table-td-fromdate').data('daterangepicker') == undefined
            || tr.find('.hotel-detail-popup-surcharge-table-td-todate').data('daterangepicker') == undefined)
            return;
        var start_date = tr.find('.hotel-detail-popup-surcharge-table-td-fromdate').data('daterangepicker').startDate._d
        var end_date = tr.find('.hotel-detail-popup-surcharge-table-td-todate').data('daterangepicker').startDate._d
        const differenceInTime = end_date - start_date;

        // Convert milliseconds to days
        const diff = differenceInTime / (1000 * 60 * 60 * 24);

        tr.find('.hotel-detail-popup-surcharge-table-td-nights').val(diff).trigger('change')
        var nights = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()))
        var quanity = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()))
        var amount = parseFloat(price) * nights * quanity
        tr.find('.hotel-detail-popup-surcharge-table-td-price').val(isNaN(amount) || amount <= 0 ? '0' : _hotel_detail.Comma(amount)).trigger('change')
        hotel_surcharge.CalucateTotalRequestAmount()
    },
    CalucateTotalRequestAmount: function () {
        var type = $('#hotel-order-voucher-code').attr('data-type')
        var value = parseFloat($('#hotel-order-voucher-code').attr('data-value'))
        let total_discount = 0;
        let total_amount = 0;
        let total_surcharge = 0;
        $('#hotel__detail_grid_selected_room .selected_room_price').each(function () {
            let seft = $(this);
            var amount_room = parseInt(seft.data('amount'))
            total_amount+=amount_room
            var nights = parseInt(seft.data('nights'))
            if (value != undefined && !isNaN(value) && type != undefined && type.trim() != '') {
                switch (type) {
                    case 'percent': {
                        total_discount += (amount_room * (value / 100) * nights)
                    } break
                    case 'vnd': {
                        total_discount += (value * nights);
                    } break
                }

            }
        });
        $('#hotel-detail-popup-surcharge-table tr').each(function (index, item) {
            var tr = $(this)
            if (tr.attr('id') == 'hotel-detail-popup-surcharge-table-summary')
                return false;
            var selected_option = tr.find('select').find(':selected')
            var price = selected_option.attr('data-amount')
            var nights = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-nights').val()))
            var quanity = (isNaN(parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val())) || parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()) < 0 ? 0 : parseInt(tr.find('.hotel-detail-popup-surcharge-table-td-quanity').val()))
            total_surcharge += parseFloat(price) * nights * quanity
        })
        $('#hotel-detail-popup-surcharge-table-summary-total b').html(_hotel_detail.Comma(total_surcharge))
        $('#hotel-detail-popup-total-table-summary-total b').html(_hotel_detail.Comma(total_amount + total_surcharge - total_discount))
    },
    GetDayText: function (date, donetdate = false) {
        var text = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
        if (donetdate) {
            text = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
        }
        return text;
    },
    RenderSurchargeDate: function (element_class = `.hotel-detail-popup-surcharge-table-td-new .hotel-detail-popup-surcharge-table-td-date`) {
        var StartDate = _hotel_detail.hotel.arrival_date;
        var Enddate = _hotel_detail.hotel.departure_date;

        $(`` + element_class).daterangepicker({
            autoUpdateInput: true,
            autoApply: true,
            singleDatePicker: true,
            startDate: StartDate.split('-')[2] + '/' + StartDate.split('-')[1] + '/' + StartDate.split('-')[0],
            minDate: StartDate.split('-')[2] + '/' + StartDate.split('-')[1] + '/' + StartDate.split('-')[0],
            maxDate: Enddate.split('-')[2] + '/' + Enddate.split('-')[1] + '/' + Enddate.split('-')[0],
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

        })

    },
   
}

