
var isGetBaggageInProgress = true;
var dataListFlightSearch = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
var ListFareData = [
    {
        "Session": dataListFlightSearch?.Session,
        "FareDataId": dataListFlightSearch?.go.FareDataId,
        "ListFlight": [
            {
                "FlightValue": dataListFlightSearch?.go.ListFlight[0].FlightValue,
                "Leg": 0
            }
        ]
    },
];
var ListBaggage = [];
dataSubmit = {};

function renderItemsBaggage(listBaggage, leg) {
    var htmllistBaggage = '';
    listBaggage.map(function (item, index) {
        return { ...item, index: index }
    }).filter(function (item) {
        return item.Leg == leg;
    }).forEach(function (item) {
        htmllistBaggage +=
            `<div class="item" data-index='${item.index}' data-price="${item.Price}" data-leg="${leg}">
                ${item.Name}</br>
                <span class="gray txt_14">${UTILS.formatViCurrency(item.Price)}</span>
            </div>`
    });
    return htmllistBaggage;
};

function renderItemsInfoAdt() {
    var qtyAdt = Number(dataListFlightSearch?.search.Adt);
    var htmlAdt = '';
    for (var i = 0; i < qtyAdt; i++) {
        htmlAdt +=
            `<div class="item">
            <h3 class="title txt_16 bold mb10">Người lớn ${i + 1}</h3>
            <div class="grid grid__2 grid-form mb20">
                <div class="form-group mb0">
                    <label class="" for="fullNameAdt${i}" style="width: 100%;">Họ và tên</label>
                    <input type="text" class="form-control form-control-CMND field-required" id="fullNameAdt${i}">
                    <div class="gray mt8">Như trên CMND (không dấu)</div>
                    <div class="error-field">Vui lòng nhập thông tin và nhập đúng định dạng</div>
                </div>
                <div class="form-group mb0">
                    <label class="" for="genderAdt${i}">Giới tính</label>
                    <div class="sort-list flex">
                        <label class="confir_res circle mb0">
                            Nam
                        <input type="radio" name="genderAdt${i}" checked="" value="male">
                        <span class="checkmark"></span>
                    </label>
                        <label class="confir_res circle mb0 ml-3">
                            Nữ
                        <input type="radio" name="genderAdt${i}" value="female">
                        <span class="checkmark"></span>
                    </label>
                    </div>
                </div>
            </div>
        </div>`
    }
    $('.block-info-adt').html(htmlAdt);
}

