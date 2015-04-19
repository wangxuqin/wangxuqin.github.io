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

###3.android访问文件权限   
android下权限跟linux是对应的，一个android应用相当是一个用户，所以一个应用创建的文件就跟一个用户创建的文件后获得访问权限一致。   

```java
context.openFileOutput("file");                                 //默认   -rw-------
context.openFileOutput("file", Context.PRIVATE);                //私有   -rw-rw----
context.openFileOutput("file", Context.MODE_WORLD_READABLE);    //可读   -rw-rw-r--
context.openFileOutput("file", Context.MODE_WORLD_WRITEABLE);   //可写   -rw-rw--w-
context.openFileOutput("file", Context.MODE_WORLD_WRITEABLE +   //可读写 -rw-rw-rw-
Context.MODE_WORLD_READABLE);
```
linux系统下的文件权限   
位置0 -代表文件 d代表目录 
一般情况下android下的每一个应用都是一个独立的用户，对应一个独立的组  
位置1~3：当前用户				r可读 w可写 x可执行  
位置4~6：当前用户所在的组  
位置7~9：其他的用户的权限  

```
- --- --- --- 0 000
- rw- --- --- 0 600
- rw- rw- rw- 0 600
```

使用 **chmod** 可改变用户权限。  

###4.介绍android在github上面相关开源项目  
  
  http://www.tuicool.com/articles/2yEBzqM
