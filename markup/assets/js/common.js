// 페이지 로딩
$(function(){
    imagesProgress();
    function imagesProgress () {
    var $container    = $('.loading'),
        $progressBar  = $container.find('.progress-bar'),
        $progressText = $container.find('.progress-text'),

        imgLoad       = imagesLoaded('body', {background: true}),//이미지 로딩을 모니터링
        imgTotal      = imgLoad.images.length,//body 전체 이미지갯수
        imgLoaded     = 0,// 읽은 이미지갯수
        current       = 0,//현재 진행률
        // 1 초에 60 번씩 읽어 여부 확인
        progressTimer = setInterval(updateProgress, 1000 / 60);

    // imagesLoaded를 통해 이미지로드 할 때마다 카운터증가
    imgLoad.on('progress', function () {
        imgLoaded++;
    });

    function updateProgress () {

        var target = (imgLoaded / imgTotal) * 100;// 로드한 이미지의 비율
        current += (target - current) * 0.1;//부드러운 여유
        $progressBar.css({ width: current + '%' });
        $progressText.text(Math.floor(current) + '%');

        if(imgTotal == 0){
            clearInterval(progressTimer);
            $progressBar.css({ width: '100%' });
            $progressText.text('100%');
            $container.fadeOut();
            $.unlockBody();
        }
        if(current >= 100){
            clearInterval(progressTimer);
            $container.fadeOut();
            $.unlockBody();
            $progressBar.add($progressText) // add는 그룹화
        }
        if (current > 99.9) {
            current = 100;
        }
    }
    }
})

$(document).ready(function(){
    $.lockBody();
    // 헤더 네비게이션 메뉴 열기/닫기
    $(".nav-open").on("click", function(){
        if($(this).hasClass("open")){
            if($(window).width() < 1080){
                $.unlockBody();
            }
            $("header nav > div").slideUp();
            setTimeout(function () {
                $("header nav > div").removeClass("open");
            }, 500);
            $(this).removeClass("open").find(".hidden").text("메뉴 열기");
        } else {
            if($(window).width() < 1080){
                $.lockBody();
            }
            $("header nav > div").slideDown().addClass("open");
            $(this).addClass("open").find(".hidden").text("메뉴 닫기");
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

    // iOS background bug fix
    if($(window).width() < 1080){
        $(".visual .bg").css("background-position", "center " + $(window).scrollTop() + "px");
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
