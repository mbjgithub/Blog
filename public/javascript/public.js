    function convert(str,jqObj,storeObj){
    var codeStr;
    //在匹配之前，得先把本来就是代码的部分提取出来，否则经过下面的正则表达式之后会被当作html标签显示
    //将传过来的字符串当作纯字符串，自动要把和html相关的转义了
    //空格没有被转换成&nbsp;但是原来的html中的&nbsp;被&amp;nsbp
    codeStr=str.match(/&lt;cc&gt;(.)*[^&lt;cc&gt;](.)*&lt;\/cc&gt;/g);
    str=str.replace(/(&lt;)/g,"<");
    str=str.replace(/(&gt;)/g,">");
    str=str.replace(/(&quot;)/g,"\"");
    str=str.replace(/(&apos;)/g,"\'");
    str=str.replace(/(&amp;nbsp;)/g,"  ");
    if(codeStr!=null){
    for(var i=0;i<codeStr.length;i++){
      str=str.replace(/<cc>(.)+[^<cc></cc>](.)+<\/cc>/,codeStr[i].substring(codeStr[i].indexOf("&gt;")+4,codeStr[i].lastIndexOf("&lt;")).replace(/(&lt;br&gt;&amp;nbsp;&amp;nbsp;)/g,"<br>").replace(/(&amp;nbsp;)/g," "));
     }
    }
    jqObj.html(str);
    storeObj.html(str);
  } 

  function ellipsis(parentObj,sonObj){
            var divH = parentObj.height();
            var divW=parentObj.width();
            var h=parseInt(sonObj.css("lineHeight"));
            var y1=Math.ceil(divH/h);   
            var x1=Math.ceil(divW/parseInt(sonObj.css("fontSize"))); 
            x1=parseInt(x1*2);
            if(sonObj.text().length>x1*y1){
               sonObj.text(sonObj.text().substring(0,x1*y1));
            }
            while (sonObj.outerHeight() > divH) {
                sonObj.text(sonObj.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/,"..."));
            }
            sonObj.text(sonObj.text().replace(/(.){15}(\.\.\.)$/,"...")).append("<span class='show-all'>显示全部</span>");
  }
  $(function(){
        $(".show-all").click(function(e){
       e.stopImmediatePropagation();
       e.preventDefault();
       $(this).parent().parent().prev().addClass("title-src-big");
       $(this).parent().parent().css("display","none");
       $(this).parent().parent().next()
       .css("display","block")
       // .append("<span class='show-ellipsis'>收起</span>");
       // $(this).parent().parent().next().find("span").click(function(){
       //    $(this).parent().css("display","none");
       //    $(this).parent().prev().prev().removeClass("title-src-big");
       //    $(this).parent().prev().css("display","inline-block");
       //    $(this).remove();
       // });
    });
       $('.show-ellipsis') .click(function(){
           $(this).parent().css("display","none");
          $(this).parent().prev().prev().removeClass("title-src-big");
          $(this).parent().prev().css("display","inline-block");
       })
});