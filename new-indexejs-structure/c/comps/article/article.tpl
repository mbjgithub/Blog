<div class="line" r-component="detail"
                  r-if="{showArticle}">
  <div class="left-first">
  <% if(articles[i].img){ %>
   <img src="<%= articles[i].img %>" />
  <% }else{ %>
  <img src="/images/public.jpg" />   <!--默认的图片-->
  <% } %>
  <div class="praise">
   <a class="praiseNum" data-flag="no" data-articleId="<%= articles[i]._id %>"
       r-on="{
          click:praiseClick
       }"><%= articles[i].praiseNum %></a>
  </div>
 </div>

 <div class="left-second">
  <div class="tags-sprite">
   <div class="tags">来自标签:<%= articles[i].tags%></div>
   <div class="sprite-delete" alt="不感兴趣" title="不感兴趣"
        r-on="{
          click:onClick
        }"></div>
  </div>
  <div class="title">
   <a href="<%= articles[i].articleHref %>" >
    <%= articles[i].title %>
   </a>
  </div>
  <div class="author">
   <a href="<%= articles[i].authorHref %>">
    <span class="authorname"><%= articles[i].author.username %></span>
   </a>
    <span>,</span>
    <span><%= articles[i].author.summary||"" %></span>
    <span>创作于:</span>
    <span><%= articles[i].createFormateDate %></span>
   
  </div>
  <div class="content">
   <% if(articles[i].titleSrc){ %>
   <img src="<%= articles[i].titleSrc %>" class="title-src" />
   <% } %>
   <a class="sub-content" href="<%= articles[i].articleHref %>">
    <span class="sub-content-ellipsis">
     <%- articles[i].shortContent %>
     <span class='show-all' r-on="{
        click:showAll
     }">显示全部</span>
    </span>
    <!-- <span class="sub-content-ellipsis"></span> -->
   </a>
   <div style="display:none" class="store-content">
    <%- articles[i].content %>
    <span class='show-ellipsis' r-on="{
        click:showEllipsis
    }">收起</span>
   </div>
  </div>
  <div class="comment">
   <a href="<%= articles[i].articleHref %>" >
    <span>评论(<%= articles[i].commentNum %>)</span>
   </a>
   <a href="<%= articles[i].articleHref %>" >
    <span>阅读(<%= articles[i].visitedNum %>)</span>
   </a>
  </div>
 </div>
 </div>