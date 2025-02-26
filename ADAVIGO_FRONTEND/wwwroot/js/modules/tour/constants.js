var tour_constants = {
    STORAGE: {
        TourSearch: 'TourSearch',
        TourCart: 'TourCart'
    },
    Domain: {
        StaticImage: 'https://static-image.adavigo.com'
    },
    MVC: {
        Detail: "/tour/detail/",
        BookingSuccess: "/tour/BookingSuccess",
        OrderDetail: "/tour/orderHistory",

    },
    HTML: {
        DetailSelectTourScheduleOption: ` <option value="{id}" data-adult="{adt}" data-child="{chd}">{time}</option>`,
        DetailSelectTourScheduleOption2: ` <option value="{id}" data-adult="{adt}" data-child="{chd}" selected>{time}</option>`,
        BreadcumbItem: ` <li class="breadcrumb-item {active}"><a href="{url}">{name}</a></li>`,
        Breadcumb: `<ol class="breadcrumb">{items}</ol>`,
        Option: `<option value="{value}">{text}</option>`,

        StarTemplate: '<svg class="icon-svg"> <use xlink:href="/images/icons/icon.svg#star"> </use> </svg>',
        SearchTourDetailItem: `

 <div class="article-itemt full">
                            <div class="article-thumb">
                                <a class="thumb_img thumb_5x3" href="{tour_url}">
                                    <img src="{thumb_img}" alt="">
                                    <div class="tag">
                                        <span class="sale" style="{sale_percent_style}">{sale_percent}</span>
                                        <span class="free" style="{free_extra_fee_style}">{free_extra_fee}</span>
                                    </div>
                                </a>
                            </div>
                            <div class="article-content">
                                <div class="tag">
                                    <svg class="icon-svg">
                                        <use xlink:href="/images/icons/icon.svg#address2"></use>
                                    </svg> {start_point}
                                </div>
                                <h3 class="title_new">
                                    <a href="{tour_url}">{tour_name}</a>
                                </h3>
                                <div class="on-star">
                                    <div class="star">
                                        {star}
                                    </div>
                                    <a href="javascripts:;" class="lbl search-tour-filter-tour-type">{tour_type}</a>
                                </div>
                                <div class="number-vote" style="display:none;">
                                    <span class="point">0</span>
                                    <span>Tuyệt vời {0 đánh giá}</span>
                                </div>
                                <div class="bottom-content">
                                    <div class="price">
                                        <p class="price-old" style="{price_old_style}">{price_old} đ</p>
                                        <div class="price-new">{price_new} </div>
                                    </div>
                                    <a class="btn-default gray confirm-booking-tour" data-tourid="{tour_id}" href="javascript:;" style="{style_dp}">Đặt ngay</a>
                                    <a class="btn-default gray size TT-Lien-He" href="javascript:;" style="{style_lh}">Liên hệ tư vấn</a>
                                </div>
                            </div>
                        </div>
`,
        LightGalleryItem: `

    <div class="item {d-none}" data-src="{img}">
                    <a class="thumb_img thumb_5x3" href="javascript:;">
                        <img class="img-responsive" src="{img}" alt="">
                    </a>
                </div>

`,
        Gallery: ` <div class="item" data-src="{img_src}">
                <a class="thumb_img thumb_5x3" href="">
                    <img class="img-responsive" src="{img_src}" alt="">
                    <div class="des">
                        <div class="address">{location_end}</div>
                        <p>Khám phá điểm vui chơi, ưu đãi, kinh nghiệm du lịch {location_end}</p>
                    </div>
                </a>
            </div>
            <div class="grid grid__2">
              {item}
                
            </div>`,
        SearchItemHeader: `<div class="header-title mb16">
                <h2 class="title-cate">Khởi hành từ {start_point}</h2>
                <p class="gray">
                    Chúng tôi tìm thấy {count} tour cho Quý khách.
                </p>
            </div>`,
        SearchItemContent: `<div class="list-article grid grid__3 mb20 search-tour-{id}">
               {items}
            </div>{items2}`,
        Star: '<svg class="icon-svg"> <use xlink:href="/images/icons/icon.svg#star"> </use> </svg>',
        SearchTourDetailViewMore: ` <div class="center mb40">
                        <a class="btn-default white search-tour-viewmore" style="(viewmore_style)" href="javascript:;" data-startpointid="(start_point)">
                            Xem thêm
                            <svg class="icon-svg min ml-1 rotate90">
                                <use xlink:href="/images/icons/icon.svg#next2"></use>
                            </svg>
                        </a>
                    </div>`,
    },
}