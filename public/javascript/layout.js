$(document).ready(function(){
	$(".top-nav-center-profile").mouseover(function(){
		if($(".loginorregister").length==0)
		{
          $(".profile-ul").css("display","block");
        }
	});
	$(".top-nav-center-profile").mouseout(function(){
        $(".profile-ul").css("display","none");
	});

	$(".top-nav-center-search-input").keyup(function(){
		var val=$(this).val();
		$(".top-nav-center-search-result-tags").html("");
			$(".top-nav-center-search-result-authors").html("");
			$(".top-nav-center-search-result-articles").html("");
		if(val!=""){
		    $.ajax({
		    	url:"/search",
		    	method:"POST",
		    	data:{"search":val},
		    	success:function(data,resText,jqXHR){
		    		$(".top-nav-center-search-result").css("display","block");
                    	for(var tag in data.tags){
                    		if(tag==null||tag=="") break;
                    		$(".top-nav-center-search-result-tags").append("<li><a href='/tags/"+tag+"' >"+tag+"</a>文章数量("+data.tags[tag]+")</li>");
                    	}
                    if(data.authors.length>0){
                          data.authors.forEach(function(author){
                             $(".top-nav-center-search-result-authors").append("<li><a href='/authors/"+author._id+"' >"+author.username+"</a>职位("+(author.job||"暂无")+")</li>");
                          });
                    }
                    if(data.articles.length>0){
                    	data.articles.forEach(function(article){
                             $(".top-nav-center-search-result-articles").append("<li><a href='/articles/"+article._id+"' >"+article.title+"</a>点赞数量("+(article.praiseNum||"0")+")</li>");
                    	});
                    }
		    	}
		    });
		}
	});
   $(".top-nav-center-search-input").focus(function(){
   	   var res=$(".top-nav-center-search-result");
   	   if(res.find("li").length>0&&res.css("display")=="none"){
           res.css("display","block");  
   	   }
   });
   //一个问题，怎么样点击其他的地方，让生成的搜索消失
   $(document).click(function(e){
       var search=$(".top-nav-center-search");
       var leftMin=search.position().left;
       var topMin=search.position().top;
       var leftMax=search.outerWidth()+leftMin;
       var topMax=search.outerHeight()+topMin;
       
       var res=$(".top-nav-center-search-result"); 
       var resLeftMin=res.position().left+leftMin;
       var resTopMin=res.position().top+topMin;
       var resLeftMax=res.outerWidth()+resLeftMin;
       var resTopMax=res.outerHeight()+resTopMin;
       if(e.pageX>leftMin&&e.pageX<leftMax&e.pageY>topMin&&e.pageY<topMax){
       	  return;
       }else if(e.pageX>resLeftMin&&e.pageX<resLeftMax&&e.pageY>resTopMin&&e.pageY<resTopMax){
          return;
       }else{
       	res.css("display","none");
       }
   });
});