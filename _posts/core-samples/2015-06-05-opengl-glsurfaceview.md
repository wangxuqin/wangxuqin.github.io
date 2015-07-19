---
layout: post
title:  "GLSurfaceView相关（转）"
date:   2015-06-05 10:26
categories: common
---
###1.GLSurfaceView简介
GLSurfaceView是一个视图，继承至SurfaceView，它内嵌的surface专门负责OpenGL渲染。 GLSurfaceView提供了下列特性:  
<i>
  1.软件一个surface，这个surface就是一块特殊的内存，能直接排版到android的视图view上。  
  2.管理一个EGL display，它能让opengl把内容渲染到上述的surface上。  
  3.用户自定义渲染器(render)。  
  4.让渲染器在独立的线程里运作，和UI线程分离。  
  5.支持按需渲染(on-demand)和连续渲染(continuous)。  
  6.一些可选工具，如调试。  
</i>

**使用GLSurfaceView**  
通常会继承GLSurfaceView，并重载一些和用户输入事件有关的方法。如果你不需要重载事件方法，GLSurface也可以直接使用，你可以使用set方法来为该类提供自定义的行为。例如，GLSurfaceView的渲染被委托给渲染器在独立的渲染线程里进行，这一点和普通视图不一样，setRenderer(Renderer)设置渲染器。  

**初始化GLSurfaceView**  
初始化过程起始仅需要你使用<b><font color='#4472C4'>setRenderer(Renderer)</font></b>设置指一个渲染器(render)。当然，你也可以修改GLSurfaceView一些默认配置。  

```java
(1)setDebugFlags(int);  
(2)setEGLConfigChooser(boolean);   
(3)setEGLConfigChooser(EGLConfigChooser);  
(4)setEGLConfigChooser(int, int, int, int, int, int);  
(5)setGLWrapper(GLWrapper);  
```

**定制android.view.Surface**  
GLSurfaceView默认会创建像素格式为<b><font color='#4472C4'>PixelFormat.RGB_565</font></b>的surface。如果需要透明效果，调用getHolder.setFormat(PixelFormat.TRANSLUCENT)。透明的surface像素格式都是32位，每个色彩单元都是8位深度，像素格式是设备相关的，这意味着它可能是ARGB、RGBA或其它。  

**选择EGL配置**  
Andoid设备往往支持多种EGL配置，可以使用不同数目的通道(channel)，也可以指定每个通道具有不同数目的位(bits)深度。  因此，在渲染器工作之前就应该指定EGL的配置。  GLSurfaceView默认EGL配置的像素格式为RGB_656，16位的深度缓存(depth buffer)，  默认不开启遮罩缓存(stencil buffer)。如果你要选择不同的EGL配置，使用setEGLConfigChooser方法中的一种。  

**调试行为**  
你可以调用调试方法<b><font color='#4472C4'>setDebugFlags(int)</font></b>或<b><font color='#4472C4'>setGLWrapper(GLSurfaceView.GLWrapper)</font></b>来定义GLSurfaceView一些行为。  在setRenderer方法之前或之后都可以调用调试方法，不过只好在之前调用，这样它们能够立即生效。  

**渲染模式**  
渲染器设定之后，你可以使用<b><font color='#4472C4'>setRenderMode(int)</font></b>指定渲染模式是按需<b><font color='#4472C4'>(on demand)</font></b>还是连续<b><font color='#4472C4'>(continuous)</font></b>。默认是连续渲染。  

**Activitiy生命周期**  
Activity窗口暂停<b><font color='#4472C4'>pause</font></b>或恢复<b><font color='#4472C4'>resume</font></b>时，GLSurfaceView都会收到通知，此时它的<b><font color='#4472C4'>onPause</font></b>方法和<b><font color='#4472C4'>onResume</font></b>方法应该被调用。这样做是为了让GLSurfaceView暂停或恢复它的渲染线程，以便它及时释放或重建OpenGL的资源。  

**事件处理**  
为了处理事件，一般都是继承GLSurfaceView类并重载它的事件方法。但是由于GLSurfaceView是多线程操作，所以需要一些特殊的处理。由于渲染器在独立的渲染线程里，你应该使用Java的跨线程机制跟渲染器通讯。<b><font color='#4472C4'>queueEvent(Runnable)</font></b>方法就是一种相对简单的操作，例如下面的例子。

```java
class MyGLSurfaceView extends GLSurfaceView {
	private MyRenderer mMyRenderer;
	
	public void start(){
		mMyRenderer = ..;
		setRenderer(mMyRenderer);
	}
	
	public boolean onKeyDown(int keyCode, KeyEvent event){
		if(keyCode == KeyEvent.KEYCODE_DPAD_CENTER){
			queueEvent(new Runnable(){
				//这个方法会在渲染线程里被调用
				public void run(){
					mMyRenderer.handleDpadCenter();
				}
			});
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
}
```

(注：如果在UI线程调用渲染器的方法，很容易收到"call to OpenGL ES API with no context"的警告，典型的误区就是在键盘或鼠标事件方法里直接调用opengl es的API,因为UI事件和渲染绘制在不同线程里。更甚者，这种情况下调用glDeleteBuffers这种释放资源的方法，可能引起程序的奔溃，因为UI线程想释放它，渲染线程却要使用它)。
 
