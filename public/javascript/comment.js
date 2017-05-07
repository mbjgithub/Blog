//接下来需要做的就是把comment.js引入到需要评论的文件中就行,但是要用到webpack，打包js和tpl

// var commentTpl=require('./template/comment.tpl')
var commentTpl
var _id
var compileReg=/<%\s*=\s*(?:(?:['"])([^><]*)(?:['"])\+)*([\w-\.]+)\s*%>/gm


function parse(comments,parent){
	comments.forEach(function(comment){
         	var currParent=render(comment,parent)     //评论渲染
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
        return (b||"")+data[c]
    })
}

$(function(){
    setTimeout(function(){

    _id=location.href.slice(location.href.lastIndexOf('/')+1)||""
    console.log(_id)
    var parent=$('.article-right-comment-content')
    commentTpl=parent.html()
    if(!_id) return
    $.ajax({
        method:'POST',
        url:'/comments',
        data:{_id:_id},
        success:function(data,resText,JQXHR){
            if(data.err){
                parent.text(data.err)
            }else if(data.tips){
                parent.text(data.tips)
            }else{
                parse(data.comments,parent.find('.article-right-comment-ul'))
            }
        }
    })
    },100)
    $('.commentBtn').click(function(e){
        saveComment.call(this,e)
    })

    function saveComment(e,isReply){
        var content=$('.commentText').val()
        if(content.length<=0){
            alert("评论不能为空")
            return
        }
        if($('.top-nav-center-profile-mainpage').length<=0){
            location.href="http://127.0.0.1:1337/loginorregister/login?path=/articles/"+_id
            return
        }
        // var userinfo=($('.top-nav-center-profile-mainpage').data('userinfo')||"").split(',')
        // if(userinfo.length<=0){
        //     location.href="http://127.0.0.1:1337/loginorregister/login?path=/articles/"+_id
        //     return
        // }
        // if(!(userinfo[0]&&userinfo[1]&&userinfo[2])){
        //     alert('获取用户信息失败，请重试')
        //     return
        // }
        var data={
                content:content,
                _id:_id
            }
        // if(isReply){
        //     data.parent_id=$('')
        // }
        $.ajax({
            method:'POST',
            url:"/saveComments",
            data:data,
            success:function(data,resStatus,JQXHR){
                 if(data.errCode<0){
                    alert(data.errMsg)
                 }else{
                    // if(isReply){
                    //     //如果是回复的话，要在该回复下，做一个评论，当前最有效的方法就是，reload
                    // }
                    location.reload()
                 }
            }
        })
    }
})