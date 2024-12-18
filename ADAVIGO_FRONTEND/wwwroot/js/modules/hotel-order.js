var _hotel_order = {
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

    getFormData: function ($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    },

    OnSubmit: function () {
        let FromCreate = $('#form_order_client_info');

        FromCreate.validate({
            rules: {
                firstName: "required",
                //lastName: "required",
                phoneNumber: {
                    required: true,
                    number: true,
                    minlength: 10
                },
                email: {
                    email: true
                }
            },
            messages: {
                firstName: "Vui lòng nhập tên người đại diện",
                //lastName: "Vui lòng nhập tên người đại diện",
                phoneNumber: {
                    required: "Vui lòng nhập số điện thoại",
                    number: "Số điện thoại phải là dạng số",
                    minlength: "Số điện thoại phải có tối thiểu 10 ký tự"
                },
                email: {
                    email: 'Email không đúng định dạng'
                }
            }
        });

        //$(".member_name").rules("add", {
        //    required: true,
        //    minlength: 3
        //});

        if (!FromCreate.valid()) {
            $('label.error').siblings('.error').first().focus();
            return;
        }

        let valid = true;
        let form_data = _hotel_order.getFormData(FromCreate);

        let contact = {
            firstName: form_data.firstName,
            //lastName: form_data.lastName,
            email: form_data.email,
            phoneNumber: form_data.phoneNumber,
            country: form_data.country,
            birthday: "",
            province: "",
            district: "",
            ward: "",
            address: form_data.address,
            note: form_data.note
        };

        let pickup_arrive_time = moment(form_data.arrive_date, 'DD/MM/YYYY HH:mm');
        let pickup_departure_time = moment(form_data.departure_date, 'DD/MM/YYYY HH:mm');

        let pickup = {
            "arrive": {
                "required": parseInt(form_data.arrive_able),
                "id_request": null,
                "stop_point_code": "",
                "vehicle": form_data.arrive_vehicle,
                "fly_code": form_data.arrive_plane_code,
                "amount_of_people": parseInt($('.qty_input_arrive').val()),
                "datetime": pickup_arrive_time.toJSON(),
                "note": form_data.arrive_note
            },
            "departure": {
                "required": parseInt(form_data.departure_able),
                "id_request": null,
                "stop_point_code": "",
                "vehicle": form_data.departure_vehicle,
                "fly_code": form_data.departure_plane_code,
                "amount_of_people": $('.qty_input_departure').val(),
                "datetime": pickup_departure_time.toJSON(),
                "note": form_data.departure_note
            }
        };

        if (pickup_arrive_time > pickup_departure_time) {
            valid = false;
            _msgalert.error("Ngày đón khách không được lớn hơn ngày tiễn khách. Vui lòng chọn ngày khác.");
            return;
        }

        if (pickup.arrive.required == 1) {
            if (pickup.arrive.vehicle == "") {
                valid = false;
                _msgalert.error("Bạn phải chọn phương tiện đón khách");
                return;
            }

            if (parseInt(pickup.arrive.amount_of_people) <= 0) {
                valid = false;
                _msgalert.error("Số lượng người cần đón phải lớn hơn 0");
                return;
            }
        }

        if (pickup.departure.required == 1) {
            if (pickup.departure.vehicle == "") {
                valid = false;
                _msgalert.error("Bạn phải chọn phương tiện tiễn khách");
                return;
            }

            if (parseInt(pickup.departure.amount_of_people) <= 0) {
                valid = false;
                _msgalert.error("Số lượng người cần tiễn phải lớn hơn 0");
                return;
            }
        }

        let guests = [];
        $('.info-room-block-item').each(function () {
            let seft = $(this);
            let room = seft.data('room');
            seft.find('.room_user_item').each(function () {
                let user_child = $(this);
                let user_birth_day = ConvertToDate(user_child.find(".member_date").val());
                let user_full_name = user_child.find(".member_name").val()
                let type = user_child.data('guesttype') == undefined ? '0' : user_child.data('guesttype')

                guests.push({
                    "profile_type": 2,
                    "room": room,
                    "firstName": user_full_name,
                    "lastName": "",
                    "birthday": ConvertJsDateToString(user_birth_day, "YYYY-MM-DD"),
                    "type": type
                });
            });
        });

        let obj = {
            //"search": search,
            //"rooms": rooms,
            "contact": contact,
            "guests": guests,
            "pickup": pickup,
            "order_token": $('#input__token_order').val(),
            
            voucher: undefined
        };
        if ($('#hotel-order-voucher-code').attr('data-id') != undefined && $('#hotel-order-voucher-code').attr('data-id').trim() != '' && $('#hotel-order-voucher-code').hasClass('voucher-applied')) {
            obj.voucher_code = $('#hotel-order-voucher-code').val()
            obj.voucher = {
                id: $('#hotel-order-voucher-code').attr('data-id'),
                code: $('#hotel-order-voucher-code').val(),
                discount: ($('#hotel-order-voucher-code').attr('data-discount') == undefined || isNaN(parseFloat($('#hotel-order-voucher-code').attr('data-discount')))) ?0 : parseFloat($('#hotel-order-voucher-code').attr('data-discount')),
            }
        }
        if (valid) {
            _ajax_caller.post('/hotel/SaveOrder', { dataObject: JSON.stringify(obj) }, function (result) {
                if (result.isSuccess) {
                    //_msgalert.success(result.message);
                    setTimeout(function () {
                        window.location.href = `/hotel/payment?booking=${result.data}`
                    }, 2000);

                } else {
                    _msgalert.error(result.message);
                }
            });
        }

    },

    getDataFromFile: function () {
        //_ajax_caller.post('/hotel/GetDataFromFile', { dataObject: JSON.stringify(obj) }, function (result) {
        //    if (result.isSuccess) {
        //        //_msgalert.success(result.message);
        //        setTimeout(function () {
        //            window.location.href = `/hotel/payment?booking=${result.data}`
        //        }, 2000);

        //    } else {
        //        _msgalert.error(result.message);
        //    }
        //});
    },

    dateSinglePicker: function (element) {
        $(element).daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            locale: _hotel_order.local_date_picker
        });
    },

    dateAdultSinglePicker: function (element) {
        $(element).daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoUpdateInput: false,
            autoApply: true,
            locale: _hotel_order.local_date_picker
        });
    },

    dateSingleTimePicker: function (element) {
        $(element).daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            minDate: moment(),
            showDropdowns: true,
            autoApply: true,
            drops: "up",
            locale: _hotel_order.local_date_picker
        });
    },
    Comma: function (number) { //function to add commas to textboxes
        number = ('' + number).replace(/[^0-9.,]+/g, '');
        number += '';
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;
    }
};

