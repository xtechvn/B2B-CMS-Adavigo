var cheapestFare = '500.000';
var codeAddressGoChosen = 'SGN';
var nameAddressGoChosen = "Hồ Chí Minh";
var codeAddressArrivalChosen = 'HAN';
var nameAddressArrivalChosen = "Hà Nội";
var listSearchMinFare = [];
var listSearchMinFareOrigin = [];
var listSearchAll = [];
var listAllFilter = [];
var listSearchAllTwoWay = [];
var listSearchNotChunksArray = [];
var isChooseGoDone = false;
var isTwoWayFare = false;
var pageAllFareCurrent = 1;
var dataSubmit = {};
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

function searchListMinFare(leg) {
    // get list date
    var arrayRequest = [];
    var dateSearchStart = isTwoWayFare ? $('#litepicker-date-start').val().split('/').reverse().join('-') : $('#litepicker-date-start-single').val().split('/').reverse().join('-');
    var dateSearchEnd = $('#litepicker-date-end').val().split('/').reverse().join('-') || new Date();
    var dateRangeStart = TIME_UTILS.getRange7DaysNextAndPrevGo(dateSearchStart);
    var dateRangeEnd = TIME_UTILS.getRange7DaysNextAndPrevBack(dateRangeStart[0], dateSearchStart, dateSearchEnd);

    dateRangeStart.forEach(function (dayStart, index) {
        var splitDay = dayStart.split('-');
        var splitDayEnd = dateRangeEnd[index].split('-');
        var date = "";
        if (!isTwoWayFare)
            date = splitDay[2] + splitDay[1] + splitDay[0];
        else
            date = leg == 0 ? splitDay[2] + splitDay[1] + splitDay[0] : splitDayEnd[2] + splitDayEnd[1] + splitDayEnd[0];

        var requestItem = {
            "FlightRequest": {
                "StartPoint": codeAddressGoChosen,
                "EndPoint": codeAddressArrivalChosen,
                "DepartDate": date,
                "Airline": ""
            }
        }
        arrayRequest.push(requestItem);
    })

    flightServices.searchListMinFareDateRange(arrayRequest).then(function (res) {
        if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                var splitDay = dateRangeStart[i].split('-');
                var index = i;
                var minFare = UTILS.formatViCurrency(res[i].AdavigoPrice.amount);
                $('#slide-date .swiper-slide.item').eq(index).find('span').html(minFare);
                $('#slide-date .swiper-slide.item').eq(index).attr('data-day', dateRangeStart[i]);

                // active current
                if (isClickSearch && (dateRangeStart[i] == dateSearchStart)) {
                    $('#slide-date .swiper-slide.item').removeClass('active');
                    $('#slide-date .swiper-slide.item').eq(index).addClass('active');
                }

                if (!isTwoWayFare) {
                    $('#slide-date .swiper-slide.item').eq(index).find('strong').html("Ngày " + splitDay[2] + '/' + splitDay[1]);
                }
                else {
                    var splitDayEnd = dateRangeEnd[i].split('-');
                    $('#slide-date .swiper-slide.item').eq(index).find('strong').html("Ngày " + splitDay[2] + '/' + splitDay[1] + ' - ' + splitDayEnd[2] + '/' + splitDayEnd[1]);
                    $('#slide-date .swiper-slide.item').eq(index).attr('data-dayend', dateRangeEnd[i]);
                }
            }
        };

        $("#skeleton-slide-date").hide();
        $("#slide-date").removeClass("opacity-zero");
        $("#slide-date").removeClass("hidden-height");
    });
}

function renderHtmlRangeDateChosen(leg) {
    searchListMinFare(leg);
}

