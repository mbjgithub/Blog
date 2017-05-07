var express=require("express");
var UserModel=require("../models/user");
var ArticleModel=require("../models/article");
var util=require("../methods/public");
//var async=require("async");
var img_prefix="http://127.0.0.1:1337/images/"
var config={
  pageIndex:0,
  pageSize:5
}
var router=express.Router();

router.get("/data",function(req,res){
  var pageSize=req.query.pageSize||config.pageSize
  var pageIndex=req.query.pageIndex||config.pageIndex
	var user="";
    if(req.session.user){   //用session存储用户
           user=req.session.user;
    } 
            //查询条件  需要查询的字段
    ArticleModel.find({},null,{
      sort:{
        createDate:-1
      },
      limit:pageSize,
      skip:pageIndex*pageSize
    }).populate(["author"]).exec(function(err,docs){  //ArticleModel.find({}).limit(5).sort("-createDate")
          if(err){
            console.log("/data 路由出错")
            docs=[]
          }
          docs.forEach(function(doc){
          	doc.commentNum=doc.comments.length;
            doc.img=img_prefix+doc.author.img;
            doc.articleHref="/articles/"+doc._id;
            doc.authorHref="/authors/"+doc.author._id;
            doc.createFormateDate=util.formateDate(doc.createDate);
            doc.content=util.convert(doc.content)
            doc.shortContent=util.ellipsis(doc.content)
          });
          var data={user:user,title:"首页--博客",articles:docs}
          res.json(data)  
          /**
           * 2017-05-07
           * 这里有个问题，单独访问http://127.0.0.1:1337/data
           * 在forEach里面添加的属性，如img，shortContent等是访问不到的
           * 但是，如果是自己渲染的话，就是正常的,很奇怪，这里先挂着这样一个问题
           */
     });
});




module.exports=router;