$(function(){
   var clickFlagPraise=0,clickFlagOppose=0;
   $(".article-right-tail-num span").click(function(){
      var flag=$(this).text().indexOf("顶")>-1?true:false;
      if((clickFlagPraise==0&&flag==true)||(clickFlagOppose==0&&flag==false)){
      var num=parseInt($(this).find("i").text());
      num++;
      $(this).find("i").text(num);
      $(this).find("div").text("+1 ~").fadeOut(1000);
      $.ajax({
         url:"/detailArticle/num",
         method:"POST",
         data:{"num":num,"flag":flag,"_id":$(".store-id").text()}
      });
      if(flag){
         clickFlagPraise=1;
      }else{
         clickFlagOppose=1;
      }
      }else{
         $(this).find("div").css("display","block");
         $(this).find("div").text("您已经点过了").fadeOut(1000);
      }
   });

  $(".show-all").click(function(e){
       e.stopImmediatePropagation();
       e.preventDefault();
       $(this).parent().parent().prev().addClass("title-src-big");
       $(this).parent().parent().css("display","none");
       $(this).parent().parent().next()
       .css("display","block")
       .append("<span class='show-ellipsis'>收起</span>");
       $(this).parent().parent().next().find("span").click(function(){
           $(this).parent().css("display","none");
           $(this).parent().prev().prev().removeClass("title-src-big");
           $(this).parent().prev().css("display","inline-block");
           $(this).remove();
       });
   });

});