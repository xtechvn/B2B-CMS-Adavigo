$(document).ready(function () {
    index_b2b.init();
});
var index_b2b = {
    init: function () {
        this.GetListFl();
        $('#search-departure').select2();
        $('#search-arrival').select2();
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
                        <p class="mb-2">Số lượng vé: <strong>${remain}</strong></p>
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
    },
    HoldBooking: function (id, amountAdt, amountChd, amountInf) {
        var parsePrice = function (val) {
            if (!val) return 0;
            var str = val.toString().replaceAll(",", "");
            var num = parseFloat(str);
            return isNaN(num) ? 0 : num;
        };

        _ajax_caller.post("/Flights/Detail", { id: id }, function (result) {
            if (result.status !== 0) {
                _msgalert.error(result.msg || 'Không thể lấy thông tin vé');
                return;
            }

            var data = result.data;
            var booking = data.Booking || {};
            var segments = data.Segments || [];
            var segGo = segments.find(function (x) { return x.SegmentType === 0; }) || {};
            var segBack = segments.find(function (x) { return x.SegmentType === 1; });
            var isTwoWay = !!segBack;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var startDate = dd + '/' + mm + '/' + yyyy;

            // Format date for display
            var formatDate = function (dateStr) {
                if (!dateStr) return '';
                var d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return String(d.getDate()).padStart(2, '0') + '/' +
                    String(d.getMonth() + 1).padStart(2, '0') + '/' +
                    d.getFullYear();
            };
            var formatTime = function (dateStr) {
                if (!dateStr) return '';
                var d = new Date(dateStr);
                if (isNaN(d.getTime())) return '';
                return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
            };
            var formatDateTime = function (dateStr) {
                var date = formatDate(dateStr);
                var time = formatTime(dateStr);
                return date && time ? date + ' ' + time : (date || '');
            };

            var adtPrice = parsePrice(amountAdt);
            var chdPrice = parsePrice(amountChd);
            var infPrice = parsePrice(amountInf);

            var searchData = {
                search: {
                    Adt: 1,
                    Child: 0,
                    Baby: 0,
                    StartDate: segGo.FlightDate ? formatDate(segGo.FlightDate) : startDate,
                    StartPoint: booking.DeparturePoint || '',
                    EndPoint: booking.ArrivalPoint || ''
                },
                isB2B: true,
                b2bWarehouseId: id,
                warehouseBookingCode: booking.BookingCode || '',
                isTwoWayFare: isTwoWay,
                Session: '',
                b2bPrices: {
                    adt: adtPrice,
                    chd: chdPrice,
                    inf: infPrice
                },
                extraInfo: {
                    StartPointName: booking.DeparturePoint || '',
                    EndPointName: booking.ArrivalPoint || '',
                    StringDateGoChoosen: formatDate(segGo.FlightDate),
                    StringDateBackChoosen: isTwoWay ? formatDate(segBack.FlightDate) : '',
                    FirstTimeGo: formatTime(segGo.FlightDate),
                    LastTimeGo: formatTime(segGo.FlightDate),
                    FirstDateGo: formatDate(segGo.FlightDate),
                    LastDateGo: formatDate(segGo.FlightDate),
                    FirstTimeBack: isTwoWay ? formatTime(segBack.FlightDate) : '',
                    LastTimeBack: isTwoWay ? formatTime(segBack.FlightDate) : '',
                    FirstDateBack: isTwoWay ? formatDate(segBack.FlightDate) : '',
                    LastDateBack: isTwoWay ? formatDate(segBack.FlightDate) : '',
                    DurationFlyGo: '',
                    DurationFlyBack: ''
                },
                go: {
                    FareDataId: 0,
                    Airline: segGo.Airline || 'B2B',
                    TotalPrice: adtPrice,
                    Adt: 1,
                    Chd: 0,
                    Inf: 0,
                    FareAdt: adtPrice, FareChd: chdPrice, FareInf: infPrice,
                    FeeAdt: 0, FeeChd: 0, FeeInf: 0,
                    TaxAdt: 0, TaxChd: 0, TaxInf: 0,
                    AdavigoPrice: { price_id: 0, profit: 0, amount: adtPrice },
                    AdavigoPriceAdt: { amount: adtPrice },
                    AirlineObj: { nameVi: segGo.Airline || 'B2B', logo: '' },
                    ListFlight: [{
                        FlightValue: segGo.FlightCode || 'B2B',
                        Leg: 0,
                        StopNum: 0,
                        Operating: segGo.Airline || '',
                        StartDate: segGo.FlightDate || null,
                        EndDate: segGo.FlightDate || null,
                        FareClass: booking.BookingCode || '',
                        GroupClassObj: { description: '', detailVi: '' },
                        ListSegment: [{
                            Airline: segGo.Airline || 'B2B',
                            StartPoint: booking.DeparturePoint || '',
                            EndPoint: booking.ArrivalPoint || '',
                            StartTime: segGo.FlightDate || null,
                            EndTime: segGo.FlightDate || null,
                            FlightNumber: segGo.FlightCode || '',
                            HandBaggage: booking.CarryOnBaggage || '7',
                            AllowanceBaggage: booking.CheckedBaggage || '0',
                            Plane: ''
                        }]
                    }]
                }
            };

            if (isTwoWay) {
                searchData.back = {
                    FareDataId: 0,
                    Airline: segBack.Airline || 'B2B',
                    TotalPrice: adtPrice,
                    Adt: 1,
                    Chd: 0,
                    Inf: 0,
                    FareAdt: adtPrice, FareChd: chdPrice, FareInf: infPrice,
                    FeeAdt: 0, FeeChd: 0, FeeInf: 0,
                    TaxAdt: 0, TaxChd: 0, TaxInf: 0,
                    AdavigoPrice: { price_id: 0, profit: 0, amount: adtPrice },
                    AdavigoPriceAdt: { amount: adtPrice },
                    AirlineObj: { nameVi: segBack.Airline || 'B2B', logo: '' },
                    ListFlight: [{
                        FlightValue: segBack.FlightCode || 'B2B',
                        Leg: 1,
                        StopNum: 0,
                        Operating: segBack.Airline || '',
                        StartDate: segBack.FlightDate || null,
                        EndDate: segBack.FlightDate || null,
                        FareClass: booking.BookingCode || '',
                        GroupClassObj: { description: '', detailVi: '' },
                        ListSegment: [{
                            Airline: segBack.Airline || 'B2B',
                            StartPoint: booking.ArrivalPoint || '',
                            EndPoint: booking.DeparturePoint || '',
                            StartTime: segBack.FlightDate || null,
                            EndTime: segBack.FlightDate || null,
                            FlightNumber: segBack.FlightCode || '',
                            HandBaggage: booking.CarryOnBaggage || '7',
                            AllowanceBaggage: booking.CheckedBaggage || '0',
                            Plane: ''
                        }]
                    }]
                };
            }

            sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(searchData));
            window.location.href = '/Flights/CustomerInfo';
        });
    }
};