$(function(){
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