var express=require("express");
var ArticleModel=require("../models/article");
var util=require("../methods/public");

var router=express.Router();

router.get("/articles/:article_id",function(req,res){
     ArticleModel.findOne({_id:req.params.article_id}).populate(["author"]).exec(function(err,doc){
        //要处理各种意外，这里明明doc不可能为空，也还要查一查
        if(doc==""||doc==undefined){
            //res.render("404Page",{});
            // res.end("服务器内部错误,在detailArticle.js");
            console.log(4444)
            res.end("")
            return
        }
       var visitedNum=doc.visitedNum;
       visitedNum++;
       doc.visitedNumAdd=visitedNum;
       ArticleModel.update({_id:req.params.article_id},{$set:{visitedNum:visitedNum}},function(err,useless){
        var user="";
        if(req.session.user){
            user=req.session.user
        }
        ArticleModel.find({author:doc.author._id}).sort("-createDate").exec(function(err,docs){
            doc.totalVisitedNum=0;
            doc.totalPraiseNum=0;
            doc.totalOpposeNum=0;
            doc.totalArticlesNum=0;
            doc.totalCommentsNum=0;
            for(var k=0;k<docs.length;k++){
                doc.totalVisitedNum+=docs[k].visitedNum;   //作者文章的总访问量
                doc.totalPraiseNum+=docs[k].praiseNum;     //作者的总赞数
                doc.totalOpposeNum+=docs[k].opposeNum;     //作者的总反对数
                doc.totalCommentsNum+=docs[k].comments.length?docs[k].comments.length:0;
                doc.totalArticlesNum++;              //总文章数量
                docs[k].createFormateDate=util.formateDate(docs[k].createDate);
                if(docs[k].createDate.getTime()==doc.createDate.getTime()){
                    doc.pre=(k==(docs.length-1))?"":docs[k+1];
                    doc.next=(k==0)?"":docs[k-1];
                }
            }
            var dateSortArticles=docs.slice(0);                 //日期排行榜
            var commentSortArticles=util.commentSort(docs).slice(0); //评论排行榜
            var visitedSortArticle=util.visitedSort(docs).slice(0);  //阅读排行榜
            var praiseSortArticle=util.praiseSort(docs).slice(0);    //推荐排行榜,根据点赞的次数来的
            var tags=util.tagsSort(docs);   //文章分类,tags的类型是map，属于key-value类型，可以用forEach
            var title=doc.title;
            doc.createFormateDate=util.formateDate(doc.createDate);
            doc.authorHref="/authors/"+doc.author._id;
            res.render("detailArticle",{flag:false,user:user,article:doc,title:title,dateSortArticles:dateSortArticles,commentSortArticles:commentSortArticles,visitedSortArticle:visitedSortArticle,praiseSortArticle:praiseSortArticle,tags:tags});
          });
        });
     });
}); 

router.post("/detailArticle/num",function(req,res){
    console.log(req.body.num+" "+req.body.flag+" "+req.body._id);
    if(req.body.flag=="true"){    //前台传来的bool型都变成字符串型了
        ArticleModel.update({_id:req.body._id},{$set:{praiseNum:req.body.num}},function(err,doc){
          // res.json({});
    });
    }else{
        ArticleModel.update({_id:req.body._id},{$set:{opposeNum:req.body.num}},function(err,doc){
          //res.json({});
    });
    }
});

router.get("/tags/:tagName",function(req,res){
    var tagName=req.params.tagName;
    ArticleModel.find({},function(err,docs){
        var articles=[];
        docs.forEach(function(doc){
            if(doc.tags.indexOf(tagName)>-1){
                doc.createFormateDate=util.formateDate(doc.createDate);
                articles.push(doc);
            }
        });
        var user="";
        if(req.session.user){
           user=req.session.user;
        }
        res.render("tags",{articles:articles,currentTag:tagName,title:"博客标签--"+tagName,user:user});
    });
});

module.exports=router;
