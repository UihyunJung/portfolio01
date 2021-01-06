$(document).ready(function(){
    // 헤더 네비게이션 메뉴 열기/닫기
    $(".nav-open").on("click", function(){
        if($(this).hasClass("open")){
            $.unlockBody();
            $("header nav > div").slideUp();
            setTimeout(function () {
                $("header nav > div").removeClass("open");
            }, 500);
            $(this).removeClass("open");
        } else {
            if($(window).width() < 1080){
                $.lockBody();
            }
            $("header nav > div").slideDown().addClass("open");
            $(this).addClass("open");
        }
    });

    // 홈 visual 영역 swipe slide 생성
    var homeSwiper = new Swiper('.visual-txt', {
        fadeEffect: { crossFade: true },
        virtualTranslate: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        speed: 1000,
        slidersPerView: 1,
        effect: "fade",
        loop: true,
        allowTouchMove: false,
        noSwiping: false
    });

    // 홈 scroll down 클릭 시 스크롤 이동
    $(".btn-scrolldown").on("click", function(e){
        var vsHeight = $(".visual").outerHeight();
        e.preventDefault();
        var hash = this.hash;
        $("html, body").animate({
            scrollTop: vsHeight
        }, 500, function(){
            // window.location.hash = hash;
        });
    });

    // top 버튼 클릭 시 스크롤 이동
    $(".btn-top").on("click", function(e){
        e.preventDefault();
        var hash = this.hash;
        $("html, body").animate({
            scrollTop: 0
        }, 500, function(){
            // window.location.hash = hash;
        });
    });

    // home에 skill 아이콘 호버시 text 표시
    $(".logo-list > li").hover(
        function(){
            $(this).find("span").removeClass("hidden").addClass("show");
        },
        function(){
            $(this).find("span").addClass("hidden").removeClass("show");
        }
    );

    AOS.init();
});

$(window).on("scroll", function(){
    var vsHeight = $(".visual").outerHeight();
    // 스크롤 시 top 버튼 보이기/숨기기
    if($(window).scrollTop() >= vsHeight){
        $(".btn-top").fadeIn("fast");
        $("header").addClass("sticky");
    } else {
        $(".btn-top").fadeOut("fast");
        $("header").removeClass("sticky");
    }
});

(function () {
    // 즉시실행함수
})()

// popup open
function popOpen(id){
    $.lockBody();
};

// popup close
function popClose(obj){
    $.unlockBody();
}

// prevent body scroll
var $docEl = $('html, body'),
    $wrap = $('.wrap'),
    $scrollTop;

$.lockBody = function() {
    if(window.pageYOffset) {
        $scrollTop = window.pageYOffset;
        $wrap.css({
            top: - ($scrollTop)
        });
    }
    $docEl.css({
        height: "100%",
        overflow: "hidden"
    });
}

$.unlockBody = function() {
    $docEl.css({
        height: "",
        overflow: ""
    });
    $wrap.css({
        top: ''
    });
    window.scrollTo(0, $scrollTop);
    window.setTimeout(function () {
        $scrollTop = null;
    }, 0);
}
