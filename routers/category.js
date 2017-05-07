var express=require("express");
var util=require("../methods/public");
var ArticleModel=require("../models/article");

var router=express.Router();

router.get("/category/:type/:author_id",function(req,res){
       ArticleModel.find({author:req.params.author_id}).populate(["author"]).sort("-createDate").exec(function(err,docs){
       	    var user="";
       	    if(req.session.user){
       	    	user=req.session.user;
       	    }
       	    var doc={};
       	    doc.author={};
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
            }
            var dateSortArticles=docs.slice(0);                 //日期排行榜
            var commentSortArticles=util.commentSort(docs).slice(0); //评论排行榜
            var visitedSortArticle=util.visitedSort(docs).slice(0);  //阅读排行榜
            var praiseSortArticle=util.praiseSort(docs).slice(0);    //推荐排行榜,根据点赞的次数来的
            var tags=util.tagsSort(docs);   //文章分类,tags的类型是map，属于key-value类型，可以用forEach
            var tagsCategory=util.tagsShow(docs);
            var title=docs[0].author.username+"---"+req.params.type;
            doc.author.username=docs[0].author.username;
            doc.author.img=docs[0].author.img;
            doc.authorHref="/authors/"+docs[0].author._id;
            doc.author._id=docs[0].author._id;
            res.render("detailArticle",{tag:req.params.type,tagsCategory:tagsCategory[req.params.type],user:user,article:doc,title:title,dateSortArticles:dateSortArticles,commentSortArticles:commentSortArticles,visitedSortArticle:visitedSortArticle,praiseSortArticle:praiseSortArticle,tags:tags});
          });
});

module.exports=router;