---
layout: page
title: 日出
tagline: 元彥の程序世界
---
{% include JB/setup %}

`yuanyan.json`:
    
    {
        name : yuanyan
        email : yuanyan.cao(ar)gmail.com
        github : http://github.com/yuanyan
        twitter : http://twitter.com/caoyuanyan
        weibo : http://weibo.com/caoyuanyan
    }



## Posts
<ul class="posts">
  {% for post in site.posts %}
    <li><span><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> {{ post.date | date_to_string }}</span> </li>
  {% endfor %}
</ul>



