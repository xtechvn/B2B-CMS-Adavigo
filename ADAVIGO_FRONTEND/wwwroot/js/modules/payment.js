var _payment = {

    openPopupPayment: function (obj) {
        _global_popup.showContextPopup("#modal-context-global", "width:400px", "Thông tin chuyển khoản", "/home/PopupPaymentConfirm", { model: obj });
    },

    loadUploadImage: function () {
        var file = $("#customFile").get(0).files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                $("#image_payment_preview").attr("src", reader.result);
                $("#image_payment_preview").closest('.image_preview_list').show();
                $("#label_payment_upload").hide();
            }
            reader.readAsDataURL(file);
        }
    }
};

$('.list-bank.grid li').click(function () {
    $('#btn__submit_payment').removeClass('gray').attr('disabled', false);
});

$('#btn__submit_payment').click(function () {
    let el_bank_active = $('.grid_onepay_bank .list-bank.grid li.active');

    let obj = {
        title: el_bank_active.attr('title'),
        image: el_bank_active.find('img').attr('src'),
        bank_id: el_bank_active.data('id'),
        bank_alias: el_bank_active.data('alias'),
        bank_account: el_bank_active.data('account'),
        amount: $('#fund__additional_payment_amount').val(),
        tran_code: $('#fund__payment_tran_code').val()
    }
    _payment.openPopupPayment(obj);
});

$(document).on('change', '#customFile', function () {
    _payment.loadUploadImage();
    $('#btn_payment_insert_deposit_log').removeClass('gray');
    $('#btn_payment_insert_deposit_log').attr('disabled', false);
});

$(document).on('click', '#btn__delete_image_preview', function () {
    $("#image_payment_preview").closest('.image_preview_list').hide();
    $("#label_payment_upload").show();
    $('#customFile').val('');
    $('#btn_payment_insert_deposit_log').addClass('gray');
    $('#btn_payment_insert_deposit_log').attr('disabled', true);
});

$(document).on('click', '#btn__fund_checkout_payment', function () {

    let obj = {
        trans_no: $('#fund_tran_code').val(),
        bank_name: $('#fund_bank_alias').val()
    };

    _ajax_caller.post('/home/PaymentCheckout', { model: obj }, function (result) {
        if (result.isSuccess) {

            setTimeout(function () {
                window.location.href = `/home/ConfirmSuccessPayment?transNo=${obj.trans_no}`;
            }, 1000);

        } else {
            _msgalert.error(result.message);
        }
    });
});

$(document).on('click', '#btn_payment_insert_deposit_log', function () {
    let obj = {
        Base64Image: $("#image_payment_preview").attr("src"),
        TransNo: $("#payment_confirm_trans_code").val()
    }
    _ajax_caller.post('/home/InsertConfirmPayment', { model: obj }, function (result) {
        if (result.isSuccess) {
            _msgalert.success(result.message);
            _global_popup.closeContextPopup('#modal-context-global');
            setTimeout(function () {
                window.location.href = '/'
            }, 1000);
        } else {
            _msgalert.error(result.message);
        }
    });
});


