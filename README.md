# Blog
这个博客网站的参考了知乎和CSDN，我个人非常喜欢知乎网站的风格。通信模块暂时没有实现，后期会持续实现这个功能。2016/9/11
一、技术简介
博客网站采用的前端技术是html5+css3+javascript+jquery，后端是Node.js+express+socket.io和cookie-parser、body-parser等中间件，数据库采用mongodb，操作数据库的是mongoose，采用的模版引擎是ejs和ejs-mate。

二、使用方式：
1.下载该项目
2.在控制台中切换到该项目根目录下，运行node app.js
3.在浏览器输入127.0.0.1:1337/就可以运行了

三、功能简介
这个博客网站主要分为六个模块，
第一：网站首页模块，
第二：文章编辑模块，
第三：注册登陆模块，
第四：评论模块，
第五：个人主页模块，
第六：文章显示模块。
网站首页模块的主要功能是显示最近发表的10篇文章，以及一个导航条，可以导航到网站的其他模块，导航条也提供搜索功能，根据文章内容、作者、标签查找文章。文章编辑模块是撰写文章的地方，这里的难点主要在于代码区域的标注，需要大量的正则表达式操作，这个花了我几天时间。注册登陆模块模仿的是知乎的注册登陆模块，简单明了。评论模块采用的是socket.io通信，实现的就是我们常见的评论回复功能。个人主页模块显示个人信息，发表的文章，别人评论的通知等。文章显示模块显示分两块，左边显示这个作者的成就，比如总文章数，总赞数，总浏览量等，根据文章点赞数排序文章，根据文章评论排序文章，根据文章标签分类，右边就是文章的具体内容了。

四、总结
（一）html+css+JavaScript方面总结
（1）contenteditable----博客网站文章编写功能-----困3小时
contenteditable使得只读元素也变得可以编辑，但是要注意一个问题，当你删除完一个元素的所有输入后，你以为这个元素的内容是空了，可是并不是，它是一个<br>,自动给你在这个元素中添加上去的,这个要特别注意困了我3个小时,true，false，如果父元素的contenteditable="true"，那么子元素的contenteditable="true"也等于true，这个就意味着子元素中的内容也可以编辑，就像你把body的contenteditable="true"，那这个网页都可编辑。

（2）去除可编辑元素获得焦点默认的样式，outline:0 none;border:0 none;cursor:text;还有一个神奇的属性，pointer-events：none；可以去除元素的click事件，比如给a元素加上此属性，那么在点击a的时候就没有反应

（3）获得当前选中区域
ie支持的获得当前选中区域文字的语法是document.selection.createRange().text,safari和firefox获得当前选中文字：window.getSelection（）

（4）IE下的trigger的使用------困5个小时
$(".imgPreview").click(function(){
         	$("input[type=file]").trigger("click").change(function(){
         	PreviewImg();
         });
         });
这样当选择好文件后，根本就不会发生change事件，我猜测可能的原因是选择文件的时间太长，IE直接忽略了change函数的定义，但是其他的浏览器不会出现这样的问题，是上面的代码也能work，但是最好换成另一种写法，$(".imgPreview").click(function(){
         	$("input[type=file]").change(function(){
         	PreviewImg();
         }).trigger("click");
         });
这样的写法IE下是正常的，先定义后trigger

（5）IE下的unselectable="on"，在做在线编辑器的时候-------困了1天，2016-8-5
事情是这样的，我要做的一个功能是显示一张图片到焦点所在的地方，这个需要用到range（被选中的文本区域），于是使用<input type="file" style="display:none">,然后点击其他的div元素trigger该input，然后在给该input一个change事件，在change事件中让让图片在焦点处显示，一直以来，除IE外，其他的浏览器都可以正常的获得range对象，但是IE一直获得错误的range对象，后面就是加了这个unselectable="on"才正常的获得了range对象，unselectable="on"指示这个元素是不可选中的，也就是不能触发已经获得焦点的元素的onblur事件，难怪我会出现一直不能获得正确的range的情况，因为我一点击该div元素，获得焦点的元素就失去焦点，所以，给div元素加上这个属性，会导致原来获得焦点的元素还是获得焦点的，这样的话讲究可以获得正确的range了，chrome和firefox对应的是-moz-user-select:none;-webkit-user-select:none;此外，还明白了range是根据焦点来确定选中内容的位置的,<input type="file" style="display:none">,在一个form表单中是可以同时存在很多个的,cursor:zoom-in;鼠标是放大图标，cursor:zoom-out;是缩小图标

