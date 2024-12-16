$(document).ready(function () {
    tour_index.Initialization()
})
var tour_index = {
    Initialization: function () {
        
        tour_index.RenderLoadingSearch()
        tour_index.LocationStart()
        tour_index.DynamicBind()
    },
    DynamicBind: function () {
        $('body').on('click', '.filter-tour-type', function (e) {
            tour_index.RenderLoadingSearch()

            tour_index.LocationStart()
            tour_index.LocationEnd()


        });
        $('body').on('select2:select', '#select-address-from', function (e) {
            //$('#select-address-to').prop('disabled', true)
            //$('#select-address-to').addClass('placeholder')
            tour_index.LocationEnd()



        });
        $('body').on('click', '.wrap-search .btn-search', function (e) {
            var request = {
                start_point: $('#select-address-from').find(':selected').val(),
                end_point: $('#select-address-to').find(':selected').val(),
                type: tour_index.GetTourType()
            }
            sessionStorage.setItem(tour_constants.STORAGE.TourSearch, JSON.stringify(request))
            window.location.href='/tour/search'
        });
    },
    RenderLoadingSearch: function () {
        $('.filter-tour-type-select').closest('.tab-menu').addClass('placeholder')
        $('.filter-tour-type-select').closest('.tab-menu').addClass('box-placeholder')
        $('.filter-tour-type').closest('.tab-menu').addClass('placeholder')
        $('.filter-tour-type').closest('.tab-menu').addClass('box-placeholder')
        $('#select-address-from').closest('.wrap-search').addClass('placeholder')
        $('#select-address-from').closest('.wrap-search').addClass('box-placeholder')
        $('#select-address-to').hide()
    },
    RemoveLoadingSearch: function () {
        $('.filter-tour-type-select').closest('.tab-menu').removeClass('placeholder')
        $('.filter-tour-type-select').closest('.tab-menu').removeClass('box-placeholder')
        $('.filter-tour-type').closest('.tab-menu').removeClass('placeholder')
        $('.filter-tour-type').closest('.tab-menu').removeClass('box-placeholder')
        $('#select-address-from').closest('.wrap-search').removeClass('placeholder')
        $('#select-address-from').closest('.wrap-search').removeClass('box-placeholder')
    },
    
    LocationStart: function () {
        var tour_type = tour_index.GetTourType();
        var template = tour_constants.HTML.Option
        _ajax_caller.post('/Tour/LocationStart', { tour_type: tour_type }, function (result) {
            var html = ''
            html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')
            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
                });
            }
            $('#select-address-from').html(html)

            $('#select-address-from').select2();
            tour_index.RemoveLoadingSearch()
            tour_index.LocationEnd()
        })
    },
    LocationEnd: function () {
        var location_start = $('#select-address-from').find(':selected').val()
        var tour_type = tour_index.GetTourType();
        var template = tour_constants.HTML.Option
        _ajax_caller.post('/Tour/LocationEnd', { tour_type: tour_type, start_point: location_start }, function (result) {
            var html = ''
            html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')
            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
                });
            }
            $('#select-address-to').html(html)
            $('#select-address-to').show()
            $('#select-address-to').prop('disabled', false)
            $('#select-address-to').removeClass('placeholder')
            $('#select-address-to').select2();

        })

    },
    GetTourType: function () {
        var type = 1
        $('.filter-tour-type').each(function (index, item) {
            var element = $(this)
            if (element.hasClass('active')) {
                var type_value = parseInt(element.attr('data-id'))
                if (!isNaN(type_value) && type_value>0) type = type_value
                return false
            }

        })
        return type
    },
}