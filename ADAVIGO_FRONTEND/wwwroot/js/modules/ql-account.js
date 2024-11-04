$(document).ready(function () {
    $("#inputSearch").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            Ql_account.GetListAc(1, 20);
        }
    });
    Ql_account.GetListAc(1,20);
});

var Ql_account = {
    GetListAc: function (PageIndex, PageSize) {
        var ClientId = $('#ClientId').val();
        var inputSearch = $('#inputSearch').val();
        var Type = $('#Type').val();
        var Status = $('#Status').val();
       
        $.ajax({
            url: "/Account/GetlistAccount",
            type: "Post",
            data: { inputSearch: inputSearch, Type: Type, Status: Status, PageIndex: PageIndex, PageSize: PageSize},
            success: function (result) {
                $('#grid_data').html(result);
            }
        });
    },
    openAddAcPopup: function (id) {
        _global_popup.showContextPopup("#modal-context-global", "width:600px", "Thêm mới người dùng", "/Account/PopupAccount", {
            id: id,
        });
    },
    openEditAcPopup: function (id) {
        _global_popup.showContextPopup("#modal-context-global", "width:600px", "Cập nhật thông tin người dùng", "/Account/PopupAccount", {
            id: id,
        });
    },
    SetupAc: function () {
        $.validator.addMethod(
            "regex",
            function (value, element, regexp) {
                if (regexp.constructor != RegExp)
                    regexp = new RegExp(regexp);
                else if (regexp.global)
                    regexp.lastIndex = 0;
                return this.optional(element) || regexp.test(value);
            },
            "Please check your input."
        );
        let FromSetUp = $('#setup_Ac');
        var optradio = $('input[name="optradio"]:checked').val();
        FromSetUp.validate({
            rules: {

                "UserName": {
                    required: true,                 
                   
                },
                "ClientName": "required",

                "Phone": {
                   
                    number: true,
                },
                "Email": {
                   
                    email: true,
                },

                "Password": {
                    required: true,
                    minlength: 6
                },
                "GroupPermission": "required",
                "PasswordBackup": {
                    required: true,
                    equalTo: "#Password",
                    minlength: 6
                    
                },


            },
            messages: {
                "UserName": 
                {
                    required: "Tên đăng nhập không đươc bỏ trống",
              
            },
                "ClientName": "Tên người dùng không được bỏ trống",
                "GroupPermission": "Nhóm quyền không được bỏ trống",

                "Phone": {
                   
                    number: "Nhập đúng định dạng số",
                },
                "Email": {
                   
                    email: "Nhập đúng định dạng email",
                },
                "Password": {
                    required: "Mật khẩu không được bỏ trống",
                    minlength: 'Mật khẩu ít nhất 6 ký tự'
                    
                },
                "PasswordBackup": {
                    required: "Nhập lại mật khẩu không được bỏ trống",
                    equalTo: 'Mật khẩu không chính xác',
                    minlength:'Mật khẩu ít nhất 6 ký tự'
                },
 
            }
        });
        if (FromSetUp.valid()) {
            var Model = {
                id: $('#id').val(),
                UserName: $('#UserName').val(),
                ClientName: $('#ClientName').val(),
                Type: $('#GroupPermission').val(),
                Phone: $('#Phone').val(),
                Email: $('#Email').val(),
                Password: $('#Password').val(),
                PasswordBackup: $('#PasswordBackup').val(),
                Status: optradio,
            }
            var a = Model.UserName.replace
            if (Ql_account.CheckIfSpecialCharracter(Model.UserName)) {
                $("#emsg-error").removeClass("hidden")
                $("#emsg-error").show()
                $("#emsg-error").html("Tên đăng nhập phải viết liên không dấu")
                return false;
            } else {
                $("#emsg-error").addClass("hidden");
            }
            $.ajax({
                url: "/Account/SetUpAccount",
                type: "Post",
                data: { Model: Model},
                success: function (result) {
                    if (result.isSuccess) {
                        _msgalert.success(result.message);
                        setTimeout(function(){
                            window.location.reload();
                        }, 1000);
                    } else {
                        _msgalert.error(result.message);
                    }
                }
            });
        }
       
    },
    OnPaging: function (id) {
        Ql_account.GetListAc(id, 20);
    },
    CheckIfSpecialCharracter: function (text) {
        if (text == null || text == undefined || text.trim() == '') {
            return false
        }
        var is_Check = text.match(/[àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ ]/g) ? true : false;
        return is_Check;
    },
}