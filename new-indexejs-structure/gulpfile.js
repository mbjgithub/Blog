var gulp=require('gulp')
var inject=require('gulp-inject')

gulp.task('default',function(){
	gulp.src('./views/layout.html')
	   .pipe(inject(gulp.src("./release/index.js"),{
	   	starttag:'<!-- inject:body:{{ext}} -->',
	   	transform: function (filePath, file) {
        // return file contents as string
        return "<script type='text/javascript'>"+file.contents.toString('utf8')+"</script>"
        }
	   }))
	   // .pipe(inject(gulp.src("./release/indexlib.js"),{
	   // 	  starttag:'<!-- inject:head:{{ext}} -->',
	   // 	  transform:function(filePath,file){
    //          return "<script type='text/javascript'>"+file.contents.toString('utf8')+"</script>"
	   // 	  }
	   // }))
	   .pipe(gulp.dest('./release'))
})