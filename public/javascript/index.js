
$(document).ready(function(){
	$(".left").on("click",".sprite-delete",function(){
		$(this).parents(".line").css("display","none");
	});
	$(".left").on("click",".praiseNum.",function(){
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

    

});