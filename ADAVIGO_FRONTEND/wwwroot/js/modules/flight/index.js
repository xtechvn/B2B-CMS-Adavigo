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
    // hà nội
    UTILS.RenderSearch()
    
    renderSearchHistory();
    renderListAddress();
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
        renderCalendarMinfare(latestHistory.search.StartPoint, placeList[0].code);
    }
    else
        renderCalendarMinfare();

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
                <use xlink:href="/images/icons/icon.svg#address"></use>
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

// Handle click chọn hạng vé modal search
$(".check-list_item").click(function () {
    var textClass = '';
    $(this).toggleClass("active");
    [...$(".check-list_item")].forEach(function (item) {
        if ($(item).hasClass('active')) {
            textClass += ' ,' + $(item).find('.text-class-seat').html();
        }
    });
    $('.class-seat').html(textClass);

    addOrRemoveValueInFilterFare('ticketClass', $(this).attr('data-value'));
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

function choosePlace(el) {
    var html = $(el).html();
    $(".dropbtn").html(html);
    // call get list min fares
    $(".line-best-content").addClass('d-none');
    $("#line-best-loading").removeClass('d-none');
    callListMin = false;
    renderListMinFare(codeAddressGoChosen, $(el).data("code"))
}

var listMinFare = [];
function renderListMinFare(go, arrival) {
    if (!go)
        go = codeAddressGoChosen;
    if (!arrival)
        arrival = codeAddressArrivalChosen;

    if (!callListMin) {
        callListMin = true;
        var goName = UTILS.findByProp("code", go, CONSTANTS.FLIGHTS.PLACES) ? UTILS.findByProp("code", go, CONSTANTS.FLIGHTS.PLACES).name : nameAddressGoChosen;
        var arrivalName = UTILS.findByProp("code", arrival, CONSTANTS.FLIGHTS.PLACES) ? UTILS.findByProp("code", arrival, CONSTANTS.FLIGHTS.PLACES).name : nameAddressArrivalChosen;

        // get list date
        var arrayRequest = [];
        for (var i = 0; i < 7; i++) {
            var date = i == 0 ? TIME_UTILS.getDateStringRequest(moment()) : TIME_UTILS.getDateStringRequest(moment().add(i, 'days'));
            var requestItem = {
                "FlightRequest": {
                    "StartPoint": go,
                    "EndPoint": arrival,
                    "DepartDate": date,
                    "Airline": ""
                }

            }
            arrayRequest.push(requestItem);
        }

        flightServices.searchListMinFare(arrayRequest).then(function (res) {
            if (res && res.length > 0) {
                listMinFare = res;
                var resultMinFare = "";
                for (var fIndex in res) {
                    var f = res[fIndex];

                    var oldPrice = ` <strong class="new">${UTILS.formatViCurrency(f.AdavigoPrice.amount)}</strong>`;
                    var newPrice = f.AdavigoPrice.price != f.AdavigoPrice.amount ? `<div class="gray"> Giá gồm thuế + phí: ${UTILS.formatViCurrency(f.AdavigoPrice?.amount)}</div>` : ""
                    var item = ` <div class="swiper-slide">
                                    <div class="name">
                                        <div class="logo"><img src="${f.AirlineObj.logo}" alt=""></div>
                                        <div class="hang">${f.AirlineObj.nameVi}</div>
                                    </div>
                                    <div class="time-flight">
                                        <div class="first-time">
                                            <div class="time">${goName}</div>
                                        </div>
                                        <div class="flight">
                                            <img src="images/icons/fly-to.png" alt="">
                                        </div>
                                        <div class="last-time">
                                            <div class="time">${arrivalName}</div>
                                        </div>
                                    </div>
                                    <div class="gray mb24">Khởi hành: ${TIME_UTILS.formatDateMomentJs(f.ListFlight[0].StartDate, "DD/MM/YYYY")}</div>
                                    <div class="flex-price">
                                        <div class="price">
                                            ${oldPrice}
                                            ${newPrice}
                                        </div>
                                        <a onclick="chooseMinFare(${fIndex})" class="btn-default gray" href="javascript:void(0)">Chọn</a>
                                    </div>
                                </div>`;
                    resultMinFare += item;

                }

                $("#list-min-fare").html(resultMinFare);
                $(".line-best-content").removeClass('d-none');
                $("#line-best-loading").addClass('d-none');

                var swiperMinFares = new Swiper(".slide-flight .swiper-container", {
                    slidesPerView: 3,
                    spaceBetween: 16,
                    loop: true,
                    navigation: {
                        nextEl: ".slide-flight .swiper-button-next",
                        prevEl: ".slide-flight .swiper-button-prev",
                    },
                    breakpoints: {
                        991: {
                            slidesPerView: 2,
                        },
                        767: {
                            slidesPerView: 1,
                        }
                    }
                });

            };

        });
    }
}

function renderListAddress() {
    for (var p of CONSTANTS.FLIGHTS.PLACES) {
        $("#list-address").append(`<li data-code="${p.code}" onclick="choosePlace(this)">${p.name}</li>`)
    }
}

function chooseMinFare(index) {
    var flight = listMinFare[index].ListFlight[0];
    if (flight) {
        dataSubmit.search = {
            StartPoint: flight.StartPoint,
            EndPoint: flight.EndPoint,
            StartDate: TIME_UTILS.formatDateMomentJs(flight.StartDate, "DD/MM/YYYY"),
            Adt: $('#qty_input_adt').val(),
            Child: $('#qty_input_chil').val(),
            Baby: $('#qty_input_baby').val(),
        };
        dataSubmit.isTwoWayFare = false;
        dataSubmit.filterFare = filterFare;

        sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataSubmit));
        window.location.href = CONSTANTS.FLIGHTS.MVC.flightList;
    }
}

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

