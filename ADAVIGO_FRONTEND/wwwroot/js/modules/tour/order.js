$(document).ready(function () {
    tour_order.Initialization();

})

var tour_order = {
    Initialization: function () {
        tour_order.DynamicBind()

    },
    DynamicBind: function () {
        $('body').on('click', '.giam_sl', function (e) {
            var element = $(this).closest('.sl_giohang').find('input')
            var value = element.val()
            var min = element.attr('min') == undefined || isNaN(parseInt(element.attr('min'))) ? 0 : parseInt(element.attr('min'))
            if (value <= min) element.val(min).trigger('change')
            else {
                value--
                element.val(value).trigger('change')
            }
            tour_order.RenderQuanity()
            tour_order.RenderAmount()
        });

        $('body').on('click', '.tang_sl', function (e) {
            var element = $(this).closest('.sl_giohang').find('input')
            var value = element.val()
            value++
            element.val(value).trigger('change')
            tour_order.RenderQuanity()
            tour_order.RenderAmount()
        });
        $('body').on('click', '#btn-payment', function (e) {
            tour_order.Submit()
        });
    },
    RenderQuanity: function () {
        $('.qty-adt').html(tour_global.Comma(parseInt($('#qty-adt').val())))
        $('.qty-chd').html(tour_global.Comma(parseInt($('#qty-chd').val())))
    },
    RenderAmount: function () {
        var price_adt = $('#order-detail').attr('data-amount-adt') == undefined || isNaN(parseInt($('#order-detail').attr('data-amount-adt'))) ? 0 : parseInt($('#order-detail').attr('data-amount-adt'))
        var price_chd = $('#order-detail').attr('data-amount-chd') == undefined || isNaN(parseInt($('#order-detail').attr('data-amount-chd'))) ? 0 : parseInt($('#order-detail').attr('data-amount-chd'))
        var qty_adt = parseInt($('#qty-adt').val())
        var qty_chd = parseInt($('#qty-chd').val())
        var amount_adt = price_adt * qty_adt
        var amount_chd = price_chd * qty_chd
        var amount_discount = 0
        $('#amount-adt').html(tour_global.Comma(amount_adt))
        $('#amount-chd').html(tour_global.Comma(amount_chd))
        $('#amount-total').html(tour_global.Comma(amount_adt + amount_chd - amount_discount))
        $('#amount-total').attr('amount',(amount_adt + amount_chd - amount_discount))
    },
    Submit: function () {
        $('#btn-payment').prop('disabled', true)
        $('#btn-payment').addClass('gray')
        $('#btn-payment').html('Vui lòng chờ ...')
        var price_adt = $('#order-detail').attr('data-amount-adt') == undefined || isNaN(parseInt($('#order-detail').attr('data-amount-adt'))) ? 0 : parseInt($('#order-detail').attr('data-amount-adt'))
        var price_chd = $('#order-detail').attr('data-amount-chd') == undefined || isNaN(parseInt($('#order-detail').attr('data-amount-chd'))) ? 0 : parseInt($('#order-detail').attr('data-amount-chd'))
        var qty_adt = parseInt($('#qty-adt').val())
        var qty_chd = parseInt($('#qty-chd').val())
        var amount_adt = price_adt * qty_adt
        var amount_chd = price_chd * qty_chd
        var amount_discount = 0

        var model = {
            orderId: '',
            tourId: $('#order-detail').attr('data-tour-id'),
            tourName: $('#order-detail').attr('data-tour-name'),
            totalAmount: amount_adt + amount_chd - amount_discount,
            totalNights: 1,
            numberOfAdult: parseInt($('#qty-adt').val()),
            numberOfChild: parseInt($('#qty-chd').val()),
            firstName: $('#contact-surname').val() + ' ' + $('#contact-name').val(),
            email: $('#contact-email').val(),
            phoneNumber: $('#contact-phone').val(),
            country: $('#contact-country').val(),
            address: $('#contact-address').val(),
            note: $('#contact-note').val(),
            startDate: $('#order-detail').attr('data-start-date'),
            voucherName: '',
            packageId: $('#order-detail').attr('data-id'),
            bookingId: '',
        }
        tour_global.POST('/Tour/SaveTour', { model: model }, function (result) {
            if (result.isSuccess) {
                //_msgalert.success(result.message);
                $('#btn-payment').html('Đang chuyển hướng')
                setTimeout(function () {
                    window.location.href = `/Tour/payment?booking=${result.data.data}`
                }, 2000);

            } else {
                $('#btn-payment').prop('disabled', false)
                $('#btn-payment').removeClass('gray')
                $('#btn-payment').html('Tiếp tục đơn hàng')
                _msgalert.error(result.message);
            }
           

        });
    }
}