$(document).ready(function () {
    hotel_recents.Initialization()
})
var hotel_recents = {
    Initialization: function () {

        var recents = window.localStorage.getItem('HotelRecent');
        var html=''
        var recents_object = []
        if (recents != undefined && recents.trim() != '') {
            recents_object = JSON.parse(recents)
            if (recents_object != undefined && recents_object.length > 0) {
                $(recents_object).each(function (index, item) {
                    var filter_object =
                    {
                        hotelID: item.hotel_id,
                        hotelName:item.name,
                        arrivalDate: item.arrival_date,
                        departureDate: item.departure_date,
                        rooms: [{
                            room: 1,
                            number_adult: 2,
                            number_child: 0,
                            number_infant: 0

                        }]
                    };
                    var url = 'hotel/detail?filter=' + encodeURIComponent(JSON.stringify(filter_object))
                    var html_detail = hotel_recents.HTML
                        .replaceAll('images/graphics/thumb1.jpg', item.avatar)
                        .replaceAll('@item.hotel_id', item.hotel_id)
                        .replaceAll('@url', url)
                        .replaceAll('The Sailing Bay Beach Resort', item.name)
                        .replaceAll('The Sailing Bay Beach Resort', item.name)
                        .replaceAll('@rate', item.star)
                        .replaceAll('@count', item.review_count)
                        .replaceAll('@old', '')
                        .replaceAll('@price', isNaN(parseFloat(item.min_price)) ? item.min_price : item.min_price+' VND')
                        .replaceAll('@code', item.discount_code)
                        .replaceAll('@discount', item.discount)
                        .replaceAll('@new', isNaN(parseFloat(item.amount)) ? item.amount : item.amount + ' đ')
                        .replaceAll('@item.is_vin_hotel.ToString()', item.isVinHotel)
                        .replaceAll('@style_blockcode', (item.discount_code == undefined || item.discount_code.trim() == '')?'display:none':'')
                    var html_star = ''
                    for (var i = 0; i < item.star; i++) {
                        html_star += `  <svg class="icon-svg">
                            <use xlink:href="/images/icons/icon.svg#star">
                            </use>
                        </svg>`
                    }
                    html_detail = html_detail.replaceAll('@star', html_star)
                    html += html_detail
                })
            }
        }
        $('#hotel-recent .list-article .swiper-wrapper').html(html)
        $('#hotel-recent').removeClass('placeholder')
        $('#hotel-recent .list-article').removeClass('placeholder')
        $('#hotel-recent').removeClass('box-placeholder')
        let $swiperContainer = $("#hotel-recent .swiper-container");
        var swiper_hotel_home = new Swiper($swiperContainer, {
            slidesPerView: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: "#hotel-recent .swiper-button-next",
                prevEl: "#hotel-recent .swiper-button-prev",
            },
            breakpoints: {
                1400: {
                    slidesPerView: 5,
                },
                1366: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 3,
                },
                572: {
                    slidesPerView: 2,
                }
            },

            on: {
                init: function () {
                    hotel_recents.checkNavigation(this, $swiperContainer);
                },
                resize: function () {
                    hotel_recents.checkNavigation(this, $swiperContainer);
                },
            },
        });
    },
    HTML: `
                        <div class="swiper-slide">

            <div class="article-itemt full article-hotel-item"data-id="@item.hotel_id" data-isvin="@item.is_vin_hotel.ToString()" style="min-height:390px">
            <div class="article-thumb">
                <a class="thumb_img thumb_5x3" href="@url">
                    <img src="images/graphics/thumb1.jpg" alt="">

                    <div class="tag2">GIÁ ĐỘC QUYỀN</div>
                </a>
            </div>
            <div class="article-content">
                <h3 class="title_new">
                    <a href="@url">The Sailing Bay Beach Resort</a>
                </h3>
                <div class="on-star">
                    <div class="star">
                        @star
                    </div>
                    <span>(@rate/5.0)</span>
                </div>
                <div class="number-vote">
                    <span>(@count đánh giá)</span>
                </div>
                <div class="bottom-content">
                    <p class="price-old">@old</p>
                    <div class="price">@price</div>
                </div>
                <div class="block-code" style="@style_blockcode">
                    Mã:<span class="code">@code</span>
                    <span class="sale">@discount</span>
                    <div class="price-new">@new</div>
                </div>
            </div>
        </div>
        </div>

    
    `,
    checkNavigation: function (swiper, $container) {
        let totalSlides = swiper.slides.length;
        let $nextButton = $container.find(".swiper-button-next");
        let $prevButton = $container.find(".swiper-button-prev");

        if (totalSlides <= swiper.params.slidesPerView) {
            $nextButton.hide();
            $prevButton.hide();
        } else {
            $nextButton.show();
            $prevButton.show();
        }
    }

}