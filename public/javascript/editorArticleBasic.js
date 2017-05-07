$(document).ready(function(){
	$(".title").focus(function(){
		if($(".titlePlaceHolder").length!=0){
            $(this).html("");
		}
	}).blur(function(){
		if($(this).html()==""||$(this).html()=="<br>"){
			$(this).html("");
			$(this).append("<span class='titlePlaceHolder'>请输入文章标题</span>");
		}
	});
	// $(".content").focus(function(){
	// 	if($(".contentPlaceHolder").length!=0){
 //            $(this).html("");
	// 	}
	// }).blur(function(){
	// 	if($(this).html()==""){
	// 		$(this).append("<span class='contentPlaceHolder'>请输入文章内容</span>");
	// 	}
	// });
   
   $(".titleImg").click(function(){
   	$(".uploadFile").trigger("click");
   });
 $(".uploadFile").change(function(){
      PreviewImg();  //该函数只需要两个参数，一个是input[type=file]的元素，一个是显示图片的元素
  });
 $(".article-release-common").hover(function(){
     $(".article-release-common").toggleClass("article-release-common-hover");
     $(".article-release-left").toggleClass("article-release-left-hover");
     $(".article-release-right").toggleClass("article-release-right-hover");
 });
 $(".recommend-tags-tips-ul li").click(function(){  /*这里有个bug，就是选择了之后，之间还可以获得焦点*/
     var value=$(this).text().replace(/(,)+/g,"");
     createTagBlock(value);
 });
 $(".article-tags-contentInput").keyup(function(e){
     if($(this).val().replace(/^\s+$/,"")==""||$(this).val()==undefined){
         if(e.which==8){  //backspace
          $(".tag-block").last().remove();
         }
         if(e.which==32){
          $(this).val("");
         }
     }else{
         if(e.which==32){
           if($(this).val().substr($(this).val().length-1,1)==" "){
               var value=$(this).val().replace(/(;)+/g,"");
               createTagBlock(value);
               $(this).val("").focus();
           }
         }
     }
 });
 $(".article-tags-contentInputDiv").click(function(){
    $(".article-tags-contentInput").focus();
 });
 $(".article-tags-contentInputDiv").one("click",function(){
    $(this).find("em").remove();
    $(".article-tags-contentInput").focus();
     $(".recommend-tags").addClass("recommend-tags-display");
 });
$(".article-tags-tips-sprites").click(function(){
     $(".article-tags-expand").toggleClass("article-tags-contract");
     $(".recommend-tags").toggleClass("recommend-tags-display");
});
$(".article-allow-common").click(function(){
     var span=$(this).find(".divs").find("span");
     if(span.hasClass("article-allow-common-sprites")==true){
         span.removeClass("article-allow-common-sprites");
         $(this).find("input").val(0);
     }else{
         $(this).find("input").val(1);
         span.addClass("article-allow-common-sprites");
     }
});
 function createTagBlock(value){
  var count=$(".tag-block").length;
     if(count<5){
     var tagBlock=$("<div class='tag-block'><span class='tag-block-words'>"+value+"</span><span class='tag-block-span'><span class='tag-block-sprites'></span></span>");
     $(".article-tags-contentInput").before(tagBlock);
     $(".tag-block-span").click(function(){
         $(this).parent().remove();
     });
   }else{
     alert("最多输入5个标签");
   }
 }
 function PreviewImg(){
         	var fileObj=$(".uploadFile")[0];
         	var extensions="jpg,png,jpeg,gif,bmp";
         	var imgExtension=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1);
         	var browserVersion=window.navigator.userAgent.toUpperCase();
         	if(extensions.indexOf(imgExtension)>-1){  //判断文件格式
                if(fileObj.files){  //如果支持filelist
                    	var reader=new FileReader();
                    	reader.onload=function(e){
                             $(".uploadImg").attr("src",e.target.result);
                    	}
                    	reader.readAsDataURL(fileObj.files[0]);
                }else if(browserVersion.indexOf("MSIE")>-1){  //不支持filelist
                      	$(".uploadImg").attr("src",fileObj.value);
                }else if(browserVersion.indexOf("FIREFOX")>-1){  //filefox不支持filelist
                       var fileFoxVersion=parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
                       if (firefoxVersion < 7) {//firefox7以下版本
                       	  console.log("firefox<7");
                          $(".uploadImg").attr("src",fileObj.files[0].getAsDataURL());
                       } else {//firefox7.0+ 
                       	console.log("firefox7.0+");
                          $(".uploadImg").attr("src",window.URL.createObjectURL(fileObj.files[0]));
                      }
                }else{   //其他版本的浏览器
                	$(".uploadImg").attr("src",fileObj.value);
                }
         	}else{  //文件格式不正确
         		alert("上传的文件格式不正确!");
         		fileObj.value="";
         	}
         }
});