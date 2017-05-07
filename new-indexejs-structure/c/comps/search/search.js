

//这个组件有依赖于listitem指令
module.exports=Reve.component("search",{
	data:function(){
    return {
        tags:[],
        articles:[],
        authors:[],
        showSearchResult:false
      }
	},
	ready:function(){
		var that=this
        $(document).click(function(e){
        if(!that.$data.showSearchResult) return
       var search=$(that.$el);
       var leftMin=search.position().left;
       var topMin=search.position().top;
       var leftMax=search.outerWidth()+leftMin;
       var topMax=search.outerHeight()+topMin;
       
       var res=search.find(".top-nav-center-search-result"); 
       var resLeftMin=res.position().left+leftMin;
       var resTopMin=res.position().top+topMin;
       var resLeftMax=res.outerWidth()+resLeftMin;
       var resTopMax=res.outerHeight()+resTopMin;
       if(e.pageX>leftMin&&e.pageX<leftMax&e.pageY>topMin&&e.pageY<topMax){
       	  return;
       }else if(e.pageX>resLeftMin&&e.pageX<resLeftMax&&e.pageY>resTopMin&&e.pageY<resTopMax){
          return;
       }else{
       	that.$data.showSearchResult=false
       }
     })
	},
	methods:{
       onFocus:function(){
       	   var $data=this.$data
       	   if(!$data.showSearchResult&&($data.tags.length||$data.articles.length||$data.authors.length)){
       	   	   $data.showSearchResult=true
       	   	   this.$update()
       	   }
       },
       onKeyup:function(e){
           var val=$(e.target).val()
           var that=this
           if(val!=""){
           	  $.ajax({
		    	url:"/search",
		    	method:"POST",
		    	data:{"search":val},
		    	success:function(data,resText,jqXHR){
		    		that.$data.showSearchResult=true
                    that.$data.tags=data.tags
                    that.$data.authors=data.authors
                    that.$data.articles=data.articles
                    that.$update()
		    	},
		    	fail:function(){
		    		alert("网络错误，请重试")
		    	}
		    })
           }
       }
	}
})

