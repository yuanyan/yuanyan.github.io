---
layout: page
title: 日出
header:  日出
tagline: 元彥の程序世界
---
{% include JB/setup %}

`yuanyan.json`:
    
    {
        name : '@元彦',
        email : 'yuanyan.cao(at)gmail.com',
        github : 'http://github.com/yuanyan',
        twitter : 'http://twitter.com/caoyuanyan',
        weibo : 'http://weibo.com/caoyuanyan'
    }

## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> {{ post.date | date_to_string }}</span> </li>
  {% endfor %}
</ul>

## Projects
<iframe src="http://markdotto.github.com/github-buttons/github-btn.html?user=yuanyan&type=follow"
  allowtransparency="true" frameborder="0" scrolling="0" width="132px" height="20px"></iframe>
<ul class="projects">

</ul>

<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="static/js/jquery-1.7.1.min.js"><\/script>')</script>

<script id="projectsTmpl" type="text/x-jquery-tmpl">
  <li>
    <h3>
    <a href="${html_url}" target="_blank">${name}</a>
    <small>${updated_at}</small>
    </h3>
    <p>${description}</p>
    <p class="meta">
       <a class="btn large" href="${html_url}" target="_blank">fork: ${forks}</a>
       <a class="btn large" href="${html_url}" target="_blank">watchers: ${watchers}</a>
    </p>
  </li>
</script>

<script>
  (function(){
     var reqPromise= $.ajax({
         dataType: "jsonp",
         url: "https://api.github.com/users/yuanyan/repos",
         jsonp: "callback",
     });

     reqPromise.done(function(data){
        var projects = data.data;

        projects.sort(function(a, b) {
              return new Date(b.updated_at) - new Date(a.updated_at);
        });

        $("#projectsTmpl").template( "projectsTmpl" )
        $.tmpl("projectsTmpl", projects).appendTo("#projects");
     });
</script>