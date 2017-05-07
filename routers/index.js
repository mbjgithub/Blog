var express=require("express");
var UserModel=require("../models/user");
var ArticleModel=require("../models/article");
var util=require("../methods/public");
//var async=require("async");

var router=express.Router();

var config={
  pageIndex:0,
  pageSize:5
}

router.get("/",function(req,res){
  // console.log(req.sessionID)
  // console.log(req.cookies)
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
          docs.forEach(function(doc){
            doc.commentNum=doc.comments.length;
            doc.img=doc.author.img;
            doc.articleHref="/articles/"+doc._id;
            doc.authorHref="/authors/"+doc.author._id;
            doc.createFormateDate=util.formateDate(doc.createDate);
            doc.content=util.convert(doc.content)
            doc.shortContent=util.ellipsis(doc.content)
          });
          res.render("index",{user:user,title:"首页--博客",articles:docs});
     });
});

router.get('/scrollLoad',function(req,res){
    var start=req.body.start
    var num=req.body.num
    renderIndex(req,res,0,5,true)     //true表示是scrollload
})


router.get("/index",function(req,res){
   res.redirect("/");
});

router.post("/search",function(req,res){
   var searchStr=req.body.search;
   if(searchStr!=""||searchStr!=undefined){
      ArticleModel.find({},function(err,docs){
        var articles=[];
        var tags="";
         docs.forEach(function(doc){
          if(doc.title.indexOf(searchStr)>-1){
             articles.push(doc);
          }
         });
         tags=util.tagsSort(docs,searchStr);
         UserModel.find({},function(err,users){
               var authors=[];
               users.forEach(function(user){
                    if(user.username.indexOf(searchStr)>-1){
                      authors.push(user);
                    }
               });
               res.json({tags:tags,authors:authors,articles:articles});
         });
      });
   }
});

router.post("/praiseNum",function(req,res){
     ArticleModel.update({_id:req.body.id},{$set:{praiseNum:req.body.val}},function(err,doc){
          if(err){
            res.render("404page",{user:req.session.user,errorMsg:"/routers/index.js 处理/praiseNum的post请求时发生错误！"});
          }else{
            res.json({});
          }
     });
});

module.exports=router;

//      Model
// .where('age').gte(25)
// .where('tags').in(['movie', 'music', 'art'])
// .select('name', 'age', 'tags')
// .skip(20)
// .limit(10)
// .asc('age')
// .slaveOk()
// .hint({ age: 1, name: 1 })
// .run(callback); 


function renderIndex(req,res,start,num,flag){
  num=num||5
  start=start||0
  var user="";
    if(req.session.user){   //用session存储用户
           user=req.session.user;
    } 
     ArticleModel.find({}).sort("-createDate").populate(["author"]).exec(function(err,docs){
          if(err||docs.length===0){
            res.render("404page",{errorMsg:"获取数据失败"})
            return 
          }
          docs=docs.slice(0,num)
          docs.forEach(function(doc){
            doc.commentNum=doc.comments.length;
            doc.img=doc.author.img;
            doc.articleHref="/articles/"+doc._id;
            doc.authorHref="/authors/"+doc.author._id;
            doc.createFormateDate=util.formateDate(doc.createDate);
          });
          flag?res.json({articles:docs}):
            res.render("index",{user:user,title:"首页--博客",articles:docs});
     });
}