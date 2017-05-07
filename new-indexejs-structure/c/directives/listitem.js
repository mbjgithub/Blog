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