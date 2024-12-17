$(document).ready(function () {
    tour_search.Initialization()
    tour_search.EventBind()
})
var tourLoading = {
    SearchListing: false,
    LoadAllLocationLocal: false,
    LoadAllLocationInternational: false,
    FromLocation: false,
    ToLocationDefault: false,
    LightGallery: false
}
var tourData = {
    localFrom: [],
    localTo: [],
    outboundFrom: [],
    outboundTo: [],
    data: [],
    startPointList: [],
}
var tour_search = {
    EventBind: function () {
        $("#select-address-from").on('select2:select', function (e) {
            var element = $(this)


            tour_search.RenderLocationEnd()
        });

        $('body').on('click', '.search-tour-viewmore', function () {
            var element = $(this)
            var start_point_id = element.attr('data-startpointid')
            if (tourData.startPointList.includes(parseInt(start_point_id)) && $('.search-tour-' + start_point_id) && $('.search-tour-' + start_point_id + ' .article-itemt') && $('.search-tour-' + start_point_id + ' .article-itemt')[0]) {
                var count = tour_search.CountElement($('.search-tour-' + start_point_id + ' .article-itemt'))
                let tour_by_start_point = tourData.data.filter(function (e) {
                    return e.startpoint == start_point_id;
                })
                var html = ''
                if (tour_by_start_point && tour_by_start_point[0]) {
                    var tour_next_page = tour_by_start_point.slice(count, count + 3)
                    if (tour_next_page && tour_next_page[0]) {
                        $(tour_next_page).each(function (index_detail, tour_detail) {
                            var start_point_name = tour_detail.startpoint1
                            switch (tour_detail.tourtype) {
                                case 2: {
                                    start_point_name = tour_detail.startpoint2
                                } break;
                                case 3: {
                                    start_point_name = tour_detail.startpoint3
                                } break;
                            }
                            html += tour_search.RenderSearchItem(start_point_name, tour_detail)
                        });
                    }

                }


                $('.search-tour-' + start_point_id).append(html)
                if ($('.search-tour-' + start_point_id +' .article-itemt').length >= tour_by_start_point.length) {
                    element.hide()
                }
            }
        });
        $('body').on('click', '.TT-Lien-He', function (e) {
            let htmlBody = `<div class="bold txt_16 mb10">Thông tin liên hệ</div>
                                <div class="gray mb16">Hỗ trợ khách hàng 24/7 0936.191.192</div>
                                <button type="button" data-dismiss="modal" class="btn btn-default">Đồng ý</button>`;
            _global_popup.showAlertPopup("width:335px", htmlBody);
        });
        $('input[type=radio][name=filter-tour-type-tour-type]').on('click', function (e) {
            var element = $(this)
            element.closest('.col-300').addClass('placeholder')
            element.closest('.col-300').addClass('box-placeholder')
            $('#clear-filter').show();
            tour_search.RenderLocationStart()
            tour_search.RenderLocationEnd()

        });
        $('#search-tour').on('click', function (e) {
            var element = $(this);
            request.startpoint = $("#select-address-from").find(':selected').val()
            request.endpoint = $("#select-address-to").find(':selected').val()
            request.tourtype = parseInt($('input[type=radio][name=filter-tour-type-tour-type]:checked').val())
            var tour_name = $("#select-address-to").find(':selected').text()
            var slug = tourRenderService.RemoveUnicode(tour_name.toLowerCase())
            slug = tourRenderService.RemoveSpecialCharacter(slug)
            slug = slug.replaceAll(' ', '-')
            window.history.pushState('', 'Adavigo - Tìm kiếm Tour', '/tour/tim-kiem/' + slug + '_' + request.startpoint + '_' + request.endpoint + '_' + request.tourtype);
            tour_search.SearchListing()
        });
        $('body').on('click', '.confirm-booking-tour', function () {
            var element = $(this)
            var tour_id = element.attr('data-tourid')
            var selected_tour = tourData.data.filter(cls => cls.Id == parseInt(tour_id))
            if (tourData.data && selected_tour && selected_tour[0]) {
                var session_object = {
                    id: selected_tour[0].Id,
                    tourname: selected_tour[0].tourname,
                    price: selected_tour[0].price,
                    days: selected_tour[0].days,
                    oldprice: selected_tour[0].oldprice,
                    avatar: selected_tour[0].avatar,
                    star: selected_tour[0].star,
                    tourtypename: selected_tour[0].tourtypename,
                    organizingname: selected_tour[0].organizingname,
                }
                sessionStorage.setItem(tour_constants.STORAGE.TourCart, JSON.stringify(session_object))
                window.location.href = '/tour/CustomerInfo'
            }
        });
        $('#clear-filter').on('click', function (e) {
            $("#select-address-from").val('-1').trigger('change')
            $("#select-address-to").val('-1').trigger('change')
            $("input[name=background][value='1']").prop("checked", true);
            objSearch = {
                fromId: $("#select-address-from").find(':selected').val(),
                toId: '-1',
                tourType: '1'
            }
            tour_search.RenderSearch()
            $('#clear-filter').hide();
        });

    },
    Initialization: function () {

        tour_search.RenderBreadcumb()

        var session_data = sessionStorage.getItem(tour_constants.STORAGE.TourSearch)
        if (session_data) {
            var json_model = JSON.parse(session_data)
            tour_search.RenderLocationStart(json_model.start_point)
            tour_search.RenderLocationEnd(json_model.startpoint, json_model.end_point)
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

        if (session_data) {
            var json_model = JSON.parse(session_data)
            model = {
                "pageindex": 1,
                "pagesize": 50,
                "tourtype": json_model.type,
                "startpoint": json_model.start_point,
                "endpoint": json_model.end_point
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
                tourtype: parseInt($('input[type=radio][name=filter-tour-type]:checked').val()),
                startpoint: parseInt($('#filter-from select').find(':selected').val()),
                endpoint: parseInt($('#filter-to select').find(':selected').val())
            }
            $('#lightgallery').addClass('placeholder')
            $('#lightgallery').addClass('box-placeholder')
            $('#search-items').addClass('placeholder')
            $('#search-items').addClass('box-placeholder')
            tour_search.SearchTour(model)

        });

        $('input[type=radio][name=filter-tour-type]').on('click', function (e) {
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
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/').replaceAll('{name}', 'Trang chủ')
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', '').replaceAll('{url}', '/tour').replaceAll('{name}', 'Tour')
        html_direction += tour_constants.HTML.BreadcumbItem.replaceAll('{active}', 'active').replaceAll('{url}', '/tour/search').replaceAll('{name}', 'Tìm kiếm Tour')
        $('#navbar').prepend(tour_constants.HTML.Breadcumb.replaceAll('{items}', html_direction))
    },
    ConfirmTour: function (element) {
        var model_input = {
            tour_id: element.closest('.article-itemt').attr('data-id')
        }
        sessionStorage.setItem(tour_constants.STORAGE.TourCart, JSON.stringify(model_input))

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
                html = tour_constants.HTML.NotFound
            }
            $('#search-items').html(html)
            $('#search-items').removeClass('placeholder')
            $('#search-items').removeClass('box-placeholder')
        });
    },
    RenderTourByStartPoint: function (result) {
        tourData.data = result.data;
        var start_point = result.data.map(a => a.startpoint);
        var unique_start_points = tour_search.GetUniqueStartPoint(start_point)
        var html = ''
        var is_more_item = true
        $(unique_start_points).each(function (index, item) {
            let tour_by_start_point = result.data.filter(function (e) {
                tourData.startPointList.push(e.startpoint)
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
                html += tour_constants.HTML.SearchItemHeader.replaceAll('{start_point}', start_point_name).replaceAll('{count}', tour_by_start_point.length)
                var html_item = ''
                var html_item2 = ''
                var count = 0
                if (tour_by_start_point.length <= 6) {
                    is_more_item = false
                }
                $(tour_by_start_point).each(function (index_detail, tour_detail) {
                    html_item += tour_search.RenderSearchItem(start_point_name, tour_detail).replaceAll('{display}', (count < 6 ? '' : 'display:none;'))
                    count++
                    
                    if (count >= 6) {
                        return false;
                    }
                });
                if (is_more_item) {
                    html_item2 += tour_constants.HTML.SearchTourDetailViewMore.replaceAll('(start_point)', item).replaceAll('(viewmore_style)', '')

                } else {
                    html_item2 += tour_constants.HTML.SearchTourDetailViewMore.replaceAll('(start_point)', item).replaceAll('(viewmore_style)', 'display:none;')

                }
                html += tour_constants.HTML.SearchItemContent.replaceAll('{id}', item).replaceAll('{items}', html_item).replaceAll('{items2}', html_item2).replaceAll('{view-more}', tour_by_start_point.length < 6 ? '' : 'display:none;')
              
            }
        })

        return html
    },
    RenderSlideGallery: function (images) {
        var html = ''
        var html_sub = ''
        var count = 0;
        var first = ''
        $(images).each(function (index, item) {
            if (item == null || item == undefined || item.trim() == '') return true
            var url = item.includes(tour_constants.Domain.StaticImage) ? item : tour_constants.Domain.StaticImage + item
            if (count <= 0) {
                first = url
                count++
            }
            if (count <= 0) return true
            if (count < 5) {
                html_sub += tour_constants.HTML.LightGalleryItem.replaceAll('{d-none}', '').replaceAll('{img}', url)
                count++
            } else {
                html_sub += tour_constants.HTML.LightGalleryItem.replaceAll('{d-none}', 'd-none').replaceAll('{img}', url)
                count++
            }
            if (count >= 20) return false
        });
        var location_end = $('#select-address-to').find(':selected').text()
        if (location_end.toLowerCase().includes('tất cả địa điểm')) location_end = ''
        html = tour_constants.HTML.Gallery.replaceAll('{location_end}', location_end).replaceAll('{img_src}', first).replaceAll('{item}', html_sub)
        $('#lightgallery').html(html)
        $('#lightgallery').removeClass('placeholder')
        $('#lightgallery').removeClass('box-placeholder')

        try { $('#lightgallery').data('lightGallery2').destroy(true); } catch (ex) { };
        $('#lightgallery').lightGallery({
            selector: '.item',
        });
    },
    RenderSearchItem: function (start_point_name, tour_detail) {

        var html = tour_constants.HTML.SearchTourDetailItem
        var endpoint = tour_detail.groupendpoint1
        var tag_name = tour_detail.groupendpoint1
        switch (tour_detail.tourtype) {
            case 2: {
                endpoint = tour_detail.groupendpoint2
                tag_name = tour_detail.groupendpoint2
            } break;
            case 3: {
                endpoint = tour_detail.groupendpoint3
                tag_name = tour_detail.groupendpoint3
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
            var item_avatar = tour_detail.avatar.includes(tour_constants.Domain.StaticImage) ? tour_detail.avatar : tour_constants.Domain.StaticImage + tour_detail.avatar
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
        var tour_name = tour_service.RemoveUnicode(tour_detail.tourname.toLowerCase())
        tour_name = tour_service.RemoveSpecialCharacter(tour_name)
        tour_name = tour_name.replaceAll(' ', '-')

        endpoint = endpoint == null || endpoint == undefined || endpoint.trim() == '' ? 'chi tiet' : endpoint.split(',')[0].toLowerCase()
        endpoint = tour_service.RemoveUnicode(endpoint)
        endpoint = tour_service.RemoveSpecialCharacter(endpoint)
        endpoint = endpoint.replaceAll(' ', '-')

        var tour_url_by_id = tour_constants.MVC.Detail.replaceAll('detail', endpoint.trim()) + tour_name.trim() + '-' + tour_id

        html = html.replaceAll('{tour_url}', tour_url_by_id)
        if (tour_detail.avatar != null && tour_detail.avatar != undefined) {
            var item_avatar = tour_detail.avatar.includes(tour_constants.Domain.StaticImage) ? tour_detail.avatar : tour_constants.Domain.StaticImage + tour_detail.avatar
            html = html.replaceAll('{thumb_img}', item_avatar)
        }
        else {
            html = html.replaceAll('{thumb_img}', '')

        }
        html = html.replaceAll('{price_old}', tour_service.Comma(tour_detail.oldprice > 0 ? tour_detail.oldprice.toFixed(0) : '0'))
        html = html.replaceAll('{free_extra_fee_style}', 'display:none;')
        html = html.replaceAll('{free_extra_fee}', '')
        html = html.replaceAll('{tour_name}', tour_detail.tourname)
        html = html.replaceAll('{star}', tour_search.RenderStar(tour_detail.star))
        html = html.replaceAll('{tour_type}', tour_detail.tourtypename)
        html = html.replaceAll('{price_new}', tour_detail.price != undefined && tour_detail.price > 0 ? tour_service.Comma(tour_detail.price.toFixed(0)) + ' đ' : 'Giá liên hệ')
        html = html.replaceAll('{tour_id}', tour_id)
        html = html.replaceAll('{style_lh}', tour_detail.packages != undefined && tour_detail.packages > 0 ? 'display:none;' : '')
        html = html.replaceAll('{style_dp}', tour_detail.packages != undefined && tour_detail.packages > 0 ? '' : 'display:none;')

        tag_name = tag_name != null && tag_name != undefined && tag_name.length > 29 ? tag_name.slice(0, 29 - 1) + "…" : tag_name
        if (tag_name == null || tag_name == undefined) {
            switch (tour_detail.tourtype) {
                case 1: {
                    html = html.replaceAll('{start_point}', tour_detail.startpoint1)

                } break
                case 2: {
                    html = html.replaceAll('{start_point}', tour_detail.startpoint2)

                } break;
                case 3: {
                    html = html.replaceAll('{start_point}', tour_detail.startpoint3)

                } break;
            }
        }
        else {

            html = html.replaceAll('{start_point}', tag_name)
        }
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
        var html_template = tour_constants.HTML.StarTemplate
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
            "tour_type": $('input[type=radio][name=filter-tour-type]:checked').val()
        }

        _ajax_caller.post('/tour/LocationStart', { "request": model }, function (result) {
            var html = ''
            html += tour_constants.HTML.Option.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')

            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += tour_constants.HTML.Option.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
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
            "tour_type": $('input[type=radio][name=filter-tour-type]:checked').val(),
            "start_point": start_point
        }
        _ajax_caller.post('/tour/LocationEnd', { request: model }, function (result) {
            var html = ''
            html += tour_constants.HTML.Option.replaceAll('{value}', '-1').replaceAll('{text}', 'Tất cả địa điểm')

            if (result != null && result != undefined && result.data != null && result.data != undefined) {
                $(result.data).each(function (index, item) {
                    html += tour_constants.HTML.Option.replaceAll('{value}', item.id).replaceAll('{text}', item.name)
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

    },
    CountElement: function (element) {
        var total = 0;
        element.each(function (index, item) {
            total++;
        });
        return total
    },
}