var callNews = false;
function callApiTopic(idTopic, classContent, idLoading, apiCall, isCall) {
    if (!isCall) {
        var hT1 = $(idTopic).offset().top,
            hH1 = $(idTopic).outerHeight(),
            wH1 = $(window).height(),
            wS1 = $(this).scrollTop();
        if (wS1 > (hT1 + hH1 - wH1)) {
            // call api
            if (apiCall) {       
                apiCall();
            }

        }
    }
}


$(window).scroll(function () {
    // Chuyến bay giá tốt đi
    callApiTopic('#list-article-wrapper', '#list-article', '#skeleton-list-article', callAllApi, callNews);
});

function callAllApi() {
    getNews();
}

function getNews() {
    if (!callNews) {
        callNews = true;

        var obj = {
            page: 1,
            size: CONSTANTS.NEWS.PAGE_SIZE,
            category_id: 1041
        };

        newsServices.getNewsByCategoryIdV2(obj).then(function (res) {
            debugger;
            var articles = "";
            if (res && res.data && res.data.length > 0) {
                for (var item of res.data) {
                    articles += renderArticle(item);
                }
            }
            $("#list-article").html(articles);
            $("#list-article").removeClass('d-none');
            $("#skeleton-list-article").addClass('d-none');

        }).catch(function (error) {
        })
    }
}

function renderArticle(item) {
    var href = `/tin-tuc/${UTILS.getSlug(item.title)}-${item.id}`


    var article = ` <div class="article-itemt full bg-white">
                    <div class="article-thumb">
                        <a class="thumb_img thumb_5x3" href="${href}" title="${item.title}">
                                    <img src="${item.image_169}">
                        </a>
                    </div>
                    <div class="article-content">
                        <h3 class="title_new">
                                    <a href="${href}" title="${item.title}">
                                        ${item.title}
                                    </a>
                                </h3>
                            <div class="des">${TIME_UTILS.formatDateMomentJs(item.publish_date, "DD/MM/YYYY")}</div>
                    </div>
                </div>`
    return article;
}

// place minfare click
$('body').on('click', '.min-price__item', function () {
    $(".min-price__item").removeClass("active");
    $(this).addClass("active");

    // render calender
    $("#skeleton-calendar-wrapper").show();
    $("#calendar-wrapper").addClass("d-none");

    var start = $(this).data("start");
    var end = $(this).data("end");

    codeAddressGoChosen = start;
    codeAddressArrivalChosen = end;

    renderCalendarMinfare(start, end);
});

