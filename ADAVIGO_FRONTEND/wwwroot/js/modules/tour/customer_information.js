$(document).ready(function () {
    customer_information.Initialization()
})
   
var customer_information = {
    Initialization: function () {
        customer_information.TourDetail()
        customer_information.DynamicBind()
    },
    DynamicBind: function () {
        $('#btn_continue_to_payment').click(function () {
            $(this).append(` <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>`)
            customer_information.OnSubmit();
        });
        $('.tang_sl').on('click', function () {
            // baby not > adult
            var currentInputType = $(this).closest('.sl_giohang').find('input').prop("id");
            if (currentInputType == "qty_input_baby") {
                var adultNumber = Number($('#qty_input_adt').val());
                var babyNumber = Number($('#qty_input_baby').val());
                if (babyNumber == adultNumber)
                    return;
            }

            // total adult + children <= 9
            var adultNumber = Number($('#qty_input_adt').val());
            var childrenNumber = Number($('#qty_input_chil').val());
            var babyNumber = Number($('#qty_input_baby').val());

            if (childrenNumber + adultNumber + babyNumber == 9)
                return;

            var inputCurrentNumber = $(this).closest('.sl_giohang').find('input');
            $(inputCurrentNumber).val(Number($(inputCurrentNumber).val()) + 1);
            $('.qty-customer').html(
                Number($('#qty_input_adt').val()) +
                Number($('#qty_input_chil').val()) +
                Number($('#qty_input_baby').val())
            );

            var adultNumber = Number($('#qty_input_adt').val());
            var babyNumber = Number($('#qty_input_baby').val());
            if (babyNumber <= adultNumber) {
                $("#error-number-passenger").removeClass("has-error")
            }
        });
        // Minus number of ticket
        $('.giam_sl').on('click', function () {

            var inputCurrentNumber = $(this).closest('.sl_giohang').find('input');
            if ($(inputCurrentNumber).val() > 1 && inputCurrentNumber.hasClass('qty_input_adt')) {
                $(inputCurrentNumber).val(Number($(inputCurrentNumber).val()) - 1);
            } else if ($(inputCurrentNumber).val() > 0 && !inputCurrentNumber.hasClass('qty_input_adt')) {
                $(inputCurrentNumber).val(Number($(inputCurrentNumber).val()) - 1);
            }

            $('.qty-customer').html(
                Number($('#qty_input_adt').val()) +
                Number($('#qty_input_chil').val()) +
                Number($('#qty_input_baby').val())
            );

            var adultNumber = Number($('#qty_input_adt').val());
            var babyNumber = Number($('#qty_input_baby').val());
            if (babyNumber > adultNumber) {
                $("#error-number-passenger").addClass("has-error")
            }
            else {
                $("#error-number-passenger").removeClass("has-error")
            }

        });
         $('.tang_sl, .giam_sl').on('click', function (e) {
            var element = $(this)
           
            if (!isNaN(parseInt($('#qty_input-adt').val().trim())) && parseInt($('#qty_input-adt').val().trim()) < 1) {
                $('#qty_input-adt').val('1').trigger('change')
            }
            customer_information.RenderTourists()
            customer_information.RenderPrice()
        });
        $('.qty_input').on('keyup', function (e) {
            if (!isNaN(parseInt($('#qty_input-adt').val().trim())) && parseInt($('#qty_input-adt').val().trim()) < 1) {
                $('#qty_input-adt').val('1').trigger('change')
            }
            customer_information.RenderTourists()
            customer_information.RenderPrice()

        });
        $('.qty_input').on('focusout', function (e) {
            var element = $(this)
            if (element.val() == null || element.val() == undefined || isNaN(parseInt(element.val().replace(',', '')))) {
                element.val('0').trigger('change')
            }
            if (!isNaN(parseInt($('#qty_input-adt').val().trim())) && parseInt($('#qty_input-adt').val().trim()) < 1) {
                $('#qty_input-adt').val('1').trigger('change')
            }
            customer_information.RenderTourists()
            customer_information.RenderPrice()

        });
          $('body').on('select2:select', '#tour-detail-schedule-fixed', function (e) {
    
              var adt_value = parseFloat($('#tour-schedule-flex').attr('data-adt'))
              var chd_value = parseFloat($('#tour-schedule-flex').attr('data-chd'))

            $('.base-price-adt-nw').html(tour_service.Comma(adt_value))
            $('.base-price-chd-nw').html(tour_service.Comma(chd_value))
            customer_information.RenderPrice()

        });
       
    },
    TourDetail: function () {
        var request = sessionStorage.getItem(tour_constants.STORAGE.TourCart)
        if (request) {
            var request_model = JSON.parse(request)
            var model = {
                "tour_id": request_model.id
            }
            _ajax_caller.post('/tour/TourDetail', { "request": model }, function (result) {
                if (result != undefined && result.status != undefined && result.status == 0) {
                    customer_information.RenderDetail(result)

                } else {
                    window.location.href = '/Error'
                }

            });
        }
        else {
            window.location.href = '/Error'
        }
    },
    RenderDetail: function (result) {
        var request = sessionStorage.getItem(tour_constants.STORAGE.TourCart)
        $('.tour-name').attr('data-id',result.data.id)
        $('.tour-name').html(result.data.tourName)
        $('.on-star .star').html(customer_information.RenderStar(result.data.star))
        customer_information.SingleDatePickerFromNow($('.tour-detail-schedule-flex'))
        var item_avatar = result.data.avatar.includes(tour_constants.Domain.StaticImage) ? result.data.avatar : tour_constants.Domain.StaticImage + result.data.avatar
        $('.col-300 .col-4 img').attr('src',item_avatar)
        $('#total_nights').attr('data-nights', result.data.days)
        $('#total_nights').html((result.data.days + 1) + ' ngày '+result.data.days+' đêm')
        var daily_adt_price= result.data.daily_adultprice != null && result.data.daily_adultprice != undefined && result.data.daily_adultprice > 0 ? result.data.daily_adultprice : result.data.price
        var daily_chd_price= result.data.daily_childprice != null && result.data.daily_childprice != undefined && result.data.daily_childprice > 0 ? result.data.daily_childprice : result.data.price
        $('#tour-schedule-flex').attr('data-adt',daily_adt_price)
        $('#tour-schedule-flex').attr('data-chd',daily_chd_price)

        if (result.data.packages != null && result.data.packages != undefined && result.data.packages.length > 0) {
            var html_option = ''
            if (daily_adt_price == 0) {
                $('#tour-schedule-flex').attr('data-adt', result.data.packages[0].AdultPrice)
            }
            if (daily_chd_price == 0) {
                $('#tour-schedule-flex').attr('data-chd', result.data.packages[0].ChildPrice)
            }
            $(result.data.packages).each(function (index, item) {
                if (item.Id == parseFloat(request.selected_packageid)){
                    html_option += tour_constants.HTML.DetailSelectTourScheduleOption2.replaceAll('{id}', item.Id).replaceAll('{adt}', item.AdultPrice)
                        .replaceAll('{chd}', item.ChildPrice).replaceAll('{time}', customer_information.RenderDetailSelectTourScheduleOptionTime(item.FromDate))
                } else {
                    html_option += tour_constants.HTML.DetailSelectTourScheduleOption.replaceAll('{id}', item.Id).replaceAll('{adt}', item.AdultPrice)
                        .replaceAll('{chd}', item.ChildPrice).replaceAll('{time}', customer_information.RenderDetailSelectTourScheduleOptionTime(item.FromDate))
                }
  
            });
            $('#tour-detail-schedule-fixed').html(html_option)
            $('#tour-detail-schedule-fixed').select2()
            
            $('#select-date-departure').hide()
        } else {
            $('#tour-schedule-fixed').hide()
            $("input[name='tour-schedule'][value='1']").prop('checked', true)
        }
        customer_information.SingleDatePickerFromNow($('.tour-detail-schedule-flex'))
        customer_information.RenderPrice()

    },
     RenderPrice: function () {
        var amount = 0
        var selected_adult_price=0
        var selected_child_price=0

         selected_adult_price = parseFloat($('#tour-schedule-flex').attr('data-adt'))
         selected_child_price = parseFloat($('#tour-schedule-flex').attr('data-chd'))
         $('.base-price-adt-nw').html(tour_service.Comma(selected_adult_price))
         $('.base-price-chd-nw').html(tour_service.Comma(selected_child_price))
        var adt = $('#qty_input-adt').val()
        var adt_number = parseInt(adt)
        if (adt_number!=null && !isNaN(adt_number) && adt_number>0) {
            $('#price-adt').show()
            $('#booking-adt').html('' + adt)
            var adt_amount = adt_number * selected_adult_price
            amount += adt_amount
            $('#amount-adt').html(tour_service.Comma(adt_amount))

        }
        else {
            $('#price-adt').hide()
        }

        var chd = $('#qty_input-chd').val()
        var chd_number = parseInt(chd)
        if (chd_number != null && !isNaN(chd_number) && chd_number > 0) {
            $('#price-chd').show()
            $('#booking-chd').html('' + chd)
            var chd_amount = chd_number * selected_child_price
            amount += chd_amount
            $('#amount-chd').html(tour_service.Comma(chd_amount))
        }
        else {
            $('#price-chd').hide()

         }
         $('.total-amount').attr('data-amount', amount)
        $('.total-amount').html(tour_service.Comma(amount) + ' VND')
        $('#amount-total').html(tour_service.Comma(amount) + ' VND')
        $('#amount-total-before-discount').html(tour_service.Comma(amount) + ' VND')

    },
    RenderTourists: function () {
        $('#qty_adt').html($('#qty_input-adt').val())
        var chd = $('#qty_input-chd').val()
        if (isNaN(parseInt(chd)) || parseInt(chd) <= 0) {
            $('#qty_chd').html('')

        }
        else {
            $('#qty_chd').html(' + ' + chd + ' trẻ em')

        }
        var inf = $('#qty_input-inf').val()
        if (isNaN(parseInt(inf)) || parseInt(inf) <= 0) {
            $('#qty_inf').html('')

        }
        else {
            $('#qty_inf').html(' + ' + inf + ' em bé')

        }
    },
    SingleDatePickerFromNow: function (element, dropdown_position = 'down') {

        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; // Months start at 0!
        var dd = today.getDate();
        var yyyy_max = yyyy + 10;
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        var time_now = dd + '/' + mm + '/' + yyyy;
        var max_range = '31/12/' + yyyy_max;

        element.daterangepicker({
            singleDatePicker: true,
            autoApply: true,
            showDropdowns: true,
            drops: dropdown_position,
            minDate: time_now,
            maxDate: max_range,
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end, label) {


        });
    },
    RenderStar: function (value) {
        var html_template = tour_constants.HTML.Star
        var html = ''
        if (value == null || value == undefined || value <= 0) return html
        if (value > 5) value = 5
        for (var i = 0; i < value; i++) {
            html += html_template
        }
        return html
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
        let form_data = customer_information.getFormData(FromCreate);

        let contact = {
            firstName: form_data.firstName,
            email: form_data.email,
            phoneNumber: form_data.phoneNumber,
            country: form_data.country,
            address: form_data.address,
            note: form_data.note,
            tourName: $('.tour-name').text(),
            numberOfAdult: $('#qty_input-adt').val(),
            numberOfChild: $('#qty_input-chd').val(),
            totalAmount: $('.total-amount').attr('data-amount'),
            startDate: $('#tour-detail-schedule-flex').val(),
            totalNights: $('#total_nights').attr('data-nights'),
            tourId: $('.tour-name').attr('data-id'),
            packageId: $('#tour-detail-schedule-fixed').val(),
        };

       

        let obj = {
            //"search": search,
            //"rooms": rooms,
            "contact": contact,
            "order_token": $('#input__token_order').val()
        };

        if (valid) {
            _ajax_caller.post('/Tour/SaveTour', { model: contact }, function (result) {
                if (result.isSuccess) {
                    //_msgalert.success(result.message);
                    setTimeout(function () {
                        window.location.href = `/Tour/payment?booking=${result.data}`
                    }, 2000);

                } else {
                    _msgalert.error(result.message);
                }
            });
        }

    },

    getFormData: function ($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    },
    RenderDetailSelectTourScheduleOptionTime: function (strdate) {
        if (strdate == null || strdate == "") {
            return null;
        }
        let arrdate = strdate.split('T')[0].split('-');
        return (arrdate[2]+"/"+arrdate[1]+"/"+arrdate[0]);

    },
}