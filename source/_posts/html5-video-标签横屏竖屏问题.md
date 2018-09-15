---
title: html5 video 标签横屏竖屏问题
date: 2017-07-17 22:47:37
tags: 前端，html5，video
categories:
---
在手机上录制的视频有些是横屏的，有些是竖屏的，发现使用video标签播放的时候横屏的视频有时候会变成竖屏播放，即使设置了宽高。所以这个播放方向是如何确定的？

先说一个场景
随便在微信打开一个带有视频的文章 你点击视频 视频播放 你把手机翻转变成横屏 
你期望的结果是视频边横屏 并且 全屏 但实际当前视窗 已经横屏不知道哪里去了 视频还是在那个小窗口里播放。

** video标签本身不具备响应横竖屏的事件 **

能捕获横竖屏方向的事件和方法

1、 window.orientation属性与onorientationchange事件
	
	//判断手机横竖屏状态：
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            alert('竖屏状态！');
        }
        if (window.orientation === 90 || window.orientation === -90 ){
            alert('横屏状态！');
        } 
    }, false);
//移动端的浏览器一般都支持window.orientation这个参数，通过这个参数可以判断出手机是处在横屏还是竖屏状态。

2、resize监听 通过计算来判断
3、css媒体查询

	/* 竖屏 */
	@media screen and (orientation:portrait) {

	/* portrait-specific styles */

	}

	/* 横屏 */

	@media screen and (orientation:landscape) {

	/* landscape-specific styles */

	}
	
屏幕方向对应的window.orientation值：

ipad,iphone： 90 或 -90 横屏

ipad,iphone： 0 或180 竖屏

Andriod：0 或180 横屏

Andriod： 90 或 -90 竖屏

	
转载自：https://segmentfault.com/q/1010000003913319/a-1020000003919464

http://www.cnblogs.com/AnotherLife/p/5764389.html