function renderCalendarMinfare(departure, arrival) {
    $(".min-price__item").addClass("disabled-child")
    var arrayRequest = [];
    var monthYear = TIME_UTILS.getMonthsFromCurrentMonth(6);

    // get all day in month
    var calendar = [];
    for (var i = 0; i < 6; i++) {
        var month = monthYear[i].month;
        var year = monthYear[i].year
        var calendarItem = TIME_UTILS.getCalendarByMonthYear(year, month);
        calendar.push({
            month,
            year,
            calendar: calendarItem
        })

        // search min fare month request
        var requestItem = {
            StartPoint: departure ? departure : codeAddressGoChosen,
            EndPoint: arrival ? arrival : codeAddressArrivalChosen,
            Month: month,
            Year: year,
        }

        var requestPromises = flightServices.searchMinFareMonth(requestItem)
        arrayRequest.push(requestPromises);
    }

    // check all promise done
    Promise.all(arrayRequest)
        .then(function (result) {
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var arrayPrice = [];
                    // min fare
                    var item = result[i].ListMinPrice;
                    var calendarGroup = calendar[i].calendar;
                    for (var j = 0; j < item.length; j++) {
                        var date = item[j];
                        var momentDate = moment(date.DepartDate).date();
                        // find moment date in calendar
                        var findDate = findDateInCalendarGroup(momentDate, calendarGroup);
                        if (findDate) {
                            findDate.minFare = date.ListFareData[0].AdavigoPriceAdt.amount;
                            arrayPrice.push(date.ListFareData[0].AdavigoPriceAdt.amount);
                        }
                    }

                    calendar[i].max = Math.round(Math.max.apply(Math, arrayPrice) / 1000) + "k";
                    calendar[i].min = Math.round(Math.min.apply(Math, arrayPrice) / 1000) + "k";
                }

                renderCalendar(calendar);
            }
        })
        .catch(function (error) {
            console.log(error)
        });

}

// render min price in months calendar
function renderCalendar(calendarList) {
    var result = "";
    for (var calendarItem of calendarList) {
        var rows = "";
        for (var groupItem of calendarItem.calendar) {
            var row = "";
            var columnStr = "";
            for (var i = 1; i <= 7; i++) {
                var findByWeekDate = UTILS.findByProp("weekDate", i, groupItem);
                var column = "";

                if (findByWeekDate) {
                    var price = findByWeekDate.minFare ? Math.round(findByWeekDate.minFare / 1000) + "k" : "";
                    var halfOpacity = !price ? "opacity-half" : "";
                    var minClass = price == calendarItem.min ? "min" : "";
                    var maxClass = price == calendarItem.max ? "max" : "";

                    column = ` <td onclick="chooseCalendarDate('${findByWeekDate.dateStr}')" class="${halfOpacity}">
                                                ${findByWeekDate.number}
                                                <div class="price ${minClass} ${maxClass}">${price}
                        </div>
                                            </td>`
                }
                else
                    column = ` <td></td>`;
                columnStr += column;
            }

            row += `<tr>${columnStr}</tr>`;
            rows += row;
        }

        var calendar = `
                        <div class="swiper-slide item">
                            <div class="head">
                                <div class="month">Tháng ${calendarItem.month} ${calendarItem.year}</div>
                                <div class="note">
                                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.125 1.4375H6.31063C6.06032 1.4375 5.82478 1.535 5.64783 1.71218L0.254017 7.10599C-0.0848364 7.44485 -0.0845083 7.99276 0.254017 8.33128L4.16871 12.246C4.50759 12.5848 5.05548 12.5845 5.394 12.246C8.20795 9.43234 6.96537 10.6749 10.7878 6.85217C10.965 6.67499 11.0625 6.43968 11.0625 6.18937V2.37498C11.0625 1.85796 10.642 1.4375 10.125 1.4375ZM8.81254 4.43745C8.39887 4.43745 8.06255 4.10089 8.06255 3.68746C8.06255 3.27403 8.39887 2.93747 8.81254 2.93747C9.2262 2.93747 9.56252 3.27403 9.56252 3.68746C9.56252 4.10089 9.2262 4.43745 8.81254 4.43745Z" fill="#79CB9C" />
                                        <path d="M10.1251 1.4375H9.18766C9.70468 1.4375 10.1251 1.85796 10.1251 2.37498V6.18937C10.1251 6.43968 10.0276 6.67499 9.85046 6.85217C4.02187 12.6812 4.43396 12.2838 4.31274 12.3621C4.64025 12.5737 5.09383 12.5463 5.39413 12.246C8.20808 9.43234 6.96549 10.6749 10.7879 6.85217C10.9651 6.67499 11.0626 6.43968 11.0626 6.18937V2.37498C11.0626 1.85796 10.6422 1.4375 10.1251 1.4375Z" fill="#63AC7D" />
                                        <path d="M8.81247 3.87492C8.64691 3.87492 8.56143 3.67332 8.67988 3.55484L11.6798 0.554896C11.753 0.481701 11.8718 0.481701 11.945 0.554896C12.0182 0.628136 12.0182 0.746822 11.945 0.820063L8.94503 3.82001C8.90844 3.85662 8.86047 3.87492 8.81247 3.87492Z" fill="#F1CC76" />
                                    </svg>
                                    <span>Rẻ nhất: <strong class="color-green">${calendarItem.min}</strong></span>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>T2</th>
                                            <th>T3</th>
                                            <th>T4</th>
                                            <th>T5</th>
                                            <th>T6</th>
                                            <th>T7</th>
                                            <th>CN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rows}
                                    </tbody>
                                </table>
                            </div>
                        </div>`

        result += calendar;
    }

    $("#calendarWrapper").html(result);
    $("#skeleton-calendar-wrapper").hide();
    $("#calendar-wrapper").removeClass("d-none");
    $(".min-price__item").removeClass("disabled-child")

    var swiperCalendar = new Swiper(".calendar-custom .swiper-container", {
        slidesPerView: 3,
        spaceBetween: 36,
        loop: true,
        navigation: {
            nextEl: ".calendar-custom .swiper-button-next",
            prevEl: ".calendar-custom .swiper-button-prev",
        },
        breakpoints: {
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1,
            }
        }
    });
}

