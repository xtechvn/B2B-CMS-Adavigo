var dataListFlightSearch = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Search));
var infoSession = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));

$(document).ready(function () {
    UTILS.showHideCountdown();

    $(".duration-fly-item-stop").click(function () {
        if (dataListFlightSearch) {
            var objFlight = $(this).hasClass("duration-fly-item-go-wrapper") ? dataListFlightSearch.go : dataListFlightSearch.back;
            if (objFlight)
                UTILS.showStop(objFlight);
        }
    })
})

function fillInfoStepSearch() {
    if (dataListFlightSearch?.go) {
        var searchObj = dataListFlightSearch.search;
        var totalGo = 0;
        var totalBack = 0;
        // go route
        var goObj = dataListFlightSearch.go;
        var flightGo = dataListFlightSearch ? goObj?.ListFlight[0] : null;

        $('.qty-adt').html(searchObj.Adt);

        if (searchObj.Child > 0) {
            $('.qty-child').html(searchObj.Child);
            $('.qty-child').closest('li').removeClass('d-none');
            $('.qty-child').closest('tr').removeClass('d-none');
        }
        if (searchObj.Baby > 0) {
            $('.qty-baby').html(searchObj.Baby);
            $('.qty-baby').closest('li').removeClass('d-none');
            $('.qty-baby').closest('tr').removeClass('d-none');
        }

        // flight detail modal
        if (flightGo) {
            $(".trip-info-go .handBaggage span").text(flightGo.ListSegment[0].HandBaggage);
            if (flightGo.ListSegment[0].AllowanceBaggage)
                $(".trip-info-go .allowanceBaggage span").text(flightGo.ListSegment[0].AllowanceBaggage);
            else
                $(".trip-info-go .allowanceBaggage").hide();

            var description = flightGo.GroupClassObj.description;
            $(".trip-info-go .service-list").append(description)
        }

        var goAirlineName = "";
        var goLogoPath = "";
        if (goObj.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating) {
            goAirlineName = CONSTANTS.PACIFIC_AIRLINE.name;
            goLogoPath = CONSTANTS.PACIFIC_AIRLINE.path;
        }
        else {
            goAirlineName = goObj.AirlineObj.nameVi;
            goLogoPath = goObj.AirlineObj.logo;
        }

        var stopGo = goObj.ListFlight[0].StopNum == 0 ? 'bay thẳng' : `${goObj.ListFlight[0].StopNum} điểm dừng ` + `<span></span><svg class="icon-svg color-blue min">
            <use xlink:href="../images/icons/icon.svg#info"></use>
                                        </svg>`
        if (goObj.ListFlight[0].StopNum > 0) {
            $(".trip-info-go .duration-fly-item-go-wrapper").addClass("duration-fly-item-stop");
        }

        $('.full-name-go').html(dataListFlightSearch?.extraInfo?.StartPointName + ' (' + searchObj.StartPoint + ') - ' + dataListFlightSearch?.extraInfo?.EndPointName + ' (' + searchObj.EndPoint + ')');
        $('.trip-info-go .date-prev-step').html(dataListFlightSearch?.extraInfo?.StringDateGoChoosen);
        $('.trip-info-go .qty-customer-prev-step').html(Number(searchObj.Adt) + Number(searchObj.Baby) + Number(searchObj.Child));
        $('.trip-info-go .stopNum-go').html(stopGo);
        $('.trip-info-go .duration-fly-item-go').html(dataListFlightSearch?.extraInfo?.DurationFlyGo);
        $('.trip-info-go .code-fly-start').html(searchObj.StartPoint);
        $('.trip-info-go .code-fly-end').html(searchObj.EndPoint);
        $('.trip-info-go .detail-trip .hang').html(goAirlineName);
        $('.trip-info-go .detail-trip .logo').html(`<img src="${goLogoPath}" alt="">`);
        $('.trip-info-go .detail-trip .option .tag').html(flightGo.FareClass);

        //var groupClass = flightGo.GroupClassObj ? UTILS.shortenGroupClass(flightGo.GroupClassObj.detailVi) : flightGo.GroupClass;
        $('.trip-info-go .tooltip-groupclass').html(flightGo.GroupClassObj.detailVi);
        //$('.trip-info-go .seat-class-go').html(groupClass);
        $('.trip-info-go .detail-trip .code').html(
            /* goObj.ListFlight[0].Airline + goObj.ListFlight[0].ListSegment[0].Plane + ' / ' +*/
            goObj.ListFlight[0].ListSegment[0].FlightNumber
        );
        $('.trip-info-go .name-code-start-go').html(dataListFlightSearch?.extraInfo?.StartPointName + ' (' + searchObj.StartPoint + ')');
        $('.trip-info-go .name-code-start-end').html(dataListFlightSearch?.extraInfo?.EndPointName + ' (' + searchObj.EndPoint + ')');
        $('.trip-info-go .first-time .time').html(dataListFlightSearch?.extraInfo?.FirstTimeGo);
        $('.trip-info-go .item-go .time').html(dataListFlightSearch?.extraInfo?.FirstTimeGo);

        $('.trip-info-go .last-time .time').html(dataListFlightSearch?.extraInfo?.LastTimeGo);
        $('.trip-info-go .item-arrival .time').html(dataListFlightSearch?.extraInfo?.LastTimeGo);
        $('.trip-info-go .first-time .date').html(dataListFlightSearch?.extraInfo?.FirstDateGo);
        $('.trip-info-go .item-go .date').html(dataListFlightSearch?.extraInfo?.FirstDateGo);
        $('.trip-info-go .last-time .date').html(dataListFlightSearch?.extraInfo?.LastDateGo);
        $('.trip-info-go .item-arrival .date').html(dataListFlightSearch?.extraInfo?.LastDateGo);

        //$('.details-go .fee-adt').html(UTILS.formatViCurrency(searchObj.Adt * goObj.FareAdt));
        //$('.details-go .fee-child').html(UTILS.formatViCurrency(searchObj.Child * goObj.FareChd));
        //$('.details-go .fee-baby').html(UTILS.formatViCurrency(searchObj.Baby * goObj.FareInf));

        var taxAndFee = UTILS.formatViCurrency((goObj.FeeAdt + goObj.TaxAdt) * searchObj.Adt + (goObj.FeeChd + goObj.TaxChd) * searchObj.Child + (goObj.FeeInf + goObj.TaxInf) * searchObj.Baby);
        $('.details-go .tax-airport').html(taxAndFee);

        var profitGo = goObj.AdavigoPrice.profit * searchObj.Adt;
        if (goObj.FareChd > 0) {
            profitGo += goObj.AdavigoPrice.profit * searchObj.Child;
        }
        //if (goObj.FeeInf > 0) {
        //    profitGo += goObj.AdavigoPrice.profit * searchObj.Baby;
        //}

        // set total fare + tax + profit for every type of customer
        var totalFareObj = calculateFareOfType();

        // case seperate
        $('.details-go .fee-adt').html(UTILS.formatViCurrency(totalFareObj.go.single.adt));
        $('.details-go .fee-child').html(UTILS.formatViCurrency(totalFareObj.go.single.child));
        $('.details-go .fee-baby').html(UTILS.formatViCurrency(totalFareObj.go.single.baby));

        $('.details-total .fee-adt').html(UTILS.formatViCurrency(totalFareObj.go.single.adt));
        $('.details-total .fee-child').html(UTILS.formatViCurrency(totalFareObj.go.single.child));
        $('.details-total .fee-baby').html(UTILS.formatViCurrency(totalFareObj.go.single.baby));

        // case total
        $('.details-go .total-adt').html(UTILS.formatViCurrency(totalFareObj.go.total.adt));
        $('.details-go .total-child').html(UTILS.formatViCurrency(totalFareObj.go.total.child));
        $('.details-go .total-baby').html(UTILS.formatViCurrency(totalFareObj.go.total.baby));

        $('.details-total .total-adt').html(UTILS.formatViCurrency(totalFareObj.go.total.adt));
        $('.details-total .total-child').html(UTILS.formatViCurrency(totalFareObj.go.total.child));
        $('.details-total .total-baby').html(UTILS.formatViCurrency(totalFareObj.go.total.baby));

        var serviceFee = UTILS.formatViCurrency(profitGo);
        //var serviceFee = UTILS.formatViCurrency(goObj.AdavigoPrice.amount - goObj.TotalPrice);
        $('.details-go .adavigo-fee').html(serviceFee);
        var baggageFee = UTILS.calculateBaggageFee();
        if (baggageFee.goTotalWeight > 0) {
            $('.details-go .baggage-name').text(baggageFee.goTotalWeight + "kg");
            $('.details-go .baggage-fee').html(UTILS.formatViCurrency(baggageFee.goFee));

            $('.baggage-wrapper-go .baggage-name').text(baggageFee.goTotalWeight + "kg");
            $('.baggage-wrapper-go .baggage-fee').html(UTILS.formatViCurrency(baggageFee.goFee));
        }

        if (!infoSession?.baggageGo || infoSession?.baggageGo.length == 0) {
            $('.details-go .baggage-wrapper').hide();
            $(".baggage-wrapper-go").hide();
        }

        totalGo = goObj.TotalPrice + profitGo + baggageFee.goFee;
        $('.details-go .total-go').html(UTILS.formatViCurrency(totalGo));

        $(".details-back").hide();
        if (dataListFlightSearch.isTwoWayFare) {
            $(".details-back").show();

            // back route
            var backObj = dataListFlightSearch.back;
            var flightBack = dataListFlightSearch ? backObj.ListFlight[0] : null;

            // flight detail modal
            if (flightBack) {
                $(".trip-info-back .handBaggage span").text(flightBack.ListSegment[0].HandBaggage);
                if (flightBack.ListSegment[0].AllowanceBaggage)
                    $(".trip-info-back .allowanceBaggage span").text(flightBack.ListSegment[0].AllowanceBaggage);
                else
                    $(".trip-info-back .allowanceBaggage").hide();

                var description = flightBack.GroupClassObj.description;
                $(".trip-info-back .service-list").append(description)
            }

            $('.details-back, .trip-info-back, .btn-modal-details-back').removeClass('d-none');
            $('.full-name-back').html(dataListFlightSearch?.extraInfo?.EndPointName + ' (' + searchObj.EndPoint + ') - ' + dataListFlightSearch?.extraInfo?.StartPointName + ' (' + searchObj.StartPoint + ')');

            var backAirlineName = "";
            var backLogoPath = "";
            if (backObj.ListFlight[0].Operating == CONSTANTS.PACIFIC_AIRLINE.operating) {
                backAirlineName = CONSTANTS.PACIFIC_AIRLINE.name;
                backLogoPath = CONSTANTS.PACIFIC_AIRLINE.path;
            }
            else {
                backAirlineName = backObj.AirlineObj.nameVi;
                backLogoPath = backObj.AirlineObj.logo;
            }

            var stopBack = backObj.ListFlight[0].StopNum == 0 ? 'bay thẳng' : `${backObj.ListFlight[0].StopNum} điểm dừng ` + `<span></span><svg class="icon-svg color-blue min">
            <use xlink:href="../images/icons/icon.svg#info"></use>
                                        </svg>`
            if (backObj.ListFlight[0].StopNum > 0) {
                $(".trip-info-back .duration-fly-item-back-wrapper").addClass("duration-fly-item-stop");
            }

            $('.trip-info-back .date-prev-step').html(dataListFlightSearch?.extraInfo?.StringDateBackChoosen);
            $('.trip-info-back .code-fly-start').html(searchObj.EndPoint);
            $('.trip-info-back .code-fly-end').html(searchObj.StartPoint);
            $('.trip-info-back .qty-customer-prev-step').html(searchObj.Adt + searchObj.Baby + searchObj.Child);
            $('.trip-info-back .duration-fly-item-back').html(dataListFlightSearch?.extraInfo?.DurationFlyBack);
            $('.trip-info-back .stopNum-back').html(stopBack);
            $('.trip-info-back .detail-trip .hang').html(backAirlineName);
            $('.trip-info-back .detail-trip .logo').html(`<img src="${backLogoPath}" alt="">`);
            $('.trip-info-back .detail-trip .option .tag').html(flightBack.FareClass);

            $('.trip-info-back .detail-trip .code').html(
                flightBack.ListSegment[0].FlightNumber
            );

            //var groupClass = flightBack.GroupClassObj ? UTILS.shortenGroupClass(flightBack.GroupClassObj.detailVi) : flightBack.GroupClass;
            //$('.trip-info-back .seat-class-back').html(groupClass);
            $('.trip-info-back .tooltip-groupclass').html(flightBack.GroupClassObj?.detailVi);
            $('.trip-info-back .name-code-back-end').html(dataListFlightSearch?.extraInfo?.StartPointName + ' (' + searchObj.StartPoint + ')');
            $('.trip-info-back .name-code-back-go').html(dataListFlightSearch?.extraInfo?.EndPointName + ' (' + searchObj.EndPoint + ')');
            $('.trip-info-back .first-time .time').html(dataListFlightSearch?.extraInfo?.FirstTimeBack);
            $('.trip-info-back .item-go .time').html(dataListFlightSearch?.extraInfo?.FirstTimeBack);
            $('.trip-info-back .last-time .time').html(dataListFlightSearch?.extraInfo?.LastTimeBack);
            $('.trip-info-back .item-arrival .time').html(dataListFlightSearch?.extraInfo?.LastTimeBack);
            $('.trip-info-back .first-time .date').html(dataListFlightSearch?.extraInfo?.FirstDateBack);
            $('.trip-info-back .item-go .date').html(dataListFlightSearch?.extraInfo?.FirstDateBack);
            $('.trip-info-back .last-time .date').html(dataListFlightSearch?.extraInfo?.LastDateBack);
            $('.trip-info-back .item-arrival .date').html(dataListFlightSearch?.extraInfo?.LastDateBack);

            //$('.details-back .fee-adt').html(UTILS.formatViCurrency(searchObj.Adt * backObj.FareAdt));
            //$('.details-back .fee-child').html(UTILS.formatViCurrency(searchObj.Child * backObj.FareChd));
            //$('.details-back .fee-baby').html(UTILS.formatViCurrency(searchObj.Baby * backObj.FareInf));

            $('.details-back .fee-adt').html(UTILS.formatViCurrency(totalFareObj.back.single.adt));
            $('.details-back .fee-child').html(UTILS.formatViCurrency(totalFareObj.back.single.child));
            $('.details-back .fee-baby').html(UTILS.formatViCurrency(totalFareObj.back.single.baby));

            $('.details-total .fee-adt').html(UTILS.formatViCurrency(totalFareObj.back.single.adt + totalFareObj.go.single.adt ));
            $('.details-total .fee-child').html(UTILS.formatViCurrency(totalFareObj.back.single.child + totalFareObj.go.single.child));
            $('.details-total .fee-baby').html(UTILS.formatViCurrency(totalFareObj.back.single.baby + totalFareObj.go.single.baby));

            $('.details-back .total-adt').html(UTILS.formatViCurrency(totalFareObj.back.total.adt));
            $('.details-back .total-child').html(UTILS.formatViCurrency(totalFareObj.back.total.child));
            $('.details-back .total-baby').html(UTILS.formatViCurrency(totalFareObj.back.total.baby));

            $('.details-total .total-adt').html(UTILS.formatViCurrency(totalFareObj.go.total.adt + totalFareObj.back.total.adt));
            $('.details-total .total-child').html(UTILS.formatViCurrency(totalFareObj.go.total.child + totalFareObj.back.total.child));
            $('.details-total .total-baby').html(UTILS.formatViCurrency(totalFareObj.go.total.baby + totalFareObj.back.total.baby));

            var taxAndFeeBack = UTILS.formatViCurrency((backObj.FeeAdt + backObj.TaxAdt) * searchObj.Adt + (backObj.FeeChd + backObj.TaxChd) * searchObj.Child + (backObj.FeeInf + backObj.TaxInf) * searchObj.Baby);
            $('.details-back .tax-airport').html(UTILS.formatViCurrency(
                taxAndFeeBack
            ));

            var profitBack = backObj.AdavigoPrice.profit * searchObj.Adt;
            if (backObj.FareChd > 0) {
                profitBack += backObj.AdavigoPrice.profit * searchObj.Child;
            }
            //if (backObj.FeeInf > 0) {
            //    profitBack += backObj.AdavigoPrice.profit * searchObj.Baby;
            //}
            var serviceFeeBack = UTILS.formatViCurrency(profitBack);

            //var serviceFeeBack = UTILS.formatViCurrency(backObj.AdavigoPrice.amount - backObj.TotalPrice);
            $('.details-back .adavigo-fee').html(serviceFeeBack);
            if (baggageFee.backTotalWeight > 0) {
                $('.details-back .baggage-name').text(baggageFee.backTotalWeight + "kg");
                $('.details-back .baggage-fee').html(UTILS.formatViCurrency(baggageFee.backFee));

                $('.baggage-wrapper-back .baggage-name').text( baggageFee.backTotalWeight + "kg");
                $('.baggage-wrapper-back .baggage-fee').html(UTILS.formatViCurrency(baggageFee.backFee));
            }

            if (!infoSession?.baggageBack || infoSession?.baggageBack.length == 0) {
                $('.details-back .baggage-wrapper').hide();
                $(".baggage-wrapper-back").hide();
            }

            totalBack = backObj.TotalPrice + profitBack + baggageFee.backFee;
            $('.details-back .total-back').html(UTILS.formatViCurrency(totalBack));

            $('.total-payment').html(UTILS.formatViCurrency(totalGo + totalBack));
            $('.total-payment-final').html(UTILS.formatViCurrency(totalGo + totalBack));
            $(".total-payment-hidden").html(totalGo + totalBack)
        }
        else {
            $('.total-payment').html(UTILS.formatViCurrency(totalGo));
            $('.total-payment-final').html(UTILS.formatViCurrency(totalGo));
            $(".total-payment-hidden").html(totalGo);
            $(".baggage-wrapper-back").hide();
        }

        var voucher = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Voucher));
        if (voucher) {
            $("#discount-value").text(UTILS.formatViCurrency(voucher.discount));
            $('.total-payment-final').html(UTILS.formatViCurrency(totalGo + totalBack - voucher.discount));
        }
    }
}