（6）做博客网站时，实现为文章选择标签的时候所走的弯路，
我以为那个可以输入的框是一个div，而且是一个contenteditable="true"的div，结果在实现的时候，点击给定的标签，构造类似新浪博客那样的效果，但是两个标签块之间还是可以获得焦点，这个问题一直解决不了，而且firefox不能直接通过后退键删除contenteditable="false"的元素，但是IE和chrome可以，后来去看了一下新浪博客的实现，发现是我想错了，那个输入框不是一个contenteditable="true"的div，而是一个普通的div+一个input[type=text]的输入框，在这个div中嵌入一个固定输入字符的input，在需要加块的时候，在这个input前面插入块即可

（7）做博客网站时，处理文章代码部分最烦---------博客网站
1.首先要标注那一块区域是代码，而不是普通的文字，我采用的是给选择的区域（假定选中区域的内容为value）加<pre><cc>value</cc></pre>
2.在加之前，还要对value进行处理，要不然替换的时候会导致value的html部分也会被解析成html的形式，而不是代码的形式，处理的方式是替换掉value中的"<"为&lt;">"为&gt;这样才不会解析为html标签，
3.对已经被cc包围的value部分，再次点击cc时，应该要无效，我的做法是点击的时候，给该value的部分加上cc，但是我会在后面判断每一个cc标签是不是存在祖先元素为cc的，如果有，那么删除该cc标签，保留祖先cc标签，这样就做到了cc不会在嵌套cc，
4.经过以上三步，就成功的标注代码区域了，接下来是把value传给服务器，在传之前，需要把value中的&lt;变为"<",&gt;变为">",
5.接受到value后，需要对value中的回车换行符进行处理，要不然返回给前端的时候，由于回车换行符的影响会导致"unterminated string literal"，没有终结的字符串这个错误，我解决的方法是将回车换行符替换掉，但是要注意后面是需要回车换行符的效果的，因此，用"<br>"来替换最好，下面是替换的代码:
         realContent = realContent.replace(/(\n\r)/g, "<br>&nbsp;&nbsp;");  
         realContent = realContent.replace(/(\r\n)/g, "<br>&nbsp;&nbsp;");
         realContent = realContent.replace(/(\r)/g, "");  
         realContent = realContent.replace(/(\n)/g, "<br>&nbsp;&nbsp;");
         realContent = realContent.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
其中realContent是需要处理的回车换行符的字符串
6.现在，前端可以正常接收value数据了，接收之后，会发现value中的<,>,空格等html中有特殊意义的字符都变成了其他的形式，如"<"变为&lt;">"变为&gt;&nbsp;变成"&amp;nbsp;"，这样，又需要把这些变回来，要不然不能以html的形式解析，变回来可不能直接将所有的&lt;变为"<",&gt;变为">",代码部分的不能变，要不然代码部分也会被当做html解析，因此，得先把<cc>代码</cc>包围的这部分复制出来，然后在全部替换，最后把替换好的cc部分用原先复制的替换，下面是代码：
var str=("<%= realContent %>");   //需要处理的字符串
    var codeStr;
 //在匹配之前，得先把本来就是代码的部分提取出来，否则经过下面的正则表达式之后会被当作html标签显示
    codeStr=str.match(/&lt;cc&gt;(.)*[^&lt;cc&gt;](.)*&lt;\/cc&gt;/g);
    str=str.replace(/(&lt;)/g,"<");
    str=str.replace(/(&gt;)/g,">");
    str=str.replace(/(&quot;)/g,"\"");
    str=str.replace(/(&apos;)/g,"\'");
    str=str.replace(/(&nbsp;)/g," ");
    if(codeStr!=null){
    for(var i=0;i<codeStr.length;i++){
str=str.replace(/<cc>(.)+[^<cc></cc>](.)+<\/cc>/,codeStr[i].substring(codeStr[i].indexOf("&gt;")+4,codeStr[i].lastIndexOf("&lt;")).replace(/(&lt;br&gt;&amp;nbsp;&amp;nbsp;)/g,"<br>").replace(/(&amp;nbsp;)/g," "));
    }
    }
   $(".p1").html(str);