function renderChildOrBaby(type) {
    var qty = Number(dataListFlightSearch?.search[type]);
    var htmlField = '';
    for (var i = 0; i < qty; i++) {
        htmlField +=
            `<div class="item">
            <h3 class="title txt_16 bold mb10">${type == 'Child' ? 'Trẻ em ' + (i + 1) + ' (2-12 tuổi)' : 'Em bé ' + (i + 1) + ' (<2 tuổi)'}</h3>
            <div class="grid grid__2 grid-form mb20">
                <div class="form-group mb0">
                    <label class="" for="fullName${type}${i}" style="width: 100%;">Họ và tên</label>
                    <input type="text" class="form-control form-control-CMND field-required" id="fullName${type}${i}">
                    <div class="error-field">Vui lòng nhập thông tin và nhập đúng định dạng</div>
                </div>
                <div class="form-group grid grid__2 mb0">
                    <div class="date-of-birth">
                        <label for="birthday${type}${i}">Ngày sinh</label>
                        <input class="datepicker-input form-control field-birthday datepicker-input-${type}" type="text" id="birthday${type}${i}" name="birthday${type}${i}" placeholder="dd/mm/yyyy">
                        <div class="error-field">Vui lòng nhập thông tin và nhập đúng định dạng</div>
                    </div>
                    <div class="gender">
                        <label class="" for="gender${type}${i}">Giới tính</label>
                        <div class="sort-list flex">
                            <label class="confir_res circle mb0">
                            Nam
                            <input type="radio" name="gender${type}${i}" checked="" value="male">
                            <span class="checkmark"></span>
                        </label>
                            <label class="confir_res circle mb0 ml-3">
                            Nữ
                            <input type="radio" name="gender${type}${i}" value="female">
                            <span class="checkmark"></span>
                        </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }
    type == 'Child' ? $('.block-info-child').html(htmlField) : $('.block-info-baby').html(htmlField);
}

// load page
renderItemsInfoAdt();
renderChildOrBaby('Child');
renderChildOrBaby('Baby');
if (dataListFlightSearch?.isTwoWayFare) {
    ListFareData.push(
        {
            "Session": dataListFlightSearch.Session,
            "FareDataId": dataListFlightSearch.back.FareDataId,
            "ListFlight": [
                {
                    "FlightValue": dataListFlightSearch.back.ListFlight[0].FlightValue,
                    "Leg": 1
                }
            ]
        }
    );
}

// Click item baggage
$("body").on("click", '.tag-hanh-ly .item', function () {
    var baggageItem = $(this).parents(".tag-hanh-ly").find('.item');
    var indexOfThis = $(this).data("index");
    $(baggageItem).each(function (index, el) {
        var indexOfEl = $(el).data("index")
        if (indexOfEl != indexOfThis) {
            $(el).removeClass('active');
        }
    })
    //$(this).closest('.tag-hanh-ly').find('.item').removeClass('active');
    $(this).toggleClass('active');
    // set total fee
    var itemsActive = $('.tag-hanh-ly .item.active');
    var total = 0;
    for (var i = 0; i < itemsActive.length; i++) {
        total += Number($(itemsActive[i]).attr('data-price'));
    }
    $('.total-baggage').html(UTILS.formatViCurrency(total));
});

// Click button to app fee baggage
$('.apply-baggage').on('click', function () {

    var totalGo = 0;
    var totalBack = 0;
    if (dataListFlightSearch) {
        var profitGo = UTILS.calculateProfitFare(dataListFlightSearch.go);
        totalGo = dataListFlightSearch.go.TotalPrice + profitGo;

        if (dataListFlightSearch.isTwoWayFare) {
            var profitBack = UTILS.calculateProfitFare(dataListFlightSearch.back);
            totalBack = dataListFlightSearch.back.TotalPrice + profitBack;
        }
    }

    $('.details-go .total-go').html(UTILS.formatViCurrency(totalGo));
    $('.details-back .total-back').html(UTILS.formatViCurrency(totalBack));
    $('.details-go .baggage-wrapper').hide();
    $('.details-back .baggage-wrapper').hide();

    dataSubmit.baggageGo = [];
    if (dataListFlightSearch.isTwoWayFare)
        dataSubmit.baggageBack = [];

    for (var i in dataSubmit.Passengers) {
        var goBaggage = $("#select-baggage-0-" + i).select2("data")[0];
        if (goBaggage.id != 0)
            dataSubmit.baggageGo.push(goBaggage);

        if (dataListFlightSearch.isTwoWayFare) {
            var backBaggage = $("#select-baggage-1-" + i).select2("data")[0];
            if (backBaggage.id != 0)
                dataSubmit.baggageBack.push(backBaggage);
        }
    };

    // go baggage
    $('.details-go .baggage-wrapper').show()
    var goBaggeFee = 0;
    var goTotalWeight = 0;
    if (dataSubmit.baggageGo.length > 0) {
        for (var go of dataSubmit.baggageGo) {
            totalGo += go.Price;
            goBaggeFee += go.Price;
            goTotalWeight += Number(go.Code.match(/\d+/));
        }
    }

    if (dataListFlightSearch) {
        $('.details-go .total-go').html(UTILS.formatViCurrency(totalGo));
        $('.details-go .baggage-fee').text(UTILS.formatViCurrency(goBaggeFee));
        $('.details-go .baggage-name').text(goTotalWeight + "kg");

        $('.baggage-wrapper-go .baggage-fee').text(UTILS.formatViCurrency(goBaggeFee));
        $('.baggage-wrapper-go .baggage-name').text(goTotalWeight + "kg");

        if (goTotalWeight > 0) {
            $('.details-go .baggage-name').text(goTotalWeight + "kg");
            $(".baggage-wrapper-go").show();
        }
        else {
            $(".baggage-wrapper-go").hide();
            $('.details-go .baggage-wrapper').hide()
        }
    }

    // back baggage
    if (dataListFlightSearch.isTwoWayFare) {
        $('.details-back .baggage-wrapper').show()
        var backBaggeFee = 0;
        var backTotalWeight = 0;
        if (dataSubmit.baggageBack.length > 0) {
            for (var back of dataSubmit.baggageBack) {
                totalBack += back.Price;
                backBaggeFee += back.Price;
                backTotalWeight += Number(back.Code.match(/\d+/));
            }
        }

        $('.details-back .total-back').html(UTILS.formatViCurrency(totalBack));
        $('.details-back .baggage-fee').text(UTILS.formatViCurrency(backBaggeFee));
        $('.baggage-wrapper-back .baggage-fee').text(UTILS.formatViCurrency(backBaggeFee));

        if (backTotalWeight > 0) {
            $('.details-back .baggage-name').text(backTotalWeight + "kg");
            $('.baggage-wrapper-back .baggage-name').text(backTotalWeight + "kg");
            $(".baggage-wrapper-back").show();
        }
        else {
            $(".baggage-wrapper-back").hide();
            $('.details-back .baggage-wrapper').hide()
        }
    }

    // total flight fee

    $('.total-payment').html(UTILS.formatViCurrency(totalGo + totalBack));
    var discount = tempVoucher ? tempVoucher.discount : 0;
    $('.total-payment-final').html(UTILS.formatViCurrency(totalGo + totalBack - discount));
    $(".total-payment-hidden").html(totalGo + totalBack)

    UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalBaggage);
});

// Prevent entering numeric and Special Characters for input name CMND
$('.form-control-CMND').on('input', function (e) {
    $(this).val($(this).val().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z ]*$/, ''));
});

// Check fields when click button to submit
$('.btn-next-step').on('click', function () {
    var dataListFlightSearch = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
    if (dataListFlightSearch) {

        var fieldsRequired = $('#customer-info-form .field-required');
        var fieldsError = [];
        $('#customer-info-form .error-field').removeClass('has-error');

        // check field required
        for (var i = 0; i < fieldsRequired.length; i++) {
            if (!$('input[name="exportBill"').prop('checked') && $(fieldsRequired[i]).hasClass('field-export')) {
                continue;
            }
            var fieldVal = $(fieldsRequired[i]).val();
            if (!fieldVal) {
                fieldsError.push($(fieldsRequired[i]));
            }
            else {
                // validate name must have 2 word
                if ($(fieldsRequired[i]).hasClass("form-control-CMND")) {
                    var fieldsRequiredId = $(fieldsRequired[i]).prop("id");
                    if (fieldsRequiredId != "firstName" && fieldsRequiredId != "lastName") {
                        var getFirstAndLastName = UTILS.getFristAndLastName(fieldVal);
                        if (!getFirstAndLastName.lastName) {
                            fieldsError.push($(fieldsRequired[i]));
                            $(fieldsRequired[i]).closest('.form-group').find('.error-field').text("Vui lòng nhập họ và tên có 2 từ trở lên!")
                        }
                    }
                }
            }
        }

        // check field email
        var fieldsEmail = $('#customer-info-form .field-email');
        for (var i = 0; i < fieldsEmail.length; i++) {
            if (!$('input[name="exportBill"').prop('checked') && $(fieldsEmail[i]).hasClass('field-export')) {
                continue;
            }
            if (!UTILS.validateEmail($(fieldsEmail[i]).val())) {
                fieldsError.push($(fieldsEmail[i]));
            }
        }

        // Check birthday
        var fieldBirthday = $('#customer-info-form .field-birthday');
        for (var i = 0; i < fieldBirthday.length; i++) {
            if (new Date($(fieldBirthday[i]).val().split('/').reverse().join('-')) > new Date() ||
                new Date($(fieldBirthday[i]).val().split('/').reverse().join('-')) == 'Invalid Date'
            ) {
                fieldsError.push($(fieldBirthday[i]));
            }
        }

        // scroll to error or submit
        if (fieldsError.length) {
            fieldsError.forEach(function (field) {
                field.closest('.form-group').find('.error-field').addClass('has-error');
            })
            $('html, body').animate({
                scrollTop: $(".error-field.has-error").eq(0).offset().top - 100
            }, 500);
        } else {
            // check end time waiting booking
            var checkEndTimeBooking = UTILS.checkEndTimeBooking();
            if (!checkEndTimeBooking) {
                // confirm
                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.customerInfoConfirm)
            }
            else
                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalExpired)
        }
    }
    else {
        UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalExpired)
    }

});


$(".btn-confirm-done").click(function () {
    UTILS.showLoading();
    getInfoData();
    sessionStorage.setItem(CONSTANTS.STORAGE.Info, JSON.stringify(dataSubmit));
    sessionStorage.setItem(CONSTANTS.STORAGE.ListFareData, JSON.stringify(ListFareData));

    // book flight
    var bookData = bookFlight(dataSubmit);
    sessionStorage.setItem(CONSTANTS.STORAGE.Booking, JSON.stringify(bookData));

    if (tempVoucher)
        sessionStorage.setItem(CONSTANTS.STORAGE.Voucher, JSON.stringify(tempVoucher));

    flightServices.bookFlight(bookData).then(function (res) {
        if (!res.Status) {
            if (res.ListBooking.length == 0) {
                if (res.Message.includes("(LastName)")) {
                    res.Message = res.Message.replace("(LastName)", "");
                }
                toastr.error(res.Message);
                UTILS.removeLoading();
                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.customerInfoConfirm);
                return;
            }
        }
        var bookFlightRes = res;
        var backFinalObj;
        var goFinalObj = UTILS.calculateFinalPriceObj(dataListFlightSearch.go, 0);
        // save to search go
        // update to booking_session
        dataListFlightSearch.go.Profit = goFinalObj.profit;
        dataListFlightSearch.go.Amount = goFinalObj.total;

        // 2 ways
        if (dataListFlightSearch.isTwoWayFare) {
            backFinalObj = UTILS.calculateFinalPriceObj(dataListFlightSearch.back, 1);
            dataListFlightSearch.back.Profit = backFinalObj.profit;
            dataListFlightSearch.back.Amount = backFinalObj.total;
        }

        // booking_session to show info when click payment in mail
        var booking_session = {
            search: JSON.stringify(dataListFlightSearch),
            info: JSON.stringify(dataSubmit)
        }

        // update amount for adavigo
        if (bookFlightRes.ListBooking.length > 0) {

            if (dataListFlightSearch.isTwoWayFare) {
                // 2 ticket other airline             
                if (bookFlightRes.ListBooking.length == 2) {
                    // go
                    bookFlightRes.ListBooking[0].PriceId = dataListFlightSearch.go.AdavigoPrice?.price_id;
                    bookFlightRes.ListBooking[0].Amount = goFinalObj.total;
                    bookFlightRes.ListBooking[0].Profit = goFinalObj.profit;

                    // back
                    bookFlightRes.ListBooking[1].PriceId = dataListFlightSearch.back.AdavigoPrice?.price_id;
                    bookFlightRes.ListBooking[1].Amount = backFinalObj.total;
                    bookFlightRes.ListBooking[1].Profit = backFinalObj.profit;
                }
                else {
                    // 2 ticket same airline
                    bookFlightRes.ListBooking[0].PriceId = dataListFlightSearch.go.AdavigoPrice?.price_id;
                    var totalAmount = 0;
                    totalAmount += goFinalObj.total;
                    totalAmount += backFinalObj.total;

                    var totalProfit = 0;
                    totalProfit += goFinalObj.profit;
                    totalProfit += backFinalObj.profit;

                    bookFlightRes.ListBooking[0].Amount = totalAmount;
                    bookFlightRes.ListBooking[0].Profit = totalProfit;
                }
            }
            else {
                // go
                bookFlightRes.ListBooking[0].PriceId = dataListFlightSearch.go.AdavigoPrice?.price_id;
                bookFlightRes.ListBooking[0].Amount = goFinalObj.total;
                bookFlightRes.ListBooking[0].Profit = goFinalObj.profit;
            }

        }

        // update search session
        sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataListFlightSearch));

        var loggedUser = UTILS.getUserLogged();
        debugger;
        var saveBookingObj = {
            booking_data: JSON.stringify(bookFlightRes),
            booking_order: JSON.stringify(bookData),
            booking_session: JSON.stringify(booking_session),
            client_id: loggedUser ? parseInt(loggedUser.clientId) : 0,
            voucher_name: $("#txt-discount").val()
        }

        // save booking data to adavigo
        flightServices.saveBooking(saveBookingObj).then(function (res) {
            if (res.status == CONSTANTS.RESPONSE_STATUS.success) {
                sessionStorage.setItem(CONSTANTS.STORAGE.Booked, JSON.stringify(bookFlightRes));
                // close modal
                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.customerInfoConfirm);
                location.href = CONSTANTS.FLIGHTS.MVC.payment;
            }
            else {
                toastr.error(res.msg);
                UTILS.removeLoading();
                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.customerInfoConfirm);
            }
        }).catch(function (err) {
            console.log(err);
        })

    }).catch(function (err) {
        UTILS.removeLoading();
        UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.customerInfoConfirm);
        UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.supportModal);
    })

})

// get info and passenger data
function getInfoData() {
    dataSubmit.infoContact = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        phone: $('#phoneNumber').val(),
        email: $('#emailContact').val(),
        area: $('#select-sort').select2('data')[0].text
    };
    dataSubmit.Passengers = [];

    dataSubmit.Adt = [];
    for (var i = 0; i < Number(dataListFlightSearch.search.Adt); i++) {
        if ($('.block-info-adt .item').eq(i).find(`#fullNameAdt${i}`).val()) {
            var obj = {
                fullName: $('.block-info-adt .item').eq(i).find(`#fullNameAdt${i}`).val(),
                gender: $('.block-info-adt .item').eq(i).find(`input[name='genderAdt${i}']:checked`).val(),
            }
            dataSubmit.Adt.push(
                obj
            );

            dataSubmit.Passengers.push(obj);
        }
    }
    dataSubmit.Child = [];
    for (var i = 0; i < Number(dataListFlightSearch.search.Child); i++) {
        var obj = {
            fullName: $('.block-info-child .item').eq(i).find(`#fullNameChild${i}`).val(),
            gender: $('.block-info-child .item').eq(i).find(`input[name='genderChild${i}']:checked`).val(),
            birthday: $('.block-info-child .item').eq(i).find(`#birthdayChild${i}`).val()
        }
        dataSubmit.Child.push(
            obj
        )

        dataSubmit.Passengers.push(obj);

    }
    dataSubmit.Baby = [];
    // infant < 2 years old not have baggage
    for (var i = 0; i < Number(dataListFlightSearch.search.Baby); i++) {
        var obj = {
            fullName: $('.block-info-baby .item').eq(i).find(`#fullNameBaby${i}`).val(),
            gender: $('.block-info-baby .item').eq(i).find(`input[name='genderBaby${i}']:checked`).val(),
            birthday: $('.block-info-baby .item').eq(i).find(`#birthdayBaby${i}`).val()
        }
        dataSubmit.Baby.push(
            obj
        )
        //dataSubmit.Passengers.push(obj);
    }

    if ($('input[name="exportBill"').prop('checked')) {
        dataSubmit.exportBill = {
            fullName: $('#fullName').val(),
            taxCode: $('#tax-code').val(),
            companyName: $('#company-name').val(),
            companyAddress: $('#company-address').val(),
            recipientsName: $('#recipients-name').val(),
            recipientsAddress: $('#recipients-address').val(),
            phoneExport: $('#phone-export').val(),
            email: $('#email-export').val(),
        }
    }
}
// case not have booking code , bookflight fail
function saveBookflightFailData() {
    var listFareData = [];
    var listBooking = [];
    if (!dataListFlightSearch?.isTwoWayFare) {
        listFareData.push(dataListFlightSearch.go);
        listBooking[0] = {
            ListFareData: listFareData,
            Session: dataListFlightSearch.Session || ""
        };
    }
    else {
        if (dataListFlightSearch.go.Airline == dataListFlightSearch.back.Airline) {
            listFareData.push(dataListFlightSearch.go);
            listFareData.push(dataListFlightSearch.back);

            listBooking[0] = {
                ListFareData: listFareData,
                Session: dataListFlightSearch.Session || ""
            };
        }
        else {
            var bookingObjGo = {
                ListFareData: dataListFlightSearch.go,
                Session: dataListFlightSearch.Session || ""
            }

            var bookingObjBack = {
                ListFareData: dataListFlightSearch.back,
                Session: dataListFlightSearch.Session || ""
            }

            listBooking.push(bookingObjGo)
            listBooking.push(bookingObjBack)
        }
    }
    var bookFlightFail = {
        BookingId: 0,
        OrderCode: "",
        Status: false,
        ListBooking: listBooking
    };

    return bookFlightFail;
}

