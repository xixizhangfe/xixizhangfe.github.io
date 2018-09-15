---
title: 'display: none, overflow: hidden, visibility: hidden之间的区别'
date: 2017-07-19 09:33:09
tags: 前端， css，css3
categories:
---
### display: none

隐藏元素，不占网页中的任何空间，让这个元素彻底消失（看不见也摸不着）

### overflow: hidden

让超出的元素隐藏，就是在设置该属性的时候他会根据你设置的宽高把多余的那部分剪掉

### visibility: hidden

他是把那个层隐藏了，也就是你看不到它的内容但是它内容所占据的空间还是存在的。（看不见但摸得到）

	{ display: none; /* 不占据空间，无法点击 */ } 

	{ visibility: hidden; /* 占据空间，无法点击 */ } 
	
	{ height: 0; overflow: hidden; /* 不占据空间，无法点击 */ } 

	{ position: absolute; top: -999em; /* 不占据空间，无法点击 */ } 
	
	{ position: relative; top: -999em; /* 占据空间，无法点击 */ } 
	
	{ position: absolute; visibility: hidden; /* 不占据空间，无法点击 */ } 
	
	{ opacity: 0; filter:Alpha(opacity=0); /* 占据空间，可以点击 */ } 

	{ position: absolute; opacity: 0; filter:Alpha(opacity=0); /* 不占据空间，可以点击 */ } 

### 重绘与回流
修改常规流中元素的display通常会造成文档重排。修改visibility属性只会造成本元素的重绘。 

### 是否可以读到
读屏器不会读取display: none;元素内容；会读取visibility: hidden;元素内容


### 是否加载

这个之前腾讯的开发组做过测试，不同浏览器下面表现不同，但是基本上都是加载的，不管你是display:none还是visibility:hidden，亦或是opacity:0，都会加载的。
