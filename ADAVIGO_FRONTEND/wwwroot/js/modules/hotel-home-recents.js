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
                        .replaceAll('@rate', item.review_rate)
                        .replaceAll('@count', item.review_count)
                        .replaceAll('@old', '')
                        .replaceAll('@price', item.min_price)
                        .replaceAll('@code', item.discount_code)
                        .replaceAll('@discount', item.discount)
                        .replaceAll('@new', item.amount)
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
        $('#hotel-recent .list-article').html(html)
        $('#hotel-recent').removeClass('placeholder')
        $('#hotel-recent .list-article').removeClass('placeholder')
        $('#hotel-recent').removeClass('box-placeholder')

    },
    HTML: `
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
                    <div class="price">@price đ</div>
                </div>
                <div class="block-code" style="@style_blockcode">
                    Mã:<span class="code">@code</span>
                    <span class="sale">@discount</span>
                    <div class="price-new">@new VND</div>
                </div>
            </div>
        </div>

    
    `

}