
//$(function () {
//    $(".btn-signup").click(function () {
//        $(".nav").toggleClass("nav-up");
//        $(".form-signup-left").toggleClass("form-signup-down");
//        $(".success").toggleClass("success-left");
//        $(".frame").toggleClass("frame-short");
//    });
//});

//$(function () {
//    $(".btn-signin").click(function () {
//        $(".btn-animate").toggleClass("btn-animate-grow");
//        $(".welcome").toggleClass("welcome-left");
//        $(".cover-photo").toggleClass("cover-photo-down");
//        $(".frame").toggleClass("frame-short");
//        $(".profile-photo").toggleClass("profile-photo-down");
//        $(".btn-goback").toggleClass("btn-goback-up");
//        $(".forgot").toggleClass("forgot-fade");
//    });
//});

function login() {
    var username = document.getElementById('user_id').value;
    var password = document.getElementById('user_password').value;
    window.external.Login(username, password);
}


function exit() {
    window.external.ExitApp();
}

function invalidUserCredentials() {
    alert("Invalid User Credentails !!");
}