function renderItemFare(infoItemFare, index, typeList) {
    var searchObj = getSearchObj();
    if (infoItemFare) {
        var listFlight = infoItemFare?.ListFlight?.[0];
        var isPacificAirline = listFlight.Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? true : false;
        var groupClass = listFlight.GroupClassObj ? listFlight.GroupClassObj.detailVi : listFlight.GroupClass;
        var description = listFlight.GroupClassObj.description;

        var nameAddressGo = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == listFlight.StartPoint;
        })?.[0]?.name || '';
        var nameAddressArrival = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == listFlight.EndPoint;
        })?.[0]?.name || '';
        // prices
        var adultFare = UTILS.formatViCurrency(infoItemFare.FareAdt * (Number($('#qty_input_adt').val())));
        var childFare = Number($('#qty_input_chil').val()) > 0 ?
            `<li class="mb15 flex space-between gray">
                                    <div>Trẻ em (x${$('#qty_input_chil').val()})</div>
                                    <div>${UTILS.formatViCurrency(infoItemFare.FareChd * (Number($('#qty_input_chil').val())))}</div>
                                </li>`
            : '';

        var infantFareText = infoItemFare.FareInf == 0 ? "<span class='green-txt'>Miễn phí</span>" : UTILS.formatViCurrency(infoItemFare.FareInf * (Number($('#qty_input_baby').val())));

        var infantFare = Number($('#qty_input_baby').val()) > 0 ?
            `<li class="mb15 flex space-between gray">
                                    <div>Em bé (x${$('#qty_input_baby').val()})</div>
                                    <div>${infantFareText}</div>
                                </li>`
            : '';

        var taxAndFee = UTILS.formatViCurrency((infoItemFare.FeeAdt + infoItemFare.TaxAdt) * searchObj.Adt + (infoItemFare.FeeChd + infoItemFare.TaxChd) * searchObj.Child + (infoItemFare.FeeInf + infoItemFare.TaxInf) * searchObj.Baby);
        var oldPrice = infoItemFare.AdavigoPriceAdt.price != infoItemFare.AdavigoPriceAdt.amount ? `<p class="price-old">${UTILS.formatViCurrency(infoItemFare.AdavigoPriceAdt.price)}</p>` : "";

        var newPrice = "";
        var filterPriceByValue = $('input[name=filterPriceBy]:checked').val();
        if (filterPriceByValue == CONSTANTS.TEXT.filterPrice.default) {
            newPrice = UTILS.formatViCurrency(infoItemFare?.FareAdt);
        }
        else {
            newPrice = UTILS.formatViCurrency(infoItemFare?.AdavigoPriceAdt.amount);
        }

        var profit = infoItemFare.AdavigoPrice.profit * searchObj.Adt;
        if (infoItemFare.FareChd > 0) {
            profit += infoItemFare.AdavigoPrice.profit * searchObj.Child;
        }
        if (infoItemFare.FeeInf > 0) {
            profit += infoItemFare.AdavigoPrice.profit * searchObj.Baby;
        }
        var serviceFee = UTILS.formatViCurrency(profit);
        var totalPrice = UTILS.formatViCurrency(infoItemFare.TotalPrice + profit);

        var boxMinFare = typeList == 'listAll' ? "" : ` <div class="slogan">
                        <img src="${infoItemFare?.AirlineObj?.logo}" alt="" />
                        <span>Giá rẻ nhất</span>
                    </div>`;

        var allowanceBaggage = listFlight.ListSegment[0].AllowanceBaggage ? ` <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#hanh-ly"></use>
                                </svg>
                                 Hành lý ký gửi: ${listFlight.ListSegment[0].AllowanceBaggage}.
                            </li>` : "";
        var stopNum = listFlight.StopNum == 0 ? 'bay thẳng' : listFlight.StopNum + ' điểm dừng ' + `<span></span><svg class="icon-svg color-blue min">
            <use xlink:href="../images/icons/icon.svg#info"></use>
                                        </svg>`

        // flight have stop
        var durationFlight = listFlight.StopNum == 0 ? `<p class="duration-fly-item"><strong>${TIME_UTILS.timeConvert(listFlight?.Duration || 0)}</strong> - ${stopNum}</p>` : `<p onclick="showStop(${infoItemFare.FareDataId})" class="duration-fly-item duration-fly-item-stop"><strong>${TIME_UTILS.timeConvert(listFlight?.Duration || 0)}</strong> - ${stopNum}</p>`;

        var item_v2 = `  <div class="item item__v2" data-fareId ="${infoItemFare.FareDataId}" data-index="${index}" data-type="${typeList}">
                        <div class="flex wrap">
                            <div class="hang-bay">
                                 <div class="logo">
                                    <img src="${isPacificAirline ? CONSTANTS.PACIFIC_AIRLINE.path : infoItemFare?.AirlineObj?.logo}" alt="" />
                                 </div>
                                <div class="hang">${isPacificAirline ? CONSTANTS.PACIFIC_AIRLINE.name : infoItemFare?.AirlineObj?.nameVi}</div >
                            </div>
                            <div class="code-flight">${listFlight?.ListSegment?.[0]?.FlightNumber}</div>
                            <div class="time-flight start">
                                ${TIME_UTILS.getFlightTime(listFlight.StartDate)}
                            </div>
                             <div class="time-flight start-add d-none">
                               ${listFlight.StartDate.slice(0, 10).split('-').reverse().join('/')}
                            </div>

                            <div class="transit">
                                 ${durationFlight}
                                
                            </div>
                            <div class="time-flight end">
                                ${TIME_UTILS.getFlightTime(listFlight.EndDate)}
                            </div>
                            <div class="time-flight start-end d-none">${listFlight.EndDate.slice(0, 10).split('-').reverse().join('/')}</div>

                            <a class="notifi collap-down collapsed" data-toggle="collapse" href="#collapseDetail-${infoItemFare.FareDataId}">
                                <span>Xem chi tiết</span>
                                <svg class="icon-svg">
                                <use xlink:href="../images/icons/icon.svg#next2"></use>
                                </svg>
                            </a>
                             <div class="price-new">${newPrice}</div>

                                <a class="btn-default btn-choose-this-fare" href="#" data-fareId ="${infoItemFare.FareDataId}" data-index="${index}" data-type="${typeList}">Chọn  <svg class="icon-svg min">
                                    <use xlink:href="../images/icons/icon.svg#next"></use>
                                </svg></a>
                        </div>
                        <div class="detail-flight collapse" id="collapseDetail-${infoItemFare.FareDataId}">
                            <div class="row">
                                <div class="col-5">
                                    <div class="mb16 txt_16"><strong>Thông tin chuyến bay</strong></div>                                  
                                     ${UTILS.renderHtmlStop(infoItemFare)}
                                </div>
                                <div class="col-7 line-left">
                                   
                                    <div class="mb16 txt_16"><strong>Thông tin khác</strong></div>
                                    <ul class="service pl-3">
                                <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#hanh-ly"></use>
                                </svg>
                                Hành lý xách tay: ${listFlight.ListSegment[0].HandBaggage}.
                                
                            </li>
                           ${allowanceBaggage}
                                    ${description}
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
        return item_v2;

        var t = `<div class="item" data-fareId ="${infoItemFare.FareDataId}" data-index="${index}" data-type="${typeList}">
        <div class="flight-top">
            <div class="name">
                <div class="logo">

                    <img src="${isPacificAirline ? CONSTANTS.PACIFIC_AIRLINE.path : infoItemFare?.AirlineObj?.logo}" alt="" />
                </div>
                <div class="hang">${isPacificAirline ? CONSTANTS.PACIFIC_AIRLINE.name : infoItemFare?.AirlineObj?.nameVi}</div >
                <p class="code">${listFlight?.ListSegment?.[0]?.FlightNumber}</p>
            </div>
            <div class="time-flight">
                <div class="first-time">
                    <div class="time">
                        ${TIME_UTILS.getFlightTime(listFlight.StartDate)}
                    </div>
                    <div class="add">${listFlight.StartPoint}</div>
                </div>
                <div class="flight">
                    <img src="/images/icons/fly-to.png" alt="" />
                    ${durationFlight}
                </div>
                <div class="last-time">
                    <div class="time">
                        ${TIME_UTILS.getFlightTime(listFlight.EndDate)}             
                    </div>
                    <div class="add">${listFlight.EndPoint}</div>
                </div>
            </div>
            <div class="right-flight">
                <div class="price">
                    ${oldPrice}
                    <div class="price-new">${newPrice}</div>
                </div>
                <div class="button">
                   ${boxMinFare}
                    <a class="btn-default btn-choose-this-fare" href="#" data-fareId ="${infoItemFare.FareDataId}" data-index="${index}" data-type="${typeList}">Chọn</a>
                </div>
            </div>
        </div>
        <div class="flight-bottom flex">
            <div class="option">
                <div class="tag">${listFlight?.FareClass}</div>
                ${groupClass}
            </div>
            <a class="notifi collapsed" data-toggle="collapse" href="#collapseDetail-${index}">
                <svg class="icon-svg">
                    <use xlink:href="../images/icons/icon.svg#info"></use>
                </svg>
                <span onclick="showDetail('${infoItemFare.TotalPrice}')">Xem chi tiết</span>
            </a>
            <div class="detail-flight collapse" id="collapseDetail-${index}">
                <div class="row">
                    <div class="col-5">
                        <div class="mb16 txt_16">
                            <strong>Thông tin chuyến bay</strong>
                        </div>
                        <div class="time-flight">
                            <div class="first-time">
                                <div class="flight-date">
                                    <div class="time">
                                        ${TIME_UTILS.getFlightTime(listFlight.StartDate)}
                                    </div>
                                    <div class="add">${listFlight.StartDate.slice(0, 10).split('-').reverse().join('/')}</div>
                                </div>
                                <div class="departure">
                                    <p class="black txt_16">
                                        <strong>${nameAddressGo} (${listFlight.StartPoint})</strong>
                                    </p>
                                </div>
                            </div>
                            <div class="flight">
                                <div class="flight-time">
                                    <img src="/images/icons/fly-to2.png" alt="" />
                                    <p><strong>${TIME_UTILS.timeConvert(listFlight?.Duration || 0)}</strong></p>
                                </div>
                                <div class="name">
                                    <div class="logo">
                                        <img src="${infoItemFare?.AirlineObj?.logo}" alt="" />
                                    </div>
                                    <div class="hang">${infoItemFare?.AirlineObj?.nameVi}</div>
                                    <p class="code">${listFlight?.ListSegment?.[0]?.FlightNumber}</p>
                                </div>
                            </div>
                            <div class="last-time">
                                <div class="flight-date">
                                    <div class="time">
                                        ${TIME_UTILS.getFlightTime(listFlight.EndDate)}
                                    </div>
                                    <div class="add">${listFlight.EndDate.slice(0, 10).split('-').reverse().join('/')}</div>
                                </div>
                                <div class="departure">
                                    <p class="black txt_16">
                                        <strong>${nameAddressArrival} (${listFlight.EndPoint})</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 line-left">
                        <div class="mb16 txt_16">
                            <strong>Thông tin vé</strong>
                        </div>
                        <ul class="pl-3">
                            <li class="mb15 flex space-between gray">
                                <div>Người lớn (x${$('#qty_input_adt').val()})</div>
                                <div>${adultFare}</div>
                            </li>
                            ${childFare}
                            ${infantFare}

                            <li class="mb15 flex space-between gray">
                                <div>
                                    Thuế & phí sân bay
                                    <span>
                                        <svg class="icon-svg color-blue min">
                                            <use xlink:href="../images/icons/icon.svg#info"></use>
                                        </svg>
                                    </span>
                                </div>
                                <div>${taxAndFee}</div>
                            </li>
                            <li class="mb15 flex space-between gray">
                                <div>Phí dịch vụ</div>
                                <div>${serviceFee}</div>
                            </li>
                        </ul>
                        <div class="line-bottom mb16"></div>
                        <div class="mb30 flex space-between">
                            <div class="gray"><strong>Tổng giá</strong></div>
                            <div>
                                <strong>
                                    ${totalPrice}
                                </strong>
                            </div>
                        </div>
                        <div class="mb16 txt_16">
                            <strong>Thông tin khác</strong>
                        </div>
                        <ul class="service pl-3">
                            <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#hanh-ly"></use>
                                </svg>
                                Hành lý xách tay: ${listFlight.ListSegment[0].HandBaggage}.
                            </li>
                           ${allowanceBaggage}
                            <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#ticket"></use>
                                </svg>
                                Đổi vé mất phí + chênh lệch nếu có.
                            </li>
                            <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#hanh-ly"></use>
                                </svg>
                                Hoàn bảo lưu tiền vé tối đa 180 ngày và tính phí
                                theo chính sách hãng, thời hạn 24h so với giờ khởi
                                hành.
                            </li>
                            <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#ticket2"></use>
                                </svg>
                                Không đổi vé
                            </li>                       
                            <li>
                                <svg class="icon-svg">
                                    <use xlink:href="../images/icons/icon.svg#ticket2"></use>
                                </svg>
                                Không hoàn vé
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    }
}

