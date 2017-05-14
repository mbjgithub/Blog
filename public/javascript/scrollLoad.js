var articleTpl=require('./template/article.tpl')

var compileReg=/{%\s*=\s*(?:(?:['"])([^{}]*)(?:['"])\+)*([\w-\.]+)\s*%}/gm
var pageContext={
    pageIndex:0,
    pageSize:5
}
var _throttle=200

function compile(tpl,data){
    return tpl.replace(compileReg,function(a,b,c){
        var d=c.split('.')
        var res
        res=d.length<=1?(b||"")+(data[d[0]]||""):
              (b||"")+(data[d[0]][d[1]]||"")
        return res
    })
}

$(window).on('scroll',function(){
    $('.loadTip').css('display','block')
	if(timer!=undefined) clearTimeout(timer)
	timer=setTimeout(function(){
        scrollLoad()
	},_throttle)
})


function scrollLoad(){
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
                    fragment.appendChild($(tpl)[0])
                })
                $('.left').append(fragment)
                 $('.loadTip').css('display','none')
            }else{
                 $('.loadTip').text("没有更多文章了")
            }
        }
    })
}