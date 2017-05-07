
 <li class="comment-item">
  <div class="comment-left">
   <a href="<%= '/authors/'+author_id %>">
    <img src="<%= author_img %>" />
   </a>
  </div>
  <div class="comment-right">

   <div class="cm-first">
    <a href="<%= '/authors/'+author_id %>" class="cm-user">
     <span><%= author_username %></span>
    </a>
    <span class="cm-date"><%= formateDate %></span>
   </div>

   <div class="cm-second">
    <span class="cm-content"><%= content %></span>
   </div>
   
   <div class="cm-third">
    <a href="" class="cm-praise" >
     <%= praiseNum %>
    </a>
    <a href="" class="cm-oppose">
     <%= opposeNum %>
    </a>
    <a href="" class="cm-replayNum">
     <%= replied.length %>
    </a>
   </div>
   
  </div>
  <ul></ul>
 </li>