function addOrRemoveValueInFilterFare(keyFilter, keyValue) {
    if (filterFare[keyFilter].indexOf(keyValue) == -1) {
        filterFare[keyFilter].push(keyValue);
    } else {
        filterFare[keyFilter] = filterFare[keyFilter].filter(function (item) {
            return item != keyValue;
        });
    }
}

function applyFilterFare(isFiltering) {
    $('.pagination').html('');

    listAllFilter = filterListFare(listSearchAll);

    // update flight number 
    if (!isChooseGoDone) {
        //$('.qty-flight-go').html(listAllFilter.length + listMinFilter.length);
        $('.qty-flight-go').html(listAllFilter.length);
    }
    else
        $('.qty-flight-arrival').html(listAllFilter.length);

    // show hide slider date
    if (listSearchAll.length == 0) {
        $("#slide-date").hide();
        $(".filter-time-date").hide();
    }
    else {
        $("#slide-date").show();
        $(".filter-time-date").show();
    }

    $("#flight-list-wrapper").removeClass("d-none");
    $("#skeleton-flight-list-wrapper").hide();
    if (isFiltering && activeSort != null) {
        if (sortByProp == "airline")
            airlineFilter(activeSort)
        else
            sortFareByProp(sortByProp, activeSort);
    }
    else {
        // render items result filter all fare
        arrPagination = UTILS.sliceIntoChunksArray(listAllFilter, CONSTANTS.PAGE_SIZE);
        // render items result filter flight fare
        renderHtmlFares(arrPagination.length > 0 ? arrPagination[0] : [], 'listAll', '.list-flight-information-all');
        // reset current page
        pageAllFareCurrent = 1;
    }
};

function filterListFare(listFare) {
    //UTILS.showLoading();
    var result = listFare;
    if (result.length) {
        result = result.filter(function (fare) {
            return fare.AdavigoPriceAdt.amount >= filterFare.minValue && fare.AdavigoPriceAdt.amount <= filterFare.maxValue
        });
    }
    if (result.length && filterFare.airlineCompany.length) {
        // if filter pacific
        if (filterFare.airlineCompany.indexOf(CONSTANTS.PACIFIC_AIRLINE.value) != -1) {
            if (filterFare.airlineCompany.length == 1) {
                result = result.filter(function (fare) {
                    return fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating
                });
            }
            else {
                var listOtherAirline = [];
                var listPacific = [];
                listOtherAirline = result.filter(function (fare) {
                    return filterFare.airlineCompany.indexOf(fare.Airline) != -1 && fare.ListFlight[0].Operating != CONSTANTS.PACIFIC_AIRLINE.operating
                });

                listPacific = result.filter(function (fare) {
                    return fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating
                });

                result = [...listOtherAirline, ...listPacific]
            }
        }
        else {
            if (filterFare.airlineCompany.indexOf(CONSTANTS.VIETNAM_AIRLINE.code) != -1) {
                var listVN = [];
                var listOther = [];
                listVN = result.filter(function (fare) {
                    return fare.Airline == CONSTANTS.VIETNAM_AIRLINE.code && fare.ListFlight[0].Operating != CONSTANTS.PACIFIC_AIRLINE.operating
                });

                listOther = result.filter(function (fare) {
                    return filterFare.airlineCompany.indexOf(fare.Airline) != -1 && fare.Airline != CONSTANTS.VIETNAM_AIRLINE.code
                });

                result = [...listVN, ...listOther]
            }
            else {
                result = result.filter(function (fare) {
                    return filterFare.airlineCompany.indexOf(fare.Airline) != -1
                });
            }
        }
    }
    if (result.length && filterFare.stopNum.length) {
        result = result.filter(function (fare) {
            return filterFare.stopNum.indexOf(String(fare.ListFlight[0].StopNum)) != -1
        });
    }
    if (result.length && filterFare.ticketClass.length) {
        result = result.filter(function (fare) {
            return filterFare.ticketClass.indexOf(UTILS.groupClassFare(fare.ListFlight[0].GroupClass)) != -1
        });
    }
    if (result.length && filterFare.takeOffTime.length) {
        result = result.filter(function (fare) {
            return filterFare.takeOffTime.indexOf(TIME_UTILS.takeOffTime(fare.ListFlight[0].StartDate)) != -1
        });
    }
    return result;
}

function getAndSetMaxPrice(listFare) {
    var max = listFare[0]?.AdavigoPriceAdt?.amount || 0;
    listFare.forEach(function (fare, index) {
        if (max < fare.AdavigoPriceAdt?.amount) {
            max = fare.AdavigoPriceAdt?.amount;
        }
    });

    var rangeSlider = document.getElementById('slider-range');
    var maxFareFilter = (JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search)) || {}).filterFare?.maxValue;
    if (isLoadFirst && maxFareFilter) {
        filterFare.maxValue = max;
        rangeSlider.noUiSlider.updateOptions({
            start: [0, max],
            range: {
                'min': [0],
                'max': [max]
            }
        });
        rangeSlider.noUiSlider.set([0, max]);
    } else {
        filterFare.maxValue = max;
        rangeSlider.noUiSlider.updateOptions({
            start: [0, max],
            range: {
                'min': [0],
                'max': [max]
            }
        });
        rangeSlider.noUiSlider.set([0, max]);
    }
}

function getAndSetMinPrice(listFare) {
    var min = listFare[0]?.TotalPrice || 0;
    listFare.forEach(function (fare) {
        if (min > fare.TotalPrice) {
            min = fare.TotalPrice;
        }
    });
    filterFare.minValue = min;
    cheapestFare = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min);
}

function getAndSetCheckboxsAirline(listFare) {
    var airlines = '';
    listFare.forEach(function (fare) {
        var logo = fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.path : fare?.AirlineObj?.logo;
        var name = fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.name : fare?.AirlineObj?.nameVi;
        var value = fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating ? CONSTANTS.PACIFIC_AIRLINE.value : fare.Airline;
        var checked = "";
        if (fare.Airline == CONSTANTS.VIETNAM_AIRLINE.code) {
            if (fare.ListFlight[0].Operating != CONSTANTS.PACIFIC_AIRLINE.operating) {
                checked = filterFare.airlineCompany.indexOf(fare.Airline) != -1 ? 'checked' : ''
            }
            else {
                checked = filterFare.airlineCompany.indexOf(CONSTANTS.PACIFIC_AIRLINE.value) != -1 ? 'checked' : ''
            }
        }
        else {
            checked = filterFare.airlineCompany.indexOf(fare.Airline) != -1 ? 'checked' : ''
        }
        airlines +=
            `<label class="confir_res confir_res_inlineGoi">
                <div class="slogan">
                    <img src="${logo}" alt="logo" />
                    <span>${name}</span>
                </div>
                <input
                    type="checkbox"
                    name="checkboxAirline"
                    id="${value}"
                    value="${value}"
                    ${checked}
                />
                <span class="checkmark"></span>
            </label>`
    });
    $('.checkboxs-airline').html(airlines);

    //$("#skeleton-filter-wrapper").hide();
    //$("#filter-wrapper").removeClass("d-none");
    $("#filter-wrapper").removeClass("disabled-child");
}

