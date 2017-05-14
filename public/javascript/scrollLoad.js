var articleTpl=require('./template/article.tpl')

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