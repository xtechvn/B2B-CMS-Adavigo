var _account = {
    GetFormData: function ($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    },

    OnChangePass: function () {
        let FromCreate = $('#form_client_change_pass');
        FromCreate.validate({
            rules: {
                password_new: "required",
                confirm_password_new: {
                    required: true,
                    equalTo: "#password_new"
                }
            },
            messages: {
                password_new: "Vui lòng nhập mật khẩu mới",
                confirm_password_new: {
                    required: "Vui lòng nhập lại mật khẩu mới",
                    equalTo: "Mật khẩu nhập lại không giống mật khẩu mới"
                }
            }
        });

        if (!FromCreate.valid()) {
            $('label.error').siblings('.error').first().focus();
            return;
        }

        let form_data = _account.GetFormData(FromCreate);

        _ajax_caller.post("client/reset-password", { model: form_data }, function (result) {
            if (result.isSuccess) {
                /*_msgalert.success(result.message);*/
                FromCreate.trigger("reset");
                $('#html_client_change_pass').html('<div class="mb40"><img src="/images/graphics/logo.svg" alt=""></div><h2 class= "bold txt_20 mb20" > Thay đổi mật khẩu Thành công</h2 ><div class="form-group"> Đổi mật khẩu thành công. Nhấn nút Xác Nhận bên dưới để chuyển về trang chủ hoặc hệ thống sẽ tự động chuyển sau 5 giây </div ><div class="form-group row"><div class= "col-md-6" > <a type="button" class="btn-default full" href="/login" >Xác nhận</a> </div></div > <div class="gray txt_12 mt20">© 2022 - Công ty cổ phần thương mại &amp; dịch vụ quốc tế Đại Việt</div>');
                setTimeout(function () {
                    window.location.href = `/login`
                }, 5000);
            } else {
                _msgalert.error(result.message);
            }
        });
    },

    ResetForm: function () {
        $('#form_client_change_pass').trigger('reset');
    },

    DisplayRawPass: function (seft) {
        var input = seft.siblings('input');
        if (seft.hasClass('fa-eye')) {
            input.prop('type', 'text');
            seft.addClass('fa-eye-slash').removeClass('fa-eye');
        } else {
            input.prop('type', 'password');
            seft.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }
};

$('.toggle-password').click(function () {
    var seft = $(this);
    _account.DisplayRawPass(seft);
});