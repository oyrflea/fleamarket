
$(document).ready(function () {
    function uId(input) {
        var value = $(input).val();
        var regid = /^[가-힣a-zA-Z0-9_]{2,10}$/; // 2~10자 한글,영문, 숫자, 특수문자 가능 
        return regid.test(value);
    }

    function uPassword(input) {
        var value = $(input).val();
        var regpassword = /^[a-zA-Z0-9]{6,24}$/; //6~24자 영문대소문자, 숫자 가능
        return regpassword.test(value);
    }

    function uName(input) {
        var value = $(input).val();
        var regname = /^[가-힣a-zA-Z]+$/; // 한글과 영문만 가능
        return regname.test(value);
    }

    function uPhone(input) { //전화번호 형식 (01011112222)
        var value = $(input).val();
        value = value.split('-').join('');
        var regphone = /^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$/;
        return regphone.test(value);
    }

    function uEmail(input) { // email만 가능
        var value = $(input).val();
        var regemail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        return regemail.test(value);
    }


    $("#form_btn").click(function () {
        if(!uId("#userid")&&!uPassword("#password")&&!uName("#name")&&!uPhone("#phonenumber")&&!uEmail("#email")){
            $("#userid").css("border-color", "#ed4956");
            $("#password").css("border-color", "#ed4956");
            $("#name").css("border-color", "#ed4956");
            $("#phonenumber").css("border-color", "#ed4956");
            $("#email").css("border-color", "#ed4956");
            $(".essential").css("display", "block");
        }
        else{
            if (!uId("#userid")) {
                $("#userid").css("border-color", "#ed4956");
                $("#warnid").css("display", "block");
                // alert("아이디 : 2-10자 입력해주시기 바랍니다.");
            }
            else {
                $("#userid").css("border-color", "#efefef");
            }
    
            if (!uPassword("#password")) {
                $("#password").css("border-color", "#ed4956"); 
                $("#warnpw").css("display", "block");             
                // alert("비밀번호 : 6~24자 영문대소문자, 숫자, 특수문자등을 혼합하여 입력해주시기 바랍니다.");
            }
            else {
                $("#password").css("border-color", "#efefef");
            }
    
            if (!uName("#name")) {
                $("#name").css("border-color", "#ed4956");
                $("#warnname").css("display", "block");
                // alert("이름 : 한글과 영문으로 입력해주시기 바랍니다.");
            }
            else {
                $("#name").css("border-color", "#efefef");
            }
    
            if (!uPhone("#phonenumber")) {
                $("#phonenumber").css("border-color", "#ed4956");
                $("#warntel").css("display", "block");
                // alert("전화번호 : 010-1234-5678 형식으로 입력해주시기 바랍니다.");
            }
            else {
                $("#phonenumber").css("border-color", "#efefef");
            }
    
            if (!uEmail("#email")) {
                $("#email").css("border-color", "#ed4956");
                $("#warnemail").css("display", "block");
                // alert("이메일 : 이메일 형식으로 입력해주시기 바랍니다.");
            }
            else {
                 $("#email").css("border-color", "#efefef");
            }
        }
         
    });
});