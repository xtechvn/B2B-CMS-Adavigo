var _booking = {
    grid_element: "#grid_data_listing",
    grid_detail_element: "#grid_data_detail",

    initDateRange: function (fromDateElement, toDateElement) {
        $(`${fromDateElement},${toDateElement}`).daterangepicker({
            autoUpdateInput: false,
            autoApply: false,
            locale: {
                "format": 'DD/MM/YYYY',
                "applyLabel": "Áp dụng",
                "cancelLabel": "Xóa",
                "daysOfWeek": [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1
            }
        }, function (start, end, label) {
            _booking.applyDaterange(fromDateElement, toDateElement, start, end);
        }).on('apply.daterangepicker', function (ev, picker) {
            _booking.applyDaterange(fromDateElement, toDateElement, picker.startDate, picker.endDate);
        }).on('cancel.daterangepicker', function (ev, picker) {
            $(fromDateElement).val('');
            $(toDateElement).val('');
        });
    },

    applyDaterange: function (fromDateElement, toDateElement, startDate, endDate) {
        $(fromDateElement).val(startDate.format('DD/MM/YYYY')).change();
        $(toDateElement).val(endDate.format('DD/MM/YYYY')).change();

        $(fromDateElement).data('daterangepicker').setStartDate(startDate);
        $(fromDateElement).data('daterangepicker').setEndDate(endDate);

        $(toDateElement).data('daterangepicker').setStartDate(startDate);
        $(toDateElement).data('daterangepicker').setEndDate(endDate);
    },

    Init: function () {
        let objSearch = {
            from_date: null,
            to_date: null,
            code: null,
            page_index: 1,
            page_size: 15
        };

        this.SearchParam = objSearch;
        this.Search(objSearch);
    },

    Filter: function () {
        let objSearch = this.SearchParam;
        let text_from_date = $('#search_from_date').val();
        if (text_from_date != "") {
            let from_date = ConvertToDate(text_from_date).toLocaleDateString("en-GB");
            objSearch.from_date = from_date;
        } else {
            objSearch.from_date = null;
        }

        let text_to_date = $('#search_to_date').val();
        if (text_to_date != "") {
            let to_date = ConvertToDate(text_to_date).toLocaleDateString("en-GB");
            objSearch.to_date = to_date;
        } else {
            objSearch.to_date = null;
        }

        objSearch.page_index = 1;
        objSearch.code = $('#search_code').val();

        this.Search(objSearch);
    },

    Search: function (input) {
        _ajax_caller.post('/Booking/Search', { model: input }, function (result) {
            $(_booking.grid_element).html(result);
        });
    },

    OnPaging: function (value) {
        var objSearch = this.SearchParam;
        objSearch.page_index = value;
        this.Search(objSearch);
    },

    Detail: function (order_id) {
        _ajax_caller.post('/Booking/Detail', { id: order_id }, function (result) {
            console.log('vao');
            $(_booking.grid_detail_element).html(result);
            $(_booking.grid_element).addClass('hidden');
            $(_booking.grid_detail_element).removeClass('hidden');
        });
    },

    BackToListing: function () {
        $(_booking.grid_element).removeClass('hidden');
        $(_booking.grid_detail_element).addClass('hidden');
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

$(document).on('change', '#customFile', function () {
    _booking.loadUploadImage();
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

$(document).ready(function () {
    _booking.initDateRange('#search_from_date', '#search_to_date');
    _booking.Init();
});
