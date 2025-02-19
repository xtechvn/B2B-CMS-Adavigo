$(document).ready(function () {
    tour_index.Initialization();

})

var tour_index = {
    Initialization: function () {
        tour_index.DynamicBind()
        tour_index.RenderLocationStart()
    },
    DynamicBind: function () {
        $('body').on('click', '.tour-type', function (e) {
            tour_index.RenderLoadingSearch()
            tour_index.RenderLocationStart()
        });
        $('body').on('select2:select', '#from', function (e) {
            tour_index.RenderLocationEnd()
        });
        $('body').on('click', '.wrap-search .btn-search', function (e) {
            var start_point= $('#from').find(':selected').val()
            var end_point= $('#to').find(':selected').val()
            var type = tour_index.GetTourType()
            window.location.href = '/tour/tim-kiem?start='
                + (start_point == undefined || isNaN(parseInt(start_point)) || parseInt(start_point) < -1 ? '-1' : parseInt(start_point))
                + '&end=' + (end_point == undefined || isNaN(parseInt(end_point)) || parseInt(end_point) < -1 ? '-1' : parseInt(end_point))
                + '&type=' + (type == undefined || isNaN(parseInt(type)) || parseInt(type) < 1 ? '1' : parseInt(type))
        });
    },
    RenderLocationStart: function () {
        var tour_type = tour_index.GetTourType();
        var template = tour_constants.HTML.Option
        var data = tour_global.LocationStart(tour_type)
        var html = ''
        html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')
        if (data != null && data != undefined && data.length>0) {
            $(data).each(function (index, item) {
                html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
            });
        }
        $('#from').prop('disabled', false)
        $('#from').html(html)
        $('#from').select2();
        tour_index.RemoveLoadingSearch()
        tour_index.RenderLocationEnd()
    },
    RenderLocationEnd: function () {
        $('#to').addClass('placeholder')
        var location_start = $('#from').find(':selected').val()
        var tour_type = tour_index.GetTourType();
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
    RenderLoadingSearch: function () {
        $('.tour-type').closest('.tab-menu').addClass('placeholder')
        $('.tour-type').closest('.tab-menu').addClass('box-placeholder')
        $('#from').closest('.wrap-search').addClass('placeholder')
        $('#from').closest('.wrap-search').addClass('box-placeholder')
        $('#to').prop('disabled',true)
    },
    RemoveLoadingSearch: function () {
        $('.tour-type').closest('.tab-menu').removeClass('placeholder')
        $('.tour-type').closest('.tab-menu').removeClass('box-placeholder')
        $('#from').closest('.wrap-search').removeClass('placeholder')
        $('#from').closest('.wrap-search').removeClass('box-placeholder')
       // $('#to').prop('disabled', false)

    },
    GetTourType: function () {
        var type = 1
        $('.tour-type').each(function (index, item) {
            var element = $(this)
            if (element.hasClass('active')) {
                var type_value = parseInt(element.attr('data-id'))
                if (!isNaN(type_value) && type_value > 0) type = type_value
                return false
            }

        })
        return type
    },
}