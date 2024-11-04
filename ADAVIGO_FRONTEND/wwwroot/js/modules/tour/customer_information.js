$(document).ready(function () {
    customer_information.Initialization()
})
   
var customer_information = {
    Initialization: function () {
        customer_information.TourDetail()
        customer_information.DynamicBind()
    },
    DynamicBind: function () {
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
            var selected_value = $('#tour-detail-schedule-fixed').find(':selected')
            var adt_value = selected_value.attr('data-adult')
            var chd_value = selected_value.attr('data-child')
            $('.base-price-adt-nw').html(tour_function.Comma(adt_value))
            $('.base-price-chd-nw').html(tour_function.Comma(chd_value))
            customer_information.RenderPrice()

        });
        $('body').on('change', '.tour-schedule-checkbox', function () {
            var element = $(this)
            $('.tour-schedule-checkbox').prop('checked', false);
            element.prop('checked', true);
            var value = element.val()
            if (value == '1') {
                var daily_adt=$('#tour-schedule-flex').attr('data-adt')
                var daily_chd=$('#tour-schedule-flex').attr('data-chd')
                $('.base-price-adt-nw').html(tour_function.Comma(daily_adt))
                $('.base-price-chd-nw').html(tour_function.Comma(daily_chd))
                customer_information.RenderPrice()

            }
            else if (value == '0') {
                var selected_value = $('#tour-detail-schedule-fixed').find(':selected')
                var adt_value = selected_value.attr('data-adult')
                var chd_value = selected_value.attr('data-child')
                $('.base-price-adt-nw').html(tour_function.Comma(adt_value))
                $('.base-price-chd-nw').html(tour_function.Comma(chd_value))
                tourCustomerInfo.RenderPrice()
            }
        });

    },
    TourDetail: function () {
        var request = sessionStorage.getItem(TOUR_CONSTANTS.STORAGE.TourCart)
        if (request) {
            var request_model = JSON.parse(request)
            var model = {
                "tour_id": request_model.tour_id
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
        $('.tour-name').html(result.data.tourName)
        $('.on-star .star').html(customer_information.RenderStar(result.data.star))
        customer_information.SingleDatePickerFromNow($('.tour-detail-schedule-flex'))
        var item_avatar = result.data.avatar.includes(TOUR_CONSTANTS.Domain.StaticImage) ? result.data.avatar : TOUR_CONSTANTS.Domain.StaticImage + result.data.avatar
        $('.col-300 .col-4 img').attr('src',item_avatar)
        $('#total_nights').html((result.data.days + 1) + ' ngày '+result.data.days+' đêm')
        var daily_adt_price= result.data.daily_adultprice != null && result.data.daily_adultprice != undefined && result.data.daily_adultprice > 0 ? result.data.daily_adultprice : result.data.price
        var daily_chd_price= result.data.daily_childprice != null && result.data.daily_childprice != undefined && result.data.daily_childprice > 0 ? result.data.daily_childprice : result.data.price
        $('#tour-schedule-flex').attr('data-adt',daily_adt_price)
        $('#tour-schedule-flex').attr('data-chd',daily_chd_price)

        if (result.data.packages != null && result.data.packages != undefined && result.data.packages.length > 0) {
            var html_option = ''
            $(result.data.packages).each(function (index, item) {
                html_option += TOUR_CONSTANTS.HTML.DetailSelectTourScheduleOption.replaceAll('{id}', item.Id).replaceAll('{adt}', item.AdultPrice)
                    .replaceAll('{chd}', item.ChildPrice).replaceAll('{time}', tour_detail.RenderDetailSelectTourScheduleOptionTime(item.FromDate))
            });
            $('#tour-detail-schedule-fixed').html(html_option)
            $('#tour-detail-schedule-fixed').select2()
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
        var schedule_type= $("input[name='tour-schedule']:checked").val()
        switch(schedule_type){
            case '0':{
                 var selected_value = $('#tour-detail-schedule-fixed').find(':selected')
                selected_adult_price = parseFloat(selected_value.attr('data-adult'))
                selected_child_price = parseFloat(selected_value.attr('data-child'))
            }break;
             case '1':{
                 selected_adult_price=parseFloat($('#tour-schedule-flex').attr('data-adt'))
                 selected_child_price=parseFloat($('#tour-schedule-flex').attr('data-chd'))
            }break;
        }
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
        var html_template = TOUR_CONSTANTS.HTML.Star
        var html = ''
        if (value == null || value == undefined || value <= 0) return html
        if (value > 5) value = 5
        for (var i = 0; i < value; i++) {
            html += html_template
        }
        return html
    },
}