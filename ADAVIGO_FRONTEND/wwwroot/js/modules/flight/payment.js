var listBank = [];
// get list banks
$.when(
    flightServices.getBankListOnePay()
).done(function (response) {
    listBank = response.data;
    renderListATM();

}).fail(function (err) {
    console.log(err)
});

function renderListATM() {
    var htmlListBank = '';
    listBank.map(function (bank, index) {
        htmlListBank +=
            `<li id="${bank.code}" >
                <img src="${bank.logo}" alt="">
                <span>${bank.bankName}</span>
            </li>`
    });
    $('#list-atm').html(htmlListBank);
}

$('.menu-bank li').on('click', function () {
    $('.menu-bank li').removeClass('active');
    $(this).addClass('active');
    $('.payment-content').addClass('d-none');
    $($(this).data('target')).removeClass('d-none');
});

$("body").on("click", "#list-bank li", function () {
    $('#list-bank li').removeClass('active');
    $(this).addClass('active');
});

$("body").on("click", "#list-atm li", function () {
    $('#list-atm li').removeClass('active');
    $(this).addClass('active');
});

$("#" + CONSTANTS.FLIGHTS.MODAL.myModalBankTransfer).on('hide.bs.modal', function () {
    window.location.href = CONSTANTS.FLIGHTS.MVC.notification
});

$('#back-btn').on('click', function () {
    window.location.href = CONSTANTS.FLIGHTS.MVC.customerInfo
});

function payment(type, getVietQRCodeRequest) {
    var activeBank = $("#list-atm li.active");
    var code = $(activeBank).prop("id");
    var bankChosenTransfer = $('#list-bank li.active').attr('data-bank');

    // verify flight
    var listFareData = getBookingBySessionId ? getBookingBySessionId.booking_order.ListFareData : JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.ListFareData))

    // pass data to adavigo
    var booking_verify = {
        booking_verify: {
            ListFareData: listFareData,
            ...UTILS.authenObj()
        }
    }

    var booked = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Booked))
    // get issue flight data
    var issueFlightData = issueTicketData(getBookingBySessionId ? getBookingBySessionId.booking_data : booked);

    var booking_order = {
        booking_order: issueFlightData
    };

    var bank_code = "";
    if (type == CONSTANTS.FLIGHTS.PAYMENT_TYPE.transfer.id) {
        bank_code = bankChosenTransfer ? bankChosenTransfer : "";
    }
    else
        bank_code = code ? code : ""

    sessionStorage.setItem(CONSTANTS.STORAGE.Issue, JSON.stringify(issueFlightData));

    // amount
    var amount = dataListFlightSearch.go.Amount;
    if (dataListFlightSearch.isTwoWayFare)
        amount += dataListFlightSearch.back.Amount;

    // orderId 
    var orderIdSession = sessionStorage.getItem(CONSTANTS.STORAGE.OrderId)

    var user = UTILS.getUserLogged();
    var objRequest = {
        "payment_type": type.toString(),
        //"return_url": "https://api-core.adavigo.com/api/onepay/receiver-data",
        //"return_url": "https://api.adavigo.com/api/onepay/receiver-data",
        "client_id": user ? user.clientId : "",
        "bank_code": bank_code,
        "order_detail": getBookingBySessionId ? getBookingBySessionId.booking_id.toString() : booked?.BookingId.toString(),
        "booking_verify": JSON.stringify(booking_verify),
        "booking_order": JSON.stringify(booking_order),
        "session_id": sessionId ? sessionId : booked?.ListBooking[0]?.Session,
        "amount": amount,
        "order_id": orderIdSession ? Number(sessionStorage.getItem(CONSTANTS.STORAGE.OrderId)) : - 1,
        "event_status": orderIdSession ? 1 : 0,
    }

    sessionStorage.setItem(CONSTANTS.STORAGE.Payment, JSON.stringify(objRequest));

    flightServices.payment(objRequest).then(function (res) {

        //$('.btn-payment').hide();
        // update orderId session to change payment method
        if (res) {
            sessionStorage.setItem(CONSTANTS.STORAGE.OrderId, res.order_id);
        }
        if (type == CONSTANTS.FLIGHTS.PAYMENT_TYPE.transfer.id) {

            if (getVietQRCodeRequest) {
                getVietQRCodeRequest.amount = amount;
                getVietQRCodeRequest.order_no = res.order_no
            }
            flightServices.getVietQRCode(getVietQRCodeRequest).then(function (res) {
                if (res && res.data) {
                    $("#qr-code-image").attr("src", res.data);
                }
            }).catch(function (error) {
            })

            $("#transfer-content").text(res.content);
            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalBankTransfer);
            sessionStorage.setItem(CONSTANTS.STORAGE.CheckOutResponse, JSON.stringify(res));
        }
        else {
            if (type == CONSTANTS.FLIGHTS.PAYMENT_TYPE.hold.id) {
                sessionStorage.setItem(CONSTANTS.STORAGE.CheckOutResponse, JSON.stringify(res));
                window.location.href = CONSTANTS.FLIGHTS.MVC.notification
            }
            else {
                if (res && res.url) {
                    window.location.href = res.url
                }
            }
        }
    }).catch(function (err) {
       // console.log(err);
    })
}