###2.非交互式Demo  

```java
/** 
 * 本示例演示OpenGL ES开发3D应用 
 * 该Activity直接使用了GLSurfaceView 
 * 这是因为GLSurfaceView可以直接使用，除非需要接受用户输入，和用户交互，才需要重写一些GLSurfaceView的方法 
 * 如果开发一个非交互式的OpenGL应用，可以直接使用GLSurfaceView。参照本示例 
 * @author Administrator 
 * 
 */  
public class NonInteractiveDemo extends Activity {
	
	private GLSurfaceView glView = null;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        glView = new GLSurfaceView(this);
        glView.setRenderer(new DemoRender());
        setContentView(glView);
    }
}

class DemoRender implements Renderer {

	@Override
	public void onDrawFrame(GL10 gl) {
		//每帧都需要调用该方法进行绘制，绘制时通常先调用glClear来清空framebuffer
		//然后调用OpenGL ES其他接口进行绘制
		gl.glClear(GL10.GL_COLOR_BUFFER_BIT|GL10.GL_DEPTH_BUFFER_BIT);
	}

	@Override
	public void onSurfaceChanged(GL10 gl, int width, int height) {
		//当surface的尺寸发生改时，该方法被调用，往往在这里设置ViewPort，或者Camera等
		gl.glViewport(0, 0, width, height);
	}

	@Override
	public void onSurfaceCreated(GL10 gl, EGLConfig config) {
		//该方法在渲染开始前调用，OpenGL ES的绘制上下问被重建时也会调用
		//当Activity暂停时，绘制上下问会丢失，当Activity恢复时，绘制上下文会重建
	}
}
```

###3.交互式  

```java
package com.example.interactivedemo;
import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.app.Activity;
import android.content.Context;
import android.opengl.GLSurfaceView;
import android.opengl.GLSurfaceView.Renderer;
import android.os.Bundle;
import android.view.MotionEvent;
/**
 * 本示例演示OpenGL ES开发3D应用
 * 该Activity使用了自定义的GLSurfaceView的子类
 * 这样，我们可以开发出和用户交互的应用，比如游戏等。
 * 需要注意的是：由于渲染对象是运行在一个独立的渲染线程中，所以
 * 需要采用跨线程的机制来进行事件的处理。但是Android提供了一个简便的方法
 * 我们只需要在事件处理中使用queueEvent(Runnable)就可以了.
 * 
 * 对于大多数3D应用，如游戏、模拟等都是持续性渲染，但对于反应式应用来说，只有等用户进行了某个操作后再开始渲染。
 * GLSurfaceView支持这两种模式。通过调用方法setRenderMode()方法设置。
 * 调用requestRender()继续渲染。
 * 
 * 
 * @author Administrator
 *
 */
public class InteractiveDemo extends Activity {
	
	private GLSurfaceView mGLView;
	
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		mGLView = new DemoGLSurfaceView(this); //这里使用的是自定义的GLSurfaceView的子类
		setContentView(mGLView);
	}
	
	
	public void onPause(){
		super.onPause();
		mGLView.onPause();
	}
	
	public void onResume(){
		super.onResume();
		mGLView.onResume();
	}
}
class DemoGLSurfaceView extends GLSurfaceView{
	DemoRenderer mRenderer;
	
	public DemoGLSurfaceView(Context context) {
		super(context);
		//为了可以激活log和错误检查，帮助调试3D应用，需要调用setDebugFlags()。
		this.setDebugFlags(DEBUG_CHECK_GL_ERROR|DEBUG_LOG_GL_CALLS);
		mRenderer = new DemoRenderer();
		this.setRenderer(mRenderer);
	}
	
	public boolean onTouchEvent(final MotionEvent event){
		//由于DemoRenderer2对象运行在另一个线程中，这里采用跨线程的机制进行处理。使用queueEvent方法
		//当然也可以使用其他像Synchronized来进行UI线程和渲染线程进行通信。
		this.queueEvent(new Runnable() {
			
			@Override
			public void run() {
				mRenderer.setColor(event.getX()/getWidth(), event.getY()/getHeight(), 1.0f);
			}
		});
		
		return true;
	}
	
}
/**
 * 这个应用在每一帧中清空屏幕，当tap屏幕时，改变屏幕的颜色。
 * @author Administrator
 *
 */
class DemoRenderer implements Renderer{
	
	private float mRed;
	private float mGreen;
	private float mBlue;
	
	@Override
	public void onDrawFrame(GL10 gl) {
		gl.glClearColor(mRed, mGreen, mBlue, 1.0f);
		gl.glClear(GL10.GL_COLOR_BUFFER_BIT|GL10.GL_DEPTH_BUFFER_BIT);
	}
	@Override
	public void onSurfaceChanged(GL10 gl, int w, int h) {
		gl.glViewport(0, 0, w, h);
	}
	
	@Override
	public void onSurfaceCreated(GL10 gl, EGLConfig config) {
		
	}
	
	public void setColor(float r, float g, float b){
		this.mRed = r;
		this.mGreen = g;
		this.mBlue = b;
	}
}
```