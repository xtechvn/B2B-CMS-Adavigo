(function($) {
    "use strict";
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    }

    //backToTop
    function backToTop() {
        $(window).scroll(function() {
            if ($(window).scrollTop() >= 200) {
                $('#to_top').fadeIn();
            } else {
                $('#to_top').fadeOut();
            }
        });

        $("#to_top").click(function() {
            $("html, body").animate({
                scrollTop: 0
            });
            return false;
        });
    }

    //scrollBar
    // function scrollBar() {
    //     var scrollContainer = $(".scrollbar-inner");
    //     if (scrollContainer.length > 0) {
    //         scrollContainer.scrollbar();
    //     }
    // }

    //onCLick
    function onCLick() {
        $(".tab-menu a").click(function(event) {
            $(".tab-menu a").removeClass("active")
            if (!$(this).hasClass("active")) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
            event.preventDefault();
            var tab = $(this).attr("href");
            $(".tab-content > div").not(tab).css("display", "none");
            $(tab).fadeIn();
        });

        $('.form-outline input').on('keyup', (e) => {
            let query = $(e.currentTarget).val();
            if (query.length) {
                $(e.currentTarget).parents('.form-outline').addClass('active');
                return;
            } else {
                $(e.currentTarget).parents('.form-outline').removeClass('active');
                return;
            }
        });

        $('.input-search').on('keyup', (e) => {
            let query = $(e.currentTarget).val();
            if (query.length) {
                $(e.currentTarget).parents('.form-search').addClass('active');
                return;
            } else {
                $(e.currentTarget).parents('.form-search').removeClass('active');
                return;
            }
        });


        $('#vibeji-ham').off('click').on('click', function() {
            $(this).toggleClass('open');
            $('.menu-left').toggleClass('open');
            $('.overlay-bg').toggleClass('open');
            $('body').css('overflow', $(this).hasClass('open') ? 'hidden' : '')
        });
        $('.overlay-bg').off('click').on('click', function() {
            $(this).toggleClass('open');
            $('#vibeji-ham,.menu-left').toggleClass('open');
            $('body').css('overflow', $(this).hasClass('open') ? 'visible' : '')
        });

        // Select ATM
        $('.list-bank li').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        });

        $('.btn_control_menu').click(function() {
            $(this).toggleClass('active');
            $('.section-main').toggleClass('full');
        });

        $(".wrap-search .item").click(function(event) {
            $(".wrap-search .item").removeClass("focus")
            if (!$(this).hasClass("focus")) {
                $(this).addClass("focus");
            } else {
                $(this).removeClass("focus");
            }
        });


    }


    //slide
    function swiper() {
        var swiperslideBanner = new Swiper(".slide-banner .swiper-container", {
            speed: 1000,
            autoplay: {
                delay: 2000,
            },
            pagination: {
                el: ".slide-banner .swiper-pagination",
            },
        });
        var swiperslidedate = new Swiper(".slide-date .swiper-container", {
            slidesPerView: 6,
            spaceBetween: 4,
            navigation: {
                nextEl: ".slide-date .swiper-button-next",
                prevEl: ".slide-date .swiper-button-prev",
            },
            breakpoints: {
                1480: {
                    slidesPerView: 5,
                },
                1280: {
                    slidesPerView: 4,
                },
                1025: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                }
            }
        });
        var swiperThumb = new Swiper(".slide-thumb .swiper-container", {
            speed: 500,
            effect: 'fade',
            autoplay: {
                delay: 6000,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });

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

    function datepicker() {
        $('input[name="birthday"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });

        $('input[name="birthday"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            // $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        });

        $('input[name="birthday"]').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
        $('input[name="daterange"]').daterangepicker({
            autoUpdateInput: false,
            showDropdowns: true,
            drops: 'up',
            startDate: '01/01/2022',
            minDate: '01/01/2022',
            maxDate: '01/01/2024',
            locale: {
                "applyLabel": "Áp dụng",
                "cancelLabel": "Xóa",
                "daysOfWeek": [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1
            },
        }, function(start, end, label) {});
        //-- Event Binding
        $(".fromdate").daterangepicker({
            autoUpdateInput: false
        }).on('apply.daterangepicker', function(ev, picker) {
            $('.fromdate').val(picker.startDate.format('DD/MM/YYYY')).change();
            $('.todate').val(picker.endDate.format('DD/MM/YYYY')).change();

        }).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });


    }

    function onSelect2() {
        $(".select2").select2();
        var dataNumber = [{
                id: 1,
                text: "+84",
                src: "images/icons/viet-nam.png",
            },
            {
                id: 2,
                text: "+64",
                src: "images/icons/viet-nam.png",
            },
        ];
        $("#select-sort").select2({
            minimumResultsForSearch: 1,
            data: dataNumber,
            escapeMarkup: function(markup) {
                return markup;
            },
            templateResult: function(data) {
                return `<img src='${data.src}'></img><span>${data.text}</span>`;
            },
            templateSelection: function(data) {
                return `<img src='${data.src}'></img><span>${data.text}</span>`;
            },
        });
        var dataAddress = [{
                id: 1,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">SGN (</div><div class="address-name name">Hồ Chí Minh</div>)',
                // src: '<div class="address">\n\t\t\t\t<div class="name">Hà Nội</div><div>HAN - Sân bay Nội Bài</div>\n\t\t\t</div>',
            },
            {
                id: 2,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">HAN (</div><div class="address-name name">Hà Nội</div>)',
            },
            {
                id: 3,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">HAN (</div><div class="address-name name">Hà Nội</div>)',
            },
            {
                id: 4,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">HAN (</div><div class="address-name name">Hà Nội</div>)',
            },
            {
                id: 5,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">SGN (</div><div class="address-name name">Hồ Chí Minh</div>)',
            },
            {
                id: 6,
                use: '<use xlink:href="images/icons/icon.svg#address"></use>',
                text: '<div class="address-code">SGN (</div><div class="address-name name">Hồ Chí Minh</div>)',
            },
        ];
        $("#select-address").select2({
            minimumResultsForSearch: 1,
            dropdownCssClass: "select-address-custom",
            data: dataAddress,
            escapeMarkup: function(markup) {
                return markup;
            },
            templateResult: function(data) {
                return `<div class="item-address"><svg class="icon-svg">${data.use}</svg><div class="address">${data.text}</div></div>`;
            },
        });
    }

    function lightGallery2() {
        var box_lightGallery = document.getElementById('lightgallery');
        if (typeof box_lightGallery != 'undefined' && box_lightGallery != null) {
            lightGallery(box_lightGallery, {
                selector: '.item',
                thumbMargin: 20,
                thumbContHeight: 120,
                subHtmlSelectorRelative: true,
                thumbnail: true,
            });

            box_lightGallery.addEventListener(
                'onAfterOpen',
                function(e) {
                    $('.lg-sub-html').insertBefore('.lg-inner');
                    // $('.lg-sub-html').wrap("<div class='lg-sub-html_wrapper'></div>");
                    // $(".lg-sub-html").perfectScrollbar();
                },
                false
            );
        }
        $('.lightgallery .item .thumb_img').on('click', function() {
            var data_img = $(this).attr('data-img');
            if (data_img) {
                $("#lightgallery a[data-img='" + data_img + "']")[0].click();
            }
        });
    }


    $(function() {
        backToTop();
        // scrollBar();
        onCLick();
        swiper();
        datepicker();
        onSelect2();
        lightGallery2();
        $('[data-toggle="tooltip"]').tooltip();

    });
})(jQuery);