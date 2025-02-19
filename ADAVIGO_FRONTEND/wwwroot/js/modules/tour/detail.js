$(document).ready(function () {
    tour_detail.Initialization();

})

var tour_detail = {
    Initialization: function () {
        tour_detail.DynamicBind()

    },
    DynamicBind: function () {
        $('body').on('click', '.select-tab', function (e) {
            var element = $(this)
            tour_detail.SwitchTab(element)
        });
        $('body').on('click', '#tab-banggia-select-month .item', function (e) {
            var element = $(this)
            $('#tab-banggia-select-month .item').removeClass('active')
            element.addClass('active')
            $('.tb-banggia').hide()
            if (element.attr('data-id') == undefined || element.attr('data-id').trim() == '') {
                $('#by_month-all').show()
            } else {
                $('#by_month-' + element.attr('data-id')).show()
            }

        });

    },
    SwitchTab: function (element) {
        if (element.hasClass('active')) {
            return;
        }
        $('.select-tab').removeClass('active')
        element.addClass('active')
        var tab_id = element.attr('data-id')
        $('.select-tab-tab').hide()
        $('#select-tab-' + tab_id).show()
    },
}