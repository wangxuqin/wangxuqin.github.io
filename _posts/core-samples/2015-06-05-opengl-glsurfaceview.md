---
layout: post
title:  "GLSurfaceView相关（转）"
date:   2015-06-05 10:26
categories: common
---
**1.GLSurfaceView简介**  
**2.非交互式Demo**  

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

**3.交互式**  

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