// Click checkbox export bill
$('input[name="exportBill"]').change(function () {
    if ($(this).prop("checked")) {
        $('#collapseExportBill').collapse('show');
    }
});

$('#collapseExportBill').on('hidden.bs.collapse', function () {
    $('.svg-collapse-export-bill .icon-svg-minus').addClass('d-none');
    $('.svg-collapse-export-bill .icon-svg-add').removeClass('d-none');
});
$('#collapseExportBill').on('show.bs.collapse', function () {
    $('.svg-collapse-export-bill .icon-svg-minus').removeClass('d-none');
    $('.svg-collapse-export-bill .icon-svg-add').addClass('d-none');
});

// Click checkbox buy insurance
$('input[name="buy-insurance"]').change(function () {
    dataSubmit.isBuyInsurance = $(this).prop("checked");
});

// save contact 
$("#save-contact").click(function () {
    if (validateContactInfoForm()) {
        var selectedPhone = $('#select-sort').select2('data')[0];
        var contactInfo = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            phone: $('#phoneNumber').val(),
            email: $('#emailContact').val(),
            area: selectedPhone.text,
            areaId: selectedPhone.id
        }

        localStorage.setItem(CONSTANTS.STORAGE.ContactInfo, JSON.stringify(contactInfo))

        $("#edit-save-contact").toggleClass("d-none")
        $("#save-contact").toggleClass("d-none")

        $('#firstName').prop('readonly', true);
        $('#lastName').prop('readonly', true);
        $('#phoneNumber').prop('readonly', true);
        $('#emailContact').prop('readonly', true);
        $('#select-sort').prop('disabled', true);

        toastr.success("Đã lưu!")
    }

})

