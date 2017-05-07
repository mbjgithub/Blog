var express=require("express");
var formidable=require("formidable");
var util=require("../methods/public")
var fs=require("fs");
var ArticleModel=require("../models/article");
var path=require("path")

var router=new express.Router();

router.get("/editorArticle",function(req,res){
	if(req.session.user){
		res.render("editorArticle");
	}else{
        res.redirect("/loginorregister/login");
	}
   // res.render("editorArticle");
});

router.post("/editorArticle/images",function(req,res){
    util.dealMultipartFormData(req,"contentImg","articleImages",function(fields,files,newName){
         var src="/articleImages/"+newName;
         res.json({src:src});
    });
});

// router.get("/test",function(req,res){
//     console.log(path.resolve(__dirname,"/public/articleImages"))
//     console.log(path.join(__dirname,"/routers/public"))
//     res.end("success")
// })

router.post("/submitArticle",function(req,res){
	util.dealMultipartFormData(req,"uploadFile","articleImages",function(fields,files,newName){
        var titleSrc=""
		if(files["uploadFile"].name.length>0){
             //说明有题图
             titleSrc="/articleImages/"+newName;
		}else{
            fs.unlinkSync(__dirname.slice(0,__dirname.lastIndexOf("\\"))+"\\public\\articleImages\\"+newName)
        }
         var realContent=fields.realContent;
         // realContent=realContent.replace(/(<)/g,"&amp;lt;");
         // realContent=realContent.replace(/(>)/g,"&amp;gt;");
         // realContent=realContent.replace(/(;)/g,"\\;");
         realContent = realContent.replace(/(\n\r)/g, "<br>&nbsp;&nbsp;");  
         realContent = realContent.replace(/(\r\n)/g, "<br>&nbsp;&nbsp;");
         realContent = realContent.replace(/(\r)/g, "");  
         realContent = realContent.replace(/(\n)/g, "<br>&nbsp;&nbsp;");
         realContent = realContent.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
         var article=new ArticleModel({title:fields.realTitle,content:realContent,
            author:req.session.user._id,allowOthers:fields.allwoOthers,
            allowComment:fields.allowComment,allowNobody:fields.allowNobody,tags:fields.realTags,
            titleSrc:titleSrc});
        article.save(function(err){
            if(!err){
                res.redirect("/");
            }
        });
		// res.render("test",{realTitle:fields.realTitle,realContent:realContent,realTags:fields.realTags});
	});
});



module.exports=router;