function paymentFlow(type, getVietQRCodeRequest) {
    // flow booking full 1
    if (!sessionId) {
        // check end time waiting booking
        var checkEndTimeBooking = UTILS.checkEndTimeBooking();
        if (!checkEndTimeBooking) {
            payment(type, getVietQRCodeRequest);
        }
        else
            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalExpired);
    }
    // flow 2 when have sessionId in url
    else {
        var bookingData = getBookingBySessionId.booking_data;
        var expiryDate = new Date(bookingData.ListBooking[0].ExpiryDate);
        // add 20 minute for expiry date datacom to allow customer to pay
        var add20minuteForExpiryDate = TIME_UTILS.addMinuteForTime(expiryDate, 20);

        if (add20minuteForExpiryDate < new Date()) {
            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalExpired)
        }
        else {
            payment(type, getVietQRCodeRequest);
        }

    }
}

// get issue data for call issueflight api
function issueTicketData(bookedData) {
    var listTicket = [];
    if (bookedData.ListBooking && bookedData.ListBooking.length > 0) {
        for (var booked of bookedData.ListBooking) {
            var data = {
                "Airline": booked.Airline,
                "BookingCode": booked.BookingCode,
                "BookingPcc": "",
                "System": booked.Airline,
                "TotalPrice": booked.Price,
                "FareQuoteSession": "",
                "Tourcode": "",
                "SendEmail": true,
                "ListPassenger": booked.ListPassenger,
                ...UTILS.authenObj()
            }
            listTicket.push(data);
        }
    }

    return listTicket;
}