7.结果上面6步，代码部分就算完成了
8.我有考虑过不加标签，而是加引号或者注释的情况，有种想法来源于看bootstrap的js部分的tooltip源码的时候看到可以在title的字符串部分加标签，然后就觉着可以给html标签加上引号就会当作字符串来解析了，而不是html，但是后来想了想给否定了，如果加的是引号的话，首先加引号不一定有作用，因为在html文件里面给标签加引号并不会导致解析成字符串，其次也不好看，你给人家的代码平白无故的多加了东西，人家不一定乐意，加注释这个方法最大的缺陷是导致用户写的代码消失，这样的用户体验非常不好。
9.输入框的搜索可以采用搜索延迟，这个还没有完善

（8）jquery操作DOM--------------博客网站
使用jquery操作DOM的时候，特别要小心append，prepend，after，before等插入元素的操作，最好在插入这些元素的时候考虑好是不是会导致非常多的插入，导致html代码大量冗余，因为你前面插入的元素可能被你display:none掉了，所以页面上只会看到一个元素，但是这样带来的后果是html元素之间的关系变得非常的不清晰，给后面操作DOM带来意想不到的困难或者错误，最好在插入之前先检查是否存在插入的元素，没有在进行插入，有的话就不要在插入了，可以根据实际情况改变需求，但是不要在插入

（9）登陆的失败避免返回一个新的登陆界面--------博客网站
当在登陆页面的时候，进行登陆，登陆成功则跳转到一个登陆成功的页面，登陆失败则给出提示，然而，这里的问题是，是采用ajax还是表单提交数据呢，如果采用ajax可以不用刷新的显示登陆错误的信息，如果用表单，那么登陆失败后需要从新返回一个带有错误提示的登陆页面，这个意味着浏览器需要从新加载这个登陆页面，很明显，这样的用户体验是极其不好的，那么，这里我想出了一个解决方案，就是登陆按钮不是submit，而是一个普通按钮，给这个普通按钮添加click事件，并在回调函数中使用ajax，当服务器返回数据时，判断是否登陆成功，登陆成功，则触发表单的submit事件，这样自然的就实现了登陆成功的跳转，也实现了登陆失败的无刷新

（10）做author.ejs页面显示所有文章的总结------博客网站
功能需求是显示该作者的所有文章，可以按日期，赞数，访问量，评论数来排序，在访问该作者的主页面的时候，我可以一次性获得所有的文章的排序数据，然后在来显示，当然只显示用户想显示的那种，比如点击按日期排序，那么直接display:"block"就行了，另一种实现的方式是，需要哪种排序，就使用ajax从后台获取文章的排序信息，然后在remove原来的，insert现在这个就行了

（二）后端总结
（1）在使用express框架的static中间件时，要注意app.use(express(static(__dirname+"/public")));其中"/public"是静态文件如js，css等的根目录，那么在页面中引用的时候，如在"/public"下有一个JavaScript文件夹，css文件夹下又有一个app.css文件，那么在index.ejs中要注意这样引用：
<link src="css/app.css" type="text/css" rel="stylesheet"> 
路径写的是相对路径，因为已经设置了静态文件的根目录为"/public"，还有要注意一定要把type和rel属性都写上，不写上浏览器加载不了。如果是在css文件中使用了背景图片等，那么背景图片的位置一定要在引用的css文件所在的目录下，也就是说默认css文件中图片的根目录是css，这个css由<link src="css/app.css" type="text/css" rel="stylesheet"> css文件的目录决定，如我在css文件下有个images文件夹，images下有个1.jpg图片，如果我要在这个app.css文件中使用1.jpg，那么写法是css/images/1.jpg或者images/1.jpg

（2）千万要注意js的加载顺序呀，写前面的js先加载，后面的后加载，所以如果前面的依赖后面的js，那一定要写在前面，如你的一个app.js需要jquery.js，那么<script src="jquery.js"></script><script src="app.js"></script>也就是说jquery.js一定要写在app.js之前

