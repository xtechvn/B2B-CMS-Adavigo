$(document).ready(function () {
    tour_search.Initialization();

})

var tour_search = {
    Initialization: function () {
        tour_search.RenderLocationStart()
        tour_search.RenderLocationEnd()
        tour_search.DynamicBind()
        $('#from').val($('#filter-url').attr('data-start')).trigger('change')
        $('#to').val($('#filter-url').attr('data-end')).trigger('change')
        $("input[name='tour-type'][value='" + $('#filter-url').attr('data-type') +"']").prop("checked", true);
    },
    DynamicBind: function () {

        $('body').on('click', '.btn-viewmore', function (e) {
            var element = $(this)
            var grid = $('#' + element.attr('data-target'))
            var count = 0

            $(grid.find('.article-itemt')).each(function (index, item) {
                var product = $(this)
                if (product.is(":hidden")) {
                    count++
                    product.show()
                }
            });
            count = 0;
            $(grid.find('.article-itemt')).each(function (index, item) {
                var product = $(this)
                if (product.is(":hidden")) {
                    count++
                    return false
                }
            });
            if (count <= 0) {
                element.closest('.mb40').hide()
            }
        });
        $('body').on('click', '.btn-search', function (e) {
            var start_point = $('#from').find(':selected').val()
            var end_point = $('#to').find(':selected').val()
            var type = tour_search.GetTourType()
            window.location.href = '/tour/tim-kiem?start='
                + (start_point == undefined || isNaN(parseInt(start_point)) || parseInt(start_point) < -1 ? '-1' : parseInt(start_point))
                + '&end=' + (end_point == undefined || isNaN(parseInt(end_point)) || parseInt(end_point) < -1 ? '-1' : parseInt(end_point))
                + '&type=' + (type == undefined || isNaN(parseInt(type)) || parseInt(type) < 1 ? '1' : parseInt(type))
        });
        $('body').on('click', '#filter-reset', function (e) {
            $('#from').val('-1').trigger('change')
            $('#to').val('-1').trigger('change')
            $("input[name='tour-type'][value='1']").prop("checked", true);
        });
    },
    RenderLocationStart: function () {
        var tour_type = tour_search.GetTourType();
        var template = tour_constants.HTML.Option
        var data = tour_global.LocationStart(tour_type)
        var html = ''
        html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')
        if (data != null && data != undefined && data.length > 0) {
            $(data).each(function (index, item) {
                html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
            });
        }
        $('#from').prop('disabled', false)
        $('#from').html(html)
        $('#from').select2();
    },
    RenderLocationEnd: function () {
        $('#to').addClass('placeholder')
        var location_start = $('#from').find(':selected').val()
        var tour_type = tour_search.GetTourType();
        var template = tour_constants.HTML.Option
        var data = tour_global.LocationEnd(tour_type, location_start)

        var html = ''
        html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')
        if (data != null && data != undefined && data.length > 0) {
            $(data).each(function (index, item) {
                html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
            });
        }
        $('#to').html(html)
        $('#to').prop('disabled', false)
        $('#to').removeClass('placeholder')
        $('#to').select2();
    },
    GetTourType: function () {
        var type = 1
        $("input[name='tour-type']").each(function (index, item) {
            var element = $(this)
            if (element.is(':checked')) {
                type = element.val()
                return false
            }

        })
        return type
    },
}