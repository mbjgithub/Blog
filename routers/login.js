var express=require("express");
var UserModel=require("../models/user");
var router=express.Router();
//登陆成功后重新返回要求登陆的界面,一个思路是把拿到的路径又带给前端，前端在返回，直到登陆成功

router.get("/loginorregister/:type",function(req,res){
     if(req.params.type=="login"){
      res.render("loginorregister",{flag:false});
     }else{
      res.render("loginorregister",{flag:true});//flag==true means register page,or login page
     }
});

router.post("/login",function(req,res){
     var username=req.body.username;
     var email=req.body.email;
     var password=req.body.password;
     var user=new UserModel({username:username,password:password,email:email});
     user.save(function(err){
     	console.log("save "+username+" success");
     });
     res.render("loginorregister",{flag:false});
});

router.post("/loginJudge",function(req,res){
     var username=req.body.username;
     var password=req.body.password;
     UserModel.findOne({username:username,password:password},function(err,doc){
         if(err){
         	console.log("query mongodb error");
         	return;
         }else{
         	if(doc){
         		req.session.user=doc;
         		res.redirect("/");
         	}else{
         		// res.render("/loginorregister",{loginMsg:false});I have a good idea to validate login,
         		// when user input his username,ajax validate whether the username is exit,if correct,then the
         		// same way to validate password,if incorrect then response some message to ajax.
         		// here,i do not give any tip msg
         		res.render("loginorregister",{flag:false});
         	}
         }
     });
});

router.post("/validateUsername",function(req,res){
     var username=req.body.user;
     console.log(req.body);
     if(username==""||username==undefined){
        console.log("404,要做一个404页面");
        res.render("404page");
     }else{
        UserModel.findOne({username:username},function(err,doc){
            var isExit="";
            if(doc){
                //表名用户名存在
                isExit="true";
            }
            res.json({isExit:isExit});
        });
     }
});

module.exports=router;