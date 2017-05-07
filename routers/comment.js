var express=require('express')
var ArticleModel=require('../models/article')

var app=express.Router()

app.post('/comments',function(req,res){
   ArticleModel.find({_id:req.body._id},function(err,article){
         if(err||article==undefined){
         	res.json({err:'连接数据库出错,请检查你的网络'})
         	return
         }
         var comments=article.comments||[]
         if(comments.length===0){
         	res.json({tips:'暂时没有评论，快来抢沙发吧'})
         }else{
         	formateComments(comments)
         	res.json({comments:comments})
         }
   })
})
/**
 * [首先得搞清楚是评论还是回复，如果是评论，直接找到文章所对应的评论，存储
 * 如果是回复，找到文章，然后存储评论，并且找到主贴的id，填上这个主贴回复的id]
 * @param  {[type]} req    [description]
 * @param  {[type]} res){                 var user [description]
 * @return {[type]}        [description]
 */
app.post('/saveComments',function(req,res){
    var user=req.session.user
    if(!user){
    	res.json({errMsg:"用户未登陆",errCode:-1})
    	return 
    }
    var body=req.body
    ArticleModel.findOne({_id:body._id},function(err,article){
    	if(err||!article){
    		res.json({errMsg:"查询文章失败",errCode:-2})
    	    return 
    	}
        var comments=article.comments||[]
        comments.push({
        	content:body.content,
        	author_id:user._id,
	    	author_img:user.img,
	    	author_username:user.username,
        	praiseNum:0,
        	opposeNum:0,
	    	reply_id:[],
        })
        if(body.parent_id){   //如果有父id，表明是回复者别人的帖子
            comments.forEach(function(comment){
                if(comment.author_id===body.parent_id){
                	comment.replied_id=comment.replied_id||[]
                	comment.replied_id.push(user._id)
                }
            })
        }
        ArticleModel.update({_id:body._id},{comments:comments},function(err){
             err?res.json({errMsg:"保存评论失败",errCode:-3}):
                  res.json({success:"保存成功",errCode:0})
        })
    })
})

module.exports=app

/**
 * [formateComments 将id转变为对象，并且是回复的评论要删除掉，因为id中已经指向了]
 * @param  {[type]} comments [description]
 * @return {[type]}          [description]
 */
function formateComments(comments){
	var reply,map={};
	comments.forEach(function(item){
         map[item._id]=item
         formateDate(item)      //item.formateDate='1小时前'
	})
	comments.forEach(function(item){
		reply=item.reply_id||[]
		item.replied=[]
		reply.forEach(function(replied_id){
             item.replied.push(map[replied_id])
             map[replied_id].isReply=true
		})
	})

	for(var i=0;i<comments.length;i++){
		if(comments[i].isReply){
			comments.splice(i,1)
			i--
		}
	}
}

function formateDate(item){
	var time=new Date().getTime()-item.date
	var formateDate;
	time=time/1000
	if(time<60){
       formateDate="刚刚"
	}else if(time<3600){
		formateDate=parseInt(time/60)+"分钟以前"
	}else if(time<86400){
		formateDate=parseInt(time/3600)+"小时以前"
	}else if(time<2592000){
		formateDate=parseInt(time/86400)+"天以前"
	}else if(time<31104000){
		formateDate=parseInt(time/259200)+"月以前"
	}else{
		formateDate="评论很久了"
	}
	item.formateDate=formateDate
}

// var test=[
//    {
//    	_id:1,
//    	reply_id:[3,5],
//    	author_username:"mbj"
//    },
//    {
//    	_id:2,
//    	reply_id:[],
//    	author_username:'wmy'
//    },
//    {
//    	_id:3,
//    	reply_id:[4],
//    	author_username:'mgs'
//    },
//    {
//    	_id:4,
//     reply_id:[5],
//     author_username:"hcx"
//    },
//    {
//    	_id:5,
//    	reply_id:[],
//    	author_username:'mfj'
//    }
// ]



