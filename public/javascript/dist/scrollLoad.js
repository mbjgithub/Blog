/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var articleTpl=__webpack_require__(1)

	var compileReg=/{%\s*=\s*(?:(?:['"])([^{}]*)(?:['"])\+)*([\w-\.]+)[\+]?(\w*)\s*%}/gm
	var pageContext={
	    pageIndex:0,
	    pageSize:5
	}
	var _throttle=200
	var timer

	function getClientHeight() {
	    if (document.compatMode == 'BackCompat') {
	        return document.body.clientHeight
	    } else {
	        return document.documentElement.clientHeight
	    }
	}



	function compile(tpl,data){
	    return tpl.replace(compileReg,function(a,b,c,e){
	        var d=c.split('.')
	        var res,temp;
	        temp=d.length<=1?data[d[0]]:data[d[0]][d[1]]
	        if(temp==undefined){
	            temp=""
	        }
	        return (b||"")+temp+(e||"")
	    })
	}

	$(window).on('scroll',function(e){
	    var loadTip=$('.loadTip')
	    loadTip.css('display','block')
	    if(loadTip[0].getBoundingClientRect().top+10<getClientHeight()){
		if(timer!=undefined) clearTimeout(timer)
		timer=setTimeout(function(){
	        scrollLoad(e)
		},_throttle)
	  }
	})


	function scrollLoad(e){
	    var left=$('.left')
	    pageContext.pageIndex++
		$.ajax({
	        method:"POST",
	        url:'/scrollLoad',
	        data:pageContext,
	        success:function(data){
	            var articles=data.articles||[]
	            if(articles.length){
	                var fragment=document.createDocumentFragment()
	                var tpl
	                articles.forEach(function(article){
	                    tpl= compile(articleTpl,article)
	                    tpl=$(tpl)
	                    var titleSrc=tpl.find('.title-src')
	                    if(titleSrc.attr("src").indexOf('/')<=-1){
	                        titleSrc.remove()
	                    }
	                    fragment.appendChild(tpl[0])
	                })
	               
	                $(fragment).insertBefore($('.left').find('.loadTip'))
	                 $('.loadTip').css('display','none')
	            }else{
	                 $('.loadTip').text("没有更多文章了")
	                 $(window).off('scroll')
	            }
	        }
	    })
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "<div class=\"line\">  <div class=\"left-first\">   <img src=\"{%= img %}\" />  <div class=\"praise\">   <a class=\"praiseNum\" data-flag=\"no\" data-articleId=\"{%= _id %}\">   {%= praiseNum %}</a>  </div> </div> <div class=\"left-second\">  <div class=\"tags-sprite\">   <div class=\"tags\">来自标签:{%= tags %}</div>   <div class=\"sprite-delete\" alt=\"不感兴趣\" title=\"不感兴趣\"></div>  </div>  <div class=\"title\">   <a href=\"{%= articleHref %}\" >    {%= title %}   </a>  </div>  <div class=\"author\">   <a href=\"{%= authorHref %}\">    <span class=\"authorname\">{%= author.username %}</span>   </a>    <span>,</span>    <span>{%= author.summary %}</span>    <span>创作于:</span>    <span>{%= createFormateDate %}</span>     </div>  <div class=\"content\">   <img src=\"{%= titleSrc %}\" class=\"title-src\" />  <!-- 题图 -->   <a class=\"sub-content\" href=\"{%= articleHref %}\">    <span class=\"sub-content-ellipsis\">{%= shortContent %}<span class=\'show-all\'>显示全部</span></span>   </a>   <div style=\"display:none\" class=\"store-content\">{%= content %}<span class=\'show-ellipsis\'>收起</span></div>  </div>  <div class=\"comment\">   <a href=\"{%= articleHref+\'#comments\' %}\" >    <span>评论({%= commentNum %})</span>   </a>   <a href=\"{%= articleHref %}\" >    <span>阅读({%= visitedNum %})</span>   </a>  </div> </div> </div>"

/***/ }
/******/ ]);