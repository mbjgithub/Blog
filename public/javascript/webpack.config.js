module.exports={
	entry:'./scrollLoad.js',
	output:{
		filename:'scrollLoad.js',
		path:'./dist'
	},
	module:{
		loaders:[
        {
        	test:/\.tpl$/,
        	loader:'string'
        }
	  ]
	}
}