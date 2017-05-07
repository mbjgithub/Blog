var mongoose=require("mongoose");
var UserModel=require("../models/user");

var Schema=mongoose.Schema;

var CommentSchema=new Schema({
	content:String,
	author_id:String,
	author_img:String,
	author_username:String,
    praiseNum:Number,
    opposeNum:Number,
	reply_id:[],
	date:{
		type:Date,
		default:new Date()
	}
});

var ArticleSchema=new Schema({
	title:String,
	content:String,
	author:{
		type:Schema.Types.ObjectId,
		ref:"user"
	},
	comments:[CommentSchema],   //评论
	allowOthers:Number,
	allowNobody:Number,           
	allowComment:Number,    //1表示允许评论，0表示不允许
	tags:String,   //博客标签
	titleSrc:String,    //文章题图
	praiseNum:{
		type:Number,
		default:0
	},
	opposeNum:{
		type:Number,
		default:0
	},
	visitedNum:{
		type:Number,
		default:0
	},
	createDate:{
		type:Date,
		default:new Date()     //这个default没有什么用，如果两篇文章的创建事件差不多，就不能区别创建创建时间
	},
	fixDate:{
		type:Date,
		default:new Date()
	}
});

ArticleSchema.pre("save",function(next){
   //do something before save
   if(this.isOld){
   	 this.fixDate=Date.now;
   }else{
   	 this.createDate=this.fixDate=Date.now();
   }
   this.praiseNum=this.praiseNum?this.praiseNum:0;
   this.opposeNum=this.opposeNum?this.opposeNum:0;
   this.visitedNum=this.visitedNum?this.visitedNum:0;
   next();
});
module.exports=ArticleSchema;