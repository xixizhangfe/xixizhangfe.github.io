---
title: 利用html5 video打造播放器（一）
date: 2017-07-17 13:55:59
tags: 前端，html5，video
categories: 
---
## html5 video标签

1\. video支持的视频格式

* ogg: 带有theora视频编码和vorbis音频编码的ogg文件
* mpeg 4: 带有H.264视频编码和AAC音频编码的MPEG 4文件
* webM: 带有VP8视频编码和Vorbis音频编码的webM文件

2\. 使用方法
	
	// 方式1
	<video src="movie.ogg" controls="controls" >
		您的浏览器不支持video标签
	</video>
	
	// 方式2
	<video width="320" height="240" controls="controls">
		<source src="movie.mp4" type="video/mp4">
		<source src="movie.ogg" type="video/ogg">
		您的浏览器不支持video标签
	</video>
说明：video元素可以包含多个source元素，每个source元素可以链接不同的视频文件，浏览器将使用第一个可识别的格式

3\. video标签的属性

(1) width、height、src属性就不多说了

(2) 重点说一下controls属性：

语法：

	<video controls="controls"/>
controls属性规定浏览器应该为视频提供播放控件。如果设置了该属性，则规定不存在作者设置的脚本控件。

浏览器控件应该包括：

* 播放
* 暂停
* 定位
* 音量
* 全屏切换
* 字幕（如果可用）
* 音轨（如果可用）

(3) autoplay属性

语法：

	<video autoplay="autoplay"/>
如果设置了该属性，视频将自动播放。

(4) loop属性
语法：

	<video loop="loop"/>
如果设置了该属性，视频将循环播放。

(5) preload属性

该属性规定是否在页面加载后载入视频。（如果设置了autoplay属性，则忽略该属性）

语法：

	<video preload="load"/>

属性值：

load： 规定是否预加载视频。可能的值：

* auto-全部预加载
* meta-部分预加载，只预加载视频的元数据（包括尺寸，第一帧，曲目列表，持续时间等）
* none-不进行预加载。可以减少http请求。

(6) poster属性

语法：

	<video preload="URL"/>

规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像。
如果未设置该属性，则使用视频的第一帧来代替。

(7) muted属性

语法：

	<video muted/>

规定视频的音频输出应该被静音。


4\. 常用方法

play(): 开始播放音频/视频
pause(): 暂停当前播放的音频/视频

5\. 常用事件

oncanplay:当文件就绪就可以开始播放时运行的脚本（缓冲已足够开始时）
ontimeupdate: 当播放位置改变时运行的脚本（比如当用户快进到媒介中一个不同的位置时）
onended: 当媒介已到达结尾时运行的脚本（可发送类似“谢谢观看”之类的信息）

6\. 常用API属性

duration:返回当前播放视频的总时间（单位是：秒）
paused:设置或返回视频是否暂停
currentTime: 设置或返回当前播放位置（单位是：秒）
ended: 返回视频的播放是否已经结束






