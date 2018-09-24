---
layout: page
title:  "android横竖屏切换时的一些问题"
date:   2015-04-13 12:00
categories: android
---
{% include setup %}
#### 前言  
android横竖切换的时候会带有很多问题，下面就是本人在使用Zxing进行二维码应用二次开发的时候遇到的一些横竖屏切换问题。

#### 1)支持横屏竖屏切换布局问题
在android中横竖屏布局有两种方案：1.使用单一布局xml文件；2.使用横竖屏xml文件：

#### 1.1 使用单一布局xml文件  
将xml文件中布局设置好，当横竖切换回调 **onConfigurationChanged** 同时自动布局UI上的界面。

优点：  
1.不需要重新执行onCreate，onResume等方法，响应速度比较快。   
2.不会发生当前Activity数据丢失的问题。 

缺点：  
1.使用单一布局文件对横竖屏的布局支持不够灵活，不够方便。需要对布局文件做较多兼容才能实现比较理想的效果。  
2.在onConfigurationChanged中无法获取一些实际参数，比如布局的横竖切换后的宽高。但是可以使用下面的方法解决： 

{% highlight java %}
public void onConfigurationChanged(Configuration newConfig) {
	super.onConfigurationChanged(newConfig);
	view.getViewTreeObserver().addOnGlobalLayoutListener(this);
}

@Override
public void onGlobalLayout() {
	// 获取横竖切换的宽高
}
{% endhighlight %}



#### 1.2 使用横竖屏布局xml文件   
在res目录下新建layout-port, layout-land文件夹，分别放入竖屏xml文件和横屏xml文件。当横竖切换的时候，就会自动调用对应xml文件进行布局。 

优点：  
1.布局比较灵活，切换横屏的时候使用layout-land里面的xml文件，切换竖屏的时候使用layout-port里面的xml文件。

缺点：   
1.布局切换的时候，需要调用onCreate方法重新生成界面，消耗资源比较大，降低响应速度。   
2.由于需要重新回调一些函数造成数据丢失，但可以使用重写Activity的非生命周期方法 onSaveInstanceState 和 onRestoreInstanceState 解决。
在 onSaveInstanceState 写入需要保存的数据，在 onRestoreInstanceState 写入还原数据的逻辑。当横竖切换时会先调用 onSaveInstanceState 保存数据，当横竖切换完毕后用 onRestoreInstanceState 恢复数据。

#### 2)Camera横竖屏时的兼容性问题
当使用camera.setDisplayOrientation(degrees)，在android高版本不会报错，但是在android低版本(2.3)就会出错，以下方法可以解决：

```java
camera.stopPreview();	//停止预览
camera.setDisplayOrientation(degrees);	//切换方向
camera.startPreview();	//开始预览
```
