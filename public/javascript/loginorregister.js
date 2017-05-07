$(document).ready(function(){
	console.log($("#registerForm").attr("data-flag"));
    if($("#registerForm").attr("data-flag")=="false"){
    	// $("#login").trigger("click");can trigger all the time,i do not konw why
    	login();
    }
	$("#login").on("click",login);
	$("#register").on("click",register);

  $("#email").keyup(function(){
    var $email=$(this).val();
    console.log($email);
    var validateEmail=$email.match(/(.)+@(.)+\.(.)*/);
    if(validateEmail==null||validateEmail==""){
       $(this).next().text("邮箱格式不对").css("color","#f00");
    }else{
      $(this).next().text("邮箱格式正确").css("color","#0f0");
    }
  });
  $("#password").keyup(function(){
      if($("input[type=submit]").val()=="注册博客"){
      if($(this).val().length>5){
        $(this).next().text("密码格式正确").css("color","#0f0");
      }else{
        $(this).next().text("密码少于6位").css("color","#f00");
      }
    }
  });
  $("#username").keyup(function(){
    if($("input[type=submit]").val()=="注册博客"){
    var val=$(this).val();
    if(val!=""){
      $.ajax({
        url:"/validateUsername",
        method:"POST",
        data:{"user":val},
        success:function(data,resText,jqXHR){
             if(data.isExit=="true"){
               $("#username").next().text("用户名已存在").css("color","#f00");
             }else{
               $("#username").next().text("用户名正确").css("color","#0f0");
        }
      }
    });
   }
  }
 });
	function login(){
		if($("#left").css("backgroundColor")=="rgb(15, 136, 235)"){
          $("#right").css("backgroundColor","#0F88EB");
          $("#left").css("backgroundColor","#fff");
          $("#register").css("color","#000");
          $("#login").css("color","#0F88EB");
          $("#registerForm").attr("action","/loginJudge")
          .find("input[name=username]").attr("placeholder","用户名或邮箱").end()
          .find("input[type=submit]").attr("value","登陆博客").end()
          .find(".emailDiv").remove();
          $("input[name=username]").next().html("");
          $("input[name=password]").next().html("");
      }
    }
    function register(){
    	if($("#right").css("backgroundColor")=="rgb(15, 136, 235)"){
		$("#right").css("backgroundColor","#fff");
		$("#left").css("backgroundColor","#0F88EB");
		$("#register").css("color","#0F88EB");
		$("#login").css("color","#000");
		$("#registerForm").attr("action","/login").find("input[name=username]").attr("placeholder","用户名")
    .end().find(".usernameDiv")
		.after('<div class="emailDiv"><input type="text" name="email" placeholder="邮箱" id="email"><span class="emailTips"></span></div>').end()
		.find("input[type=submit]").attr("value","注册博客");
		}
    }
});