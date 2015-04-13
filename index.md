---
layout: page
title: 欢迎来到KimWang的博客
tagline: 简单是一种态度
---
### 文件列表  
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

