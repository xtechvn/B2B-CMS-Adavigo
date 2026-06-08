$(document).ready(function () {
    index_b2b.init();
});
var index_b2b = {
    init: function () {
        this.GetListFl();
    },
    GetListFl: function () {
        var obj = {
            BookingCode: $('#search-booking-code').val(),
            DeparturePoint: $('#search-departure').val() ? $('#search-departure').val().toString() : '',
            ArrivalPoint: $('#search-arrival').val() ? $('#search-arrival').val().toString() : '',
            Airline: $('#search-airline').val(),
            Date: $('#Date').val(),
            FundType: $('#search-fund-type').val(),
            pageIndex: 1,
            pageSize: 10
        };
        _ajax_caller.post("/Flights/Search", { searchModel: obj }, function (result) {
            $('#grid-data-b2b').html(result);
        });
    },
    ViewDetail: function (id, element) {
        var tr = $(element).closest('tr');
        var nextTr = tr.next('.detail-row');
        if (nextTr.length > 0) {
            nextTr.remove();
            return;
        }

        _ajax_caller.post("/Flights/Detail", { id: id }, function (result) {
            if (result.status === 0) {
                var data = result.data;
                var booking = data.Booking || {};
                var segments = data.Segments || [];

                var html = `
                    <tr class="detail-row">
                        <td colspan="10" class="p-3">
                            <div class="border rounded p-3 bg-light" style="border: 2px solid #dc3545 !important;">
                                <div class="row">
                `;

                var segGo = segments.find(x => x.SegmentType === 0) || {};
                var segBack = segments.find(x => x.SegmentType === 1) || {};

                var formatDateTime = function (dateString) {
                    if (!dateString) return 'N/A';
                    var date = new Date(dateString);
                    if (isNaN(date.getTime())) return dateString;
                    var d = date.getDate().toString().padStart(2, '0');
                    var m = (date.getMonth() + 1).toString().padStart(2, '0');
                    var y = date.getFullYear();
                    var h = date.getHours().toString().padStart(2, '0');
                    var min = date.getMinutes().toString().padStart(2, '0');
                    return `${d}/${m}/${y} ${h}:${min}`;
                };

                html += `
                    <div class="col-md-3 border-right">
                        <h6 class="text-primary font-weight-bold mb-3">Chuyến đi</h6>
                        <p class="mb-2 text-dark"><strong>${segGo.FlightCode || 'N/A'}</strong> &bull; ${formatDateTime(segGo.FlightDate)}</p>
                        <p class="mb-2 text-muted">${booking.DeparturePoint || ''} <i class="fa fa-arrow-right mx-1"></i> ${booking.ArrivalPoint || ''}</p>
                        <p class="mb-0 text-muted"><small>${segGo.Airline || 'N/A'}</small></p>
                    </div>
                `;

                if (segments.some(x => x.SegmentType === 1)) {
                    html += `
                        <div class="col-md-3 border-right">
                            <h6 class="text-primary font-weight-bold mb-3">Chuyến về</h6>
                            <p class="mb-2 text-dark"><strong>${segBack.FlightCode || 'N/A'}</strong> &bull; ${formatDateTime(segBack.FlightDate)}</p>
                            <p class="mb-2 text-muted">${booking.ArrivalPoint || ''} <i class="fa fa-arrow-right mx-1"></i> ${booking.DeparturePoint || ''}</p>
                            <p class="mb-0 text-muted"><small>${segBack.Airline || 'N/A'}</small></p>
                        </div>
                    `;
                } else {
                    html += `<div class="col-md-3 border-right"></div>`;
                }

                html += `
                    <div class="col-md-3 border-right">
                        <h6 class="text-primary font-weight-bold mb-3">Điều kiện vé</h6>
                        <p class="mb-2"><i class="fa fa-check-circle text-muted mr-1"></i> Hành lý xách tay: <strong>${booking.CarryOnBaggage || '0'} KG</strong></p>
                        <p class="mb-2"><i class="fa fa-check-circle text-muted mr-1"></i> Hành lý ký gửi: <strong>${booking.CheckedBaggage || '0'} KG</strong></p>
                        <p class="mb-0"><i class="fa fa-check-circle text-muted mr-1"></i> Hoàn vé: <strong>${booking.IsRefundable === 1 ? 'Có' : 'Không'}</strong></p>
                    </div>
                `;

                var total = booking.TotalTicket || 0;
                var sold = booking.TotalClosedTicket || 0;
                var remain = booking.RemainTicket || 0;
                var held = total - sold - remain;

                html += `
                    <div class="col-md-3">
                        <h6 class="text-primary font-weight-bold mb-3">Thông tin tồn chỗ</h6>
                        <p class="mb-2">Tổng số chỗ: <strong>${total}</strong> | Đã bán: <strong>${sold}</strong> | Đã giữ: <strong>${held}</strong> | Còn lại: <strong>${remain}</strong></p>
                    </div>
                `;

                html += `
                                </div>
                            </div>
                        </td>
                    </tr>
                `;

                tr.after(html);
            } else {
                _msgalert.error(result.msg || 'Có lỗi xảy ra');
            }
        });
    }
};