$(document).ready(function () {
    hotel_voucher.Initialization()
})
var hotel_voucher = {
    Initialization: function () {
        hotel_voucher.DynamicBind()
    },
    DynamicBind: function () {
        $('body').on('click', '#hotel-order-voucher-popup', function () {
            $('#chonvoucher').fadeIn()
            $('#chonvoucher').addClass('overlay-active')
            $('#chonvoucher').addClass('show')

        });
      
        $('body').on('click', '#chonvoucher .close', function () {
            $('#chonvoucher').fadeOut()
            $('#chonvoucher').removeClass('overlay-active')
            $('#chonvoucher').removeClass('show')
        });
        $('body').on('click', '.item-voucher', function () {
            var element = $(this)
            $('.item-voucher .voucher-select').prop('checked',false)
            element.find('.voucher-select').prop('checked',true)

        });
        $('body').on('click', '#chonvoucher .confirm-selected', function () {
            var element = $(this)
            var voucher_code=''
            $('.item-voucher .voucher-select').each(function (index, item) {
                var checked_item = $(this)
                if (checked_item.is(':checked')) {
                    voucher_code = checked_item.closest('.item-voucher').attr('data-code')
                    return false
                }
            })
            if (voucher_code != undefined && voucher_code.trim() != '') {
                $('#hotel-order-voucher-code').val(voucher_code).trigger('change')
                $('#hotel-order-voucher-apply').click()
            }
            $('#chonvoucher').fadeOut()
            $('#chonvoucher').removeClass('overlay-active')
            $('#chonvoucher').removeClass('show')
        });
    },
}