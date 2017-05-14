//接下来需要做的就是把comment.js引入到需要评论的文件中就行,但是要用到webpack，打包js和tpl

// var commentTpl=require('./template/comment.tpl')
var commentTpl
var _id
var compileReg=/{%\s*=\s*(?:(?:['"])([^{}]*)(?:['"])\+)*([\w-\.]+)\s*%}/gm
var margin=40

function parse(comments,parent){
	comments.forEach(function(comment){
         	var currParent=render(comment,parent)     //评论渲染
            $(currParent).css('marginLeft',margin)
            parse(comment.replied,currParent)
	})
}

function render(comment,parent){
	var compiledTpl=compile(commentTpl,comment)
    var ul
    compiledTpl=$(compiledTpl)
    ul=compiledTpl.find('ul')
    parent.append(compiledTpl)
    return ul
}

function compile(tpl,data){
    return tpl.replace(compileReg,function(a,b,c){
        var d=c.split('.')
        var res
        res=d.length<=1?(b||"")+data[d[0]]:
              (b||"")+data[d[0]][d[1]]
        return res
    })
}

$(function(){
    setTimeout(function(){
    var start=location.href.lastIndexOf('/')+1
    var anchor=location.href.indexOf("#",start)
    if(~anchor){
        _id=location.href.slice(start,anchor)||""
    }else{
        _id=location.href.slice(start)||""
    }
    var parent=$('.article-right-comment-content')
    var sonUl=parent.find('.article-right-comment-ul').first()
    commentTpl=sonUl.html()
    sonUl.html("")
    if(!_id) return
    $.ajax({
        method:'POST',
        url:'/comments',
        data:{_id:_id},
        success:function(data,resText,JQXHR){
            console.log(data)
            if(data.err){
                parent.text(data.err)
            }else if(data.tips){
                parent.text(data.tips)
            }else{
                parse(data.comments,sonUl)
            }
            parent.css('display',"block")
        }
    })
    },100)
    $('.article-right-comment').on("click",".commentBtn",function(e){
        saveComment.call(this,e)
    })
    $('.article-right-comment').on("click",'.cm-replayNum',function(e){
        var commentModule=$('.article-right-comment-header').first().clone()
        $(this).parent().parent().append(commentModule)
    })

     $('.article-right-comment').on("click",".cm-praise,.cm-oppose",function(e){
        if(this.isClicked) return
        var em=$(this).find('em')
        var num=em.text()
        num=parseInt(num)+1
        em.text(num)
        var comment_id=$(this).parent().find('.cm-replayNum').attr('data-parentId')
        var key=$(this).hasClass('cm-praise')?"praiseNum":"opposeNum"
        this.isClicked=true
        $.ajax({
            method:"POST",
            url:"/saveCommentNum",
            data:{
                article_id:_id,
                comment_id:comment_id,
                num:num,
                key:key
            },
            success:function(){
                
            }
        })
    })
     
    function saveComment(e){
        var that=$(this)
        var isReply=true
        if(that.parent().parent().hasClass("article-right-comment")){
             isReply=false
        }
        var commentText=that.prev()
        var content=commentText.val()
        commentText.focus()
        if($('.top-nav-center-profile-mainpage').length<=0){
            location.href="http://127.0.0.1:1337/loginorregister/login"
            //?path=/articles/"+_id
            return
        }
        if(content.length<=0){
            alert("评论不能为空")
            return
        }
        var data={
                content:content,
                _id:_id
            }
        if(isReply){
            var temp=that.parent().prev().find('.cm-replayNum')
            data.parent_id=temp.attr("data-parentId")
            data.author_id=temp.attr("data-authorId")
        }
        $.ajax({
            method:'POST',
            url:"/saveComments",
            data:data,
            success:function(data,resStatus,JQXHR){
                 if(data.errCode<0){
                    alert(data.errMsg)
                 }else{
                    var parent
                    if(isReply){
                        parent=that.parent().parent().next()
                        that.parent().remove()
                    }else{
                        parent=$('.article-right-comment-ul').first()
                    }
                    parse(data.comment,parent)
                 }
            }
        })
    }

})