// edit save contact 
$("#edit-save-contact").click(function () {
    $('#firstName').prop('readonly', false);
    $('#lastName').prop('readonly', false);
    $('#phoneNumber').prop('readonly', false);
    $('#emailContact').prop('readonly', false);
    $('#select-sort').prop('disabled', false);

    $("#edit-save-contact").toggleClass("d-none")
    $("#save-contact").toggleClass("d-none")
})

/// datepicker for birthday
var nowDate = new Date();
var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

var basicBirthday = {
    autoApply: true,
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
        "format": 'DD/MM/YYYY',
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
        ]
    }
};

function renderBirthDayPickers() {
    var dateToSetDateRange = dataListFlightSearch.search.StartDate;

    $(".field-birthday.datepicker-input-Child").daterangepicker({
        ...basicBirthday,
        maxDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 2, true),
        minDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 12, true),
        startDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 12, true),
        endDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 2, true)
    });

    // check if StartDate > now -> get now
    // just for infant
    var dateMomentJs = TIME_UTILS.getDateMomentStringFromString(dateToSetDateRange);
    if (moment(dateMomentJs) > moment()) {
        dateToSetDateRange = moment().format("DD/MM/YYYY");
    }

    $(".field-birthday.datepicker-input-Baby").daterangepicker({
        ...basicBirthday,
        maxDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 0, true),
        minDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 2, true),
        startDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 2, true),
        endDate: TIME_UTILS.getDateStringChangeYear(dateToSetDateRange, 0, true)
    });

}

