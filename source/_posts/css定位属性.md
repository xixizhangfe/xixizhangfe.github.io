---
title: css定位属性
date: 2017-07-18 22:09:08
tags: 前端，css，css3
categories:
---
说到定位属性，首先想到的是relative，absolute等等，但今天一查，原来面试官口中说的定位属性原来不仅仅是这些~~~~

属性|版本|继承性|简介
-----|-----|-----|-----|
position|css2|无|用来设置文档对象的定位方式
z-index|css2|无|用来设置文档对象的层叠顺序，必须定位position属性为absolute、relative、或fixed，此取值方可生效
top|css2|无|用来设置文档对象与其最近一个定位的父对象顶部相关的位置，仅当定义position属性值为absolute、relative、fixed，此取值方可生效
right|css2|无|检索或这是对象与其最近一个定位的父对象右边相关的位置
bottom|css2|无|检索或设置与其最近一个定位的父对象底边相关的位置
left|css2|无|检索或设置与其最近一个定位的父对象左边相关的位置


#### position对应的值

* 绝对定位(position: absolute)

绝对定位的作用是将元素**从文档流中拖出来**，然后使用left，right，top，bottom属性相对于其最近的一个具有定位属性的父包含块(containing block)进行绝对定位，而且是**相对于其边框内边缘的，而不是其padding内边缘**。如果不存在这样的包含块，则相对于body元素定位。

原来的空间会被其他元素挤占。

元素在最终位置时也不会挤占其他元素的空间，而是浮动到其他元素的上方。

* 相对定位(postition: relative)

通过left,right,top,bottom属性确定元素在正常文档流中的偏移位置，相对定位完成的过程是首先按static(float)方式生成一个元素（并且元素像层一样浮动起来），然后相对于以前的位置移动，移动方向和幅度由left，right，top，bottom属性确定，**偏移前的位置保留不动，没有脱离文档流**。

原来的空间不会被其他元素挤占。

元素在最终位置时也不会挤占其他元素的空间，它浮动到其他元素的上方。

* 固定定位(positition: fixed)

与absolute定位类型类似，但它相对移动的坐标是视图（屏幕内的网页窗口）本身，由于视图本身是固定的，它不会随浏览器窗口的滚动条滚动而变化，不会受文档流动影响。

* position: static

是默认值。就是按正常的布局流从上到下从左到右布局，没有指定position，默认是static。

* position: inherit

继续父元素的position值








