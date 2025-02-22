var _global = {
    Login: function () {
        var current_url = window.location.pathname;
        window.location.href = '/Login?url=' + current_url;
    },

    Logout: function () {
        $('#modal-warning-logout').modal('show');
    },

    ConfirmLogout: function () {
        $.ajax({
            url: '/client/Logoff',
            type: 'GET',
            success: function (response) {
                window.location.href = "/";
            }
        });
    },
    Comma: function (number) { //function to add commas to textboxes
        number = ('' + number).replace(/[^0-9.,]+/g, '');
        number += '';
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;
    },
};

var _global_popup = {
    showContextPopup: function (modal_element, width, title, url = null, param = null, callback = null) {
        let modal = $(modal_element);
        modal.find('.modal-dialog').attr("style", width);

        modal.find('.modal-content .modal-title').html(title);
        $.ajax({
            url: url,
            type: "post",
            data: param,
            success: function (result) {
                modal.find('.modal-content .modal-body').html(result);
                if (callback) callback();
            }
        });

        modal.modal('show');
    },

    closeContextPopup: function (element) {
        $(element).modal('hide');
    },

    showAlertPopup: function (width, htmlBody) {
        let modal = $('#modal-warning-global');
        modal.find('.modal-dialog').attr("style", width);
        modal.find('.modal-content .modal-body').html(htmlBody);
        modal.modal('show');
    },

    closeAlertPopup: function () {
        $('#modal-warning-global').modal('hide');
    },
    HideSummaryPopup: function () {
        $('.home-summary-popup').removeClass('show')
        $('.home-summary-popup').css('display', 'none')
        $('#home-hotdeal-popup').removeClass('show')
        $('#home-hotdeal-popup').css('display', 'none')
    }
};

function ConvertToDate(strdate) {
    if (strdate == null || strdate == "") {
        return null;
    }
    let arrdate = strdate.split("/");
    return new Date(arrdate[2], arrdate[1] - 1, arrdate[0]);
}

function ConvertToJSONDate(strdate) {
    return ConvertToDate(strdate).toJSON();
}

function ConvertToJSONDateTime(strdatetime) {
    if (strdatetime == null || strdatetime == "") {
        return null;
    }
    let arrdate = strdatetime.split(" ")[0].split("/");
    let arrtime = strdatetime.split(" ")[1].split(":");

    var jsdate = new Date(arrdate[2], arrdate[1] - 1, arrdate[0], parseInt(arrtime[0]), parseInt(arrtime[1]));

    return new Date(jsdate.getTime() - (jsdate.getTimezoneOffset() * 60000)).toJSON();
}

function ConvertJsDateToString(date, format) {

    if (date == null || date == "" || date == undefined) return "";

    let day = (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate());
    let month = (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
    let year = date.getFullYear();

    switch (format) {
        case "DD/MM/YYYY":
            return `${day}/${month}/${year}`;
        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;
        case "YYYY/MM/DD":
            return `${year}/${month}/${day}`;
        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

//----------- Input vn curency number----------
$(document).on('keyup blur', '.ip-currency', function () {
    formatCurrency($(this));
});

$(document).on('keyup blur', '.currency-usd', function () {
    formatDecimalCurrency($(this));
});

function formatNumber(n) {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
    var input_val = input.val();
    if (input_val === "") { return; }
    var original_len = input_val.length;
    var caret_pos = input.prop("selectionStart");

    if (input_val.indexOf(".") >= 0) {
        var decimal_pos = input_val.indexOf(".");
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);

        if (blur === "blur") {
            right_side += "00";
        }

        right_side = right_side.substring(0, 2);
        input_val = left_side + "." + right_side;
    } else {
        input_val = formatNumber(input_val);
    }

    // send updated string to input
    input.val(input_val);
    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

function formatDecimalNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatDecimalCurrency(input, blur) {
    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") { return; }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatDecimalNumber(left_side);

        // validate right side
        right_side = formatDecimalNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = left_side + "." + right_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatDecimalNumber(input_val);
        input_val = input_val;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

function ConvertMoneyToNumber(strMoney) {
    return parseFloat(strMoney.replace(/,/g, ""));
}
//----------- End input curency number------

var _msgalert = {
    error: (content, title) => {
        toastr.error(content, title);
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        return false;
    },

    success: (content, title) => {
        toastr.success(content, title);
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        return true;
    },

    notify_tooltip: (content, title) => {
        toastr.success(content, title);
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "10000",
            "extendedTimeOut": "2000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        return true;
    }
};

var date_input = {
    single_picker: $('.date-single-picker'),
    range_picker: $('.date-range-picker'),

    initSinglePicker: function () {
        date_input.single_picker.daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: true,
            minDate: new Date(),
            locale: {
                format: 'DD/MM/YYYY',
                cancelLabel: 'Clear'
            }
        });

        date_input.single_picker.on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            // $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        });

        date_input.single_picker.on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
    },
};

var _ajax_caller = {
    post: function (url, param = null, callback = null) {
        $.ajax({
            url: url,
            type: "POST",
            data: param,
            success: function (result) {
                callback(result);
            }
        });
    },

    get: function (url, param = null, callback = null) {
        $.ajax({
            url: url,
            type: "GET",
            data: param,
            success: function (result) {
                callback(result);
            },
            error: function (err) {
                reject(err);
            }
        });
    },
    PostData: function (url, data, callback) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            processData: false,
            success: function (result) {
                callback(result);
            },
            error: function (err) {
                reject(err);
            }
        });;
    },
    POSTSynchorus: function (url, model) {
        var data = undefined
        $.ajax({
            url: url,
            type: "POST",
            data: model,
            success: function (result) {
                data = result;
            },
            error: function (err) {
                console.log(err)
            },
            async: false
        });
        return data
    },
};

var _ui_common = {
    toggleFocusOut: function (target) {
        $(document).on("click", function () {
            $(target).addClass('collapse').removeClass('show');

            if (target == '#block__suggest-hotel')
                $(target).closest('.form-search').removeClass('active');

        });

        $(target).on("click", function (event) {
            event.stopPropagation();
        });
    }
}

$(document).ready(function () {
    let path_name = location.pathname.toLocaleLowerCase();
    $('section.menu-left .nav-left ul li a').each(function () {
        var seft = $(this);
        let data_href = seft.attr('href').toLocaleLowerCase();
        if (path_name === '/' || path_name.includes('/home')) {
            $('section.menu-left .nav-left ul li a').first().addClass('active');
        } else {

            if (data_href !== "/" && path_name.includes(data_href)) {
                seft.addClass('active');
            }
        }
    });
    _ajax_caller.post('/Home/GetNewsDetail', { article_id: 20338 }, function (result) {
        if (result.isSuccess == true && result.data != undefined && result.data.id != undefined) {
            $('#home-hotdeal span').html(result.data.lead)
            $('#home-hotdeal-popup .modal-body').html(result.data.body)
        }

    });
});
$(document).on('click', '#home-hotdeal', function () {
    _global_popup.HideSummaryPopup()
    $('#home-hotdeal-popup').addClass('show')
    $('#home-hotdeal-popup').css('display', 'block')
});
$(document).on('click', '.home-summary-popup .close, #home-hotdeal-popup .close', function () {
    _global_popup.HideSummaryPopup()

});
