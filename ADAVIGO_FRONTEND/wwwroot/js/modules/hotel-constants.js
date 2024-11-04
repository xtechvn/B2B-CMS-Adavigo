var hotel_constants = {
    HTML: {
        ExclusiveArticle: `
      <div class="article-itemt full hotel-exclusive-item" data-id="{hotel_id}" data-name="{name}" data-hotel-type="{hotel_hotel_type}" data-amount={amount_number}>
            <div class="article-thumb">
                <a class="thumb_img thumb_5x3" href="#">
                    <img src="{thumb}" alt="">
                    <div class="tag"  style="display:none;">
                        <span class="sale">-{percent}%</span>
                        <span class="free">Miễn phí phụ thu</span>
                    </div>
                </a>
            </div>
            <div class="article-content">
                <div class="tag">
                    <svg class="icon-svg">
                        <use xlink:href="/images/icons/icon.svg#address2"></use>
                    </svg> <div style="overflow: hidden; white-space: nowrap;">{city}</div>
                </div>
                <h3 class="title_new">
                    <a href="javascript:;" class="hotel-exclusive-name"  style="overflow: hidden; white-space: nowrap;"> {name}</a>
                </h3>
                <div class="on-star">
                    <div class="star">
                       {star}
                    </div>
                    <a href="#" class="lbl">{hotel_type}</a>
                </div>
                <div class="number-vote" style="display:none;">
                    <span class="point">{review_point}</span>
                    <span>Tuyệt vời ({review_count} đánh giá)</span>
                </div>
                <div class="bottom-content">
                    <div class="price">
                        <p class="price-old" style="display:none;">{old_price} đ</p>
                        <div class="price-new box-placeholder placeholder">{amount}</div>
                        <div class="gray" style="{display}">/ <strong>1</strong> Đêm</div>
                    </div>
                    <a class="vote" href="#">
                        <svg class="icon-svg">
                            <use xlink:href="/images/icons/icon.svg#heart">
                            </use>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `,
        CommitArticle: `
      <div class="article-itemt full hotel-commit-item" data-id="{hotel_id}" data-name="{name}" data-hotel-type="{hotel_hotel_type}" data-amount={amount_number}>
            <div class="article-thumb">
                <a class="thumb_img thumb_5x3" href="#">
                    <img src="{thumb}" alt="">
                    <div class="tag"  style="display:none;">
                        <span class="sale">-{percent}%</span>
                        <span class="free">Miễn phí phụ thu</span>
                    </div>
                </a>
            </div>
            <div class="article-content">
                <div class="tag">
                    <svg class="icon-svg">
                        <use xlink:href="/images/icons/icon.svg#address2"></use>
                    </svg> <div style="overflow: hidden; white-space: nowrap;">{city}</div>
                </div>
                <h3 class="title_new">
                    <a href="javascript:;" class="hotel-commit-name"  style="overflow: hidden; white-space: nowrap;"> {name}</a>
                </h3>
                <div class="on-star">
                    <div class="star">
                       {star}
                    </div>
                    <a href="#" class="lbl">{hotel_type}</a>
                </div>
                <div class="number-vote" style="display:none;">
                    <span class="point">{review_point}</span>
                    <span>Tuyệt vời ({review_count} đánh giá)</span>
                </div>
                <div class="bottom-content">
                    <div class="price">
                        <p class="price-old" style="display:none;">{old_price} đ</p>
                        <div class="price-new box-placeholder placeholder">{amount}</div>
                        <div class="gray" style="{display}">/ <strong>1</strong> Đêm</div>
                    </div>
                    <a class="vote" href="#">
                        <svg class="icon-svg">
                            <use xlink:href="/images/icons/icon.svg#heart">
                            </use>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `,
        Star:`<svg class="icon-svg">
                            <use xlink:href="/images/icons/icon.svg#star">
                            </use>
                        </svg>
        `,

        BookingExprire:`   
        <div class="modal fade" id="hotel-booking-exprire" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 350px;">
                <div class="modal-content">
                    <!-- Modal body -->
                    <div class="modal-body center">
                        <div class="mb12"><img src="~/images/icons/notification.svg" alt=""></div>
                        <h4 class="txt_16 bold mb10" id="expiry-title">Thời gian cập nhật / hoàn tất thanh toán đã hết</h4>
                        <div class="gray mb16" id="expiry-message">
                            Thông tin về booking đã hết hạn, vui lòng quay lại trang sản phẩm hoặc trở về trang chủ để cập nhật thông tin mới nhất.
                        </div>
                        <a href="{url}">
                            <button type="submit" class="btn btn-default">Quay lại</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `,

    },
    CONSTATNTS: {
        ExclusiveLimit: 8,
        CommitLimit: 8,
        STORAGE: {
            Exclusive: 'HotelExclusives',
            CACHE_OBJECT_SEARCH: "CACHE_OBJECT_SEARCH",
            CACHE_SUGGEST_SEARCH: "CACHE_SUGGEST_SEARCH",
            OrderID: "HotelOrderID",
            HotelDetailURL:'HotelDetailURL'
        },
        ExclusiveLocationType: [
            {
                value: 1,
                name:'Tỉnh / Thành phố'
            },
            {
                value: 2,
                name: 'Quận/Huyện/Thành phố trực thuộc tỉnh thành phố'
            },
            {
                value: 3,
                name: 'Phường / Xã'
            }
        ],
        ExclusiveLocation: [
            {
                id: 911,
                type:1,
                name:'Phú Quốc'
            },
            {
                id: 568,
                type: 1,
                name: 'Nha Trang'
            },
            
            {
                id: 48,
                type: 1,
                name: 'Đà Nẵng'
            },
            {
                id: 672,
                type: 1,
                name: 'Đà Lạt'
            },
            {
                id: 193,
                type: 1,
                name: 'Hạ Long'
            }

        ],
        CommitLocation: [
            {
                id: 911,
                type: 1,
                name: 'Phú Quốc'
            },
            {
                id: 568,
                type: 1,
                name: 'Nha Trang'
            },

            {
                id: 1,
                type: 1,
                name: 'Hạ Long'
            },
            {
                id: 2,
                type: 1,
                name: 'Hải Phòng'
            },
            {
                id: 3,
                type: 1,
                name: 'Vĩnh Yên'
            }

        ],

    },
    RenderStar: function (value) {
        var html_template = hotel_constants.HTML.Star
        var html = ''
        if (value == null || value == undefined || value <= 0) return html
        if (value > 5) value = 5
        for (var i = 0; i < value; i++) {
            html += html_template
        }
        return html
    },
}