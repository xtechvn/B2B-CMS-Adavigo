$(document).ready(function () {
    hotel_location.Initialization()
})
var hotel_location = {
    Initialization: function () {

        $('#hotel-location .box-hotel-home').each(function (index, item) {
            var element = $(this)
            var name = element.attr('data-name')
            var type = element.attr('data-type')
            hotel_location.RenderHotelByLocation(element, name, type)

        })
    },
    RenderHotelByLocation: function (element, name, type) {
        var input = {
            name: name,
            type: type,
            index: 1,
            size: 10,
            committype: hotel_location.GetHotelCommitType()

        }
        _ajax_caller.post('/hotel/ListingItems', input, function (result) {
            if (result != undefined) {
                element.find('.swiper-wrapper').html(result)
                hotel_location.RenderHotelPrice(element)
                hotel_location.RenderDetail(element.find('.swiper-container'))

            }
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
        });
    },
    RenderDetail: function ($swiperContainer) {
        $(".box-hotel-home .swiper-container").each(function () {
            let $swiperContainer = $(this);
            var swiper_hotel_home = new Swiper($swiperContainer, {
                slidesPerView: 4,
                spaceBetween: 16,
                navigation: {
                    nextEl: ".box-hotel-home .swiper-button-next",
                    prevEl: ".box-hotel-home .swiper-button-prev",
                },
                breakpoints: {
                    1400: {
                        slidesPerView: 4,
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
                        hotel_location.checkNavigation(this, $swiperContainer);
                    },
                    resize: function () {
                        hotel_location.checkNavigation(this, $swiperContainer);
                    },
                },
            });
        })
	

    },
    RenderHotelPrice: function (element) {
        element.find('.article-hotel-item').each(function (index, item) {
            var element_detail = $(this)
            var input = {
                hotelid: element_detail.attr('data-id'),
                is_vin_hotel: element_detail.attr('data-isvin')
            }
            _ajax_caller.post('/hotel/HotelByLocationAreaDetail', { request_model: input }, function (result) {
                if (result != undefined && result.isSuccess == true && result.data != undefined && result.data.min_price != undefined) {
                    element_detail.find('.bottom-content').find('.price').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price-old').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price').html(_global.Comma(result.data.min_price) + ' VND')
                    element_detail.find('.bottom-content').find('.price').attr('data-price', result.data.min_price)
                    element_detail.find('.bottom-content').find('.price-old').html('')

                    hotel_location.RenderHotelPriceVoucher(element_detail)
                }
                if (result.data == undefined || parseFloat(result.data.min_price) == undefined || parseFloat(result.data.min_price) <= 0) {
                    element_detail.find('.bottom-content').find('.price').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price-old').removeClass('placeholder')
                    element_detail.find('.bottom-content').find('.price').html('Giá liên hệ')
                    element_detail.find('.bottom-content').find('.price').attr('data-price', '0')
                    element_detail.find('.bottom-content').find('.price-old').html('')
                    element_detail.find('.block-code').hide()
                }
            });
        })

    },
    RenderHotelPriceVoucher: function (element_detail) {
        var input = {
            hotel_id: element_detail.attr('data-id'),
        }
        var price = element_detail.find('.bottom-content').find('.price').attr('data-price')
        _ajax_caller.post('/hotel/HotelByLocationAreaDiscount', { request: input, price: price }, function (result) {
            if (result != undefined && result.isSuccess == true && result.data != undefined && result.data > 0) {
                element_detail.find('.block-code').removeClass('placeholder')
                element_detail.find('.block-code').find('.block-code-text').html('Mã:')
                element_detail.find('.block-code').find('.code').html((result.code != undefined) ? result.code : '')
                element_detail.find('.block-code').find('.sale').html((result.discount != undefined) ? result.discount : '')
                element_detail.find('.block-code').find('.price-new').html(_global.Comma(result.data) + '  đ')
            }

        });

    },
    GetHotelCommitType: function () {
        return 1
    },
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