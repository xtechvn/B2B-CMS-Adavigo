var cheapestFare = '500.000';
var codeAddressGoChosen = 'SGN';
var nameAddressGoChosen = "Hồ Chí Minh";
var codeAddressArrivalChosen = 'HAN';
var nameAddressArrivalChosen = "Hà Nội";
var listSearchMinFare = [];
var listSearchAll = [];
var listSearchAllTwoWay = [];
var listSearchNotChunksArray = [];
var isChooseGoDone = false;
var isTwoWayFare = false;
var pageAllFareCurrent = 1;
var dataSubmit = {};
var numberItemInpage = 5;
var arrPagination = [];
var Session = null;
var isClickItemSlideRangeDate = false;
var isClickSearch = true;
var isLoadFirst = false;
var filterFare = {
    takeOffTime: [],
    airlineCompany: [],
    ticketClass: [],
    stopNum: [],
    minValue: 0,
    maxValue: 0,
};
var isEdit = false;
// date
var nowDate = new Date();

$("#date-end-value").click(function () {
    if (isTwoWayFare)
        $("#date-picker-flight").click();
});

$("#date-start-value").click(function () {
    $("#date-picker-flight").click();
});

function addOrRemoveValueInFilterFare(keyFilter, keyValue) {
    if (filterFare[keyFilter].indexOf(keyValue) == -1) {
        filterFare[keyFilter].push(keyValue);
    } else {
        filterFare[keyFilter] = filterFare[keyFilter].filter(function (item) {
            return item != keyValue;
        });
    }
}

var picker = new Lightpick({
    field: document.getElementById('litepicker-date-start'),
    secondField: document.getElementById('litepicker-date-end'),
    numberOfMonths: 2,
    lang: 'vi',
    singleDate: false,
    selectForward: true,
    minDate: moment(),
    locale:
    {

        tooltip: {
            one: 'ngày',
            other: 'ngày'
        },
    }
});

var pickerSingle = new Lightpick({
    field: document.getElementById('litepicker-date-start-single'),
    numberOfMonths: 2,
    lang: 'vi',
    singleDate: true,
    selectForward: true,
    minDate: moment()
});

