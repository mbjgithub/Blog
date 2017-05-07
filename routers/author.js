var express = require("express");
var UserModel = require("../models/user");
var ArticleModel = require("../models/article");
var util = require("../methods/public");

var router = express.Router();

router.get("/authors/:author_id", function(req, res) {
    // UserModel.findOne({_id:req.params.author_id},function(err,doc){
    //      if(doc){
    //      	var user="";
    //      	if(req.session.user){
    //      		user=req.session.user;
    //      	}
    //      	res.render("author",{author:doc,user:user,title:"博客 - "+doc.username});
    //      }else{
    //      	res.render("404page");
    //      }
    // });
    ArticleModel.find({
        author: req.params.author_id
    }).populate(["author"]).sort("-createDate").exec(function(err, docs) {
        if (docs && docs.length == 0) {
            UserModel.findOne({
                _id: req.params.author_id
            }, function(err, author) {
                if (err || (!author)) {
                    res.render("404page", {
                        errorMsg: "不存在该用户",
                        title: "页面出错啦",
                        user: ""
                    });
                } else {
                    renderAuthor([],req,res,author)
                }
            })
            return
        }
        renderAuthor(docs,req,res,{})
    });
});

//修改个人资料
router.post("/author/fix", function(req, res) {
    var username = req.body.username;
    var obj = {};
    for (var key in req.body) {
        if (key == "username") {
            continue;
        }
        obj[key] = req.body[key];
    }
    UserModel.update({
        username: username
    }, {
        $set: obj
    }, function(err, doc) {
        if (err) {
            res.redirect("/error");
        } else {
            res.json({});
        }
    });
});

router.get("/mainpage", function(req, res) {
    if (req.session.user) {
        res.redirect("/authors/" + req.session.user._id);
    } else {
        res.redirect("/loginorregister/login");
    }
});

router.get("/exit", function(req, res) {
    req.session.user = ""; //退出只需要清除session就行了
    res.redirect("/");
});

router.get("/setting", function(req, res) {
    var user = "";
    if (req.session.user) {
        user = req.session.user;
    }
    res.render("building", {
        user: user,
        title: "设置模块正在建设中"
    });
});

router.get("/personalMsg", function(req, res) {
    var user = "";
    if (req.session.user) {
        user = req.session.user;
    }
    res.render("building", {
        user: user,
        title: "私信模块正在建设中"
    });
});

router.post("/imgChange/authors/:author_id", function(req, res) {
    util.dealMultipartFormData(req, "imgChange", "authorImages", function(fields, files, newName) {
        var img = "";
        if (files["imgChange"].name.length > 0) {
            img = "/authorImages/" + newName;
            UserModel.update({
                _id: req.params.author_id
            }, {
                $set: {
                    img: img
                }
            }, function(err, doc) {
                res.json({
                    imgPath: img
                });
            });
        } else {
            res.json({
                imgPath: img
            });
        }
    });
});



module.exports = router;



function renderAuthor(docs,req,res,authorR) {
    var selfFlag = "";
    var user = "";
    if (req.session.user) {
        user = req.session.user;
        if (user._id == (authorR._id||docs[0].author._id)) {
            //说明当前登陆用户要访问的是自己的主页，那么它可以修改自己的信息，否则不行
            selfFlag = "yes";
        }
    }
    var doc = {};
    doc.selfFlag = selfFlag;
    doc.totalVisitedNum = 0;
    doc.totalPraiseNum = 0;
    doc.totalOpposeNum = 0;
    doc.totalArticlesNum = 0;
    doc.totalCommentsNum = 0;
    for (var k = 0; k < docs.length; k++) {
        doc.totalVisitedNum += docs[k].visitedNum; //作者文章的总访问量
        doc.totalPraiseNum += docs[k].praiseNum; //作者的总赞数
        doc.totalOpposeNum += docs[k].opposeNum; //作者的总反对数
        doc.totalCommentsNum += docs[k].comments.length ? docs[k].comments.length : 0;
        doc.totalArticlesNum++; //总文章数量
        docs[k].createFormateDate = util.formateDate(docs[k].createDate);
    }
    var dateSortArticles = docs.slice(0); //日期排行榜
    var commentSortArticles = util.commentSort(docs).slice(0); //评论排行榜
    var visitedSortArticle = util.visitedSort(docs).slice(0);; //阅读排行榜
    var praiseSortArticle = util.praiseSort(docs).slice(0); //推荐排行榜,根据点赞的次数来的
    var tags = util.tagsSort(docs); //文章分类,tags的类型是map，属于key-value类型，可以用forEach
    doc.authorHref = "/authors/" + (authorR._id||docs[0].author._id);
    var title = "博客 - " + (authorR._id||docs[0].author.username);
    var author = authorR._id&&authorR||docs[0].author;
    res.render("author", {
        author: author,
        user: user,
        article: doc,
        title: title,
        dateSortArticles: dateSortArticles,
        commentSortArticles: commentSortArticles,
        visitedSortArticle: visitedSortArticle,
        praiseSortArticle: praiseSortArticle,
        tags: tags
    });
}