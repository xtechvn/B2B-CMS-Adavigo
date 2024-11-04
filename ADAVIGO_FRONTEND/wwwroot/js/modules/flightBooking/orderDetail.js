function getOrderDetail(orderId, clientId) {
    var request = {
        order_id: orderId || 0,
        client_id: clientId || 0
    };

    flightServices.getOrderDetail(request).then(function (res) {
        if (res && res?.data?.length > 0) {
            var groups = {
                go: [],
                back: []
            }

            for (var f of res.data) {
                if (f.leg == 0) {
                    groups.go.push(f);
                }
                else {
                    groups.back.push(f);
                }
            }
            renderDetail(groups);
        }
        else {
            $("#order-detail-content").hide();
            $(".search-null").removeClass("d-none");

        }
    }).catch(function (error) {

    })
}

function renderDetail(data) {
    var firstItem = data.go[0];
    sessionId = firstItem.sessionid;
    $("#orderNo").text(firstItem.orderNo);

    var paymentStatus = firstItem.paymentStatus ? firstItem.paymentStatus : false;
    var isLock = firstItem.is_lock ? firstItem.is_lock : false;

    // check lock first
    if (isLock) {
        $(".btn-not-paid").hide();
    }
    else {
        if (!paymentStatus) {
            $(".btn-not-paid").show();
        }
        else
            $(".btn-not-paid").hide();
    }

    var paymentStatusHtml = paymentStatus ? `<a href="javascript:void(0)" class="btn-default success min">${firstItem.paymentStatusName}</a>` : `<a href="javascript:void(0)" class="btn-default btn-have-not-payment min">${firstItem.paymentStatusName}</a>`
    $("#paymentStatus").append(paymentStatusHtml);

    $("#createTime").text(moment(firstItem.createTime).format("DD/MM/YYYY, HH:mm:ss"));

    var bookingCodes = "";
    var flightList = "";
    var label = "";

    // go 
    if (data.go.length > 0) {
        for (var i in data.go) {
            label = "";
            var item = data.go[i];
            // just render first item
            if (i == 0) {
                label = `<div class="lbl mb-2">Chiều đi</div>`;
                bookingCodes += ` <div class="gray mb2">Mã đặt chỗ chiều đi</div>
                       ${item.bookingCode ? `<div class="bold color-blue">${item.bookingCode}</div>` : '<a href="javascript:void(0)" class="btn-default orange min">Đang xử lý</a>'}`
            }

            //if (i == 0) {
            //    label = data.length > 1 ? `<div class="lbl mb-2">Chiều đi</div>` : "";
            //    bookingCodes += ` <div class="gray mb2">Mã đặt chỗ chiều đi</div>
            //           ${item.bookingCode ? `<div class="bold color-blue">${item.bookingCode}</div>` : '<a href="javascript:void(0)" class="btn-default orange min">Đang xử lý</a>'}`
            //}
            //else {
            //    label = `<div class="lbl mb-2 red">Chiều về</div>`;
            //    bookingCodes += ` <div class="gray mb2">Mã đặt chỗ chiều về</div>
            //           ${item.bookingCode ? `<div class="bold color-blue">${item.bookingCode}</div>` : '<a href="javascript:void(0)" class="btn-default orange min">Đang xử lý</a>'}`
            //}

            // list flight
            var flightItem = ` <div class="trip-info__right mb-2">
                                   ${label}
                                    <div class="name">
                                        <div class="logo"><img src="${item.airlineLogo}" alt=""></div>
                                        <div class="hang">${item.airlineName_Vi}</div>
                                        <p class="code">${item.flightNumber}</p>
                                    </div>
                                    <div class="time-flight">
                                        <div class="first-time">
                                            <div class="time">${item.startPoint}</div>
                                            <div class="gray">${item.startDistrict}</div>
                                            <div class="gray">${TIME_UTILS.getFlightTime(item.startime) + ", " + TIME_UTILS.getViDate(item.startime)}</div>
                                        </div>
                                        <div class="flight">
                                            <img src="/images/icons/fly-to-gray.png" alt="">
                                        </div>
                                        <div class="last-time">
                                            <div class="time">${item.endPoint}</div>
                                            <div class="gray">${item.endDistrict}</div>
                                            <div class="gray">${TIME_UTILS.getFlightTime(item.endtime) + ", " + TIME_UTILS.getViDate(item.endtime)}</div>
                                        </div>
                                    </div>
                                </div>`

            flightList += flightItem;
        }
    }

    // back
    if (data.back.length > 0) {
        for (var i in data.back) {
            label = "";
            var item = data.back[i];
            // just render first item
            if (i == 0) {
                label = `<div class="lbl red mb-2">Chiều về</div>`;
                bookingCodes += ` <div class="gray mb2">Mã đặt chỗ chiều về</div>
                     ${item.bookingCode ? `<div class="bold color-blue">${item.bookingCode}</div>` : '<a href="javascript:void(0)" class="btn-default orange min">Đang xử lý</a>'}`
            }

            // list flight
            var flightItem = ` <div class="trip-info__right  mb-2">
                                   ${label}
                                    <div class="name">
                                        <div class="logo"><img src="${item.airlineLogo}" alt=""></div>
                                        <div class="hang">${item.airlineName_Vi}</div>
                                        <p class="code">${item.flightNumber}</p>
                                    </div>
                                    <div class="time-flight">
                                        <div class="first-time">
                                            <div class="time">${item.startPoint}</div>
                                            <div class="gray">${item.startDistrict}</div>
                                            <div class="gray">${TIME_UTILS.getFlightTime(item.startime) + ", " + TIME_UTILS.getViDate(item.startime)}</div>
                                        </div>
                                        <div class="flight">
                                            <img src="/images/icons/fly-to-gray.png" alt="">
                                        </div>
                                        <div class="last-time">
                                            <div class="time">${item.endPoint}</div>
                                            <div class="gray">${item.endDistrict}</div>
                                            <div class="gray">${TIME_UTILS.getFlightTime(item.endtime) + ", " + TIME_UTILS.getViDate(item.endtime)}</div>
                                        </div>
                                    </div>
                                </div>`

            flightList += flightItem;
        }
    }

    $("#bookingCode").html(bookingCodes);
    $("#list-flight").html(flightList)

    var contact = `  <li class="mb10 flex space-between">
                                    <div class="gray">Họ tên</div>
                                    <div>${firstItem.name}</div>
                                </li>
                                <li class="mb10 flex space-between">
                                    <div class="gray">Số điện thoại</div>
                                    <div>${'0' + firstItem.phone}</div>
                                </li>
                                <li class="mb10 flex space-between">
                                    <div class="gray">Email</div>
                                    <div>${firstItem.email}</div>
                                </li>`
    $("#contact").html(contact);

    $("#passengerNum").text(`(${firstItem.passenger.length} khách)`);
    var passengers = "";
    for (var pIndex in firstItem.passenger) {
        var p = firstItem.passenger[pIndex];
        var className = pIndex > 0 ? "passenger-item" : "";
        passengers += ` <li class="mb10 flex ${className} space-between">
                                    <div class="gray">${p.gender ? 'Ông' : 'Bà'}</div>
                                    <div>${p.name.trim()}</div>
                                </li>`
    }

    if (firstItem.passenger.length > 1) {
        passengers += ` <li>
                                        <a onclick="detailPassengers(this)" class="bold color-blue btn-detail-customers" href="javascript:void(0)">Xem chi tiết</a>
                                    </li>`
    }

    $("#passengers").html(passengers);

    $("#paymentStatusName").text(firstItem.paymentStatusName);
    $("#paymentTypeName").text(firstItem.paymentTypeName)

    // calculate total amount
    var totalAmount = 0;
    totalAmount += data.go[0].amount;
    if (data.back.length > 0) {
        totalAmount += data.back[0].amount;
    }

    $(".total-price").text(UTILS.formatViCurrency(totalAmount));
    $(".total-price-final").text(UTILS.formatViCurrency(totalAmount));

    if (firstItem.voucher_code) {
        $("#voucher-adavigo").removeClass("d-none");
        $("#voucher-adavigo-price").text("-" + UTILS.formatViCurrency(firstItem.discount));
        $(".total-price-final").text(UTILS.formatViCurrency(totalAmount - firstItem.discount));
    }
}

var sessionId = "";
var clientId = "";
init();
function init() {
    var orderId = Number(UTILS.getUrlParam("orderId"));

    getOrderDetail(orderId);
}

function detailPassengers(el) {
    $(".passenger-item").css("display", "flex");
    $(el).hide();
}

//$(".btn-not-paid").click(function () {
//    window.location.href = CONSTANTS.FLIGHTS.MVC.payment + "?sessionId=" + sessionId + "&clientId=" + clientId;
//})
