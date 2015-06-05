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