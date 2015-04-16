---
layout: post
title:  "android基础知识"
date:   2015-04-15 12:00
categories: android
---
###1.两种Java虚拟机的的比较  
**1.编译后文件格式**  
jvm:    .java -> .class-> .jar  
dalvik: .java -> .class -> .dex -> .odex  

**2.基于的架构**  
jvm：	基于栈的架构  
dalvik: 基于寄存器的架构  

**3.文件结构**  
Dalvik执行的是特有的DEX文件格式，而JVM运行的是*.class文件格式。  
优势：  
1、在编译时提前优化代码而不是等到运行时  
2、虚拟机很小，使用的空间也小；被设计来满足可高效运行多种虚拟机实例。  
3、常量池已被修改为只使用32位的索引，以	简化解释器JVM的字节码主要是零地址形式的，概念上说JVM是基于栈的架构。Google Android平台上的应用程序的主要开发语言是Java，通过其中的Dalvik VM来运行Java程序。为了能正确实现语义，Dalvik VM的许多设计都考虑到与JVM的兼容性；但它却采用了基于寄存器的架构，其字节码主要是二地址/三地址的混合形式。


###2.获取android各种目录
```java
context.getAssets();	//资产目录
context.getFilesDir();	//数据目录
context.getCacheDir();	//缓存目录
context.getResource();	//资源目录
```