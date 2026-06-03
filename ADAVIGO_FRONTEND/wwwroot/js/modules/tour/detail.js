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
        $('body').on('click', '.tb-banggia .tr-row', function (e) {
            var element = $(this)
            var detail_row = element.next('.detail-row')
            if (detail_row.is(':visible')) {
                detail_row.hide()
                element.find('.icon-svg').css('transform', 'rotate(0deg)')
            } else {
                detail_row.show()
                element.find('.icon-svg').css('transform', 'rotate(90deg)')
            }
        });
        $('.tb-banggia .tr-row').each(function () {
            var element = $(this)
            var id = element.attr('data-id')
            var detail_row = element.next('.detail-row')
            _ajax_caller.post('/tour/GetListTourItinerary', { id: id }, function (result) {
                if (result.isSuccess) {
                    var html = '';
                    var chi_tiet = '';
                    var deadlineDate = '';
                    result.data.forEach(function (item) {
                        var date = new Date(item.DepartureDate);
                        var formatdatetime = item.DepartureDate ?
                            String(date.getDate()).padStart(2, '0') + "/" +
                            String(date.getMonth() + 1).padStart(2, '0') + "/" +
                            date.getFullYear() + " " +
                            String(date.getHours()).padStart(2, '0') + ":" +
                            String(date.getMinutes()).padStart(2, '0')
                            : "";
                        var date2 = new Date(item.BookingDeadline);
                        var formatdatetime2 = item.BookingDeadline ?
                            String(date2.getDate()).padStart(2, '0') + "/" +
                            String(date2.getMonth() + 1).padStart(2, '0') + "/" +
                            date2.getFullYear() + " " +
                            String(date2.getHours()).padStart(2, '0') + ":" +
                            String(date2.getMinutes()).padStart(2, '0')
                            : "";
                        var title = item.TripType == 1 ? 'chiều đi' : 'chiều về';
                        var transportType = '';
                        if (item.TransportType == 1) {
                            transportType = '<i class="fa fa-plane"></i> Máy bay';
                        } else if (item.TransportType == 2) {
                            transportType = '<i class="fa fa-train"></i> Tàu hỏa';
                        } else if (item.TransportType == 3) {
                            transportType = '<i class="fa fa-bus"></i> Xe khách';
                        }
                        chi_tiet += `<h5 class="bold mb10">Thông tin ${title}</h5>` +
                            `<div class="flight-detail">` +
                            `<span class="flight-detail-item">Phương tiện di chuyển: ${transportType}</span><br>` +
                            `<span class="flight-detail-item">Hãng/Đơn vị: ${item.TransportProvider}</span><br>` +
                            `<span class="flight-detail-item">${item.StartPoint} -> ${item.EndPoint}</span><br>` +
                            `<span class="flight-detail-item">GIỜ ĐI: ${formatdatetime}</span><br></div>`;

                        deadlineDate = `<li><strong>Hạn nhận hồ sơ:</strong> ${formatdatetime2}</li>`;

                    });
                    html += '<td colspan="6">' +
                        `<div class="row">` +
                        `<div class="col-md-6" style=" text-align: left !important;">` +
                        chi_tiet +
                        `</div>` +
                        `<div class="col-md-6" style=" text-align: left !important;">` +
                        `<h5 class="bold mb10">Thông tin khác</h5>` +
                        `<ul class="list-unstyled">` +
                        deadlineDate +
                        `</ul>` +
                        `</div>` +
                        `</td>`;
                    detail_row.html(html)
                }
            });

        })

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