/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


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


/***/ }),
/* 1 */
/***/ (function(module, exports) {


module.exports=Reve.component("nav",{
	data:function(){
    return {
        isLogin:false,
        showProfile:false
      }
	},
	methods:{
       onMouseover:function(){
          if(this.$data.isLogin){
             this.$data.showProfile=true
             this.$update()
          }
       },
       onMouseout:function(){
       	   this.$data.showProfile=false
       	   this.$update()
       }
	}
})



/***/ }),
/* 2 */
/***/ (function(module, exports) {



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



/***/ }),
/* 3 */
/***/ (function(module, exports) {

//指令用法r-for={obj}
//指令内部用key表示obj的key，用value表示obj的值

function render(tpl,items){
	var str=""
	var copy
	for(var key in items){
		copy=tpl
		copy=copy.replace(/\{\s*key\s*\}/gmi,key)
		if(typeof items[key]=='object'){
             copy=copy.replace(/\{\s*value\.([\w]+)\s*\}/gim,function(a,b){
                  return items[key][b]
             }) 
		}else{
			copy=copy.replace(/\{\s*value\s*\}/gim,items[key])
		}
		str+=copy
	}
	return str
}
module.exports=Reve.directive("for",{
	bind:function(items,expr){  //items是表达式的值，expr是表达式
        this.$el.innerHTML=render(this.$el.innerHTML,items)
	},
	update:function(items){
        //当没有shouldUpdate或者shouldUpdate的返回值为true的时候，执行该函数
	},
	shouldUpdate:function(newItems,oldItems){
        this.$el.innerHTML=render(this.$el.innerHTML,newItems)
	}
})

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 针对那个public.js，可以使用指令的方式，或者其他的方式来渲染，那样渲染确实太挫了
 * 把数据传给component，然后在component里面进行处理
 */

__webpack_require__(3)
__webpack_require__(1)
__webpack_require__(0)
__webpack_require__(2)
// require("../c/pages/index/index")

window.App=function(){
	new Reve({
       el:document.body,
       ready:function(){
       	
       }
	})
}


/***/ })
/******/ ]);