---
title: 利用html5 video打造播放器(二)
date: 2017-07-17 14:47:44
tags: 前端，html5，video
categories:
---
有了video的基本知识（<a href="http://www.xixizhang.info/2017/07/17/%E5%88%A9%E7%94%A8html5-video%E6%89%93%E9%80%A0%E6%92%AD%E6%94%BE%E5%99%A8/">利用html5 video打造播放器(一)</a>)，接下来我们要量身定做播放器了。

---
那么我们的这个播放器要有什么功能呢？

1、自定义播放按钮

2、自定义的进度条，能够显示视频总时间，当前播放了多长时间

3、点击播放按钮，视频开始播放，按钮消失，进度条逐渐消失

4、点击视频，可以切换播放/暂停状态；如果切换为暂停，则播放按钮和进度条重新显示

5、全屏播放

6、手势拨动前进、快退

7、重力感应

---
下面开始：

（1）新建video-demo.html文件：

	<div class="my-video">
        <!-- webkit-playsinline : 在ios中，加入此属性，可以关闭自动全屏播放 -->
        <!-- object-fit:fill : 视频充满video容器的大小 -->
        <video class="" style="" id="video1">
            <source src="2.mp4" type="video/mp4">
            <source src="2.ogg" type="video/ogg"> 设备不支持Video标签。
        </video>
    </div>
    
（2）然后新建video-demo.css文件设置样式：

	html, body{
  		height: 100%;
	}
	.my-video{
  		position: relative;
  		background: black;
	}

	.my-video video {
  		width: 100%;
  		height: 100%;
  		display: block;
  		onject-fit: fill;
	}
并在video-demo.html里引入该css文件：

	<link rel="stylesheet" type="text/css" href="css/video-demo.css">
此时，应该能看到页面了。

（3）接下来我们要用到mui框架，所以需要在video-demo.html引入mui对应的js文件

	<script type="text/javascript" src="js/mui.min.js"></script>

（4）下面我们新建video-demo.js文件，动态添加播放按钮和进度条，记得把该js文件引入到html里：

	<script type="text/javascript" src="js/video-demo.js"></script>
（5）在video-demo.js里，我们先写上整体结构：

	(function($) {
		var myVideo = function(dom) {
			var that = this;
			$.ready(function() {
				that.video = document.querySelector(dom || 'video');
            	that.vRoom = that.video.parentNode;
            	// 元素初始化
            	that.initEm();
            	// 事件初始化
            	that.initEvent();
            	//  记录信息
            	that.initInfo();
			});
		}
		var nv = null;
    	$.myVideo = function(dom) {
        	return nv || (nv = new myVideo(dom));
    	}
	}(mui))
其中，

initEm是用于初始化元素，即动态添加播放按钮和控制条；

initEvent是用于放置我们需要的事件函数；

initInfo是用于处理相关信息，比如视频的元数据，小屏、全屏时对应的信息。

然后如果要使用myVideo对应的这些函数，就要在html里加入调用：

	<script type="text/javascript">
      var v = mui.myVideo();
    </script>

（6）接下来我们首先填充initEm()函数

	var pro = myVideo.prototype;

    pro.initEm = function() {
        // 动态添加播放按钮
        this.vimg = document.createElement("img");
        // 如果img的src设置为本地资源的话，那么以后使用会出现很多问题，比如，页面层级发生变化时，你要去修改video-demo.js,为避免夜长梦多，我们将图片转换为base64 
        // this.vimg.src = "img/play.png";
        // 以下就是base64编码，可以网上搜索在线转换工具，这里就没写上编码，太长了
        this.vimg.src = 'data:image/png;base64...';
        this.vimg.className = 'play-img';
        this.vRoom.appendChild(this.vimg);

        // 动态添加控制条
        this.vControls = document.createElement('div');
        this.vControls.classList.add('controls');
        this.vControls.innerHTML = '<div><div class="progressBar"><div class="timeBar"></div></div></div><div><span class="current">00:00</span>/<span class="duration">00:00</span></div><div><span class="fill">全屏</span></div>';
        this.vRoom.appendChild(this.vControls);
    }

此时应该能看到播放按钮和控制条了，只是样式不对。

（7）接下来我们设置播放按钮的样式
	
	.my-video .play-img{
      position: absolute;
      width: 15%;
      z-index: 99;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%)
    }
   
（8）然后设置控制条的样式

    .my-video .controls{
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      font-size: 0.8rem;
      color: white;
      position: absolute;
      bottom:0;
      background: rgba(0, 0, 0, .55);
      display: flex;
    }

    .my-video .controls > * {
      flex: 1;
    }

    .my-video .controls > *:nth-child(1) {
      flex: 6;
    }
    .my-video .controls > *:nth-child(2) {
      flex: 2;
    }

    .my-video .controls .progressBar{
      margin: 0.75rem 5%;
      position: relative;
      width: 90%;
      height: 0.5rem;
      background: rgba(200, 200, 200, .55);
      border-radius: 10px;
    }

    .my-video .controls .timeBar {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background-color: rgba(99, 110, 225, .85);
        border-radius: 10px;
    }
此时应该能看到这样了：
![detail](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/3.png)

至此，我们的基本样式已经搞定了，下面就是一些事件了。



















