var _fund_management = {
    html_element_fund_from: "sel__from_fund",
    html_element_fund_to: "sel__to_fund",
    html_input_move_fund_money: "input__tranfer_fund",

    openTranferFundPopup: function () {
        _global_popup.showContextPopup("#modal-context-global", "width:300px", "Phân bổ quỹ", "/home/popuptranferfund");
    },

    openAddFundPopup: function (s_name, s_type, s_amount) {
        _global_popup.showContextPopup("#modal-context-global", "width:300px", "Nạp tiền", "/home/PopupAddFund", {
            service_name: s_name,
            service_type: s_type,
            account_blance: s_amount
        });
    },

    checkMoneyValid: function () {
        var seft = $('#' + _fund_management.html_input_move_fund_money);
        var value = ConvertMoneyToNumber(seft.val());
        let fund_from_selected = parseInt($('#' + _fund_management.html_element_fund_from).find(":selected").data('value'));

        seft.siblings('.invalid-feedback').remove();

        if (value > fund_from_selected) {
            seft.removeClass('is-success').addClass('is-invalid');
            let error = "Vượt quá số tiền trong tài khoản";
            if (fund_from_selected === 0)
                error = "Bạn phải chọn quỹ chuyển";

            seft.parent('.currency-gr').append('<div class="invalid-feedback">' + error + '</div>');

            return false;
        } else {
            seft.removeClass('is-invalid').addClass('is-success');
            return true;
        }
    },

    changeFundPosition: function () {
        let element_from = $('#' + _fund_management.html_element_fund_from);
        let element_to = $('#' + _fund_management.html_element_fund_to);

        let value_from = element_from.val();
        let value_to = element_to.val();

        element_from.val(value_to).trigger('change');
        element_to.val(value_from).trigger('change');
    },

    activeButtonTranfer: function () {
        var valid = _fund_management.checkMoneyValid();

        let element_from_id = _fund_management.html_element_fund_from;
        let element_to_id = _fund_management.html_element_fund_to;

        let value_from = $('#' + element_from_id).val();
        let value_to = $('#' + element_to_id).val();

        if (valid && value_from > 0 && value_to > 0) {
            $('#btn__submit_tranfer_fund').removeClass('gray');
        } else {
            $('#btn__submit_tranfer_fund').addClass('gray');
        }
    },

    LoadFundManagement: function () {

        let home_holder = $('#fund_management_holder');
        let hotel_holder = $('#fund_hotel_holder');

        if (home_holder.length > 0) {
            _ajax_caller.post('/Home/FundManager', null, function (result) {
                home_holder.html(result);
            });
        } else {
            _ajax_caller.post('/Home/FundHotel', null, function (result) {
                hotel_holder.html(result);
            });
        }
    },

    tranferBalance: function () {
        let value_from = $('#' + _fund_management.html_element_fund_from).val();
        let value_to = $('#' + _fund_management.html_element_fund_to).val();
        var value_amount = ConvertMoneyToNumber($('#' + _fund_management.html_input_move_fund_money).val());

        let input = {
            from_fund_type: value_from,
            to_fund_type: value_to,
            amount_move: value_amount
        };

        $.ajax({
            url: "/Home/TranferBalance",
            type: "post",
            data: input,
            success: function (result) {
                if (result.isSuccess) {
                    _msgalert.success(result.message);
                    _global_popup.closeContextPopup('#modal-context-global');
                    _fund_management.LoadFundManagement();
                } else {
                    _msgalert.error(result.message);
                }
            }
        });
    },

    redirectToPayment: function (service_type) {
        let amount = ConvertMoneyToNumber($('#input__add_fund').val()).toString();
        window.location.href = "/home/FundPaymentMethod?service_type=" + service_type + "&amount=" + amount;
    }
};

$(document).on('change', '.fund_select', function () {
    var seft = $(this);
    let balance = parseInt(seft.find(":selected").data('value'));
    let element_from_id = _fund_management.html_element_fund_from;
    let element_to_id = _fund_management.html_element_fund_to;

    if (balance > 0) {
        seft.addClass('color-blue');
        let element_id = seft.attr('id');

        if (element_id === element_from_id) {
            let to_value = $('#' + element_to_id).val();
            let from_value = $('#' + element_from_id).val();

            if (to_value == from_value) {
                $('#' + element_to_id).val(-1).trigger('change');
            }

            $('#' + element_to_id + ' option').removeAttr('disabled');
            $('#' + element_to_id + ' option[value=' + from_value + ']').attr("disabled", "disabled");
        }
    } else {
        seft.removeClass('color-blue');
    }
    seft.siblings().find(".price strong").html(balance.toLocaleString());
    _fund_management.activeButtonTranfer();
});

$(document).on('change', '#input__tranfer_fund', function () {
    _fund_management.activeButtonTranfer();
});

$(document).on('click', '#btn__submit_tranfer_fund', function () {
    _fund_management.tranferBalance();
});
$(document).on('click', '.article-itemt-view-more', function () {
    var count = 0
    $('.article-itemt').each(function (index, item) {
        var element = $(item)
        if (element.hasClass('hidden') && count < 5) {
            element.removeClass('hidden')
            count++
        }
        else if (count >= 5) return false
    })

});

$(".tab-menu-item").click(function () {
    $(".tab-menu-item").removeClass("active")
    $(this).addClass("active");
    var id = $(this).data("id");
    $(".tab-content").addClass("d-none");
    $("#" + id).removeClass("d-none");

})
$(document).on('change', '#input__add_fund', function () {
    var seft = $(this);
    var value = ConvertMoneyToNumber(seft.val());
    if (value > 0) {
        $('#btn__submit_add_fund').removeClass('gray');
    } else {
        $('#btn__submit_add_fund').addClass('gray');
    }
});
$(document).ready(function () {


});
