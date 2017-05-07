var mongoose=require("mongoose");
var ArticleSchema=require("../schemas/article");

var ArticleModel=mongoose.model("article",ArticleSchema);

module.exports=ArticleModel;