function renderHtmlFares(listFare, listType, classParent, listAll) {
    if (listFare?.length) {
        var htmlListFare = '';
        listFare.forEach(function (fare, index) {
            // bỏ ràng chuyến bay có nhìu điểm dừng
            //if (fare && fare?.ListFlight?.[0]?.StopNum == 0)
            htmlListFare += renderItemFare(fare, listType == 'listAll' ? 2000 + index : index, listType);
        });
        $(classParent).html(htmlListFare);
        $(classParent).show();

    } else {
        $(classParent).html(UTILS.get404Box());
    }
}

function removeFilter() {
    filterFare = {
        ...filterFare,
        takeOffTime: [],
        airlineCompany: [],
        ticketClass: [],
        stopNum: [],
    };
    [...$('.session-list a.item')].forEach(function (item) {
        $(item).removeClass('active');
    });
    [...$('input[name="checkboxAirline"')]
        .concat([...$('input[name="inlineGoi3"')])
        .concat([...$('input[name="inlineGoi2"')])
        .forEach(function (item) {
            $(item).prop('checked', false);
        });

    // set max price
    getAndSetMaxPrice(listSearchAll);

}

function actionAfterGetDataFromApi(leg, isRenderDateRange) {
    getAndSetMaxPrice(listSearchAll);
    applyFilterFare(false);
    if (isRenderDateRange)
        renderHtmlRangeDateChosen(leg)
}

function filterListMinFareFromListSearchAll(listFare) {
    var groupByAirline = UTILS.groupBy(listFare, "Airline");
    var listMin = [];
    if (groupByAirline.length > 0) {
        for (var g of groupByAirline) {
            var sort = UTILS.sortByKeyAsc(g, "TotalPrice");
            // filter VN not Pacific
            if (g[0].Airline == CONSTANTS.VIETNAM_AIRLINE.code) {
                var vnList = g.filter(function (fare) {
                    return fare.ListFlight[0].Operating != CONSTANTS.PACIFIC_AIRLINE.operating;
                });

                vnList = UTILS.sortByKeyAsc(vnList, "TotalPrice");
                if (vnList.length > 0)
                    listMin.push(vnList[0]);

                var pacificList = g.filter(function (fare) {
                    return fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating;
                });

                pacificList = UTILS.sortByKeyAsc(pacificList, "TotalPrice");
                if (pacificList.length > 0)
                    listMin.push(pacificList[0]);
            }
            else
                listMin.push(sort[0]);
        }
    }

    listSearchMinFare = listMin;
    listSearchMinFareOrigin = listMin;

    getAndSetCheckboxsAirline(listSearchMinFare);
}

function searchFlightOneWay(date) {
    renderHtmlRangeDateChosen(0)
    var searchObj = getSearchObj();
    $.when(
        flightServices.getAllListSearchFareOneWay(codeAddressGoChosen, codeAddressArrivalChosen, date, searchObj)
    ).done(function (dataAllFareOneWay) {
        if (dataAllFareOneWay.ListFareData && dataAllFareOneWay.ListFareData.length > 0) {
            console.log(dataAllFareOneWay.ListFareData)
            $.when(
                flightServices.getAdavigoPrices(dataAllFareOneWay.ListFareData),
                flightServices.getAdavigoAdtPrices(dataAllFareOneWay.ListFareData),
                flightServices.getCommonGroupClass(dataAllFareOneWay.ListFareData),
                flightServices.getCommonAirlines(dataAllFareOneWay.ListFareData),
            ).done(function (prices, adtPrices, groupCLass, airlines) {
                if (prices.length > 0) {
                    for (var i in prices) {
                        dataAllFareOneWay.ListFareData[i].AdavigoPrice = prices[i].AdavigoPrice;
                        dataAllFareOneWay.ListFareData[i].AdavigoPriceAdt = prices[i].AdavigoPriceAdt;
                    }
                }

                if (adtPrices.length > 0) {
                    for (var adt in adtPrices) {
                        dataAllFareOneWay.ListFareData[adt].AdavigoPriceAdt = adtPrices[adt].AdavigoPriceAdt;
                    }
                }

                if (airlines.length > 0) {
                    for (var a in airlines) {
                        dataAllFareOneWay.ListFareData[a].AirlineObj = airlines[a].AirlineObj;
                    }
                }

                if (groupCLass.length > 0) {
                    for (var g in groupCLass) {
                        dataAllFareOneWay.ListFareData[g].ListFlight[0].GroupClassObj = groupCLass[g].ListFlight[0].GroupClassObj;
                    }
                }

                dataAllFareOneWay.ListFareData = sortFlightByAdultPrice(dataAllFareOneWay.ListFareData)
                actionAfterSearchOneWay(dataAllFareOneWay.ListFareData, dataAllFareOneWay.Session);
            }).fail(function (err) {
                console.log(err)
            });
        }
        else {
            actionAfterSearchOneWay(dataAllFareOneWay.ListFareData, dataAllFareOneWay.Session);
        }
    }).fail(function (err) {
        console.log(err)
    });
}

// sort by adult price
function sortFlightByAdultPrice(array) {
    return array.sort(function (a, b) {
        return a.AdavigoPriceAdt.amount - b.AdavigoPriceAdt.amount;
    });
}

function actionAfterSearchOneWay(list, session) {
    listSearchAll = list || [];
    arrPagination = UTILS.sliceIntoChunksArray(listSearchAll, CONSTANTS.PAGE_SIZE);
    filterListMinFareFromListSearchAll(listSearchAll);

    Session = session || '';
    actionAfterGetDataFromApi(0, false);
}

function searchMinFare(date) {
    $.when(
        flightServices.getListSearchMinFare(codeAddressGoChosen, codeAddressArrivalChosen, date)
    ).done(function (res) {
        console.log(res)
    }).fail(function (err) {
        console.log(err)
    });
}

// filter back flight from result
function getBackFlightFromSearchFlightTwoWay(Leg) {
    listSearchAll = listSearchAllTwoWay.filter(function (item) {
        return item.Leg == Leg
    });
    arrPagination = UTILS.sliceIntoChunksArray(listSearchAll, CONSTANTS.PAGE_SIZE);
    filterListMinFareFromListSearchAll(listSearchAll);

    actionAfterGetDataFromApi(Leg, true);
}

