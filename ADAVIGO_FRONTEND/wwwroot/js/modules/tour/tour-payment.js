var _tour_payment = {

};

$('#block__payment_option li').click(function () {
    let seft = $(this);
    let type = parseInt(seft.data('type'));
    $('#block__payment_option li').removeClass('active');
    seft.addClass('active');

    if (![3, 5, 6].includes(type)) {
        type = 1;
    }

    $(`.payment-type-grid`).addClass('hidden');
    $(`.payment-type-grid[data-type="${type}"]`).removeClass('hidden');
});

$('#btn__submit_tour_payment').click(function () {

    var order_id = sessionStorage.getItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)
    var order_id_value = $('#input__tour_payment_orderid').val()
    if (order_id == null || order_id == undefined || order_id.trim() == '') order_id = ((order_id_value == null || order_id_value == undefined || order_id_value.trim() == '') ? null : order_id_value)
    let obj = {
        payment_type: parseInt($('#block__payment_option li.active').data('type')),
        bank_name: $('.list-bank.grid__3 li.active').attr('title'),
        short_name: $('.list-bank.grid__3 li.active').attr('data-short-name'),
        bank_account: $('.list-bank.grid__3 li.active').data('account'),
        bank_code: $('.list-bank.grid__3 li.active').data('code'),
        booking_id: $('#input__tour_payment_bookingid').val(),
        amount: parseFloat($('#input__tour_payment_amount').val()),
        order_id: order_id ? order_id : - 1
    }

    if (obj.payment_type <= 0) {
        _msgalert.error("Bạn phải chọn phương thức thanh toán");
        return;
    }

    _ajax_caller.post('/tour/SavePayment', { model: obj }, function (result) {
        if (result.isSuccess) {
            obj.order_no = result.data;
            sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.OrderID, result.order_id)
            if (obj.payment_type == 5) { window.location.href = '/tour/OrderSuccess?order_no=' + obj.order_no + '&payment_type=5' }
            else {
                _global_popup.showContextPopup("#modal-context-global", "min-width:700px;", 'Thông tin chuyển khoản', '/hotel/PopupPaymentHotel', { model: obj });
            }
        } else {
            _msgalert.error(result.message);
        }
    });
});
