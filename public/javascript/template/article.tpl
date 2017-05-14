<div class="line">
  <div class="left-first">
   <img src="{%= img %}" />
  <div class="praise">
   <a class="praiseNum" data-flag="no" data-articleId="{%= _id %}">
   {%= praiseNum %}</a>
  </div>
 </div>

 <div class="left-second">
  <div class="tags-sprite">
   <div class="tags">来自标签:{%= tags %}</div>
   <div class="sprite-delete" alt="不感兴趣" title="不感兴趣"></div>
  </div>
  <div class="title">
   <a href="{%= articleHref %}" >
    {%= title %}
   </a>
  </div>
  <div class="author">
   <a href="{%= authorHref %}">
    <span class="authorname">{%= author.username %}</span>
   </a>
    <span>,</span>
    <span>{%= author.summary %}</span>
    <span>创作于:</span>
    <span>{%= createFormateDate %}</span>
   
  </div>
  <div class="content">

   <img src="{%= titleSrc %}" class="title-src" />  <!-- 题图 -->

   <a class="sub-content" href="{%= articleHref %}">
    <span class="sub-content-ellipsis">{%= shortContent %}<span class='show-all'>显示全部</span></span>
   </a>
   <div style="display:none" class="store-content">{%= content %}<span class='show-ellipsis'>收起</span></div>
  </div>
  <div class="comment">
   <a href="{%= articleHref+'#comments' %}" >
    <span>评论({%= commentNum %})</span>
   </a>
   <a href="{%= articleHref %}" >
    <span>阅读({%= visitedNum %})</span>
   </a>
  </div>
 </div>
 </div>