function searchFlightTwoWay(departDateGo, departDateArrival, leg) {
    renderHtmlRangeDateChosen(leg)
    var searchObj = getSearchObj();
    $.when(
        flightServices.getAllListSearchFareTwoWay(codeAddressGoChosen, codeAddressArrivalChosen, departDateGo, codeAddressArrivalChosen, codeAddressGoChosen, departDateArrival, searchObj)
    ).done(function (dataAllFareTwoWay) {
        if (dataAllFareTwoWay.ListFareData && dataAllFareTwoWay.ListFareData.length > 0) {
            $.when(
                flightServices.getAdavigoPrices(dataAllFareTwoWay.ListFareData),
                flightServices.getAdavigoAdtPrices(dataAllFareTwoWay.ListFareData),
                flightServices.getCommonGroupClass(dataAllFareTwoWay.ListFareData),
                flightServices.getCommonAirlines(dataAllFareTwoWay.ListFareData),
            ).done(function (prices, adtPrices, groupCLass, airlines) {
                if (prices.length > 0) {
                    for (var i in prices) {
                        dataAllFareTwoWay.ListFareData[i].AdavigoPrice = prices[i].AdavigoPrice;
                        dataAllFareTwoWay.ListFareData[i].AdavigoPriceAdt = prices[i].AdavigoPriceAdt;
                    }
                }

                if (adtPrices.length > 0) {
                    for (var adt in adtPrices) {
                        dataAllFareTwoWay.ListFareData[adt].AdavigoPriceAdt = adtPrices[adt].AdavigoPriceAdt;
                    }
                }

                if (airlines.length > 0) {
                    for (var a in airlines) {
                        dataAllFareTwoWay.ListFareData[a].AirlineObj = airlines[a].AirlineObj;
                    }
                }

                if (groupCLass.length > 0) {
                    for (var g in groupCLass) {
                        dataAllFareTwoWay.ListFareData[g].ListFlight[0].GroupClassObj = groupCLass[g].ListFlight[0].GroupClassObj;
                    }
                }

                // sort by price of 1 adult
                dataAllFareTwoWay.ListFareData = sortFlightByAdultPrice(dataAllFareTwoWay.ListFareData)
                actionAfterSearchTwoWay(dataAllFareTwoWay.ListFareData, dataAllFareTwoWay.Session, leg);
            });
        }
        else {
            actionAfterSearchTwoWay(dataAllFareTwoWay.ListFareData, dataAllFareTwoWay.Session, leg);
        }
    }).fail(function (err) {
        console.log(err)
    });
}

function actionAfterSearchTwoWay(list, session, leg) {
    listSearchAllTwoWay = list || [];
    listSearchAll = listSearchAllTwoWay.filter(function (item) {
        return item.Leg == leg
    });
    arrPagination = UTILS.sliceIntoChunksArray(listSearchAll, CONSTANTS.PAGE_SIZE);
    filterListMinFareFromListSearchAll(listSearchAll);

    Session = session || '';
    actionAfterGetDataFromApi(leg, false);
}

// default when load page
$(document).ready(function () {
    debugger;
    $("#filterPriceByList").hide();
    sessionStorage.setItem(CONSTANTS.STORAGE.Path, window.location.pathname);

    $("#nav-flight-list").addClass("active");
    $("#menu-flight").addClass("active");
    // remove countdown
    sessionStorage.removeItem(CONSTANTS.STORAGE.COUNTER_KEY);
    isLoadFirst = true;
    var listHtmlAddress = '';
    var dataChosen = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search)) || {};

    if (dataChosen?.filterFare) {
        filterFare = dataChosen.filterFare;
    }

    // start date
    var dateStartChosen;
    var dateStartChosenString = "";
    if (dataChosen?.search?.StartDate) {
        dateStartChosenString = dataChosen.search.StartDate.split('/').reverse().join('-');
        dateStartChosen = new Date(dateStartChosenString);
        pickerSingle.setDate(dateStartChosen);
        $('.string-date-go-chosen').html(TIME_UTILS.nameDay(new Date(dataChosen.search.StartDate.split('/').reverse().join('-'))));
    } else {
        var defaultStartValue = `${String(moment(nowDate).month() >= 9 ? moment(nowDate).month() + 1 : '0' + (moment(nowDate).month() + 1)) + '/' +
            String(moment(nowDate).date() >= 10 ? moment(nowDate).date() : '0' + moment(nowDate).date()) + '/' +
            String(moment(nowDate).year())
            }`;

        pickerSingle.setDate(moment(defaultStartValue))
    }

    // end date
    var dateEndChosenString = "";
    var dateEndChosen;
    if (dataChosen?.search?.EndDate) {
        isTwoWayFare = true;
        $("#switch-two-way").prop('checked', true);
        dateEndChosenString = dataChosen.search.EndDate.split('/').reverse().join('-');
        dateEndChosen = moment(dateEndChosenString);
        picker.setDateRange(dateStartChosen, dateEndChosen);
        // hide lable
        $("#date-end-value").addClass("d-none");
        // show range picker
        $("#litepicker-date-start").removeClass("d-none");
        $("#litepicker-date-end").removeClass("d-none");
        // hide single datepicker
        $("#litepicker-date-start-single").addClass("d-none");
        $('.string-date-back-chosen').html(TIME_UTILS.nameDay(new Date(dataChosen.search.EndDate.split('/').reverse().join('-'))));
    } else {
        UTILS.setEndDate(CONSTANTS.TEXT.noEndDate);
        $('.string-date-back-chosen').html(TIME_UTILS.nameDay(new Date()));
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

    if (dataChosen?.filterFare?.stopNum?.length) {
        for (var i = 0; i < dataChosen.filterFare.stopNum.length; i++) {
            $(`input[name="inlineGoi3"][data-value="${dataChosen.filterFare.stopNum[i]}"]`).prop('checked', true);
        }
    }

    if (dataChosen?.filterFare?.takeOffTime?.length) {
        for (var i = 0; i < dataChosen.filterFare.takeOffTime.length; i++) {
            $(`.session-list .item[data-value="${dataChosen.filterFare.takeOffTime[i]}"]`).addClass('active');
        }
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

        $("#select-go").val(itemGoInListAddress.id.toString()).trigger("change");
        $(".select-go-code").text(itemGoInListAddress.code)
        $(".select-go-name").text(itemGoInListAddress.name)
        nameAddressGoChosen = itemGoInListAddress.name;

        // line 1
        $('.name-go-1, .name-arrival-2').html(itemGoInListAddress.name + ' (' + itemGoInListAddress.code + ')');

    }
    else {
        var itemGoInListAddress = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == codeAddressGoChosen;
        })[0];

        $("#select-go").val(itemGoInListAddress.id.toString()).trigger("change");
        $(".select-go-code").text(codeAddressGoChosen)
        $(".select-go-name").text(nameAddressGoChosen)
    }

    if (dataChosen?.search?.EndPoint) {
        codeAddressArrivalChosen = dataChosen.search.EndPoint;
        var itemArrivalInListAddress = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == codeAddressArrivalChosen;
        })[0];

        $("#select-arrival").val(itemArrivalInListAddress.id.toString()).trigger("change");
        $(".select-arrival-code").text(itemArrivalInListAddress.code);
        $(".select-arrival-name").text(itemArrivalInListAddress.name);
        nameAddressArrivalChosen = itemArrivalInListAddress.name;

        // line 2
        $('.name-go-2, .name-arrival-1').html(itemArrivalInListAddress.name + ' (' + itemArrivalInListAddress.code + ')');
    }
    else {
        var itemArrivalInListAddress = CONSTANTS.FLIGHTS.PLACES.filter(function (item) {
            return item.code == codeAddressArrivalChosen;
        })[0];

        $("#select-arrival").val(itemArrivalInListAddress.id.toString()).trigger("change");
        $(".select-arrival-code").text(codeAddressArrivalChosen);
        $(".select-arrival-name").text(nameAddressArrivalChosen);
    }

    $('.qty-customer').html(
        (dataChosen?.search?.Adt ? Number(dataChosen.search.Adt) : 1) +
        (dataChosen?.search?.Child ? Number(dataChosen.search.Child) : 0) +
        (dataChosen?.search?.Baby ? Number(dataChosen.search.Baby) : 0)
    )

    if (isTwoWayFare) {
        $("#trip-info-choose-go-inprogress-label").text("Đang chọn chiều đi");
        $("#flight-go-lbl").removeClass("d-none");
    } else {
        $("#trip-info-choose-go-inprogress-label").text("Đang chọn chuyến bay");
        $("#flight-go-lbl").addClass("d-none");
    }

    // have search start date
    if (dateStartChosenString) {
        // if have end date
        if (dateEndChosenString)
            searchFlightTwoWay(dateStartChosenString.split('-').reverse().join(''), dateEndChosenString.split('-').reverse().join(''), 0);
        else
            searchFlightOneWay(dateStartChosenString.split('-').reverse().join(''));
    }
    else//default
        searchFlightOneWay(TIME_UTILS.formatDay(new Date()).split('-').reverse().join(''));
    UTILS.RenderSearch()
});

