
module.exports=Reve.component('detail',{
	data:function(){
		return {
		  showArticle:true
		}
	},
	methods:{
		onClick:function(){
			this.$data.showArticle=false
			this.$update()
		},
		showAll:function(e){
           e.stopImmediatePropagation();
           e.preventDefault();
           $(e.target).parent().parent().prev().addClass("title-src-big");
           $(e.target).parent().parent().css("display","none");
           $(e.target).parent().parent().next()
           .css("display","block")
		},
		showEllipsis:function(e){
           $(e.target).parent().css("display","none");
           $(e.target).parent().prev().prev().removeClass("title-src-big");
           $(e.target).parent().prev().css("display","inline-block");
		},
		praiseClick:function(e){
		var $this=$(e.target);
		var val=$this.text();
		val=(val==""||val==null)?0:parseInt(val);
		if($this.attr("data-flag")=="yes"){
			val--;
		}else{
			val++;
		}
		var id=$this.attr("data-articleId");
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
		})
	  }
	}
})
