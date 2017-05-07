$(function(){
	 $(".left-bottom-header-right li").click(function(){
    var dataFlag=$(this).attr("data-flag");
    $(".left-bottom-header-right li").css("color","#999");
    $(this).css("color","#225599");
    console.log(dataFlag);
    $(".left-bottom-center").each(function(i,e){
        if($(this).attr("data-flag")==dataFlag){
          $(this).css("display","block");
        }else{
          $(this).css("display","none");
        }
    });
 });
});