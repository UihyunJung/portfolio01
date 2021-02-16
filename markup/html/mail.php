<?php
header('Content-type: text/html; charset=utf-8');

// 빈 필드가 있는지 확인하는 구문
if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])){ // post로 넘어온 값이 비었는지 확인
	echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><script>alert('이름, 이메일주소, 제목, 내용을 입력해주세요.');history.go(-1);</script>";
	return false;
}

// Cross-Site Scripting (XSS)을 방지하는 시큐어코딩
// strip_tags() -> 문자열에서 html과 php태그를 제거한다
// htmlspecialchars() -> 특수 문자를 HTML 엔터티로 변환
// 악의적인 특수문자 삽입에 대비하기 위함
$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags($_POST['email']);
$subject = strip_tags(htmlspecialchars($_POST['subject']));
$message = strip_tags(htmlspecialchars($_POST['message']));

// 이메일을 생성하고 메일을 전송하는 부분 아래 발신자 수신자 부분을 기입해 주세요
$to = "ratmcrew@naver.com"; // 수신자
$from = "ratmcrew@naver.com";
$mailheader = "From: $from \r\n"; //답장주소
$formcontent= "포트폴리오에서 발송된 메일입니다.\n\n From: $name \n\n E-mail: $email \n\n Subject: $subject \n\n Message: $message"; // 메일 세부 내용

mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $formcontent, $mailheader);

if (!$name){
    echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><script>alert('메일 발송이 실패하였습니다.');history.go(-1);</script>";
} else {
    echo "<script language=\"javascript\" charset=\"utf-8\">alert('메일 발송이 완료 됐습니다. 확인 후 연락 드리겠습니다. 감사합니다.');window.location.href=\"https://nooroong.net/contact.html\";</script>";
}
?>
