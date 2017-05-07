var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var UserSchema=new Schema({
    username:{
    	type:String,
    	required:true
    },
    password:{
    	type:String,
    	required:true
    },
    email:{
    	type:String,
    	required:true
    },
    sex:String,
    expert:String,   //擅长什么
    summary:String,  //对自己的概括
    img:String,   //用户的图片
    city:String,
    school:String,
    profession:String,
    job:String,
    company:String,
    dateReg:{
    	type:Date,
    	default:new Date()
    },
    reserve:String
});

UserSchema.pre("save",function(next){
    this.img=this.img?this.img:"/images/publicHeader.png";
    next();
});

module.exports=UserSchema;