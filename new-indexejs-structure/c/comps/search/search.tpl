<div class="top-nav-center-search"
     r-component="search">
    <form class="top-nav-center-search-form">
     <input type="text" name="search" value="" class="top-nav-center-search-input" placeholder="请输入..."
       r-on="{
         keyup:onKeyup;
         focus:onFocus
       }">
     <button class="top-nav-center-search-button">
     <span class="top-nav-center-search-button-span"></span>
     </button>
    </form>
    <div class="top-nav-center-search-result"
     r-show="{showSearchResult}">
     <p>标签</p>
     <ul class="top-nav-center-search-result-tags"
         r-for="{tags}">
      <li><a href='/tags/{key}' >{key}</a>文章数量({value})</li>
     </ul>
     <p>作者</p>
     <ul class="top-nav-center-search-result-authors"
         r-for="{authors}">
           <li><a href="/authors/{value._id}">{value.username}</a>职位({value.job})</li>
     </ul>
     <p>文章</p>
     <ul class="top-nav-center-search-result-articles"
         r-for="{articles}">
      <li><a href="/authors/{value._id}">{value.title}</a>点赞数量({value.praiseNum})</li>
     </ul>
    </div>
   </div>