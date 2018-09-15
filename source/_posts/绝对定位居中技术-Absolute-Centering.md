---
title: 绝对定位居中技术(Absolute Centering)
date: 2017-07-19 14:24:51
tags:
categories:
---
## 水平垂直居中

实现水平垂直居中，只需要三点：
* 声明元素宽度
* 给父元素设置相对定位
* 给该元素设置类Absolute-Center，如下：
	
	```
	.Absolute-Center {
      margin: auto;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: auto; // 建议加上
    }
    ```
  
  
## 原理

1\. 在普通文档流中，margin:auto 的效果等同于margin-top:0; margin-bottom: 0;。

2\. position:absolute;使绝对定位块跳出了文档流，文档流其余部分渲染时绝对定位部分不进行渲染。

3\. 为块区域设置top:0;left:0;bottom:0;right:0;将给浏览器重新分配一个边界框，此时该块将填充至其父元素的所有可用空间，父元素一般为body，或者声明为position:relative;的容器。

4\. 给内容块设置一个width或者height，能够防止内容块占据所有的可用空间，促使浏览器根据新的边界框重新计算margin:auto;

5\. 由于内容块被绝对定位，脱离了正常的文档流，浏览器会给magin-top,margin-bottom相同的值，使元素块在先前定义的边界内居中。


简而言之： 绝对定位元素不在普通文档流中渲染，因此margin-auto可以使内容在通过top:0;left:0;bottom: 0;right:0;设置的边界内垂直居中。


## 误解的地方
以前一直以为margin:auto; 就是上下左右都是按照可用空间同等分配，这是错的！错的！错的！

**margin: 0 auto; 表示左右根据可用空间同等分配，而上下设置为0**



## 居中方式

### 1\. 容器内(within container)

这个不多说，就是给父容器设置position:relative;，该元素设置宽高，并加上.Absolute-Center的类。

### 2\. 视区内(within viewport)
想让内容块一只停留在可视区域？给内容块设置为position:fixed;并设置一个z-index:1;层叠属性值即可。

### 3\. 边栏(offsets)

不懂。。。
（待后续研究）



转载自：http://blog.csdn.net/freshlover/article/details/11579669