function getSearchObj() {
    return {
        StartPoint: codeAddressGoChosen,
        EndPoint: codeAddressArrivalChosen,
        StartDate: $('#date-start').val(),
        EndDate: $('#date-end').val(),
        Adt: Number($('#qty_input_adt').val()),
        Child: Number($('#qty_input_chil').val()),
        Baby: Number($('#qty_input_baby').val()),
    }
}

// Click to choose fare
$("body").on("click", ".btn-choose-this-fare", function (e) {
    var fareDataId = Number($(this).attr('data-fareId'));
    var typeList = $(this).attr('data-type');
    $('.pagination').html('');
    e.preventDefault();

    // find choose fare in list
    //var findInListMinFare = UTILS.findByProp("FareDataId", fareDataId, listSearchMinFare);
    var findInListAll = UTILS.findByProp("FareDataId", fareDataId, listAllFilter);

    if (isEdit) {
        isEdit = false;
        isChooseGoDone = false;
    }

    if (!isChooseGoDone && isTwoWayFare && $('#slide-date .swiper-slide.item').eq(0).attr('data-dayend')) {
        isChooseGoDone = true;

        $('.trip-info-choose-go-inprogress').addClass('d-none');
        $('.trip-info-choose-go-done').removeClass('d-none');
        $('.trip-info-return, .line-bottom-return').removeClass('d-none');
        $('.time-go-chosen').html($(this).closest('.item').find('.time-flight.start').html());
        $('.time-arrival-chosen').html($(this).closest('.item').find('.time-flight.end').html());
        $('.duration-fly').html($(this).closest('.item').find('.duration-fly-item').html());

        // Get data fly go chosen
        //dataSubmit.go = typeList == 'listMin' ? findInListMinFare : findInListAll;
        dataSubmit.go = findInListAll;
        dataSubmit.extraInfo = {
            DurationFlyGo: $(this).closest('.item').find('.duration-fly-item strong').html(),
            FirstTimeGo: $(this).closest('.item').find('.time-flight.start').html(),
            LastTimeGo: $(this).closest('.item').find('.time-flight.end').html(),
            FirstDateGo: $(this).closest('.item').find('.time-flight.start-add').html(),
            LastDateGo: $(this).closest('.item').find('.time-flight.start-end').html(),
        }
        $('.trip-info-choose-go-done .code.airplane-flynumber').html($(this).closest('.item').find('.code-flight').html());
        $('.trip-info-choose-go-done .hang.airplane-hang').html($(this).closest('.item').find('.hang').html());
        $('.trip-info-choose-go-done').removeClass('d-none');
        $('.address-go-code').html(codeAddressGoChosen);
        $('.address-arrival-code').html(codeAddressArrivalChosen);

        // chú ý chỗ này
        //removeFilter();
        /*searchFlightTwoWay(dateSearchStart, dateSearchEnd, 1);*/
        getBackFlightFromSearchFlightTwoWay(1);
    } else {
        // clear all session
        sessionStorage.clear();

        var startDate = "";
        var endDate = "";
        if (isTwoWayFare) {
            startDate = $("#litepicker-date-start").val();
            endDate = $("#litepicker-date-end").val();
        }
        else {
            startDate = $("#litepicker-date-start-single").val();
        }

        dataSubmit.search = {
            StartPoint: codeAddressGoChosen,
            EndPoint: codeAddressArrivalChosen,
            StartDate: dateStartSlideSearch ? dateStartSlideSearch : startDate,
            EndDate: dateEndSlideSearch ? dateEndSlideSearch : endDate,
            Adt: Number($('#qty_input_adt').val()),
            Child: Number($('#qty_input_chil').val()),
            Baby: Number($('#qty_input_baby').val()),
        };

        dataSubmit[!isTwoWayFare ? 'go' : 'back'] = typeList == 'listMin' ? findInListMinFare : findInListAll;
        dataSubmit.Session = Session;
        dataSubmit.isTwoWayFare = isTwoWayFare;
        dataSubmit.extraInfo = {
            ...dataSubmit.extraInfo,
            EndPointName: CONSTANTS.FLIGHTS.PLACES.filter(function (item) { return item.code == codeAddressArrivalChosen })[0].name,
            StartPointName: CONSTANTS.FLIGHTS.PLACES.filter(function (item) { return item.code == codeAddressGoChosen })[0].name,
            StringDateGoChoosen: $('.string-date-go-chosen').html(),
            StringDateBackChoosen: $('.string-date-back-chosen').html(),
        }

        if (!isTwoWayFare) {
            dataSubmit.extraInfo = {
                ...dataSubmit.extraInfo,
                DurationFlyGo: $(this).closest('.item').find('.duration-fly-item strong').html(),
                FirstTimeGo: $(this).closest('.item').find('.time-flight.start').html(),
                LastTimeGo: $(this).closest('.item').find('.time-flight.end').html(),
                FirstDateGo: $(this).closest('.item').find('.time-flight.start-add').html(),
                LastDateGo: $(this).closest('.item').find('.time-flight.start-end').html(),
            };
        } else {
            dataSubmit.extraInfo = {
                ...dataSubmit.extraInfo,
                DurationFlyBack: $(this).closest('.item').find('.duration-fly-item strong').html(),
                FirstTimeBack: $(this).closest('.item').find('.time-flight.start').html(),
                LastTimeBack: $(this).closest('.item').find('.time-flight.end').html(),
                FirstDateBack: $(this).closest('.item').find('.time-flight.start-add').html(),
                LastDateBack: $(this).closest('.item').find('.time-flight.start-end').html(),
            };
        }

        dataSubmit.filterFare = filterFare;
        sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(dataSubmit));

        // data for verify flight
        var ListFareData = [
            {
                "Session": dataSubmit.Session,
                "FareDataId": dataSubmit.go.FareDataId,
                "ListFlight": [
                    {
                        "FlightValue": dataSubmit.go.ListFlight[0].FlightValue,
                        "Leg": 0
                    }
                ]
            },
        ];

        if (dataSubmit.isTwoWayFare) {
            ListFareData.push(
                {
                    "Session": dataSubmit.Session,
                    "FareDataId": dataSubmit.back.FareDataId,
                    "ListFlight": [
                        {
                            "FlightValue": dataSubmit.back.ListFlight[0].FlightValue,
                            "Leg": 1
                        }
                    ]
                }
            );
        }

        // save list fare data to verify flight
        sessionStorage.setItem(CONSTANTS.STORAGE.ListFareData, JSON.stringify(ListFareData));
        location.href = CONSTANTS.FLIGHTS.MVC.customerInfo;
    }
});

function addSkeletonLoading() {
    $("#skeleton-slide-date").show();
    $("#slide-date").addClass("opacity-zero");
    $("#flight-list-wrapper").addClass("d-none");
    $("#skeleton-flight-list-wrapper").show();
    $("#filter-wrapper").addClass("disabled-child");
}

