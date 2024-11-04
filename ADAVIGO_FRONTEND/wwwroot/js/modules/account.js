var _account = {

    GetFormData: function ($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    },

    OnChangeProvince: function (value, districtId = 0) {
        _ajax_caller.get("/account/GetDistrictOfProvince", { provinceId: value }, function (result) {
            let datas = result.data;

            let DistrictHtml = '<option value="0">Chọn Quận/Huyện</option>';
            let WardHtml = '<option value="0">Chọn Phường/Xã</option>';

            if (datas && datas.length > 0) {
                datas.map((obj) => {
                    DistrictHtml += `<option value="${obj.districtId}" ${(districtId == obj.districtId ? "selected" : "")}>${obj.name}</option>`;
                });
            }
            $('#sl_client_district').html(DistrictHtml);
            $('#sl_client_ward').html(WardHtml);
        });
    },

    OnChangeDistrict: function (value, wardId = 0) {
        _ajax_caller.get("/account/GetWardOfDistrict", { districtId: value }, function (result) {
            let datas = result.data;
            let WardHtml = '<option value="0">Chọn Phường/Xã</option>';
            if (datas && datas.length > 0) {
                datas.map((obj) => {
                    WardHtml += `<option value="${obj.wardId}" ${(wardId == obj.wardId ? "selected" : "")}>${obj.name}</option>`;
                });
            }
            $('#sl_client_ward').html(WardHtml);
        });
    },

    OnUpdate: function () {
        let FromCreate = $('#form_client_info');
        FromCreate.validate({
            rules: {
                name: "required",
                email: {
                    required: true,
                    email: true
                },
                indentifer_no: {
                    required: true
                }
            },
            messages: {
                name: "Vui lòng nhập họ và tên",
                email: {
                    required: "Vui lòng nhập địa chỉ email",
                    email: 'Email không đúng định dạng'
                }, indentifer_no: {
                    required: "Vui lòng nhập CMT/CCCD"
                }
            }
        });

        if (!FromCreate.valid()) {
            $('label.error').siblings('.error').first().focus();
            return;
        }

        let form_data = _account.GetFormData(FromCreate);

        _ajax_caller.post("/account/update", { model: form_data }, function (result) {
            if (result.isSuccess) {
                _msgalert.success(result.message);
            } else {
                _msgalert.error(result.message);
            }
        });
    },

    OnChangePass: function () {
        let FromCreate = $('#form_client_change_pass');
        FromCreate.validate({
            rules: {
                password_old: "required",
                password_new: "required",
                confirm_password_new: {
                    required: true,
                    equalTo: "#password_new"
                }
            },
            messages: {
                password_old: "Vui lòng nhập mật khẩu hiện tại",
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

        _ajax_caller.post("/account/changepass", { model: form_data }, function (result) {
            if (result.isSuccess) {
                _msgalert.success(result.message);
                FromCreate.trigger("reset");
            } else {
                _msgalert.error(result.message);
            }
        });
    }
};

$('#sl_client_district').change(function () {
    var seft = $(this);
    _account.OnChangeDistrict(seft.val());
    seft.find(":selected").text();
});

$('#sl_client_province').change(function () {
    let seft = $(this);
    _account.OnChangeProvince(seft.val());
});

$('.client_tab_info').click(function () {
    let seft = $(this);
    let tab = seft.data('tab');
    let grid_view = $(`#client_tab_info_${tab}`);
    grid_view.removeClass('hidden');
    grid_view.siblings().addClass('hidden');
    seft.siblings().removeClass('active');
    seft.addClass('active');
});

$('.toggle-password').click(function () {
    var seft = $(this);
    var input = seft.siblings('input');
    if (seft.hasClass('fa-eye')) {
        input.prop('type', 'text');
        seft.addClass('fa-eye-slash').removeClass('fa-eye');
    } else {
        input.prop('type', 'password');
        seft.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

$(document).ready(function () {
    let provinceId = $('#sl_client_province').val();
    if (provinceId != "0") {
        let districtId = $('#ip_hd_district_id').val();
        _account.OnChangeProvince(provinceId, districtId);
        setTimeout(function () {
            let wardId = $('#ip_hd_ward_id').val();
            _account.OnChangeDistrict(districtId, wardId);
        }, 200);
    }
});