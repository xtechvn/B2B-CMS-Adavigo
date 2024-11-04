var infoStep2 = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));
var booked = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Booked));
var booking = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Booking));
var searchObj = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
var checkout = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.CheckOutResponse));

var arrCustomer = [
    ...(infoStep2?.Adt || []),
    ...(infoStep2?.Child || []),
    ...(infoStep2?.Baby || []),
];

var htmlCustomer = "";

$(".total-customer").html(
    (Number(infoStep2?.Adt?.length) || 1) +
    (Number(infoStep2?.Child?.length) || 0) +
    (Number(infoStep2?.Baby?.length) || 0)
);

$(".btn-paid").on("click", function () {
    var checkoutRes = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.CheckOutResponse));
    if (checkoutRes) {
        window.location.href = window.location.origin + CONSTANTS.FLIGHTS.MVC.orderDetail + "?orderId=" + checkoutRes.order_id;
        //sessionStorage.clear();
    }
});


init();
function init() {
    arrCustomer.forEach(function (item, index) {
        htmlCustomer += `<li class="mb10 flex space-between">
        <div class="gray">${UTILS.filterGender(item.gender)}</div>
        <div class="fullName-customer">${item.fullName}</div>
    </li>`;
    });

    $(".list-customer").html(htmlCustomer);

    if (infoStep2?.infoContact) {
        $(".contact-name").html(
            infoStep2.infoContact.firstName + " " + infoStep2.infoContact.lastName
        );
        $(".contact-phone").html(infoStep2.infoContact.phone);
        $(".contact-email").html(infoStep2.infoContact.email);
    }

    if (booked) {
        $(".order-code").text(checkout?.order_no);

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

            $(".go-saving-code").text(go.BookingCode)
            $("#saving-time").text(savingTimeTxt)

            // 2 ways booking
            if (searchObj.isTwoWayFare) {
                // booking same airline
                if (searchObj.go.Airline == searchObj.back.Airline) {
                    $(".back-saving-code").text(booked.ListBooking[0].BookingCode)
                }
                else {
                    if (booked.ListBooking.length == 2) {

                        $(".back-saving").show();
                        $(".back-saving-code").text(back.BookingCode)
                    }
                    else
                        $(".back-saving").hide();
                }
            }
            else {
                $(".go-saving-text").text("Mã đặt chỗ chuyến bay");
                $(".back-saving").hide();
                $(".trip-info-go .lbl").hide();
            }

        }

        if (booked.Status) {
            $("#noti-fail").addClass("d-none");
        }
        else
            $("#noti-success").addClass("d-none");

        if (booking) {
            $("#booking-date").text(TIME_UTILS.formatDateMomentJs(booking.BookingDate, "DD/MM/YYYY, HH:mm:ss"))
        }
    }

    bindPaymentType();
}

$(document).ready(function () {
    UTILS.removeLoading();

    // handle header steps
    $(".step-menu .step1").addClass("success");
    $(".step-menu .step2").addClass("success");
    $(".step-menu .step3").addClass("success");
})

function bindPaymentType() {
    var paymentObj = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Payment));
    if (paymentObj) {
        var findPayment = UTILS.findById(paymentObj.payment_type, CONSTANTS.FLIGHTS.PAYMENT_TYPE)
        if (findPayment) {
            $("#payment-type").text(findPayment.textVi)
        }
    }

}