$('.btn_add_user_room').click(function () {
    let seft = $(this);
    let adult_order = parseInt($('#input__number_adult_order').val());
    let child_order = parseInt($('#input__number_child_order').val());
    let infant_order = parseInt($('#input__number_infant_order').val());

    let total_user = adult_order + child_order + infant_order;
    let total_input_user = $('.info-room-block-item .room_user_item').length;

    if (total_input_user >= total_user) {
        seft.siblings('.note-warring').show();
        setTimeout(function () {
            seft.siblings('.note-warring').hide();
        }, 2000);

    } else {

        var current_total_user = seft.closest('.info-room-block-item').find('.room_user_item').length + 1;

        let html = `
        <div class="row input-padding-right room_user_item">
            <div class="col-md-6 form-group">
                <label class="" for="exampleInputEmail1">Thành viên ${current_total_user}</label>
                <input type="text" class="form-control member_name">
            </div>
            <div class="col-md-6 form-group">
                <label class="" for="exampleInputEmail1">Ngày sinh</label>
                <div class="line-btn-date">
                    <input class="form-control datepicker-input member_date" type="text" name="birthday" placeholder="Ngày sinh" />
                </div>
            </div>
            <a class="cursor-pointer delete" onclick="$(this).closest('.room_user_item').remove();">
                <span class="icon">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.941406" width="24" height="24" rx="12" fill="#F73B2F"/>
                        <path d="M15.4363 17.1586H10.4793C10.2203 17.1586 10.0059 16.9582 9.98828 16.6992L9.56289 10.3758C9.54414 10.091 9.76914 9.85078 10.0539 9.85078H15.8617C16.1465 9.85078 16.3715 10.0922 16.3527 10.3758L15.9273 16.6992C15.9098 16.9582 15.6953 17.1586 15.4363 17.1586ZM16.8379 8.92852H9.13867C9.13164 8.92852 9.12695 8.92383 9.12695 8.9168V7.57031C9.12695 7.56328 9.13164 7.55859 9.13867 7.55859H16.8379C16.8449 7.55859 16.8496 7.56328 16.8496 7.57031V8.91563C16.8496 8.92266 16.8449 8.92852 16.8379 8.92852Z" fill="white"/>
                        <path d="M15.0383 8.22065H10.9238C10.9168 8.22065 10.9121 8.21597 10.9121 8.20894V6.67847C10.9121 6.67144 10.9168 6.66675 10.9238 6.66675H15.0383C15.0453 6.66675 15.05 6.67144 15.05 6.67847V8.20894C15.05 8.21479 15.0453 8.22065 15.0383 8.22065Z" fill="white"/>
                    </svg>
                </span> Xoá
            </a>
        </div>`;

        $(html).insertBefore(seft.parent());
        _hotel_order.dateSinglePicker('.datepicker-input');
    }
});

