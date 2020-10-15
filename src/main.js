document.addEventListener("DOMContentLoaded", function (event) {

    // Menu mobile
    var menu = $(".hamburger");
    var navigation = $('.fullpage_menu');
    var navBackground = $('#navBackground');
    var body = $('body');

    menu.on("click", menuHandler);
    $('#navigation nav').on("click", menuHandler);

    function menuHandler() {
        menu.toggleClass("open");
        navigation.toggleClass("open");
        navBackground.toggleClass("open");
        body.toggleClass("preventOverflow");
    }


    let tester = document.getElementById('webGLApp');
    let dist = 100;

    function checkVisible(elm, threshold, mode) {
        threshold = threshold || 0;
        mode = mode || 'visible';

        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        var above = rect.bottom - threshold < 0;
        var below = rect.top - viewHeight + threshold >= 0;

        return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
    }


    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.marges_header').outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 150);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $('.logo').removeClass('nav-down').addClass('nav-up');
            $('.hamburger').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('.logo').removeClass('nav-up').addClass('nav-down');
                $('.hamburger').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }

    var cursor = $("#cursor"), follower = $("#cursorFollow");

    var posX = 0,
        posY = 0;

    var mouseX = 0,
        mouseY = 0;

    TweenMax.to({}, 0.016, {
        repeat: -1,
        onRepeat: function () {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;
            TweenMax.set(follower, {
                css: {
                    left: posX - 12,
                    top: posY - 12
                }
            });
            TweenMax.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY
                }
            });
        }
    });

    $(document).on("mousemove", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });

    var $links = $("a, input, button, textarea, .btn, .hamburger");

    $links.on("mouseenter", function () {
        cursor.addClass("active");
        follower.addClass("active");
    });

    $links.on("mouseleave", function () {
        cursor.removeClass("active");
        follower.removeClass("active");
    });

    
   

});


// -- Animation sections
$(document).ready(function () {
    inViewport();
});

$(window).scroll(function () {
    inViewport();
});

$(window).resize(function () {
    inViewport();
});

function inViewport() {
    $('.service').each(function () {
        var divPos = $(this).offset().top,
            topOfWindow = $(window).scrollTop();

        if (divPos < topOfWindow + 700) {
            $('.service').removeClass('visible');
            $(this).addClass('visible');
        }
        else {
            $(this).removeClass('visible');
        }
    });
}


