$(document).ready(function () {
    hotel_location.Initialization()
})
var hotel_location = {
    Initialization: function () {

        $('#hotel-location .box-hotel-home').each(function (index, item) {
            var element = $(this)
            var name = element.attr('data-name')
            hotel_location.RenderHotelByLocation(element, name)

        })
    },
    RenderHotelByLocation: function (element, name) {
        var input = {
            location: name,
            index: 1,
            size: 15,

        }
        _ajax_caller.post('/hotel/ListingSlideItems', input, function (result) {
            if (result != undefined && result.trim() != '') {
                element.find('.swiper-wrapper').html(result)
                hotel_location.RenderHotelPriceVoucher(element)
                hotel_location.RenderDetail(element.find('.swiper-container'))

            } else {
                element.hide()
            }
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')
        });
    },
    RenderDetail: function ($swiperContainer) {
        var nextElement = '#' + $swiperContainer.closest('.box-hotel-home').attr('id') + " .swiper-button-next";
        var prevElement = '#' + $swiperContainer.closest('.box-hotel-home').attr('id') + " .swiper-button-prev";
        var swiper_hotel_home = new Swiper($swiperContainer, {
            slidesPerView: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: nextElement,
                prevEl: prevElement,
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

    },
    
    RenderHotelPriceVoucher: function (element) {
        element.find('.article-hotel-item').each(function (index, item) {
            var element_detail = $(this)
            var input = {
                hotel_id: element_detail.attr('data-id'),
            }
            var price = element_detail.find('.bottom-content').find('.price').attr('data-price')
            _ajax_caller.post('/hotel/HotelByLocationAreaDiscount', { request: input, price: price }, function (result) {
                if (result != undefined && result.isSuccess == true && result.data != undefined && result.data > 0 && (result.code != undefined && result.code.trim() != '')) {
                    element_detail.find('.block-code').show()
                    element_detail.find('.block-code').removeClass('placeholder')
                    element_detail.find('.block-code').find('.block-code-text').html('Mã:')
                    element_detail.find('.block-code').find('.code').html((result.code != undefined) ? result.code : '')
                    element_detail.find('.block-code').find('.sale').html((result.discount != undefined) ? result.discount : '')
                    element_detail.find('.block-code').find('.price-new').html(_global.Comma(result.data) + '  đ')
                }
                else {
                    element_detail.find('.block-code').hide()
                }


            });
        })
       

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