$('.minus-btn').click(function () {
    let seft = $(this);
    var input = seft.parent().siblings('input');
    var value = parseInt(input.val());
    if (value > 0) {
        input.val(value - 1);
    }
});

$('.plus-btn').click(function () {
    let seft = $(this);
    var input = seft.parent().siblings('input');
    var value = parseInt(input.val());
    input.val(value + 1);
});

$('#btn_continue_to_payment').click(function () {
    $(this).append(` <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>`)
    _hotel_order.OnSubmit();
});
$('#hotel-order-voucher-apply').click(function () {
    var voucher_code = $('#hotel-order-voucher-code').val()
    if (voucher_code == undefined || voucher_code == null || voucher_code.trim() == '') {
        _msgalert.error('Vui lòng điền vào mã giảm giá');
        return
    }
    var request = {
        "voucher_name": voucher_code,
        "token": $('#input__token_order').val()
    }
    _ajax_caller.post('/hotel/TrackingVoucher', { "request": request }, function (result) {
        if (result.isSuccess) {
            _msgalert.success('Áp dụng mã Voucher [' + voucher_code + '] thành công');
            $('#hotel-order-voucher-code').prop('disabled',true)
            $('#hotel-order-voucher-code').prop('readonly',true)
            $('#hotel-order-voucher-apply').prop('disabled', true)
            $('#hotel-order-voucher-apply').addClass('gray')
            $('#hotel-order-voucher-apply').addClass('voucher-applied')
            $('#hotel-order-total-amount').html(_hotel_order.Comma(result.data.total_order_amount_after)+' VNĐ')
            $('#hotel-order-total-amount-old').html(_hotel_order.Comma(result.data.total_order_amount_before)+' VNĐ')
            $('#hotel-order-total-discount').html('- '+_hotel_order.Comma(result.data.total_order_amount_before-result.data.total_order_amount_after)+' VNĐ')
            $('#hotel-order-voucher-code').attr('data-id', result.data.voucher_id)
            $('#hotel-order-voucher-code').attr('data-discount', (result.data.total_order_amount_before - result.data.total_order_amount_after))


        } else {
            _msgalert.error(result.message);
        }
    });
});

$(document).ready(function () {
    _hotel_order.dateSinglePicker('.datepicker-input-child');
    _hotel_order.dateSinglePicker('.datepicker-input-infant');
    _hotel_order.dateSingleTimePicker('.date-arrive-picker');
    _hotel_order.dateSingleTimePicker('.date-departure-picker');

    _hotel_order.dateAdultSinglePicker('.datepicker-input-adult');

    //if ($('.datepicker-input-adult').length > 0) {
    //    $('.datepicker-input-adult').each(function () {
    //        $(this).data('daterangepicker').minDate = moment().add(-103, 'y');
    //        $(this).data('daterangepicker').maxDate = moment().add(-13, 'y');
    //    });
    //}

    if ($('.datepicker-input-child').length > 0) {
        $('.datepicker-input-child').each(function () {
            $(this).data('daterangepicker').minDate = moment().add(-12, 'y');
            $(this).data('daterangepicker').maxDate = moment().add(-4, 'y');
        });
    }

    if ($('.datepicker-input-infant').length > 0) {
        $('.datepicker-input-infant').each(function () {
            $(this).data('daterangepicker').minDate = moment().add(-3, 'y');
            $(this).data('daterangepicker').maxDate = moment();
        });
    }
    var order_id = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)
    if (order_id) {
        var url = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.HotelDetailURL)
        $('body').append(hotel_constants.HTML.BookingExprire.replaceAll('{url}', url ? url:'/hotel'))
        $('#hotel-booking-exprire').modal('toggle');
        sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.HotelDetailURL)
        //window.location.href = url ? url :'/hotel'

    }
});