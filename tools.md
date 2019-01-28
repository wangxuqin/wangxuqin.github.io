---
layout: default
title: 工具列表
tag: tool-list
---
### 工具列表 
{% assign pages = "" | split: "" %}
{% for page in site.pages %}
    {%if page.tag == "tool" %}
      {% assign pages = pages | push: page %}
    {% endif %}
{% endfor %}

<!-- {% for page in pages %}
<p>{{page | inspect}}</p>
{% endfor %} -->

{% assign categories = "" | split: "" %}
{% assign tmpArr = pages | map:"categories" %}
{% assign hasOtherFlag = false %}
{% for tmp in tmpArr %}
  {% assign flag = false %}
  
  {% for categorie in categories %}
    {% if categorie == tmp %}
      {% assign flag = true %}
      {% break %}
    {% endif %}
  {% endfor %}
  
  {% if flag == false %}
    {% if tmp == "其它" %}
      {% assign hasOtherFlag = true %}
    {% else %}
      {% assign categories = categories | push: tmp %}
    {% endif %}
  {% endif %}
{% endfor %}

{% if hasOtherFlag == true %}
  {% assign categories = categories | push: "其它" %}
{% endif %}

{% for categorie in categories %}
  <p>{{categorie}}</p>
  <ul>
  {% for page in pages %}
      {% assign cur = page.categories | frist %}
      {% if categorie == cur %}
        <li>&nbsp;<a href="{{ BASE_PATH }}{{ page.url }}">{{ page.title }}</a></li>
      {% endif %}
  {% endfor %}
  </ul>
{% endfor %}