function renderCustomerList() {
    var info = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE.Info));
    if (info) {
        var liList = "";
        if (info.Adt && info.Adt.length > 0) {
            liList += renderCustomerInList(info.Adt)
        }

        if (info.Child && info.Child.length > 0) {
            liList += renderCustomerInList(info.Child)
        }

        if (info.Baby && info.Baby.length > 0) {
            liList += renderCustomerInList(info.Baby)
        }

        $("#customer-list").html(liList);
    }
    else
        $("#customer-list-wrapper").hide();

}

function renderCustomerInList(list) {
    var liList = "";
    for (var a of list) {
        var li = `  <li class="mb15 flex space-between">
        <div>${UTILS.filterGender(a.gender)}</div>
        <div class="gray">${a.fullName}</div>
            </li>`;

        liList += li;
    }

    return liList;
}

function calculateFareOfType() {
    var searchObj = dataListFlightSearch.search;
    var goObj = dataListFlightSearch.go;

    var feeAdtTotalGo = 0;
    var feeAdtSingleGo = 0;

    var feeBabyTotalGo = 0;
    var feeBabySingleGo = 0;

    var feeChildTotalGo = 0;
    var feeChildSingleGo = 0;

    var feeAdtTotalBack = 0;
    var feeAdtSingleBack = 0;

    var feeChildTotalBack = 0;
    var feeChildSingleBack = 0;

    var feeBabyTotalBack = 0;
    var feeBabySingleBack = 0;

    feeAdtSingleGo = goObj.FareAdt + goObj.FeeAdt + goObj.TaxAdt + goObj.AdavigoPrice.profit;
    feeAdtTotalGo = searchObj.Adt * feeAdtSingleGo;
    if (searchObj.Child > 0) {
        feeChildSingleGo = goObj.FareChd + goObj.FeeChd + goObj.TaxChd + goObj.AdavigoPrice.profit
        feeChildTotalGo = searchObj.Child * feeChildSingleGo;
    }
    if (searchObj.Baby > 0) {
        feeBabySingleGo = goObj.FareInf + goObj.FeeInf + goObj.TaxInf;
        feeBabyTotalGo = searchObj.Baby * feeBabySingleGo;
    }

    if (dataListFlightSearch.isTwoWayFare) {
        var backObj = dataListFlightSearch.back;
        feeAdtSingleBack = backObj.FareAdt + backObj.FeeAdt + backObj.TaxAdt + backObj.AdavigoPrice.profit
        feeAdtTotalBack = searchObj.Adt * feeAdtSingleBack;
        if (searchObj.Child > 0) {
            feeChildSingleBack = backObj.FareChd + backObj.FeeChd + backObj.TaxChd + backObj.AdavigoPrice.profit
            feeChildTotalBack = searchObj.Child * feeChildSingleBack;
        }
        if (searchObj.Baby > 0) {
            feeBabySingleBack = backObj.FareInf + backObj.FeeInf + backObj.TaxInf;
            feeBabyTotalBack = searchObj.Baby * feeBabySingleBack;
        }
    }

    return {
        go: {
            total: {
                adt: feeAdtTotalGo,
                child: feeChildTotalGo,
                baby: feeBabyTotalGo
            },
            single: {
                adt: feeAdtSingleGo,
                child: feeChildSingleGo,
                baby: feeBabySingleGo
            }

        },
        back: {
            total: {
                adt: feeAdtTotalBack,
                child: feeChildTotalBack,
                baby: feeBabyTotalBack
            },
            single: {
                adt: feeAdtSingleBack,
                child: feeChildSingleBack,
                baby: feeBabySingleBack
            }
        }
    }
}

fillInfoStepSearch();
renderCustomerList();

var tempVoucher;
$("#btn-apply-voucher").click(function () {
    var disabled = $(this).hasClass("disabled-icon");
    if (!disabled) {
        if ($("#txt-discount").val()) {
            var user = UTILS.getUserLogged();
            var voucherObj = {
                voucher_name: $("#txt-discount").val(),
                user_id: user ? parseInt(user.clientId) : 0,
                total_order_amount_before: $(".total-payment-hidden").text() ? parseFloat($(".total-payment-hidden").text()) : 0
            }

            flightServices.trackingVoucher(voucherObj).then(function (res) {
                if (res && res.status == CONSTANTS.RESPONSE_STATUS.success) {
                    tempVoucher = res;
                    $("#discount-value").text(UTILS.formatViCurrency(res.discount));
                    $('.total-payment-final').text(UTILS.formatViCurrency(res.total_order_amount_after));
                }
                else {
                    toastr.error(res.msg);
                }
            }).catch(function (error) {
            })
        }
    }
})