var sessionId = "";
var clientId = "";
var getBookingBySessionId;
$(document).ready(function () {
    // collapse info flight
    $("#collapseInfoflight").removeClass("show");
    $(".icon-collapse").addClass("collapsed");
    $(".icon-collapse").attr("aria-expanded", false);

    $("body").removeClass("h-100vh");

    var userLogged = UTILS.getUserLogged();

    sessionId = UTILS.getUrlParam("sessionId");
    clientId = Number(UTILS.getUrlParam("clientId"));
    if (sessionId) {
        if (clientId == 0) {
            clientId = Number(userLogged.clientId) || 0
        }

        // check if 2 account, re login
        if (userLogged) {
            if (Number(userLogged.clientId) != clientId) {
                localStorage.removeItem(CONSTANTS.STORAGE.User)
            }
        }

        var request = {
            session_id: sessionId,
            client_id: clientId
        }

        flightServices.getBookingBySessionId(request).then(function (res) {
            if (res.data && res.data.length > 0) {
                getBookingBySessionId = res?.data[0];
                // set session to show info in sidebar
                sessionStorage.setItem(CONSTANTS.STORAGE.Search, getBookingBySessionId.booking_session.search)
                sessionStorage.setItem(CONSTANTS.STORAGE.Info, getBookingBySessionId.booking_session.info)
                sessionStorage.setItem(CONSTANTS.STORAGE.Booking, JSON.stringify(getBookingBySessionId.booking_order))
                sessionStorage.setItem(CONSTANTS.STORAGE.Booked, JSON.stringify(getBookingBySessionId.booking_data))
                calculateSavingTime();

                TIME_UTILS.setCountdowntime();
                dataListFlightSearch = JSON.parse(getBookingBySessionId.booking_session.search);
                infoSession = JSON.parse(getBookingBySessionId.booking_session.info);
                // sidebar.js
                fillInfoStepSearch();
                renderCustomerList();
                UTILS.showHideCountdown();
            }
        }).catch(function (err) {
        })

        // get order info
        flightServices.getBookingBySessionIdOrder(request).then(function (res) {
            console.log(res);
            if (res.data && res.data.length > 0) {
                var order = res.data[0];
                if (order.paymentStatus) {
                    window.location.href = CONSTANTS.FLIGHTS.MVC.orderDetail + "?orderId=" + order.orderId;
                }
                else
                    sessionStorage.setItem(CONSTANTS.STORAGE.OrderId, order.orderId)

                // discount
                if (order.voucher_code) {
                    $("#discount-value").text(UTILS.formatViCurrency(order.discount));
                    var total_order_amount_before = $(".total-payment-hidden").text();
                    $('.total-payment-final').text(UTILS.formatViCurrency(Number(total_order_amount_before) - order.discount));

                    //$("#voucher-adavigo").removeClass("d-none");
                    //$("#voucher-adavigo-price").text("-" + UTILS.formatViCurrency(firstItem.discount));
                    //$(".total-price-final").text(UTILS.formatViCurrency(totalAmount - firstItem.discount));
                }
            }
        }).catch(function (err) {
        })
    }

    $("#txt-discount-box").hide();
    $(".btn-sidebar-submit").addClass("btn-payment")
    $(".btn-sidebar-submit").text("Thanh toán");

    // handle header steps
    $(".step-menu .step1").addClass("success");
    $(".step-menu .step2").addClass("active");

    calculateSavingTime();

    // payment button click
    $('.btn-payment').on('click', function () {
        var method = $('.menu-bank li.active').attr('data-method');
        switch (method) {
            case CONSTANTS.FLIGHTS.PAYMENT_TYPE.transfer.text:
                var bankChosen = $('#list-bank li.active').attr('data-bank');
                var stk = "";
                var owner = "";
                var bankName = "";
                var bankCode = "";
                var shortName = "";
                
                switch (bankChosen) {
                    case "Techcombank":
                        stk = "19131835226016";
                        owner = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt";
                        bankName = "Ngân Hàng TMCP Kỹ Thương Việt Nam chi nhánh Đông Đô";
                        bankCode = "970407";
                        shortName = "Techcombank";
                        break;
                    case "HD":
                        stk = "371704070000023";
                        owner = "Công ty Cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt";
                        bankName = "Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh";
                        bankCode = "970437";
                        shortName = "HDBank";
                        break;
                    case "VIETIN":
                        stk = "113600558866";
                        owner = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt";
                        bankName = "Ngân hàng TMCP Công Thương Việt Nam";
                        bankCode = "970415";
                        shortName = "VietinBank";
                        break;
                }

                $('.bank-stk').html(stk);
                $('.bank-owner').html(owner);
                $('.bank-name').html(bankName);
                $('.bank-tranfer-money').html($('.total-payment-final').html());

                var getVietQRCodeRequest = {
                    bank_account: stk,
                    bank_code: bankCode,
                    amount: 0,
                    order_no: "",
                    short_name: shortName
                }
                paymentFlow(CONSTANTS.FLIGHTS.PAYMENT_TYPE.transfer.id, getVietQRCodeRequest);
                break;
            case CONSTANTS.FLIGHTS.PAYMENT_TYPE.atm.text:
                paymentFlow(CONSTANTS.FLIGHTS.PAYMENT_TYPE.atm.id);
                break;
            case CONSTANTS.FLIGHTS.PAYMENT_TYPE.visa.text:
                paymentFlow(CONSTANTS.FLIGHTS.PAYMENT_TYPE.visa.id);
                break;
            case CONSTANTS.FLIGHTS.PAYMENT_TYPE.qr.text:
                paymentFlow(CONSTANTS.FLIGHTS.PAYMENT_TYPE.qr.id);
                break;
            case CONSTANTS.FLIGHTS.PAYMENT_TYPE.hold.text:
                paymentFlow(CONSTANTS.FLIGHTS.PAYMENT_TYPE.hold.id);
                break;

        }
    });
})

function calculateSavingTime() {
    // calculate saving time 
    var booked = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Booked))
    if (booked) {
        // if booked fail hide payment hold method
        if (!booked.Status) {
            $("#payment-hold").hide();
        }
        if (booked.ListBooking.length > 0) {
            // filter go and back flight
            var go;
            var back;
            for (var b of booked.ListBooking) {
                if (b.FareData.Leg == 0) {
                    go = b;
                }
                else
                    back = b;
            }

            // 2 ticket other airline
            var savingTimeTxt = TIME_UTILS.formatDateMomentJs(go.ExpiryDate, "HH:mm:ss DD/MM/YYYY");
            if (back) {
                savingTimeTxt = new Date(go.ExpiryDate) < new Date(back.ExpiryDate) ? TIME_UTILS.formatDateMomentJs(go.ExpiryDate, "HH:mm:ss DD/MM/YYYY") : TIME_UTILS.formatDateMomentJs(back.ExpiryDate, "HH:mm:ss DD/MM/YYYY")
            }

            $("#saving-time").text(savingTimeTxt);
        }
    }
}

// show and hide loading fullscreen
$(document).ajaxStart(function (e) {
    if (window.location.pathname != CONSTANTS.FLIGHTS.MVC.index && window.location.pathname != CONSTANTS.FLIGHTS.MVC.customerInfo && window.location.pathname != CONSTANTS.FLIGHTS.MVC.flightList)
        UTILS.showLoading();
});

$(document).ajaxStop(function () {
    if (window.location.pathname != CONSTANTS.FLIGHTS.MVC.index && window.location.pathname != CONSTANTS.FLIGHTS.MVC.customerInfo && window.location.pathname != CONSTANTS.FLIGHTS.MVC.flightList)
        UTILS.removeLoading();
});


