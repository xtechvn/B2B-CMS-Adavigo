$(document).ready(function () {
    tour_detail.Initialization()
})
var tour_detail = {
    Initialization: function () {
        tour_detail.TourDetail()
        tour_detail.DynamicBind()
    },
    DynamicBind: function () {
        $('body').on('click', '.select-tab', function (e) {
            var element = $(this)
            tour_detail.SwitchTab(element)
        });
        $('body').on('click', '.tour-detail-confirm', function (e) {
            var element = $(this)
            var packageid = element.closest('tr').attr('data-id')
            var price = element.closest('tr').find('.price').text().replaceAll(',', '')
            var fromdate = element.closest('tr').find('.departure-date').attr('data-date').replaceAll('/', '-')
            var object = {
                id: $('#tour-detail-id').val(),
                tourname: $('#tour-detail-id').val(),
                price: price,
                days: $('#tour-detail-days').val(),
                oldprice: $('#tour-detail-oldPrice').val(),
                avatar: $('#tour-detail-avatar').val(),
                star: $('#tour-detail-star').val(),
                tourtypename: $('#tour-detail-tourTypeName').val(),
                organizingname: $('#tour-detail-organizingName').val(),
                selected_packageid: packageid,
                fromdate: fromdate,
            }

            sessionStorage.setItem(tour_constants.STORAGE.TourCart, JSON.stringify(object))
            tour_detail.ConfirmTour()
        });
        $('body').on('click', '.tour-detail-confirm-quick', function (e) {
            var object = {
                id: $('#tour-detail-id').val(),
                tourname: $('#tour-detail-id').val(),
                price: 0,
                days: $('#tour-detail-days').val(),
                oldprice: $('#tour-detail-oldPrice').val(),
                avatar: $('#tour-detail-avatar').val(),
                star: $('#tour-detail-star').val(),
                tourtypename: $('#tour-detail-tourTypeName').val(),
                organizingname: $('#tour-detail-organizingName').val(),
                selected_packageid: 0,

            }

            sessionStorage.setItem(tour_constants.STORAGE.TourCart, JSON.stringify(object))
            tour_detail.ConfirmTour()
        });
        $('body').on('click', '.TT-Lien-He', function (e) {
            let htmlBody = `<div class="bold txt_16 mb10">Thông tin liên hệ</div>
                    <div class="gray mb16">Hỗ trợ khách hàng 24/7 0936.191.192</div>
                    <button type="button" data-dismiss="modal" class="btn btn-default">Đồng ý</button>`;
            _global_popup.showAlertPopup("width:335px", htmlBody);
        });
        $('body').on('select2:select', '#tour-detail-schedule-fixed', function (e) {
            var selected_value = $(this).find(':selected')
            var adt_value = selected_value.attr('data-adult')
            var chd_value = selected_value.attr('data-child')
            $('#min_adultprice').html(tour_function.Comma(adt_value))
            $('#min_childprice').html(tour_function.Comma(chd_value))
        });
        $('body').on('change', '.tour-schedule-checkbox', function () {
            var element = $(this)
            $('.tour-schedule-checkbox').prop('checked', false);
            element.prop('checked', true);
            var value = element.val()
            if (value == '1') {
                var adt_value = $('#tour-schedule-flex').attr('data-adt')
                var chd_value = $('#tour-schedule-flex').attr('data-chd')
                $('#min_adultprice').html(tour_service.Comma(adt_value))
                $('#min_childprice').html(tour_service.Comma(chd_value))
            }
            else if (value == '0') {
                var selected_value = $('#tour-detail-schedule-fixed').find(':selected')
                var adt_value = selected_value.attr('data-adult')
                var chd_value = selected_value.attr('data-child')
                $('#min_adultprice').html(tour_service.Comma(adt_value))
                $('#min_childprice').html(tour_service.Comma(chd_value))
            }
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
    TourDetail: function () {
        var model = {
            tour_id: parseInt($('#tour-detail-id').val())
        }
        _ajax_caller.post('/tour/TourDetail', { "request": model }, function (result) {
            if (result != undefined && result.status != undefined && result.status == 0) {
                tour_detail.RenderDetail(result)

            } else {
                window.location.href = '/Error'
            }

        });
    },
    RenderDetail: function (result) {
        tour_detail.RenderBreadcumb(result.data.tourName)
        switch (result.data.tourType) {
            case 1:
                {
                    $('.url-tourtype').attr('href', '/tour/tour-noi-dia');
                    $('#schedule-summary').html('[' + result.data.startPoint1 + ']' + " - " + '[' + result.data.groupEndPoint1 + ']');
                }
                break;
            case 2:
                {
                    $('.url-tourtype').attr('href', '/tour/tour-inbound');
                    $('#schedule-summary').html('[' + result.data.startPoint2 + ']' + " - " + '[' + result.data.groupEndPoint2 + ']');

                }
                break;
            case 3:
                {
                    $('.url-tourtype').attr('href', '/tour/tour-quoc-te');
                    $('#schedule-summary').html('[' + result.data.startPoint3 + ']' + " - " + '[' + result.data.groupEndPoint3 + ']');

                }
                break;
        }
        $('.tour-name').html(result.data.tourName)
        $('.on-star .star').html(tour_detail.RenderStar(result.data.star))
        tour_detail.RenderSlideGallery(result.data.otherImages)
        $('#min_adultprice').html(tour_service.Comma(result.data.min_adultprice != null && result.data.min_adultprice != undefined && result.data.min_adultprice > 0 ? result.data.min_adultprice : result.data.price) + ' đ')
        $('#min_childprice').html(tour_service.Comma(result.data.min_childprice != null && result.data.min_childprice != undefined && result.data.min_childprice > 0 ? result.data.min_childprice : result.data.price) + ' đ')
        $('#min_adultprice').removeClass('placeholder')
        $('#min_childprice').removeClass('placeholder')
        var html = ''
        if (result.data.packages != null && result.data.packages != undefined && result.data.packages.length > 0) {
            var html_option = ''
            $(result.data.packages).each(function (index, item) {
                html_option += tour_constants.HTML.DetailSelectTourScheduleOption.replaceAll('{id}', item.Id).replaceAll('{adt}', item.AdultPrice)
                    .replaceAll('{chd}', item.ChildPrice).replaceAll('{time}', tour_detail.RenderDetailSelectTourScheduleOptionTime(item.FromDate))
            });
            html += tour_constants.HTML.DetailSelectTourScheduleFixed.replaceAll('{option}', html_option)
            html += tour_constants.HTML.DetailSelectTourScheduleFlex.replaceAll('{checked}', '')
                .replaceAll('{adt}', result.data.daily_adultprice != null && result.data.daily_adultprice != undefined && result.data.daily_adultprice > 0 ? result.data.daily_adultprice : result.data.price)
                .replaceAll('{chd}', result.data.daily_childprice != null && result.data.daily_childprice != undefined && result.data.daily_childprice > 0 ? result.data.daily_childprice : result.data.price)
                .replaceAll('{package_id}', result.data.daily_package_id)
        } else {
            html += tour_constants.HTML.DetailSelectTourScheduleFlex.replaceAll('{checked}', 'checked')
                .replaceAll('{adt}', result.data.daily_adultprice != null && result.data.daily_adultprice != undefined && result.data.daily_adultprice > 0 ? result.data.daily_adultprice : result.data.price)
                .replaceAll('{chd}', result.data.daily_childprice != null && result.data.daily_childprice != undefined && result.data.daily_childprice > 0 ? result.data.daily_childprice : result.data.price)
                .replaceAll('{package_id}', result.data.daily_package_id)
        }
        $('#schedule').html(html)
        tour_detail.SingleDatePickerFromNow($('.tour-detail-schedule-flex'))
        $('#schedule').removeClass('box-placeholder')
        $('#schedule').removeClass('placeholder')
        $('.tour-description').html(result.data.description)
        $('.tour-description').closest('.detail_tin').removeClass('box-placeholder')
        $('.tour-description').closest('.detail_tin').removeClass('placeholder')
        html = ''
        if (result.data.tourSchedule != null && result.data.tourSchedule != undefined && result.data.tourSchedule.length > 0) {
            $(result.data.tourSchedule).each(function (index, item) {
                html += tour_constants.HTML.DetailSelectTourScheduleDay.replaceAll('{day_num}', item.day_num).replaceAll('{day_title}', item.day_title)
                    .replaceAll('{day_description}', item.day_description)
            });
        }
        $('.lich-trinh-tour').html(html)
        if (result.data.include == null || result.data.include == undefined || result.data.include.trim() == "") {
            $('.select-tag-1').hide()
        }
        else {
            $('#select-tab-1').html(result.data.include)

        }
        if (result.data.exclude == null || result.data.exclude == undefined || result.data.exclude.trim() == "") {
            $('.select-tag-2').hide()
        }
        else {
            $('#select-tab-2').html(result.data.exclude)

        }

        if (result.data.refund == null || result.data.refund == undefined || result.data.refund.trim() == "") {
            $('.select-tag-3').hide()
        }
        else {
            $('#select-tab-3').html(result.data.refund)

        }
        if (result.data.surcharge == null || result.data.surcharge == undefined || result.data.surcharge.trim() == "") {
            $('.select-tag-4').hide()
        }
        else {
            $('#select-tab-4').html(result.data.surcharge)

        }
        if (result.data.note == null || result.data.note == undefined || result.data.note.trim() == "") {
            $('.select-tag-5').hide()
        }
        else {
            $('#select-tab-5').html(result.data.note)

        }
        $('.select-tab').each(function (index, item) {
            var element = $(this)
            if (element.is(':hidden')) {
                return true
            } else {
                element.addClass('active')
                $('#select-tab-' + element.attr('data-id')).show()
                return false
            }
        });
        $('#total_nights').html((result.data.days + 1) + ' ngày ' + result.data.days + ' đêm')
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
    RenderDetailSelectTourScheduleOptionTime: function (date) {
        let arrdate = date.split('T')[0].split('-');
        return (arrdate[2] + "/" + arrdate[1] + "/" + arrdate[0]);

    },
    RenderStar: function (value) {
        var html_template = tour_constants.HTML.Star
        var html = ''
        if (value == null || value == undefined || value <= 0) return html
        if (value > 5) value = 5
        for (var i = 0; i < value; i++) {
            html += html_template
        }
        return html
    },
    RenderSlideGallery: function (images) {
        var html = ''
        var count = 0;
        var first = false
        $(images).each(function (index, item) {
            if (item == null || item == undefined || item.trim() == '') return true
            var url = item.includes(tour_constants.Domain.StaticImage) ? item : tour_constants.Domain.StaticImage + item
            if (!first) {
                $('#lightgallery .thumb-main img').attr('src', url)
                first = true
                count++
                return true
            }
            if (count <= 0) return true
            if (count < 5) {
                html += tour_constants.HTML.LightGalleryItem.replaceAll('{d-none}', '').replaceAll('{src}', url)
                count++
            } else {
                html += tour_constants.HTML.LightGalleryItem.replaceAll('{d-none}', 'display:none;').replaceAll('{src}', url)
                count++
            }
            if (count >= 20) return false
        });

        $('#lightgallery .sub-gallery').html(html)
        if ($('#lightgallery .sub-gallery .item').length <= 0) {
            for (var i = 1; i < 5; i++) {
                var url = images[0].includes(tour_constants.Domain.StaticImage) ? images[0] : tour_constants.Domain.StaticImage + images[0]
                html += tour_constants.HTML.LightGalleryItem.replaceAll('{d-none}', '').replaceAll('{src}', url)
            }
            $('#lightgallery .sub-gallery').html(html)

        }
        $('#lightgallery').removeClass('placeholder')
        $('#lightgallery').removeClass('box-placeholder')
        //try { $('#lightgallery').data('lightGallery').destroy(true); } catch (ex) { };
        //$('#lightgallery').lightGallery({
        //    selector: '.item',
        //});
    },
    RenderBreadcumb: function (tourName) {
        var html_direction = ''
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/').replaceAll('{name}', 'Trang chủ')
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/tour').replaceAll('{name}', 'Tour')
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', 'active').replaceAll('{url}', 'javascript:;').replaceAll('{name}', tourName)
        $('#navbar').prepend(tour_constants.HTML.Breadcumb.replaceAll('{items}', html_direction))
    },
    ConfirmTour: function () {
        var model_input = {
            tour_id: $('#tour-detail').val()
        }

        model_input.is_daily = true


        window.location.href = '/tour/CustomerInfo'
    },
    SingleDatePickerFromNow: function (element, dropdown_position = 'down') {

        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; // Months start at 0!
        var dd = today.getDate();
        var yyyy_max = yyyy + 10;
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        var time_now = dd + '/' + mm + '/' + yyyy;
        var max_range = '31/12/' + yyyy_max;

        element.daterangepicker({
            singleDatePicker: true,
            autoApply: true,
            showDropdowns: true,
            drops: dropdown_position,
            minDate: time_now,
            maxDate: max_range,
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end, label) {


        });
    },
}