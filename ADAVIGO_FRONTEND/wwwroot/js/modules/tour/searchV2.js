$(document).ready(function() {
    tour_search_v2.Initialization();
});

var tour_search_v2 = {
    currentIndex: 2,
    isLoading: false,
    hasMoreData: true,
    Initialization: function() {
        tour_search_v2.initDatePickers();
        tour_search_v2.RenderLocationStart();
        tour_search_v2.RenderLocationEnd();
        tour_search_v2.DynamicBind();
        $('#from').val($('#filter-url').attr('data-start')).trigger('change');
        $('#to').val($('#filter-url').attr('data-end')).trigger('change');
        var type = $('#filter-url').attr('data-type');
        if (type) {
            $('input[name="tour-type"][value="' + type + '"]').prop('checked', true);
        }
        //tour_search_v2.SetupInfiniteScroll();
    },
    initDatePickers: function() {
        var options = {
            singleDatePicker: true,
            autoUpdateInput: false,
            autoApply: true,
            minDate: new Date(),
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
        };

        $('#fromdate').daterangepicker(options, function(start, end, label) {
            $('#fromdate').val(start.format('DD/MM/YYYY'));
        }).on('apply.daterangepicker', function(ev, picker) {
            $('#fromdate').val(picker.startDate.format('DD/MM/YYYY'));
        }).on('cancel.daterangepicker', function(ev, picker) {
            $('#fromdate').val('');
        });

        $('#todate').daterangepicker(options, function(start, end, label) {
            $('#todate').val(start.format('DD/MM/YYYY'));
        }).on('apply.daterangepicker', function(ev, picker) {
            $('#todate').val(picker.startDate.format('DD/MM/YYYY'));
        }).on('cancel.daterangepicker', function(ev, picker) {
            $('#todate').val('');
        });
    },
    DynamicBind: function() {
        $('body').on('click', '#btn-search', function(e) {
            tour_search_v2.ResetAndSearch();
        });
         $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                tour_search_v2.LoadMoreTours(false);
            }
        });
        // Handle month change
        $('#month').on('change', function(e) {
            var month = $(this).val();
            if (month > 0) {
                var year = moment().year();

                var firstDay = moment(`${year}-${month}-01`, 'YYYY-M-DD');
                var lastDay = moment(firstDay).endOf('month');

                $('#fromdate').val(firstDay.format('DD/MM/YYYY'));
                $('#todate').val(lastDay.format('DD/MM/YYYY'));
            
            } else {
                $('#fromdate').val('');
                $('#todate').val('');
            }
        });
    },
    ResetAndSearch: function() {
        tour_search_v2.currentIndex = 1;
        tour_search_v2.hasMoreData = true;
        $('#tour-list').empty();
        $('#loading-indicator').show();
        tour_search_v2.LoadMoreTours(true);
    },
    RenderLocationStart: function() {
        var location_start = parseInt($('#from').find(':selected').val());
        var tour_type = tour_search_v2.GetTourType();
        var template = tour_constants.HTML.Option;
        var templateSelected = tour_constants.HTML.OptionSelected;
        var data = tour_global.LocationStart(tour_type);
        var html = '';
        html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm');
        if (data != null && data != undefined && data.length > 0) {
            $(data).each(function(index, item) {
                if (item.id == location_start) {
                    html += templateSelected.replaceAll('{value}', item.id).replaceAll('{text}', item.name);
                }else{
                    html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name);
                }
                
            });
        }
        $('#from').prop('disabled', false);
        $('#from').html(html);
      
        $('#from').hide();
    },
    RenderLocationEnd: function() {
        $('#to').addClass('placeholder');
        var location_start = $('#from').find(':selected').val();
        var location_end = parseInt($('#to').find(':selected').val());
        var tour_type = tour_search_v2.GetTourType();
        var template = tour_constants.HTML.Option;
        var templateSelected = tour_constants.HTML.OptionSelected;
        var data = tour_global.LocationEnd(tour_type, location_start);
        var html = '';
        html += template.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm');
        if (data != null && data != undefined && data.length > 0) {
            $(data).each(function(index, item) {
                if (item.id == location_end) {
                    html += templateSelected.replaceAll('{value}', item.id).replaceAll('{text}', item.name);
                }else{
                    html += template.replaceAll('{value}', item.id).replaceAll('{text}', item.name);
                }
                
            });
        }
        $('#to').html(html);
        $('#to').prop('disabled', false);
        $('#to').removeClass('placeholder');
        $('#to').select2();
    },
    GetTourType: function() {
        var type = 1;
        $('input[name="tour-type"]').each(function(index, item) {
            var element = $(this);
            if (element.is(':checked')) {
                type = element.val();
                return false;
            }
        });
        return type;
    },
    SetupInfiniteScroll: function() {
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                tour_search_v2.LoadMoreTours(false);
            }
        });
    },
    LoadMoreTours: function(isFirstLoad) {
        if (tour_search_v2.isLoading || !tour_search_v2.hasMoreData) return;
        tour_search_v2.isLoading = true;
        if (!isFirstLoad) {
            $('#loading-indicator').show();
        }
        var start_point = $('#from').find(':selected').val();
        var end_point = $('#to').find(':selected').val();
        var type = tour_search_v2.GetTourType();
        var tourname = $('#tourname').val();
        var fromdate = $('#fromdate').val();
        var todate = $('#todate').val();
        var month = $('#month').val();
        var noShopping = $('#noShopping').is(':checked') ? 1 : 0;
        var isHoliday = $('#isHoliday').is(':checked') ? 1 : 0;
        var holdSlot = $('#holdSlot').is(':checked') ? 1 : 0;

        $.ajax({
            url: '/Tour/SearchV2',
            type: 'GET',
            data: {
                start: start_point,
                end: end_point,
                type: type,
                index: tour_search_v2.currentIndex,
                tourname: tourname,
                fromdate: fromdate,
                todate: todate,
                month: month,
                noShopping: noShopping,
                isHoliday: isHoliday,
                holdSlot: holdSlot
            },
            success: function(response) {
                var newItems = $(response).find('#tour-list > *');
                var nullItems = $(response).find('.search-null > *');
                if (newItems.length > 0 && nullItems < 1) {
                    $('#tour-list').append(newItems);
                    tour_search_v2.currentIndex++;
                } else {
                    tour_search_v2.hasMoreData = false;
                    $('#tour-list').append(newItems);
                }
                tour_search_v2.isLoading = false;
                $('#loading-indicator').hide();
            },
            error: function() {
                tour_search_v2.isLoading = false;
                $('#loading-indicator').hide();
                alert('Có lỗi xảy ra khi tải dữ liệu!');
            }
        });
    }
};