// Click button Search Fare
$('.btn-search').on('click', function () {
    if (!$("#error-number-passenger").hasClass("has-error")) {
        addSkeletonLoading();

        // bind label route
        // line 1
        $('.name-go-1, .name-arrival-2').html(nameAddressGoChosen + ' (' + codeAddressGoChosen + ')');
        // line 2
        $('.name-go-2, .name-arrival-1').html(nameAddressArrivalChosen + ' (' + codeAddressArrivalChosen + ')');
        // line address
        $('.address-go-name').html(nameAddressGoChosen);
        $('.address-arrival-name').html(nameAddressArrivalChosen);

        // remove countdown
        sessionStorage.removeItem(CONSTANTS.STORAGE.COUNTER_KEY)
        isClickSearch = true;

        var dateSearchStart = isTwoWayFare ? $('#litepicker-date-start').val().split('/').join('') : $('#litepicker-date-start-single').val().split('/').join('');
        var dateSearchEnd = $('#litepicker-date-end').val().split('/').join('');

        var dateSearchStartStringChosen = isTwoWayFare ? $('#litepicker-date-start').val().split('/').reverse().join('-') : $('#litepicker-date-start-single').val().split('/').reverse().join('-');
        var dateSearchEndStringChosen = $('#litepicker-date-end').val().split('/').reverse().join('-') || new Date();

        $('.pagination').html('');
        $('.string-date-go-chosen').html(TIME_UTILS.nameDay(new Date(dateSearchStartStringChosen)));
        $('.string-date-back-chosen').html(TIME_UTILS.nameDay(new Date(dateSearchEndStringChosen)));

        removeFilter();

        // reset ticket when click search btn
        $('.trip-info.trip-info-return, .line-bottom.line-bottom-return').addClass('d-none');
        $(".trip-info-choose-go-inprogress").removeClass("d-none");
        $(".trip-info-choose-go-done").addClass("d-none");
        isChooseGoDone = false;

        // get all list fare
        if (isTwoWayFare) {
            searchFlightTwoWay(dateSearchStart, dateSearchEnd, 0);
            $("#trip-info-choose-go-inprogress-label").text("Đang chọn chiều đi");
            $("#flight-go-lbl").removeClass("d-none");
        } else {
            searchFlightOneWay(dateSearchStart);
            $("#trip-info-choose-go-inprogress-label").text("Đang chọn chuyến bay");
            $("#flight-go-lbl").addClass("d-none");
        }

        // bind checkbox search
        setTimeout(function () {
            var elTicketClass = $(".check-list_item.active");
            for (var i = 0; i < elTicketClass.length; i++) {
                $(`input[name="inlineGoi2"][value="${$(elTicketClass[i]).attr('data-value')}"]`).prop('checked', true);
                addOrRemoveValueInFilterFare('ticketClass', $(elTicketClass[i]).attr('data-value'));
            }
        }, 200);

        var startDate = "";
        var endDate = "";
        if (isTwoWayFare) {
            startDate = $("#litepicker-date-start").val();
            endDate = $("#litepicker-date-end").val();
        }
        else {
            startDate = $("#litepicker-date-start-single").val();
        }

        // save search obj to session
        var searchObj = {
            StartPoint: codeAddressGoChosen,
            EndPoint: codeAddressArrivalChosen,
            StartDate: startDate,
            EndDate: endDate,
            Adt: Number($('#qty_input_adt').val()),
            Child: Number($('#qty_input_chil').val()),
            Baby: Number($('#qty_input_baby').val()),
        };

        var searchSession = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
        if (searchSession) {
            searchSession = {
                ...searchSession,
                search: searchObj
            }
        }
        else {
            searchSession = {
                search: searchObj
            }
        }

        // save search history
        UTILS.handleSearchHistory(searchSession);

        sessionStorage.setItem(CONSTANTS.STORAGE.Search, JSON.stringify(searchSession));
    }
});

// Click button pafination to go to page
$("body").on("click", ".page-item", function () {
    var isGoToPage = false;
    if ($(this).hasClass('prev-page') && pageAllFareCurrent > 1) {
        pageAllFareCurrent = pageAllFareCurrent - 1;
        isGoToPage = true;
    }
    if ($(this).hasClass('next-page') && pageAllFareCurrent < arrPagination.length) {
        pageAllFareCurrent = pageAllFareCurrent + 1;
        isGoToPage = true;
    }
    if ($(this).hasClass('page-number')) {
        pageAllFareCurrent = $(this).data('page');
        isGoToPage = true;
    }
    $('.page-item').removeClass('active');
    $('.page-item').eq(pageAllFareCurrent).addClass('active');
    if (isGoToPage) {
        renderHtmlFares(arrPagination[pageAllFareCurrent - 1], 'listAll', '.list-flight-information-all');
        // scroll top
        $('html, body').animate({
            scrollTop: $(".list-flight-information-all").offset().top - 100
        });
    }
});

// Click to Edit Fare go chosen
$('.edit-go-chosen').on('click', function (e) {
    e.preventDefault();
    isEdit = true;
    isChooseGoDone = false;
    // re filter leg 0
    listSearchAll = listSearchAllTwoWay.filter(function (item) {
        return item.Leg == 0
    });
    arrPagination = UTILS.sliceIntoChunksArray(listSearchAll, CONSTANTS.PAGE_SIZE);
    filterListMinFareFromListSearchAll(listSearchAll);
    actionAfterGetDataFromApi(0, true);
    $('.trip-info-return, .line-bottom-return, .trip-info-choose-go-done').addClass('d-none');
    $('.trip-info-choose-go-inprogress').removeClass('d-none');
    $('#slide-date .swiper-slide.item.active').click();
});

// change datepicker "Ngày đi"
$('#date-start').on('change', function () {
    var day = $(this).val().split('/').reverse().join('-'); // 2022-09-30
    $('.string-date-go-chosen').html(TIME_UTILS.nameDay(new Date(day)));
});

// change datepicker "Ngày về"
$('#date-end').on('change', function () {
    var day = $(this).val().split('/').reverse().join('-'); // 2022-09-30
    $('.string-date-back-chosen').html(TIME_UTILS.nameDay(new Date(day)));
});

// Change address go
var myCollapseGo = document.getElementById('collapseGo');
$("body").on("click", '#collapseGo li', function () {
    codeAddressGoChosen = $(this).find('.address-code').html();
    nameAddressGoChosen = $(this).find('.address-name').html();
    $('.address-go-code').html(codeAddressGoChosen);
    $("#collapseGo-link .address-go-name").html(nameAddressGoChosen);
    var bsCollapse = new bootstrap.Collapse(myCollapseGo, {
        show: false
    })
});

// Change address arrival
var myCollapseArrival = document.getElementById('collapseArrival')
$("body").on("click", '#collapseArrival li', function () {
    codeAddressArrivalChosen = $(this).find('.address-code').html();
    nameAddressArrivalChosen = $(this).find('.address-name').html();
    $('.address-arrival-code').html(codeAddressArrivalChosen);
    $("#collapseArrival-link .address-arrival-name").html(nameAddressArrivalChosen);
    var bsCollapse = new bootstrap.Collapse(myCollapseArrival, {
        show: false
    })
});

var dateStartSlide = "";
var dateEndSlide = "";
var dateStartSlideSearch = "";
var dateEndSlideSearch = "";
// Click slider date range item
$('#slide-date .swiper-slide.item').on('click', function () {
    //addSkeletonLoading();
    $("#flight-list-wrapper").addClass("d-none");
    $("#skeleton-flight-list-wrapper").show();
    $("#filter-wrapper").addClass("disabled-child");

    isClickItemSlideRangeDate = true;
    isClickSearch = false;
    // reset ticket when click search btn
    $('.trip-info.trip-info-return, .line-bottom.line-bottom-return').addClass('d-none');
    $(".trip-info-choose-go-inprogress").removeClass("d-none");
    $(".trip-info-choose-go-done").addClass("d-none");
    isChooseGoDone = false;


    $('#slide-date .swiper-slide.item').removeClass('active');
    $(this).addClass('active');
    dateStartSlide = $(this).attr('data-day').split('-').reverse().join('');
    dateStartSlideSearch = $(this).attr('data-day').split('-').reverse().join('/');
    $('.string-date-go-chosen').html(TIME_UTILS.nameDay(new Date($(this).attr('data-day'))));

    // get all list fare
    if (isTwoWayFare && $(this).attr('data-dayend')) {
        dateEndSlide = $(this).attr('data-dayend').split('-').reverse().join('');
        dateEndSlideSearch = $(this).attr('data-dayend').split('-').reverse().join('/');

        $('.string-date-back-chosen').html(TIME_UTILS.nameDay(new Date($(this).attr('data-dayend'))));
        searchFlightTwoWay(dateStartSlide, dateEndSlide, 0);
    } else {
        searchFlightOneWay(dateStartSlide);
    }
})

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
});

