var mongoose=require("mongoose");
var CommentSchema=require("../schemas/comment");
var CommentModel=mongoose.model("comment",CommentSchema);

module.exports=CommentModel;