$(document).ready(function(){
	$(".sprite-delete").click(function(){
		$(this).parents(".line").css("display","none");
	});
	$(".praiseNum").click(function(){
		var val=$(this).text();
		var $this=$(this);
		val=(val==""||val==null)?0:parseInt(val);
		if($(this).attr("data-flag")=="yes"){
			val--;
		}else{
			val++;
		}
		var id=$(this).attr("data-articleId");
		$.ajax({
			url:"/praiseNum",
			method:"POST",
			data:{val:val,id:id},
			success:function(data,resText,jqXHR){
				$this.text(val);
				if($this.attr("data-flag")=="yes"){
					$this.attr("data-flag","no");
				}else{
					$this.attr("data-flag","yes");
				}
			}
		});
	});

    $(".authorname").hover(function(){

    },function(){
    	
    });

});