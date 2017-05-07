var webpack=require('webpack')

module.exports={
	entry:__dirname+"/views/entry",
	output:{
		path:__dirname+"/release",
		filename:"index.js"
	}
}