（3）如：app.render("home",{flag:true});<div data-flag=<%=flag%>>;$("div").attr("data-flag")的值是"true"，是一个字符串，而不是boolean

（4）socket.io(1.4.8版本)，客户端的socket.disconnect();调用这个函数也会触发客户端的disconnect事件，socket.broadcast.to(socket.id).emit('event_name', data);其中socket.id是另一个socket，但是我自定义的room就一直触发不了，如：socket.join(roomname);socket.broadcast.to(myroom).emit('event_name', data);这样写就触发不了，room中的socket收不到,io.sockets.in(roomname).emit("r",data);//work，但是也发给了自己，可能的原因是她自己页在room里面
io.to(roomname).emit("r",data);//work

（5）socket.io（1.4.8版本），在页面刷新的时候，会导致socket断开，也就是触发了客户端和服务器端的disconnect事件，但是不会触发error事件，如果是直接关闭页面，那么会触发服务器端和客户端的disconnect事件，

（6）mongoose的populate函数的使用，populate用于填充数据，如UserModel.find({查询条件}).populate(["post"]).exec(function(err,docs){console.log(docs[0].post.classname)});
UserSchema={post:{type:Schema.Types.ObjectId,ref:"class"}},其中class是参照的表名,populate的作用是填充指定的字段，如UserModel中的post的值等于，用post的值在class表中查询_id=post值的class文档，然后将查询的结果赋给post，所以才可以docs[0].post.classname这样写，这类是于关系型数据库的联合查询

（7）在ejs中使用模版
1---首先npm install ejs-mate，安装这个ejs第三方母模版包
2---在app.engine("ejs",require("ejs-mate"));app.set("view engine","ejs"),app.set    ("views",__dirname+"/views");千万不能在res.render("index",options),options中绝对不能包含layout:true或者layout:false，因为会覆盖ejs-mate的layout函数
3---app.locals._layoutFile="layout.ejs";  这样写的话，就是所有views页面下的ejs文件都使用这个布局     文件
3---也可以在特定的ejs文件中包含模版文件，包含了这个布局文件声明的才会使用布局文件写法如下:
    <% layout("layout") -%>,其中layout为布局文件名，也可以是其他的布局文件名，不一定是layout
4---布局文件的书写和一般的ejs文件时一样的，不过在需要变化的地方写上<%- body -%>,这样声明了布局文件的ejs中的所有内容就会替代布局文件的<%- body -%>
5---还可以部分引用某一代码块，这个到ejs-mate官网看文档就行

（8）js实现html模版数据的快速填充---原理和下面的代码一样，replace函数的第二个参数可以是函数，函数的第一个参数表示匹配的字符串，第二个参数表示的值等于$1,也就是第一个括号中匹配的值,博客：http://freshflower.iteye.com/blog/2120268

(function (window) {    
    function fn(str) {    
        this.str = str;    
    }    
    fn.prototype.format = function () {    
        var arg =Array.prototype.slice.call(arguments);    
        return this.str.replace(/\{(\d+)\}/g, function (a, b,c) {    
            console.log(a+" "+b+" "+c);return arg[b] || '';    
        });    
    }    
    window.fn = fn;    
})(window);    
// use    
(function(){    
    var t = new fn('<p><a href="{0}">{9}</a><span>{2}</span></p>');  
    console.log( t.format('http://www.alibaba.com', 'Alibaba', 'Welcome') );    
})(); 

（9）表达式&&和||的写法
function a(){return 1;};function b(){return 2;};var c=a()&&b();那c=2;var c=a()||b();那么c=1；这中表达式的值的返回结果取决于哪个能决定这个表达式的true和false，也就是决定表达式的结束，比如上面的var c=a()&&b();因为a函数的返回值是1，所以不能决定这个表达式的true和false，要判断b函数，b函数的返回值是2，就决定了这个表达式的true和false，所以这个表达式的值是2

（10）迭代和递归
迭代是从已知推到未知，递归是从未知推到已知，如fibonacci数列，比如要算第5个数的值，那么可以由已知的第一个数和第二个数，推出第三个数，然后由第二个数和第三个数求出第四个数，依次类推，这就是迭代了，也可以由要求第5个数，可以先求第4个数和第3个数，求第4个数得先求第3个数，和第2个数，直到推到已知条件，这个就是递归了，递归的优点呢就是代码简单，但是时间复杂度高，迭代呢是代码复杂，但是时间复杂度滴

