
const pagesize = CONSTANTS.PAGE_SIZE;
var pagenum = 1;
var total_order = 0;
var total_page = 0;
const btnPrevPage =
    `<li class="page-item page-prev">
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#prev"></use>
                    </svg>
                </span>
            <span class="sr-only">Previous</span>
        </a>
    </li>`;

const btnNextPage =
    `<li class="page-item page-next">
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">
                    <svg class="icon-svg">
                        <use xlink:href="../images/icons/icon.svg#next"></use>
                    </svg>
                </span>
            <span class="sr-only">Next</span>
        </a>
    </li>`;

function renderPagination() {
    $('.pagination').html('');
    if (total_order) {
        total_page = Math.ceil(total_order / pagesize)
        var paginationHtml = btnPrevPage;
        for (var i = 1; i <= total_page; i++) {
            paginationHtml += `<li data-page="${i}" class="page-item ${i == pagenum ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
        }
        paginationHtml += btnNextPage;
        if (Number(total_page) > 1)
            $('.pagination').html(paginationHtml);
    }
};

function renderItemOrder(listOrders) {
    var orderHtml = '';
    listOrders.forEach(order => {
        var rows = "";
        order.list_Order = UTILS.sortByKeyAsc(order.list_Order, "leg");
        for (var index in order.list_Order) {
            var item = order.list_Order[index];

            var priceZone = index == 0 ? ` <div class="price-all">
                            <div class="gray">Tổng tiền</div>
                            <div class="txt_18 bold">${UTILS.formatViCurrency(order.orderAmount)}</div>
                            <div class="status" style="background-color:${order.color_code};color:${order.color_code != '#F1F5F9' && order.color_code ? 'white' : ''}">${order.order_status_name}</div>
                        </div>` : ""

            var row = ` <div class="row trip-info min">
                    <div class="col-md-7">
                        <div class="trip-info__right">
                            <div class="detail-trip">
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
                                        <div class="gray">${TIME_UTILS.getFlightTime(item.endTime) + ", " + TIME_UTILS.getViDate(item.endTime)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 flex space-between">
                        <div class="name">
                            <div class="logo"><img src="${item.airlineLogo}" alt=""></div>
                            <div class="hang">${item.flightNumber}</div>
                        </div>
                        ${priceZone}                    
                    </div>
                </div>`;
            rows += row;
        }

        if (order.list_Order.length > 0) {
            orderHtml +=
                `<div class="bg-white pd-20 radius10 item-info-flight mb24">
                <div class="flex align-center space-between mb20">
                    <div class="gray">Mã đơn hàng: <strong class="color-blue">${order.orderNo}</strong></div>
                    <a href="javascript:void(0)" onclick="getOrderDetail(${order.orderId})" class="color-blue">
                        Xem chi tiết
                        <svg class="icon-svg min">
                            <use xlink:href="../images/icons/icon.svg#next2"></use>
                        </svg>
                    </a>
                </div>
                ${rows}              
            </div>`;
        }
    });
    $('.listOrders').html(orderHtml);
}

function getOrderDetail(orderId) {
    window.location.href = CONSTANTS.FLIGHT_BOOKING.MVC.orderDetail + "?orderId=" + orderId;
}

getDataAndRenderPage();
function getDataAndRenderPage() {
    var request = {
        "source_type": 2,
        "pageNumb": Number(pagenum),
        "PageSize": Number(pagesize),
        "keyword": $("#input_search").val()
    };

    flightServices.getOrderByClientId(request).then(function (res) {
        console.log(res);
        if (res.total_order >= 0)
            $("#orderHistoryTotal").text("Tìm thấy " + res.total_order + " kết quả");

        if (res && res.data.length > 0) {
            $('.search-null').addClass('d-none');
        }
        else {
            $('.search-null').removeClass('d-none');
        }

        total_order = res.total_order;
        renderItemOrder(res.data);
        renderPagination();

        // scroll top
        $('html, body').animate({
            scrollTop: $("#search").offset().top - 100
        });


    }).catch(function (error) {

    })
}


$(".btn_reset").click(function () {
    $("#input_search").val('');
    getDataAndRenderPage();
    $(".btn_reset").hide();
})

$("body").on("click", '.page-item', function (e) {
    e.preventDefault();
    if ($(this).hasClass('page-prev') && pagenum > 1) {
        pagenum = pagenum - 1;
        $('.page-item').removeClass('active');
        getDataAndRenderPage();
    } else if ($(this).hasClass('page-next') && pagenum < total_page) {
        pagenum = pagenum + 1;
        $('.page-item').removeClass('active');
        getDataAndRenderPage();
    } else if (!$(this).hasClass('page-prev') && !$(this).hasClass('page-next')) {
        pagenum = $(this).attr('data-page');
        $('.page-item').removeClass('active');
        getDataAndRenderPage();
    }
});

$("#search input").keypress(function (e) {
    //Event.which == 1 mouse click left and event. which == 13 is enter key.
    if ((e.which == 13 || e.which == 1)) {
        getDataAndRenderPage();
    }
})

$("#search input").on('input', function () {
    var val = $(this).val();
    if (val)
        $(".btn_reset").show();
    else
        $(".btn_reset").hide();

});


$(document).ready(function () {
    $("#input_search").val('');
    $("body").removeClass("h-100vh");
    UTILS.removeLoading();
    $(".btn_reset").hide();
})