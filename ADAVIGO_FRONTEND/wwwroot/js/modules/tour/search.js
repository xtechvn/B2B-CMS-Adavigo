$(document).ready(function () {
    tour_search.Initialization()
})
var tour_search = {
    Initialization: function () {

        tour_search.RenderBreadcumb()

        var session_data = localStorage.getItem(TOUR_CONSTANTS.STORAGE.Search)
        if (session_data) {
            var json_model = JSON.parse(session_data)
            tour_search.RenderLocationStart(json_model.startpoint)
            tour_search.RenderLocationEnd(json_model.startpoint, json_model.endpoint)
        } else {
            tour_search.RenderLocationStart()
            tour_search.RenderLocationEnd()
        }
        //-- Search Tour:
        var model = {
            pageindex: 1,
            pagesize: 50,
            tourtype: -1,
            startpoint: -1,
            endpoint: -1
        }

        var session_data = localStorage.getItem(TOUR_CONSTANTS.STORAGE.Search)
        if (session_data) {
            var json_model = JSON.parse(session_data)
            model = {
                "pageindex": 1,
                "pagesize": 50,
                "tourtype": json_model.tourtype,
                "startpoint": json_model.startpoint,
                "endpoint": json_model.endpoint
            }
        }
        tour_search.SearchTour(model)
        tour_search.DynamicBind()
    },
    DynamicBind: function () {
        $('body').on('select2:select', '#filter-from select', function (e) {
            //var element = $(this)
            //if (element.find(':selected').val() != undefined && element.find(':selected').val() != '-1') {
            //    $('.address-name').html(element.find(':selected').text())
            //} else {
            //    $('.address-name').html('')
            //}
        });
        $('body').on('click', '.tour-detail-confirm', function (e) {
            var element = $(this)
            tour_search.ConfirmTour(element)
        });
        $('body').on('click', '.btn-search-tour', function (e) {
            if ($('#filter-from select').find(':selected').val() != undefined && $('#filter-from select').find(':selected').val() != '-1') {
                $('.address-name').html($('#filter-from select').find(':selected').text())
            } else {
                $('.address-name').html('')
            }
            var model = {
                pageindex: 1,
                pagesize: 50,
                tourtype: parseInt($('input[type=radio][name=filter]:checked').val()),
                startpoint: parseInt($('#filter-from select').find(':selected').val()),
                endpoint: parseInt($('#filter-to select').find(':selected').val())
            }
            $('#lightgallery').addClass('placeholder')
            $('#lightgallery').addClass('box-placeholder')
            $('#search-items').addClass('placeholder')
            $('#search-items').addClass('box-placeholder')
            tour_search.SearchTour(model)

        });

        $('input[type=radio][name=filter]').on('click', function (e) {
            $('#filter-from').addClass('placeholder')
            $('#filter-from').addClass('box-placeholder')
            $('#filter-to').addClass('placeholder')
            $('#filter-to').addClass('box-placeholder')
            tour_search.RenderLocationStart()
            tour_search.RenderLocationEnd()

        });
        $('body').on('click', '.search-view-more', function () {
            var element = $(this)
            var count = 0
            element.closest('.article-data').find('.grid').find('.article-itemt').each(function (index, item) {
                var article = $(this)
                if (article.is(':hidden')) {
                    article.show()
                    count++
                    if (count > 6) return false
                }
            });
            var all_show = true
            element.closest('.article-data').find('.grid').find('.article-itemt').each(function (index, item) {
                var article = $(this)
                if (article.is(':hidden')) {
                    all_show = false
                    return false
                }
            });
            if (all_show) {
                element.hide()
            }
        });
    },
    RenderBreadcumb: function () {
        var html_direction = ''
        html_direction += TOUR_CONSTANTS.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/').replaceAll('{name}', 'Trang chủ')
        html_direction += TOUR_CONSTANTS.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/tour').replaceAll('{name}', 'Tour')
        html_direction += TOUR_CONSTANTS.HTML.BreadcumbItem.replaceAll('{active}', 'active').replaceAll('{url}', '/tour/search').replaceAll('{name}', 'Tìm kiếm Tour')
        $('#navbar').prepend(TOUR_CONSTANTS.HTML.Breadcumb.replaceAll(' {items}', html_direction))
    },
    ConfirmTour: function (element) {
        var model_input = {
            tour_id: element.closest('.article-itemt').attr('data-id')
        }
        sessionStorage.setItem(TOUR_CONSTANTS.STORAGE.TourCart, JSON.stringify(model_input))

        window.location.href = '/tour/CustomerInfo'
    },
    SearchTour: function (model) {

        _ajax_caller.post('/tour/SearchTour', { "request": model }, function (result) {
            var html = ''
            if (result && result.status == 0 && result.data && result.data.length > 0) {
                //-- Gallery:
                tour_search.RenderSlideGallery(result.listimages)
                //-- Group by start_point:
                html = tour_search.RenderTourByStartPoint(result)

            } else {
                html = TOUR_CONSTANTS.HTML.NotFound
            }
            $('#search-items').html(html)
            $('#search-items').removeClass('placeholder')
            $('#search-items').removeClass('box-placeholder')
        });
    },
    RenderTourByStartPoint: function (result) {
        var start_point = result.data.map(a => a.startpoint);
        var unique_start_points = tour_search.GetUniqueStartPoint(start_point)
        var html = ''
        $(unique_start_points).each(function (index, item) {
            let tour_by_start_point = result.data.filter(function (e) {
                return e.startpoint == item;
            });
            if (tour_by_start_point && tour_by_start_point[0]) {
                //------ Render Header:
                var start_point_name = tour_by_start_point[0].startpoint
                var end_point_name = tour_by_start_point[0].groupendpoint1
                switch (tour_by_start_point[0].tourtype) {
                    case 1: {
                        start_point_name = tour_by_start_point[0].startpoint1
                        end_point_name = tour_by_start_point[0].groupendpoint1
                    } break
                    case 2: {
                        start_point_name = tour_by_start_point[0].startpoint2
                        end_point_name = tour_by_start_point[0].groupendpoint2
                    } break;
                    case 3: {
                        start_point_name = tour_by_start_point[0].startpoint3
                        end_point_name = tour_by_start_point[0].groupendpoint3
                    } break;
                }
                html += TOUR_CONSTANTS.HTML.SearchItemHeader.replaceAll('{start_point}', start_point_name).replaceAll('{count}', tour_by_start_point.length)
                var html_item = ''
                var count = 0
                $(tour_by_start_point).each(function (index_detail, tour_detail) {
                    html_item += tour_search.RenderSearchItem(start_point_name, tour_detail).replaceAll('{display}', (count < 6 ? '' : 'display:none;'))
                    count++
                });
                html += TOUR_CONSTANTS.HTML.SearchItemContent.replaceAll('{items}', html_item).replaceAll('{view-more}', tour_by_start_point.length > 6 ? '' : 'display:none;')

            }
        })

        return html
    },
    RenderSlideGallery: function (images) {
        var html = ''
        var count = 0;
        var first = false
        $(images).each(function (index, item) {
            if (item == null || item == undefined || item.trim() == '') return true
            var url = item.includes(TOUR_CONSTANTS.Domain.StaticImage) ? item : TOUR_CONSTANTS.Domain.StaticImage + item
            if (!first) {
                $('#lightgallery .thumb-main img').attr('src', url)
                first = true
                count++
                return true
            }
            if (count <= 0) return true
            if (count < 5) {
                html += TOUR_CONSTANTS.HTML.LightGalleryItem.replaceAll('{d-none}', '').replaceAll('{src}', url)
                count++
            } else {
                html += TOUR_CONSTANTS.HTML.LightGalleryItem.replaceAll('{d-none}', 'display:none;').replaceAll('{src}', url)
                count++
            }
            if (count >= 20) return false
        });

        $('#lightgallery .sub-gallery').html(html)
        $('#lightgallery').removeClass('placeholder')
        $('#lightgallery').removeClass('box-placeholder')
        //try { $('#lightgallery').data('lightGallery').destroy(true); } catch (ex) { };
        //$('#lightgallery').lightGallery({
        //    selector: '.item',
        //});
    },
    RenderSearchItem: function (start_point_name, tour_detail) {

        var html = TOUR_CONSTANTS.HTML.SearchItemDetail
        var endpoint = tour_detail.groupendpoint1
        switch (tour_detail.tourtype) {
            case 2: {
                endpoint = tour_detail.groupendpoint2
            } break;
            case 3: {
                endpoint = tour_detail.groupendpoint3
            } break;
        }

        endpoint = endpoint != null && endpoint != undefined && endpoint.length > 29 ? endpoint.slice(0, 29 - 1) + "…" : endpoint
        html = html.replaceAll('{end_point}', endpoint)

        //-- Tour ID:
        var tour_id = tour_detail.Id
        if (tour_id == null && tour_id == undefined && tour_detail.id != null && tour_detail.id != undefined) tour_id = tour_detail.id
        //-- URL:
        var tour_url_startpoint = tour_service.RemoveUnicode(start_point_name)
        tour_url_startpoint = tour_service.RemoveSpecialCharacter(tour_url_startpoint)
        tour_url_startpoint = tour_url_startpoint.replaceAll('  ', ' ')
        tour_url_startpoint = tour_url_startpoint.replaceAll(' ', '-')
        var tour_url_name = tour_service.RemoveUnicode(tour_detail.tourname)
        tour_url_name = tour_service.RemoveSpecialCharacter(tour_url_name)
        tour_url_name = tour_url_name.replaceAll('  ', ' ')
        tour_url_name = tour_url_name.replaceAll(' ', '-')
        html = html.replaceAll('{url}', '/tour/' + tour_url_startpoint + '/' + tour_url_name + '--' + tour_id)
        //-- Thumb
        if (tour_detail.avatar != null && tour_detail.avatar != undefined) {
            var item_avatar = tour_detail.avatar.includes(TOUR_CONSTANTS.Domain.StaticImage) ? tour_detail.avatar : TOUR_CONSTANTS.Domain.StaticImage + tour_detail.avatar
            html = html.replaceAll('{thumb}', item_avatar)
        }
        else {
            html = html.replaceAll('{thumb}', '')

        }
        //-- Price
        if (tour_detail.oldprice != null && tour_detail.oldprice != undefined && tour_detail.price < tour_detail.oldprice) {
            var percent = ((tour_detail.oldprice - tour_detail.price) / tour_detail.oldprice * 100).toFixed(1)
            html = html.replaceAll('{sale_percent_style}', '')
            html = html.replaceAll('{price_old_style}', '')
            html = html.replaceAll('{sale_percent}', '' + percent + ' %')

        }
        else {
            html = html.replaceAll('{price_old_style}', 'display:none;')
            html = html.replaceAll('{sale_percent_style}', 'display:none;')
            html = html.replaceAll('{sale_percent}', '')

        }
        html = html.replaceAll('{price_old}', tour_service.Comma(tour_detail.oldprice > 0 ? tour_detail.oldprice.toFixed(0) : '0'))
        html = html.replaceAll('{free_extra_fee_style}', 'display:none;')
        html = html.replaceAll('{free_extra_fee}', '')
        html = html.replaceAll('{tour_name}', tour_detail.tourname)
        html = html.replaceAll('{star}', tour_search.RenderStar(tour_detail.star))
        html = html.replaceAll('{tour_type}', tour_detail.tourtypename)
        html = html.replaceAll('{price_new}', tour_detail.price != undefined && tour_detail.price > 0 ? tour_service.Comma(tour_detail.price.toFixed(0)) + ' đ' : 'Giá liên hệ')
        html = html.replaceAll('{tour_id}', tour_id)

        return html
    },
    GetUniqueStartPoint: function (start_point) {
        var uniqueIds = [];

        var unique_start_point = start_point.filter(element => {
            const isDuplicate = uniqueIds.includes(element);
            if (!isDuplicate) {
                uniqueIds.push(element);

                return true;
            }

            return false;
        });
        return uniqueIds
    },
    RenderStar: function (value) {
        var html_template = TOUR_CONSTANTS.HTML.Star
        var html = ''
        if (value == null || value == undefined || value <= 0) return html
        if (value > 5) value = 5
        for (var i = 0; i < value; i++) {
            html += html_template
        }
        return html
    },
    RenderLocationStart: function (default_option = undefined) {
        var model = {
            "tour_type": $('input[type=radio][name=filter]:checked').val()
        }

        _ajax_caller.post('/tour/GetLocationStart', { request: model }, function (result) {
            var html = ''
            html += TOUR_CONSTANTS.HTML.Option.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')

            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += TOUR_CONSTANTS.HTML.Option.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
                });
            }
            $('#filter-from').removeClass('placeholder')
            $('#filter-from').removeClass('box-placeholder')
            $('#filter-from select').prop('disabled', false);
            $('#filter-from select').html(html)
            $('#filter-from select').select2()
            if (default_option != null && default_option != undefined) {
                $('#filter-from select').val(default_option).trigger('change')
            }
        });


    },
    RenderLocationEnd: function (start_point = -1, default_option = undefined) {
        var model = {
            "tour_type": $('input[type=radio][name=filter]:checked').val(),
            "start_point": start_point
        }
        _ajax_caller.post('/tour/GetLocationEnd', { request: model }, function (result) {
            var html = ''
            html += TOUR_CONSTANTS.HTML.Option.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')

            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += TOUR_CONSTANTS.HTML.Option.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
                });
            }
            $('#filter-to').removeClass('placeholder')
            $('#filter-to').removeClass('box-placeholder')
            $('#filter-to select').prop('disabled', false);
            $('#filter-to select').html(html)
            $('#filter-to select').select2()
            if (default_option != null && default_option != undefined) {
                $('#filter-to select').val(default_option).trigger('change')
            }
        });

    }
}