（11）图片上传功能总结：使用Node.js的formidable和jquery的jquery-form.js插件
首先使用input[type=file]来选择文件，然后在使用$("form").ajaxSubmit({url:"/uploadImg",method:"POST",success:funciton(data,resText,jqXHR){}});用jquery-form.js的ajaxSubmit函数可以异步提交表单，即不需要刷新页面，这里提交给"/uploadImg"
其次，当浏览器把文件提交过来后,var form=new formidable.IncomingForm();form.uploadDir=__dirname+"/test";//设置上传的文件的存放路径,form.keepExtensions=true;//保留文件的后缀名,form.parse(req,function(err,fields,files){});//form.parse是解析上传过来的文件的关键，采用的是边解析，边存放的方式，当form.parse执行完成后，上传的文件就已经在form.uploadDir这个路径下了，文件名是由浏览器随机生成，fields表示传递过来的其他的表单数据，files存放着传递过来的一些文件信息，如果<input type="file" name="mbj">,那么files.mbj.path=form.uploadDir+浏览器生成的文件名字,files.mbj.name=文件的真实名字，

（12）当一个node.js服务器启动的时候，会初始化所有的不再回调函数中的变量，这些不再回调函数中的变量只会初始化一次，由所有访问该网站的用户所共享，这个是node.js是当线程的体现，每当用户访问页面的时候，实际上调用的都是一系列回调函数，会重新初始化需要调用的回调函数中的变量，终于理解node.js是单线程这个概念了

（12）前端的js给后端传递的bool类型的值变成了string类型，

（13）值赋值和引用赋值，-------------博客网站---------2016-8-23 20:10
我把一个对象先是赋值给一个变量，然后在对这个对象进行修改，最后前面那个变量的值是现在这个对象的值，而不是保存着以前的那个对象，因为这个是引用赋值，给变量存的是引用，并不是那个对象的copy，他们指向同一个空间，我竟然也在不知不觉间放了这样的错误，what a shame ，

（14）真正的动手去做才知道需要考虑的和遇到的问题-------------博客网站---------2016-8-23 23:57
比如我的博客网站，访问用户的主页得分为两中情况，第一种是用户本人访问自己的主页，第二种是别人访问你的主页，但是这个主页是同一个ejs文件，因此你需要区分，那么当是自己访问的时候，可以出现那些修改个人信息的功能，但是如果是别人访问的话，那就不能出现，因此我想到了如果是本人的话，就这个ejs加载一个包含修改功能的js文件，如果不是的话就不包含，恩，这个方法很好，但是在调试的时候又发现，个人信息的文章信息我们是可以访问的，因此需要把原来那个js文件按照可以显现的功能和不可以显现的功能分成两个js文件，你看，这个必须自己实际去做才会发现这个问题，然后有这个解决方法，

五、参考资料
（1）http://www.365mini.com/page/jquery-quickstart.htm    jquery的中文网站
（2）http://freshflower.iteye.com/blog/2120268  JS使用模板快速填充HTML控件数据
（3）http://blog.csdn.net/weiwei22844/article/details/36877911  浏览器的js引擎线程，解释了该线程是单线程和改线程的任务队列，并介绍了其他两个浏览器常驻线程，图形渲染线程，浏览器事件触发线程

（4）http://blog.csdn.net/yuanmei1986/article/details/50401842  详细解析浏览器加载网页的整个过程

（5）https://www.w3.org/TR/   w3c关于html和css的标准文档

（6）node.js博客开发教程

（7）自己打造HTML在线编辑器 http://www.cnblogs.com/lucc/archive/2010/03/22/1692011.html

（8）http://www.zhangxinxu.com/wordpress/2011/04/js-range-html%E6%96%87%E6%A1%A3%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9%E9%80%89%E4%B8%AD%E3%80%81%E5%BA%93%E5%8F%8A%E5%BA%94%E7%94%A8%E4%BB%8B%E7%BB%8D/   //介绍选中区域对象Range

（10）https://developer.mozilla.org/en-US/docs/Web/JavaScript    JavaScript文档，很全

