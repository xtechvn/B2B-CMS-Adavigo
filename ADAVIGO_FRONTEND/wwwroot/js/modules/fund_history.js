var fund_history = {
    grid_element: "#grid_data",

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
            fund_history.applyDaterange(fromDateElement, toDateElement, start, end);
        }).on('apply.daterangepicker', function (ev, picker) {
            fund_history.applyDaterange(fromDateElement, toDateElement, picker.startDate, picker.endDate);
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
            from_date: "",
            to_date: "",
            code: null,
            page_index: 1,
            page_size: 15
        };

        this.SearchParam = objSearch;
        this.Search(objSearch);
    },

    Filter: function () {
        let objSearch = this.SearchParam;

        let fromdate = $('#search_from_date').val();
        let todate = $('#search_to_date').val();

        objSearch.from_date = fromdate;
        objSearch.to_date = todate;
        objSearch.code = $('#search_trans_code').val();
        objSearch.page_index = 1;

        this.Search(objSearch);
    },

    Search: function (input) {
        _ajax_caller.post('/Fund/SearchHistory', { model: input }, function (result) {
            $(fund_history.grid_element).html(result);
        });
    },

    OnPaging: function (value) {
        var objSearch = this.SearchParam;
        objSearch.page_index = value;
        this.Search(objSearch);
    }
};

$(document).ready(function () {
    fund_history.initDateRange('#search_from_date', '#search_to_date');
    fund_history.Init();
});
