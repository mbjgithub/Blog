/**
 * 针对那个public.js，可以使用指令的方式，或者其他的方式来渲染，那样渲染确实太挫了
 * 把数据传给component，然后在component里面进行处理
 */

require('../c/directives/listitem')
require('../c/comps/nav/nav')
require('../c/comps/article/article')
require('../c/comps/search/search')
// require("../c/pages/index/index")

window.App=function(){
	new Reve({
       el:document.body,
       ready:function(){
       	
       }
	})
}
