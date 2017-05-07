 <div class="top-nav"
      r-component="nav"
      r-props="{
          isLogin:<%= !!user %>
      }">
  <div class="top-nav-center">

   <div class="top-nav-center-profile"
        r-on="{
           mouseover:onMouseover;
           mouseout:onMouseout
        }">
     <% if(user){ %>
      <a href="/mainpage" class="top-nav-center-profile-mainpage">
       <% if(user.img){ %>
       <img src='<%= user.img %>' />
       <% }else{ %>
       <img src='/images/publicHeader.png' />
       <% } %>
       <span><%= user.username %></span>
      </a>
     <% }else{ %>
     <span class="loginorregister">
      <a href="/loginorregister/login"><span>登陆</span></a>
     <a href="/loginorregister/register"><span>注册</span></a>
     </span>
    <% } %>
    <div class="profile-div">
    <ul class="profile-ul"
        r-show="showProfile">
     <li><a href="/mainpage"><span class="sprite-mainpage"></span>我的主页</a></li>
     <li><a href="/personalMsg"><span class="sprite-personalMsg"></span>私信</a></li>
     <li><a href="/setting"><span class="sprite-setting"></span>设置</a></li>
     <li><a href="/exit"><span class="sprite-exit"></span>退出</a></li>
    </ul>
    </div>
   </div>

   <a class="top-nav-center-publish-article" href="/editorArticle">发博文</a>
   <a href="/shouye" class="top-nav-center-search-a"><span class="top-nav-center-search-span"></span></a>
   {% search $replace=true %}
   
   <div class="top-nav-center-menu">
    <ul>
     <li><a href="/index">首页</a></li>
     <li><a href="/topic">话题</a></li>
     <li><a href="/explore">发现</a></li>
     <li><a href="/message">消息</a></li>
    </ul>
   </div>

  </div>
 </div>