// Bộ lọc: Chọn "Thời gian cất cánh"
$('.session-list a.item').on('click', function () {
    $(this).toggleClass('active');
    addOrRemoveValueInFilterFare('takeOffTime', $(this).data('value'));
    applyFilterFare(true);
});

// Bộ lọc: Chọn "Hãng bay"
$("body").on("click", 'input[name="checkboxAirline"]', function () {
    addOrRemoveValueInFilterFare('airlineCompany', $(this).val());

    applyFilterFare(true);
});

// Bộ lọc: Chọn "Điểm dừng"
$('input[name="inlineGoi3"]').change(function () {
    addOrRemoveValueInFilterFare('stopNum', $(this).val());
    applyFilterFare(true);
});

// Bộ lọc: Chọn "Hạng vé"
$('input[name="inlineGoi2"]').change(function () {
    addOrRemoveValueInFilterFare('ticketClass', $(this).val());
    applyFilterFare(true);
});

// Bộ lọc: Xoá bộ lọc
$('.clear-fliter').on('click', function (e) {
    e.preventDefault();
    setTimeout(function () {
        removeFilter();
        applyFilterFare();
    }, 100)
});

// Handle click on off two way
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

// collapse when click outside
$(document).click(function (event) {
    if (!$(event.target).is(".wrap-search .collapse *")) {
        $(".wrap-search .collapse").collapse("hide");
    }
});
function showStop(fareId) {
    var find;
    //var findInListMinFare = UTILS.findByProp("FareDataId", fareId, listSearchMinFare);
    //if (findInListMinFare)
    //    find = findInListMinFare;
    var findInListAll = UTILS.findByProp("FareDataId", fareId, listAllFilter);
    if (findInListAll)
        find = findInListAll;

    UTILS.showStop(find);
}

var sortByProp = "";
var activeSort = null;
$(".sort-select").click(function () {
    var thisActive = $(this).hasClass("active");
    $(".sort-select").removeClass("active");
    if (thisActive)
        $(this).removeClass("active");
    else
        $(this).addClass("active");

    var sortBy = $(this).data("sort");
    // save sort status
    sortByProp = sortBy;
    activeSort = !thisActive;
    sortFareByProp(sortBy, !thisActive);
})

$(".btn-sort-airline").click(function () {
    $(".sort-select").removeClass("active");
    $(this).toggleClass("btn-sort-airline-filtered");
    var checkFiltered = $(this).hasClass("btn-sort-airline-filtered");
    sortByProp = "airline";
    activeSort = checkFiltered;
    airlineFilter(checkFiltered)
})

// filter airline button
function airlineFilter(checkFiltered) {
    $('.pagination').html('');
    listAllFilter = filterListFare(listSearchAll);
    if (checkFiltered) {
        //fiter
        var filteredList = [];
        var vnList = listAllFilter.filter(function (fare) {
            return fare.Airline == CONSTANTS.VIETNAM_AIRLINE.code;
        });

        var otherAirlineList = listAllFilter.filter(function (fare) {
            return fare.Airline != CONSTANTS.VIETNAM_AIRLINE.code;
        });

        otherAirlineList = UTILS.sortByKeyAsc(otherAirlineList, "Airline");

        var pacificList = vnList.filter(function (fare) {
            return fare.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating;
        });

        vnList = vnList.filter(function (fare) {
            return fare.ListFlight[0].Operating != CONSTANTS.PACIFIC_AIRLINE.operating;
        });

        filteredList = [...otherAirlineList, ...vnList, ...pacificList];

        // render items result filter all fare
        filteredList = UTILS.sliceIntoChunksArray(filteredList, CONSTANTS.PAGE_SIZE);
        arrPagination = filteredList;
    }
    else {
        arrPagination = UTILS.sliceIntoChunksArray(listAllFilter, CONSTANTS.PAGE_SIZE);
    }
    renderHtmlFares(arrPagination.length > 0 ? arrPagination[0] : [], 'listAll', '.list-flight-information-all');
    //UTILS.renderPagination(arrPagination);
    // reset current page
    pageAllFareCurrent = 1;
};

// filter airline button
function sortFareByProp(prop, thisActive) {
    $('.pagination').html('');
    listAllFilter = filterListFare(listSearchAll);

    switch (prop) {
        case "start":
            listAllFilter = listAllFilter.sort(function (a, b) {
                return thisActive ? moment(a.ListFlight[0].StartDate).diff(b.ListFlight[0].StartDate) : moment(b.ListFlight[0].StartDate).diff(a.ListFlight[0].StartDate);
            });

            break;
        case "end":
            listAllFilter = listAllFilter.sort(function (a, b) {
                return thisActive ? moment(a.ListFlight[0].EndDate).diff(b.ListFlight[0].EndDate) : moment(b.ListFlight[0].EndDate).diff(a.ListFlight[0].EndDate);
            });

            break;
        case "price":
            listAllFilter = thisActive ? UTILS.sortByKeyDesc(listAllFilter, "TotalPrice") : UTILS.sortByKeyAsc(listAllFilter, "TotalPrice");
            break;
    }

    for (var item of listAllFilter) {
        console.log(item.TotalPrice)
    }
    arrPagination = UTILS.sliceIntoChunksArray(listAllFilter, CONSTANTS.PAGE_SIZE);
    console.log('arrPagination', arrPagination);
    renderHtmlFares(arrPagination.length > 0 ? arrPagination[0] : [], 'listAll', '.list-flight-information-all');
    //UTILS.renderPagination(arrPagination);
    // reset current page
    pageAllFareCurrent = 1;
};

// load more ticket fare when scroll down
function loadMoreFare(listFare, listType, classParent) {
    if (listFare?.length) {
        var htmlListFare = '';
        listFare.forEach(function (fare, index) {
            //if (fare && fare?.ListFlight?.[0]?.StopNum == 0)
            htmlListFare += renderItemFare(fare, listType == 'listAll' ? 2000 + index : index, listType);
        });
        $(classParent).append(htmlListFare);
    }
}

function loadMoreFareScroll(idTopic) {
    var hT1 = $(idTopic).offset().top,
        hH1 = $(idTopic).outerHeight(),
        wH1 = $(window).height(),
        wS1 = $(this).scrollTop();
    if (wS1 > (hT1 + hH1 - wH1)) {
        if (pageAllFareCurrent < arrPagination.length) {
            loadMoreFare(arrPagination[pageAllFareCurrent], 'listAll', '.list-flight-information-all');
            pageAllFareCurrent++;
        }
    }
}

$(window).scroll(function () {
    loadMoreFareScroll("#load-more-position")
});

// task 271
// NAN daterange when mobile (iphone)
window.onpageshow = function () {
    var path = sessionStorage.getItem(CONSTANTS.STORAGE.Path);
    if (path) {
        if (path.indexOf(CONSTANTS.FLIGHTS.MVC.customerInfo) != -1) {
            window.location.reload()
            sessionStorage.removeItem(CONSTANTS.STORAGE.Path);
        }
    }
};

// filter price 1 Adult handle
$('input[name=filterPriceBy]').click(function () {
    var value = $('input[name=filterPriceBy]:checked').val();
    $(".filterPriceByName").text(value);

    $("#filterPriceByList").hide();

    // change price list
    renderHtmlFares(arrPagination.length > 0 ? arrPagination[0] : [], 'listAll', '.list-flight-information-all');
    pageAllFareCurrent = 1;
});

function showFilterPrice() {
    $("#filterPriceByList").toggle();
}