// default when load page
$(document).ready(function () {
    // set default value for select place
    // hcm
    $("#select-go").val("2").trigger("change");
    // hà nội
    $("#select-arrival").val("1").trigger("change");
    $("body").removeClass("h-100vh");
    isLoadFirst = true;
    var listHtmlAddress = '';

    // find latest start and end from search history
    var searchHistory = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.SearchHistory));
    var latestHistory;
    if (searchHistory && searchHistory.length > 0) {
        latestHistory = searchHistory[searchHistory.length - 1]
    }

    var dataChosen = latestHistory ? latestHistory : {};

    if (latestHistory) {
        var depatureLatest = UTILS.findByProp("code", latestHistory.search.StartPoint, CONSTANTS.FLIGHTS.MIN_FARE_MONTH_PLACES);
        var findDeparture = UTILS.findByProp("code", latestHistory.search.StartPoint, CONSTANTS.FLIGHTS.PLACES);

        var places = "";
        // if departure in list
        var placeList = [];
        if (depatureLatest) {
            for (var p = 0; p < CONSTANTS.FLIGHTS.MIN_FARE_MONTH_PLACES.length; p++) {
                var item = CONSTANTS.FLIGHTS.MIN_FARE_MONTH_PLACES[p];
                if (item.id != depatureLatest.id) {
                    placeList.push(item)
                }
            }
        } // if departure not in list
        else {
            for (var p = 0; p < CONSTANTS.FLIGHTS.MIN_FARE_MONTH_PLACES.length - 1; p++) {
                var item = CONSTANTS.FLIGHTS.MIN_FARE_MONTH_PLACES[p];
                placeList.push(item)
            }
        }

        for (var i = 0; i < placeList.length; i++) {
            var item = placeList[i];
            var active = i == 0 ? "active" : "";
            var place = ` <a href="javascript:void(0)" class=" ${active} min-price__item" data-start="${latestHistory.search.StartPoint}" data-end="${item.code}">
                    <span>${depatureLatest ? depatureLatest.name : findDeparture.name}</span>
                    <svg class="icon-svg ml-1 mr-1">
                        <use xlink:href="../images/icons/icon.svg#flight"></use>
                    </svg>
                    <span>${item.name}</span>
                    </a>`;

            places += place;
        }

        $("#min-price-places").html(places);
        codeAddressGoChosen = latestHistory.search.StartPoint;
        codeAddressArrivalChosen = placeList[0].code;
    }

    if (dataChosen?.isTwoWayFare) {
        isTwoWayFare = true;
        $('#switch-two-way').prop('checked', true);
    }

    if (dataChosen?.filterFare?.ticketClass?.length) {
        var textClassSeat = $('.class-seat').html();
        for (var i = 0; i < dataChosen.filterFare.ticketClass.length; i++) {
            $(`.check-list_item[data-value="${dataChosen.filterFare.ticketClass[i]}"]`).addClass('active');
            $(`input[name="inlineGoi2"][value="${dataChosen.filterFare.ticketClass[i]}"]`).prop('checked', true);
            textClassSeat += ', ' + $(`.check-list_item[data-value="${dataChosen.filterFare.ticketClass[i]}"] .text-class-seat`).html();
        }
        $('.class-seat').html(textClassSeat);
    }

    var dateStartChosen;
    // start date
    if (dataChosen?.search?.StartDate) {
        dateStartChosen = new Date(dataChosen.search.StartDate.split('/').reverse().join('-'));
        UTILS.setStartDate(dataChosen.search.StartDate);
        $('.string-date-go-chosen').html(TIME_UTILS.nameDay(new Date(dataChosen.search.StartDate.split('/').reverse().join('-'))));
        TIME_UTILS.renderSingleDate(new Date(dateStartChosen.getFullYear(), dateStartChosen.getMonth(), dateStartChosen.getDate(), 0, 0, 0, 0));
        if (dateStartChosen < moment())
            pickerSingle.setDate(moment());
        else
            pickerSingle.setDate(dateStartChosen);

    } else {
        var defaultStartValue = `${String(moment(nowDate).month() >= 9 ? moment(nowDate).month() + 1 : '0' + (moment(nowDate).month() + 1)) + '/' +
            String(moment(nowDate).date() >= 10 ? moment(nowDate).date() : '0' + moment(nowDate).date()) + '/' +
            String(moment(nowDate).year())
            }`;

        pickerSingle.setDate(moment(defaultStartValue))
    }

    // end date
    if (dataChosen?.search?.EndDate) {
        isTwoWayFare = true;
        $("#switch-two-way").prop('checked', true);
        var dateEndChosenString = dataChosen.search.EndDate.split('/').reverse().join('-');
        var dateEndChosen = moment(dateEndChosenString);

        var startDate = dateStartChosen < moment() ? moment() : dateStartChosen
        var endDate = dateEndChosen < moment() ? moment() : dateEndChosen

        picker.setDateRange(startDate, endDate);
        // hide lable
        $("#date-end-value").addClass("d-none");
        // show range picker
        $("#litepicker-date-start").removeClass("d-none");
        $("#litepicker-date-end").removeClass("d-none");
        // hide single datepicker
        $("#litepicker-date-start-single").addClass("d-none");
    } else {
        UTILS.setEndDate(CONSTANTS.TEXT.noEndDate);
    }

    if (dataChosen?.search?.Adt) {
        $('input#qty_input_adt').val(dataChosen.search.Adt);
    }

    if (dataChosen?.search?.Child) {
        $('input#qty_input_chil').val(dataChosen.search.Child);
    }

    if (dataChosen?.search?.Baby) {
        $('input#qty_input_baby').val(dataChosen.search.Baby);
    }

    if (dataChosen?.search?.StartPoint) {
        codeAddressGoChosen = dataChosen.search.StartPoint;
        var itemGoInListAddress = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == codeAddressGoChosen;
        })[0];
        $('.address-go-code').html(itemGoInListAddress.code);
        $('.address-go-name').html(itemGoInListAddress.name);

        $("#select-go").val(itemGoInListAddress.id.toString()).trigger("change");

    }

    if (dataChosen?.search?.EndPoint) {
        codeAddressArrivalChosen = dataChosen.search.EndPoint;
        var itemArrivalInListAddress = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == codeAddressArrivalChosen;
        })[0];
        $('.address-arrival-code').html(itemArrivalInListAddress.code);
        $('.address-arrival-name').html(itemArrivalInListAddress.name);

        $("#select-arrival").val(itemArrivalInListAddress.id.toString()).trigger("change");
    }

    $('.qty-customer').html(
        (dataChosen?.search?.Adt ? Number(dataChosen.search.Adt) : 1) +
        (dataChosen?.search?.Child ? Number(dataChosen.search.Child) : 0) +
        (dataChosen?.search?.Baby ? Number(dataChosen.search.Baby) : 0)
    )

    CONSTANTS.FLIGHTS.PLACES.forEach(function (address) {
        listHtmlAddress +=
            `<li>
            <svg class="icon-svg">
                <use xlink:href="images/icons/icon.svg#address"></use>
            </svg>
            <div class="address">
                <div class="address-name name">${address.name}</div>
                <div class="address-code">${address.code}</div>
            </div>
        </li>`
    });
    $('#collapseGo ul').html(listHtmlAddress);
    $('#collapseArrival ul').html(listHtmlAddress);
});

