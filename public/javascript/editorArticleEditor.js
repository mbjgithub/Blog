$(document).ready(function(){
  $(".contentBlock").append('<iframe name="editorFrame" id="editorFrame" class="content" frameborder="0" style="padding: 0px;"></iframe>');
  var browser={};
  var ua=window.navigator.userAgent.toLowerCase();
  browser.msie=(/msie ([\d.]+)/).test(ua);
  browser.firefox=(/firefox\/([\d.]+)/).test(ua);
  browser.chrome=(/chrome\/([\d.]+)/).test(ua);
  var editor=$(".content")[0];
  var editorDoc = editor.contentWindow.document; //iframe所在的document对象,因为一个iframe相当于一个文档
  var editorWindow = editor.contentWindow;      //ifarme所在的window对象
  if (browser.firefox)
  {
       editor.onload = function(){
       editorDoc.designMode = "on";
    }
  }else{
         editorDoc.designMode = "on";
    }

  editorDoc.open();
  editorDoc.write("<html><head><link type='text/css' rel='stylesheet' href='/css/editorFrame.css'></head><body style='overflow-x:hidden;margin:0px; padding: 0px;'><span class='article-tip'>Please input your article</span></body></html>");
  editorDoc.close();
function fixImgSize(img){
     var width,height;
    width=parseInt(img.css("width").toString().replace(/px/,""));
    height=parseInt(img.css("height").toString().replace(/px/,""));
    console.log(width+" "+height);
    if(width>670){
      img.before("<br/>");
      img.after("<br/>");
      $(".content").css("height",parseInt($(".content").css("height"))+680);
    }
    height=width>670?Math.floor(height*(670/width)):height;
    width=width>670?670:width;
    height=(height==0)?670:height;
    width=(width==0)?670:width;
    img.css({"width":width,"height":height});
}
function getImgSrc(obj,img){
          var fileObj=obj;
          var extensions="jpg,png,jpeg,gif,bmp";
          var imgExtension=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1);
          var browserVersion=window.navigator.userAgent.toUpperCase();
          if(extensions.indexOf(imgExtension)>-1){  //判断文件格式
                if(fileObj.files){  //如果支持filelist
                      var reader=new FileReader();
                      reader.onload=function(e){
                             img.attr("src",e.target.result);
                            fixImgSize(img);
                      }
                      reader.readAsDataURL(fileObj.files[0]);
                }else if(browserVersion.indexOf("MSIE")>-1){  //不支持filelist
                        img.attr("src",fileObj.value);
                        fixImgSize(img);
                }else if(browserVersion.indexOf("FIREFOX")>-1){  //filefox不支持filelist
                       var fileFoxVersion=parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
                       if (firefoxVersion < 7) {//firefox7以下版本
                          console.log("firefox<7");
                          img.attr("src",fileObj.files[0].getAsDataURL());
                          fixImgSize(img);
                       } else {//firefox7.0+ 
                        console.log("firefox7.0+");
                          img.attr("src",window.URL.createObjectURL(fileObj.files[0]));
                          fixImgSize(img);
                      }
                }else{   //其他版本的浏览器
                  img.attr("src",fileObj.value);
                  fixImgSize(img);
                }
          }else{  //文件格式不正确
            alert("上传的文件格式不正确!");
            fileObj.value="";
          }
      }

function SelectionRange(doc, range)
        {
               //html=="<img src='" + src + "'></img>"
            this.Replace = function(html)
            {     //用新产生的东西替代被选中的东西，IE的做法是直接通过一个函数就可以拿新的替换旧的
                  //其他的浏览器的做法是通过删除选中的内容，然后插入新的内容的节点来实现
                if (range != null)
                {
                    if (browser.msie)
                    {
                        if (range.pasteHTML != undefined)
                        {
                            range.select();
                            range.pasteHTML(html);   //range代表选中的内容，html是用来代替被选中的内容的
                            return true;
                        }
                    }
                    else if (browser.firefox || browser.chrome)
                    {
                        if (range.deleteContents != undefined && range.insertNode != undefined)
                        {
                            var temp = doc.createElement("DIV");
                            temp.innerHTML = html;

                            var elems = [];
                            for (var i = 0; i < temp.childNodes.length; i++)
                            {
                                elems.push(temp.childNodes[i]);
                            }

                            range.deleteContents();  //把选中的内容删除

                            for (var i in elems)
                            {
                                temp.removeChild(elems[i]);
                                range.insertNode(elems[i]);
                            }
                            return true;
                        }
                    }
                }
                return false;
            }
        }
          //传入的是editor.contentWindow,也就是iframe的window对象
       function GetSelectionRange(win)
        {
            var range = null;

            if (browser.msie)
            {
                range = win.document.selection.createRange(); //TextRange ,当前被选中的区域
                // alert(range.parentElement().name+" "+range.parentElement().name+" "+range.parentElement());
                if (range.parentElement().document != win.document)   //range.parentElement()==HTMLBodyElement
                {
                  console.log(1);
                    range = null;
                }
            }
            else if (browser.firefox || browser.chrome)
            {
                var sel = win.getSelection();
                if (sel.rangeCount > 0) range = sel.getRangeAt(0); else range = null;
            }

            return new SelectionRange(win.document, range);
        }

  $(".firstBold").click(function(){
      editorDoc.execCommand("Bold",false,null);
  });
  $(".firstItalic").click(function(){
      editorDoc.execCommand("Italic",false,null);
  });
  $(".firstUnderline").click(function(){
      editorDoc.execCommand("Underline",false,null);
  });
  $(".firstCode").click(function(){
      var value="";
      if(browser.msie){
          value=editorDoc.selection.createRange().text;
      }else{
          value=editorWindow.getSelection();
      }
      
      var range=GetSelectionRange(editorWindow);
      if(value.toString().length>0){
         value=value.toString();
         value=value.replace(/\</g,"&lt;");
         value=value.replace(/\>/g,"&gt;");
          range.Replace("<pre><cc>"+value+"</cc></pre><br>");
          var cc=$(window.frames["editorFrame"].document).find("cc");
          cc.each(function(ele,i){     //这里主要解决多次点击code标签,我这里的意思是cc不能嵌套cc,
              var $this=$(this).parents("cc");
              if($this.length>0){
                var txt=$(this).text();
                var newTxt=$this.html().replace("<cc>"+txt+"</cc>",txt);
                $this.html(newTxt);
              }
          });
      }else{   //再次点击，并且没有选中内容，跳出c标签包围的范围
          $(window.frames["editorFrame"].document).find("body").append("<br><p contenteditor='true'></p>").focus();
      }
  });
  $(".firstOl").click(function(){
     editorDoc.execCommand("InsertOrderedList",false,null);
  });
  $(".firstUl").click(function(){
    editorDoc.execCommand("InsertUnorderedList",false,null); 
  });
  $(".firstImg").click(function(){
      $(".contentImg").click();
  });
  $(".contentImg").change(function(){
          var range=GetSelectionRange(editorWindow);
          range.Replace("<img src='/images/loading.gif'></img>");
          $(".otherForm").ajaxSubmit({
            url:"/editorArticle/images",
            method:"POST",
            success:function(data,responseText,jqXHR){
              var img=$(window.frames["editorFrame"].document).find("img[src='/images/loading.gif']");
                var anotherImg=$("<img src='"+data.src+"' />");
                anotherImg.replaceAll(img);//直接用img.attr("src",data.src);会导致Firefox显示的图片大小和loading.gif的大小一样
                fixImgSize(anotherImg);  //这里又好奇怪，chrome不能获取图片的大小,但是firefox可以
            }
          });
          // var img=$(window.frames["editorFrame"].document).find("img[src='/images/loading.gif']");
          // getImgSrc(this,img);
      });
  $(window.frames["editorFrame"].document).find("body").focusin(function(){   /*这里在firefox下focus无用*/
    var jqSpan=$(window.frames["editorFrame"].document).find(".article-tip");
    if(jqSpan.length!=0){
        jqSpan.remove();
    }
  }).focusout(function(){
       var jqBody=$(this);
       if(jqBody.html()==""||jqBody.html()=="<br/>"){
           jqBody.append("<span class='article-tip'>Please input your article</span>");
       }
  });
  if(browser.firefox){
    $(window.frames["editorFrame"].document).find(".article-tip").remove();
    $(".content").focus();
  }

  $(".article-release").click(function(){
    var title=$(".title").text();
    if(title==""||title==undefined){
      alert("文章标题不能为空");
      return;
    }else{
      $("input[name=realTitle]").val(title);
    }
    var content=$(window.frames["editorFrame"].document).find("body").html();
    if(content==""||content==undefined||content=="<br>"){
      alert("文章内容不能为空");
      return;
    }else{
      content=content.replace(/(&lt;)/g,"<");
      content=content.replace(/(&gt;)/g,">");
      $("input[name=realContent]").val(content);
    }
    var tags=$(".tag-block-words");
    var tagsValue=[];
    tags.each(function(i,element){
            tagsValue.push($(this).text());
    });
    if(tagsValue.length==0){
      alert("文章标签不能为空");
      return;
    }else{
      var tagsString=tagsValue.join(",");
      $("input[name=realTags]").val(tagsString);
    }
    $(".mainForm").submit();
    
  });


});