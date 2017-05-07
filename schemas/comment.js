var mongoose=require("mongoose");
var UserModel=require("../models/user");
var ArticleModel=require("../models/article");

var Schema=mongoose.Schema;
var CommentSchema=new Schema({
	content:String,
	commentAuthor:{
		type:Schema.Types.ObjectId,
		ref:"user"
	},
	commentArticle:{
		type:Schema.Types.ObjectId,
		ref:"article"
	},
	commentDate:{
		type:Date,
		default:new Date()
	}
});

CommentSchema.pre("save",function(next){
     //do something before save
     next();
});
module.exports=CommentSchema;