$(document).ready(function () {
    renderBirthDayPickers();
    sessionStorage.setItem(CONSTANTS.STORAGE.Path, window.location.pathname);
    UTILS.removeLoading();

    // verify flight
    var listFareData = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.ListFareData));

    if (listFareData) {
        flightServices.verifyFlight(ListFareData).then(function (res) {
            if (res) {
                if (res.Status) {
                    // set timer countdown
                    var endTime = TIME_UTILS.addMinuteForTime(new Date(), CONSTANTS.TIMER)
                    sessionStorage.setItem(CONSTANTS.STORAGE.COUNTER_KEY, endTime);
                }
                else {
                    var listFareToGetPrice = [];
                    if (res.ListFareStatus && res.ListFareStatus.length > 0) {
                        var go = res.ListFareStatus[0];
                        if (Number(go.Difference) == 0) {
                            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalEndPrice);
                        }
                        else {
                            // change price update goObj and show modal 
                            // get AirlineObj and GroupClassObj from old go
                            var newGo = go.FareData;
                            newGo.AirlineObj = dataListFlightSearch.go.AirlineObj;
                            newGo.ListFlight[0].GroupClassObj = dataListFlightSearch.go.ListFlight[0].GroupClassObj;
                            listFareToGetPrice.push(newGo);

                        }

                        if (dataListFlightSearch.isTwoWayFare) {
                            var back = res.ListFareStatus[1];
                            if (Number(back.Difference) == 0) {
                                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalEndPrice)
                            }
                            else {
                                // change price update goObj and show modal 
                                // get AirlineObj and GroupClassObj from old go
                                var newBack = back.FareData;
                                newBack.AirlineObj = dataListFlightSearch.back.AirlineObj;
                                newBack.ListFlight[0].GroupClassObj = dataListFlightSearch.back.ListFlight[0].GroupClassObj;
                                listFareToGetPrice.push(newBack);
                            }
                        }

                        // set timer countdown
                        var endTime = TIME_UTILS.addMinuteForTime(new Date(), CONSTANTS.TIMER)
                        sessionStorage.setItem(CONSTANTS.STORAGE.COUNTER_KEY, endTime);

                        // update AdavigoPrice and AdavigoPriceAdt go and back
                        flightServices.getPriceOfListFareData(listFareToGetPrice).then(function (res) {
                            if (res && res.length > 0) {
                                // show modal change price
                                UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalChangePrice)
                                $("#go-change-price-old").text(UTILS.formatViCurrency(dataListFlightSearch.go.AdavigoPriceAdt.amount))
                                // update go and back obj search
                                dataListFlightSearch.go = res[0];
                                $("#go-change-price-new").text(UTILS.formatViCurrency(dataListFlightSearch.go.AdavigoPriceAdt.amount))

                                if (dataListFlightSearch.isTwoWayFare) {
                                    $("#back-change-price-old").text(UTILS.formatViCurrency(dataListFlightSearch.back.AdavigoPriceAdt.amount))

                                    // update new obj
                                    dataListFlightSearch.back = res[1];
                                    $("#back-change-price-new").textUTILS.formatViCurrency((dataListFlightSearch.back.AdavigoPriceAdt.amount))
                                }
                                else {
                                    $("#back-change-price-wrapper").hide();
                                }

                                // re render side bar after update fare data in sidebar.js
                                fillInfoStepSearch();
                            }
                        }).catch(function (error) {

                        })
                    }

                }
            }

        }).catch(function (err) {
            console.log(err);
        })
    }

    flightServices.getBaggageFareChosen(ListFareData).then(function (data) {
        if (data.ListBaggage && data.ListBaggage.length > 0) {
            ListBaggage = data.ListBaggage.filter(function (baggage) {
                return baggage.Price > 0;
            });
        }

        if (dataListFlightSearch.isTwoWayFare) {
            $(".wrap-baggage-back").removeClass("d-none");
        }
        // check bagage for VNAirline
        var renderedBaggageVn = false;
        var vnBaggages = [];
        if (dataListFlightSearch.go.Airline == "VN") {
            vnBaggages = UTILS.renderBaggageListVNAirline(dataListFlightSearch.go.ListFlight[0].Operating);
            renderedBaggageVn = true;
        }

        if (dataListFlightSearch.back && dataListFlightSearch.back.Airline == "VN" && !renderedBaggageVn) {
            vnBaggages = UTILS.renderBaggageListVNAirline(dataListFlightSearch.back.ListFlight[0].Operating);
        }
        ListBaggage.push(...vnBaggages);

    }).catch(function (err) {
        console.log(err)
    });

    // bind save contact info
    bindSaveContactInfo();
})

