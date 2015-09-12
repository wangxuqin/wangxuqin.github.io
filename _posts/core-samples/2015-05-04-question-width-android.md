---
layout: post
title:  "android开发问题集"
date:   2015-05-04 10:08
categories: Android
---
**1.android 的 assets 目录中不要包含中文名字的文件，否则会出现文件【resources.ap_ does not exist】的错误。**

**2.android sdk manager 列表中没有google api选项**  
<font color='#009900'>
方法1: 更新到最新的SDK R18版本（若你用eclipse开发，要注意ADT的版本）  
方法2: 寻找Google API包，下载后，添加到add-ons目录下。  
</font>

<font color='#AAAAAA'>
<i>
add-ons：存放Android的扩展库，例如google map、USB驱动等。  
Google API包：包含 google map API、media effects API、USB连接。
</i>
</font>  