function findDateInCalendarGroup(dateNum, calendarGroup) {
    for (var i in calendarGroup) {
        var group = calendarGroup[i];
        for (var j in group) {
            var item = group[j];
            if (item.number == dateNum) {
                return item;
            }
        }
    }
}

function chooseCalendarDate(date) {
    var dateArray = date.split('-');
    var day = dateArray[1];
    var month = dateArray[0];

    var startDate = day + "/" + month + "/" + dateArray[2];
    var dataSubmit = {};

    // save data localStorage
    // redirect flight list
    dataSubmit.search = {
        StartPoint: codeAddressGoChosen,
        EndPoint: codeAddressArrivalChosen,
        StartDate: startDate,
        EndDate: "",
        Adt: 1,
        Child: 0,
        Baby: 0,
    };
    dataSubmit.isTwoWayFare = false;

    dataSubmit.filterFare = {
        takeOffTime: [],
        airlineCompany: [],
        ticketClass: [],
        stopNum: [],
        minValue: 0,
        maxValue: 0,
    };
    // save search history
    UTILS.handleSearchHistory(dataSubmit);
    debugger;
    sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataSubmit));
    window.location.href = CONSTANTS.FLIGHTS.MVC.flightList;
};

function chooseHistory(date, start, end) {
    var dataSubmit = {};
    // save data localStorage
    // redirect flight list
    dataSubmit.search = {
        StartPoint: start,
        EndPoint: end,
        StartDate: date,
        EndDate: "",
        Adt: 1,
        Child: 0,
        Baby: 0,
    };
    dataSubmit.isTwoWayFare = false;

    dataSubmit.filterFare = {
        takeOffTime: [],
        airlineCompany: [],
        ticketClass: [],
        stopNum: [],
        minValue: 0,
        maxValue: 0,
    };
    // save search history
    UTILS.handleSearchHistory(dataSubmit);

    sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataSubmit));
    window.location.href = CONSTANTS.FLIGHTS.MVC.flightList;
};

// render search history
function renderSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.SearchHistory));
    if (searchHistory && searchHistory.length > 0) {
        var result = "";
        for (var i = searchHistory.length - 1; i >= 0; i--) {
            var history = searchHistory[i];
            var dateMomentJs = TIME_UTILS.getDateMomentStringFromString(history.search.StartDate);

            if (!moment(dateMomentJs).isSameOrAfter(moment(), 'day')) {
                continue;
            }

            var number = Number(history.search.Adt) + Number(history.search.Baby) + Number(history.search.Child);
            var startDate = TIME_UTILS.nameDay(new Date(history.search.StartDate.split('/').reverse().join('-')));
            var time = ` <div class="des gray">
                            ${startDate} 
                        </div>`

            var startPoint = UTILS.findByProp("code", history.search.StartPoint, CONSTANTS.FLIGHTS.PLACES);
            var endPoint = UTILS.findByProp("code", history.search.EndPoint, CONSTANTS.FLIGHTS.PLACES);
            var flightClassList = [];
            if (history.filterFare.ticketClass.length > 0) {
                for (var t of history.filterFare.ticketClass) {
                    var findTicket = UTILS.findById(Number(t), CONSTANTS.FARE_CLASSES);
                    if (findTicket)
                        flightClassList.push(findTicket.name);
                }
            }
            var flightClassStr = flightClassList.length > 0 ? `- ${flightClassList.join(' , ')}` : "";
            var item = ` <div class="item" onclick="chooseHistory('${history.search.StartDate}','${history.search.StartPoint}','${history.search.EndPoint}')">
                    <div class="start">${startPoint.name} (${history.search.StartPoint}) </div>
                    <div class="end">
                        ${endPoint.name} (${history.search.EndPoint})
                        ${time}
                         <div class="des gray">
                            ${number} Khách ${flightClassStr}
                        </div>
                    </div>
                </div>`;

            result += item;
        }

        $("#searchHistory").html(result);
    }
}











