var mongoose=require("mongoose");
var UserSchema=require("../schemas/user");
var UserModel=mongoose.model("user",UserSchema);

module.exports=UserModel;