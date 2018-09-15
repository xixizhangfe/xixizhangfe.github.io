---
title: css盒模型
date: 2017-07-19 09:53:40
tags: 前端，css，css3
categories:
---
## 盒模型属性

* margin: 外边距
* border: 内边距
* padding: 边框
* content: 内容

### 标准盒模型
盒模型的宽和高：margin+border+padding+width/height

设置的width/height:是指content区的


### IE盒模型(怪异模式)
盒模型的宽和高：margin+width/height

widht/height: content+padding+border

## box-sizing
box-sizing: content-box|border-box|inherit

当设置为content-box时，采用标准模式解析；

当设置为border-box时，采用怪异模式解析：

则设置的width和height：是指border+padding+content


## 边界塌陷
当相邻的两个盒模型上下紧邻的时候，会选择margin值较大的作为外边距，即合并两个外边距取大值，左右外边距不合并。

如果两个div，一个设置为display:inline-block,一个不设置，那么就不会塌陷。