function bindSaveContactInfo() {
    var contactInfo = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.ContactInfo));

    if (contactInfo) {
        $("#edit-save-contact").toggleClass("d-none");
        $("#save-contact").toggleClass("d-none");

        $('#firstName').val(contactInfo.firstName);
        $('#lastName').val(contactInfo.lastName);
        $('#phoneNumber').val(contactInfo.phone);
        $('#emailContact').val(contactInfo.email);

        $('#firstName').prop('readonly', true);
        $('#lastName').prop('readonly', true);
        $('#phoneNumber').prop('readonly', true);
        $('#emailContact').prop('readonly', true);

        $("#select-sort").select2("val", contactInfo.areaId);
        $('#select-sort').prop('disabled', true);
    }
    else {
        var fullName = $("#fullName").val();
        var firstName = UTILS.removeUnicodeUTF8(UTILS.getFristAndLastName(fullName).firstName);
        var lastName = UTILS.removeUnicodeUTF8(UTILS.getFristAndLastName(fullName).lastName);

        $('#firstName').val(firstName.toUpperCase());
        $('#lastName').val(lastName.toUpperCase());

        $("#edit-save-contact").toggleClass("d-none");
        $("#save-contact").toggleClass("d-none");

        $('#firstName').prop('readonly', true);
        $('#lastName').prop('readonly', true);
        $('#phoneNumber').prop('readonly', true);
        $('#emailContact').prop('readonly', true);

        $('#select-sort').prop('disabled', true);
    }
}


function validateContactInfoForm() {
    var fieldsRequired = $('#contact-info-form .field-required');
    var fieldsError = [];
    $('#contact-info-form .error-field').removeClass('has-error');

    // check field required
    for (var i = 0; i < fieldsRequired.length; i++) {
        if (!$(fieldsRequired[i]).val()) {
            fieldsError.push($(fieldsRequired[i]));
        }
    }

    // check field email
    var fieldsEmail = $('#contact-info-form .field-email');
    for (var i = 0; i < fieldsEmail.length; i++) {
        if (!UTILS.validateEmail($(fieldsEmail[i]).val())) {
            fieldsError.push($(fieldsEmail[i]));
        }
    }

    // scroll to error or submit
    if (fieldsError.length) {
        fieldsError.forEach(function (field) {
            field.closest('.form-group').find('.error-field').addClass('has-error');
        })

        return false;
    } else {
        return true;
    }
}

