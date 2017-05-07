var http=require('http')
var url=require('url')
var Promise=require('promise')
var request=require('request')

var renderPage = require('./node/render-page')
var util=require('./node/utils')
var jsonp=require('@tencent/jsonp')

http.createServer(function(req,res){
    if(url.parse(req.url).path==='/'){
     request('http://127.0.0.1:1337/data',function(err,response,body){
         if(err){
           res.write(err)
         }else{
           res.setHeader('Content-Type', 'text/html')
           console.log(JSON.parse(body).articles[0].shortContent)
           var html=renderPage("index",JSON.parse(body),{serverSideRender:true})
           res.write(html)
         }
         res.end()
     })
   }
}).listen(1338,"127.0.0.1",function(){
	console.log("server is runiing")
})

// http.createServer(function(req,res){
//    if(url.parse(req.url).path==='/'){
//    	renderIndex(req,res,0,5).then(function(data){
//          res.setHeader('Content-Type', 'text/html')
//          var html=renderPage("index",data,{serverSideRender:true})
//          res.write(html)
//          res.end()
// 	},function(reason){
//          res.write(JSON.stringify(reason))
//          res.end()
// 	})
//    }
// }).listen(1338,"127.0.0.1",function(){
// 	console.log("server is runiing")
// })



function renderIndex(req,res,start,num,flag){
   return new Promise(function(resolve,reject){
  num=num||5
  start=start||0
  var user="";
  var data
    if(req.session.user){   //用session存储用户
           user=req.session.user;
    } 
     ArticleModel.find({}).sort("-createDate").populate(["author"]).exec(function(err,docs){
          if(err||docs.length===0){
            res.reject({errorMsg:"获取数据失败"})
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
          data=flag?{articles:docs}:{user:user,title:"首页--博客",articles:docs}   
          resolve(data)   
     });
   })
}


// var config={
//   pageIndex:0,
//   pageSize:5
// }

// router.get("/",function(req,res){
//   var pageSize=req.query.pageSize||config.pageSize
//   var pageIndex=req.query.pageIndex||config.pageIndex
// 	var user="";
//     if(req.session.user){   //用session存储用户
//            user=req.session.user;
//     } 
//             //查询条件  需要查询的字段
//     ArticleModel.find({},null,{
//       sort:{
//         createDate:-1
//       },
//       limit:pageSize,
//       skip:pageIndex*pageSize
//     }).populate(["author"]).exec(function(err,docs){  //ArticleModel.find({}).limit(5).sort("-createDate")
//           docs.forEach(function(doc){
//           	doc.commentNum=doc.comments.length;
//             doc.img=doc.author.img;
//             doc.articleHref="/articles/"+doc._id;
//             doc.authorHref="/authors/"+doc.author._id;
//             doc.createFormateDate=util.formateDate(doc.createDate);
//           });
//           res.render("index",{user:user,title:"首页--博客",articles:docs});
//      });
// });