// Click button Search Fare
$('.btn-search').on('click', function () {
    if (!$("#error-number-passenger").hasClass("has-error")) {
        var startDate = "";
        var endDate = "";
        if (isTwoWayFare) {
            startDate = $("#litepicker-date-start").val();
            endDate = $("#litepicker-date-end").val();
        }
        else {
            startDate = $("#litepicker-date-start-single").val();
        }

        // save data localStorage
        // redirect flight list
        dataSubmit.search = {
            StartPoint: codeAddressGoChosen,
            EndPoint: codeAddressArrivalChosen,
            StartDate: startDate,
            EndDate: endDate,
            Adt: $('#qty_input_adt').val(),
            Child: $('#qty_input_chil').val(),
            Baby: $('#qty_input_baby').val(),
        };
        dataSubmit.isTwoWayFare = isTwoWayFare;
        dataSubmit.filterFare = filterFare;

        // save search history
        UTILS.handleSearchHistory(dataSubmit);

        sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataSubmit));
        window.location.href = CONSTANTS.FLIGHTS.MVC.flightList;
    }
});

// Change address go
var myCollapseGo = document.getElementById('collapseGo');
$("body").on("click", '#collapseGo li', function () {
    codeAddressGoChosen = $(this).find('.address-code').html();
    nameAddressGoChosen = $(this).find('.address-name').html();
    $(this).parents(".form-search").removeClass("active");
    $("#go-input").val(`${codeAddressGoChosen} (${nameAddressGoChosen})`)
});

// Change address arrival
var myCollapseArrival = document.getElementById('collapseArrival')
$("body").on("click", '#collapseArrival li', function () {
    codeAddressArrivalChosen = $(this).find('.address-code').html();
    nameAddressArrivalChosen = $(this).find('.address-name').html();
    $(this).parents(".form-search").removeClass("active");
    $("#arrival-input").val(`${codeAddressArrivalChosen} (${nameAddressArrivalChosen})`)
});

// Handle click on off two  way
$('input#switch-two-way').on('change', function () {
    isTwoWayFare = $(this).prop('checked');
    if (isTwoWayFare) {
        var startDate = pickerSingle.getDate();
        // hide single date and show daterange date
        $("#litepicker-date-start-single").addClass("d-none");
        $("#litepicker-date-start").removeClass("d-none");
        $("#litepicker-date-end").removeClass("d-none");
        $("#date-end-value").addClass("d-none")
        picker.setDateRange(startDate);
        picker.show();
    } else {
        // get start date of daterangepicker to set for single picker
        var startDaterange = picker.getStartDate();
        $("#litepicker-date-start-single").removeClass("d-none");
        $("#date-end-value").removeClass("d-none");
        $("#litepicker-date-start").addClass("d-none");
        $("#litepicker-date-end").addClass("d-none");
        pickerSingle.setDate(startDaterange);
    }
});


$(".time-going .item").click(function () {
    $(".time-going .item").removeClass("active")
    $(this).addClass("active")
})


// collapse when click outside
$(document).click(function (event) {
    if (!$(event.target).is(".wrap-search .collapse *")) {
        $(".wrap-search .collapse").collapse("hide");
    }
});

// task 271
// NAN daterange when mobile (iphone)
window.onpageshow = function () {
    var path = sessionStorage.getItem(CONSTANTS.STORAGE.Path);
    if (path) {
        if (path.indexOf(CONSTANTS.FLIGHTS.MVC.flightList) != -1) {
            window.location.reload()
            sessionStorage.removeItem(CONSTANTS.STORAGE.Path);
        }
    }
};

$(".index-menu-item").click(function () {
    $(".index-menu-item").removeClass("active");
    $(this).addClass("active");
    $(".box-item").addClass("d-none");
    var box = $(this).data("box");
    $("#" + box).removeClass("d-none")
})