function getListPassenger(array, type, index, haveBirthDay) {
    var result = [];
    var flightData = UTILS.saveFlightData();

    for (var a of array) {
        var getFristAndLastName = UTILS.getFristAndLastName(a.fullName);
        var gender = UTILS.getGender(a.gender);
        var listBaggage = [];
        if (flightData.infoContact.baggageGo && flightData.infoContact.baggageGo.length > 0) {
            if (flightData.infoContact.baggageGo[index])
                listBaggage = [flightData.infoContact.baggageGo[index]]
        }

        if (flightData.dataFlight.isTwoWayFare && flightData.infoContact.baggageBack && flightData.infoContact.baggageBack.length > 0) {
            if (flightData.infoContact.baggageBack[index])
                listBaggage.push(flightData.infoContact.baggageBack[index]);
        }

        var obj = {
            "Index": index,
            "ParentId": type == CONSTANTS.AGES.ADT ? 0 : 1,
            "FirstName": getFristAndLastName.firstName,
            "LastName": getFristAndLastName.lastName,
            "Type": type,
            "Gender": gender,
            "Birthday": haveBirthDay ? TIME_UTILS.getShortDate(a.birthday) : "",
            "Nationality": "",
            "PassportNumber": "",
            "PassportExpirationDate": "",
            "Membership": "",
            "Wheelchair": false,
            "Vegetarian": false,
            "ListBaggage": type == CONSTANTS.AGES.INF ? [] : listBaggage
        }
        result.push(obj);
        index++;
    }

    return {
        list: result,
        index: index
    }
}

function bookFlight(info) {
    var contact;
    if (info) {
        var infoContact = info.infoContact;
        contact = {
            "Gender": true,
            "FirstName": infoContact.firstName,
            "LastName": infoContact.lastName,
            "Area": infoContact.area,
            "Phone": infoContact.phone.substring(1),
            "Email": infoContact.email,
            "Address": ""
        }

        // list passenger
        var listPassenger = [];
        var index = 0;
        if (info.Adt && info.Adt.length > 0) {
            var listAdt = getListPassenger(info.Adt, CONSTANTS.AGES.ADT, index, false);
            listPassenger = listAdt.list;
            index = listAdt.index;
        }

        if (info.Child && info.Child.length > 0) {
            var listChild = getListPassenger(info.Child, CONSTANTS.AGES.CHD, index, true);
            listPassenger = [...listPassenger, ...listChild.list];
            index = listChild.index;
        }

        if (info.Baby && info.Baby.length > 0) {
            var listBaby = getListPassenger(info.Baby, CONSTANTS.AGES.INF, index, true);
            listPassenger = [...listPassenger, ...listBaby.list];
        }

    }

    var data = {
        "BookType": "book-normal",
        "UseAgentContact": true,
        "Contact": contact,
        "ListPassenger": listPassenger,
        "ListFareData": ListFareData,
        "AccountCode": "",
        "Remark": "",
        "BookingDate": new Date(),
        ...UTILS.authenObj()
    }

    return data;
}

$(".btn-payment").click(function () {
    location.href = CONSTANTS.FLIGHTS.MVC.payment;

})

// click div add baggage
$("#myModalBaggage-div").click(function () {
    var booked = sessionStorage.getItem(CONSTANTS.STORAGE.Booked);
    if (!booked) {
        getInfoData();
        var totalPassengers = dataListFlightSearch.search.Adt + dataListFlightSearch.search.Child;

        if (dataSubmit.Passengers.length != totalPassengers) {
            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.errorModal);
            UTILS.setTitleAndMessageModal(CONSTANTS.MODAL_TYPES.error, CONSTANTS.TEXT.errorBaggage.title, CONSTANTS.TEXT.errorBaggage.message)
        }
        else
            UTILS.toggleModal(CONSTANTS.FLIGHTS.MODAL.myModalBaggage);
    }
})

$(".baggage-info").click(function () {
    $(".baggage-info").removeClass("active");
    $(this).addClass("active");
    if ($(this).hasClass("baggage-info-go")) {
        $(".select-baggage-go").removeClass("d-none");
        $(".select-baggage-back").addClass("d-none");
    }
    else {
        // update value for select2
        $(".select-baggage-back").removeClass("d-none");
        $(".select-baggage-go").addClass("d-none");
    }
})

// active select baggage when show modal
$("#" + CONSTANTS.FLIGHTS.MODAL.myModalBaggage).on('show.bs.modal', function () {
    $("#baggage-customer-list").empty();
    // render list customer
    renderPassengers();

    // bind data
    for (var i in dataSubmit.Passengers) {
        if (dataSubmit.baggageGo && dataSubmit.baggageGo.length > 0) {
            var item = dataSubmit.baggageGo[i];
            if (item) {
                $("#select-baggage-0-" + i).val(item.id);
                $("#select-baggage-0-" + i).trigger('change');
            }
        }

        if (dataListFlightSearch.isTwoWayFare) {
            if (dataSubmit.baggageBack && dataSubmit.baggageBack.length > 0) {
                var item = dataSubmit.baggageBack[i];
                if (item) {
                    $("#select-baggage-1-" + i).val(item.id);
                    $("#select-baggage-1-" + i).trigger('change');
                }
            }
        }
    };

    // calculate fee
    $('.total-baggage').html(UTILS.formatViCurrency(calculateBaggageFee()));

});

