$(function(){
	var tips={"company":["填写公司信息","公司或组织名称"],"job":["填写职位信息","你的职位"],"city":["填写城市信息","你所在城市"],
"sex":["填写性别信息","你的性别"],"school":["填写学校信息","毕业院校"],"profession":["填写专业信息","你的专业"],
"expert":["填写优势信息","你的优势"],"summary":["填写座右铭信息","你的座右铭"]}
   $(".personal-information-right-line-common").on("click",".write-information-a-common",function(){
   	     $(this).next().css("display","inline-block");
   	     $(this).css("display","none");
   });
   $(".personal-information-right-line-common").on("click",".write-information-double-button",function(){
   	     var $this=$(this);
   	     var secondInput,firstInput;
   	     if($this.prev().attr("type")=="radio"){
             firstInput=$this.parent().find("input").first();
             secondInput=$this.parent().find("input[type=radio]:checked");
   	     }else{
             secondInput=$(this).prev();
   	         firstInput=secondInput.prev();
   	     }
   	     if(secondInput.val()==""||secondInput.val()==undefined){
   	     	if(firstInput.val()==""||firstInput.val()==undefined){
                $(this).parent().prev().css("display","inline-block");
                $(this).parent().css("display","none");
                return;
   	     	}
   	     }
   	     var data={};
   	     data[secondInput.attr("name")]=secondInput.val();
   	     data[firstInput.attr("name")]=firstInput.val();
   	     data.username=$(".personal-information-right-username").text();
   	     $.ajax({
   	     	url:"/author/fix",
   	     	method:"POST",
   	     	data:data,
   	     	success:function(data,resText,jqXHR){
   	     		 $this.parent().parent().find(".personal-information-common").remove();
                 if(secondInput.val()==""||secondInput.val()==undefined){
                 	$this.parent().after('<span class="personal-information-company personal-information-common"><span></span><a class="write-information-a-common">'+tips[secondInput.attr("name")][0]+'</a><div class="company-information-div write-personal-information-common"><input type="text" name="'+secondInput.attr("name")+'" placeholder="'+tips[secondInput.attr("name")][1]+'"><button class="write-information-single-button write-information-sure-button">确定</button></div></span>');
                 }else{
                 	$this.parent().after('<span class="personal-information-job personal-information-common"><span>'+secondInput.val()+'</span></span>');
                 }
                 if(firstInput.val()==""||firstInput.val()==undefined){
                 	$this.parent().after('<span class="personal-information-company personal-information-common"><span></span><a class="write-information-a-common">'+tips[firstInput.attr("name")][0]+'</a><div class="company-information-div write-personal-information-common"><input type="text" name="'+firstInput.attr("name")+'" placeholder="'+tips[firstInput.attr("name")][1]+'"><button class="write-information-single-button write-information-sure-button">确定</button></div></span>');
                 }else{
                 	$this.parent().after('<span class="personal-information-job personal-information-common"><span>'+firstInput.val()+'</span></span>');
                 }
                 $this.parent().css("display","none");
   	     	}
   	     });
   });
$(".personal-information-right-line-common").on("click",".write-information-single-button",function(){
   	     var $this=$(this);
   	     var firstInput=$(this).prev();
   	     if(firstInput.attr("type")=="radio"){
   	     	firstInput=$this.parent.find("input[type=radio]:checked");
   	     }
   	     	if(firstInput.val()==""||firstInput.val()==undefined){
                $(this).parent().prev().css("display","inline-block");
                $(this).parent().css("display","none");
                return;
   	     	}
   	     var data={};
   	     data[firstInput.attr("name")]=firstInput.val();
   	     data.username=$(".personal-information-right-username").text();
   	     $.ajax({
   	     	url:"/author/fix",
   	     	method:"POST",
   	     	data:data,
   	     	success:function(data,resText,jqXHR){
   	     		 if($this.parent().parent().find("span").length>0){
   	     		 	$this.parent().parent().find("span").eq(0).text(firstInput.val()).css("display","inline-block");
   	     		 }else{
   	     		 	$this.parent().parent().prepend("<span>"+firstInput.val()+"</span>");
   	     		 }
                 // $this.parent().after('<span class="personal-information-job personal-information-common">'+firstInput.val()+'</span>');
                 $this.parent().css("display","none");
   	     	}
   	     });
   });

$(".personal-information-right-line-common").hover(function(){
	    var acount=0;
	    var divcount=0;
	    $(this).find(".write-information-a-common").each(function(){
	    	if($(this).css("display")=="none"){
	    		acount++;
	    	}
	    });
	    if(acount==$(this).find(".write-information-a-common").length){
	    	$(this).find(".write-personal-information-common").each(function(){
	    		if($(this).css("display")=="none"){
	    		divcount++;
	    	 }
	    	});
	    	if(divcount==$(this).find(".write-personal-information-common").length){
	   	        $(this).find(".personal-information-right-line-fix").css("display","inline-block");
	    	}
	    }
},function(){
	   	$(this).find(".personal-information-right-line-fix").css("display","none");
});

$(".personal-information-right-line-fix").click(function(){
	var span1Text=$(this).parent().find(".personal-information-right-line0-div").find(".personal-information-common").eq(0).find("span").text();
	if($(this).parent().find(".personal-information-right-line0-div").find(".personal-information-common").length==1){
      $(this).parent().find(".personal-information-right-line0-div").find(".personal-information-common").find("span").css("display","none");
      var div=$(this).parent().find(".personal-information-right-line0-div").find(".write-personal-information-common");
      if(div.length==2){
      	div.eq(1).prev().remove();
      	div.eq(1).remove();
      	div=div.eq(0);
      }
      div.find("input").val(span1Text);    //有可能是input，也又可能是textarea，通过find函数找不到会返回一个空的jquery对象，这个不会报错
      div.find("textarea").val(span1Text);
	}else{
	$(this).parent().find(".personal-information-right-line0-div").find(".personal-information-common").css("display","none");
    var span2Text=$(this).parent().find(".personal-information-right-line0-div").find(".personal-information-common").eq(1).find("span").text();
	var div=$(this).parent().find(".personal-information-right-line0-div").find(".job-company-information-div");
	if(div.length>=2){
		div.first().remove();
	}
	div.find("input").eq(0).val(span1Text);
	if(div.find("input[type=radio]").length>0){
		div.find("input").eq(1).val()==span2Text?div.find("input").eq(1).attr("checked","checked"):div.find("input").eq(2).attr("checked","checked");
	}else{
	    div.find("input").eq(1).val(span2Text);
	}
  }
	div.css("display","inline-block");
	$(this).css("display","none");
});


 $(".personal-information-img").click(function(){
    $(".imgChange").click();
 });
 $(".imgChange").change(function(){
    var val=$(this).val();
    var img="jpg,png,jpeg,gif,bmp";
    if(val==""||val==null){
      return;
    }else if(img.indexOf(val.substring(val.lastIndexOf(".")+1))<0){
      alert("请选择图片");
      return;
    }
    var author_id=$(".personal-information-left-a").attr("href");
    $(".imgChangeForm").ajaxSubmit({
      url:"/imgChange"+author_id,
      method:"POST",
      success:function(data,resText,jqXHR){
          if(data.imgPath){
            $(".personal-information-img").attr("src",data.imgPath);
          }
      }
    });
 });

});