function renderPassengerItem(array, leg, airline) {
    if (array.length > 0) {
        for (var index in array) {
            var item = array[index];
            var classBaggage = leg == 0 ? "select-baggage-go" : "select-baggage-back d-none";
            var itemHtml = `  <div class="form-group row mb10 ${classBaggage}">
                        <div class="col-md-3"><label class="mt10 black">${item.fullName}</label></div>
                        <div class="col-md-7">
                            <select class="select2 select-baggage" id="select-baggage-${leg}-${index}"  style="width: 100%;"></select>
                        </div>
                    </div>`
            $("#baggage-customer-list").append(itemHtml);

            // make id for select2 

            var listBagages = ListBaggage.filter(function (item, index) {
                item.id = index + 1;
                return item.Leg == leg && item.Airline == airline;
            })

            var findZero = UTILS.findByProp("id", 0, listBagages);
            if (!findZero) {
                var zeroBaggage = {
                    id: 0,
                    Name: "Chọn hành lý ký gửi",
                    Price: 0,
                    Code: 0
                }

                // add 0 value 
                listBagages.unshift(zeroBaggage);
            }

            $("#select-baggage-" + leg + "-" + index).select2({
                minimumResultsForSearch: -1,
                data: listBagages,
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (data) {
                    if (data.Name && data.Price > 0)
                        return `<div class="flex space-between align-center"><span>${data?.Name}</span><span class="color-green">${UTILS.formatViCurrency(data?.Price)}</span></div>`;
                    else
                        return `<div class="flex space-between align-center"><span>${data?.Name}</span></div>`;
                },
                templateSelection: function (data) {
                    if (data.Name)
                        return `<div class="flex space-between align-center"><span>${data?.Name}</span><span class="color-green">${UTILS.formatViCurrency(data?.Price)}</span></div>`;
                },
            });

            // catch selected event
            $("#select-baggage-" + leg + "-" + index).on('select2:select', function (e) {
                var data = e.params.data;
                $('.total-baggage').html(UTILS.formatViCurrency(calculateBaggageFee()));
            });

        }
    }
}

function calculateBaggageFee() {
    var total = 0;
    for (var i in dataSubmit.Passengers) {
        var goBaggage = $("#select-baggage-0-" + i).select2("data")[0];
        total += goBaggage.Price;
        if (dataListFlightSearch.isTwoWayFare) {
            var backBaggage = $("#select-baggage-1-" + i).select2("data")[0];
            total += backBaggage.Price;
        }
    };

    return total;
}

function renderPassengers() {
    renderPassengerItem(dataSubmit.Passengers, 0, dataListFlightSearch.go.Airline);
    if (dataListFlightSearch.isTwoWayFare)
        renderPassengerItem(dataSubmit.Passengers, 1, dataListFlightSearch.back.Airline);
}

// use for check if booked flight and press back button of chrome
window.onpageshow = function (event) {
    var booked = sessionStorage.getItem(CONSTANTS.STORAGE.Booked);
    if (booked) {
        UTILS.removeLoading();
        $(".btn-payment").removeClass("d-none");
        $(".btn-sidebar-submit").addClass("d-none");
        $(".field-required").prop("readonly", true);
        $('input').prop("disabled", true);
        renderCustomerContact();
        $("#myModalBaggage-div").addClass("disabled-div")
        $("#myModalBaggage-div .add").addClass("disabled-icon")
        $("#txt-discount").prop('disabled', true);

        $("#btn-apply-voucher").addClass("disabled-icon")
    }
};

function renderCustomerContact() {
    var infoSession = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));
    if (infoSession) {
        if (infoSession.Adt.length > 0) {
            for (var a in infoSession.Adt) {
                var adult = infoSession.Adt[a];
                $("#fullNameAdt" + a).val(adult.fullName);

                $(`input[name='genderAdt${a}']`).filter(`[value='${adult.gender}']`).attr('checked', true);
            }
        }

        if (infoSession.Child.length > 0) {
            for (var c in infoSession.Child) {
                var child = infoSession.Child[c];
                $("#fullNameChild" + c).val(child.fullName);
                $("#birthdayChild" + c).val(child.birthday);

                $(`input[name='genderChild${c}']`).filter(`[value='${child.gender}']`).attr('checked', true);
            }
        }

        if (infoSession.Baby.length > 0) {
            for (var b in infoSession.Baby) {
                var baby = infoSession.Baby[b];
                $("#fullNameBaby" + b).val(baby.fullName);
                $("#birthdayBaby" + b).val(baby.birthday);

                $(`input[name='genderBaby${b}']`).filter(`[value='${baby.gender}']`).attr('checked', true);
            }
        }
        if (infoSession.exportBill) {
            var exportBill = infoSession.exportBill;
            $("#fullName").val(exportBill.fullName);
            $("#tax-code").val(exportBill.taxCode);
            $("#company-name").val(exportBill.companyName);
            $("#company-address").val(exportBill.companyAddress);
            $("#recipients-name").val(exportBill.recipientsName);
            $("#recipients-address").val(exportBill.recipientsAddress);
            $("#phone-export").val(exportBill.phoneExport);
            $("#email-export").val(exportBill.email);

            $("input[name='exportBill'").prop("checked", true);
        }
    }
}




