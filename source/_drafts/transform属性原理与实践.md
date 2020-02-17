---
title: transform属性原理与实践
tags: css
---
# 区分translate属性、transform属性、translate函数
translate属性与transform属性一样都是元素的css属性，只是现在<strong>所有浏览器都不支持translate属性</strong>。

transform属性（transform、transform2d属性）浏览器兼容性非常好，几乎所有浏览器都支持。

translate函数与scale、rotate一样，是变形函数（transform-function）的一种，需要用在transform属性中。

所以如下这种写法是不生效的：

```javascript
.box {
  translate: 50px; // 不生效，浏览器会提示【无效的属性】
}
```

要想生效，只能通过transform来实现：

```javascript
.box {
  transform: translate(50px); // 生效
}
```

## translate函数使用注意事项
参数是两个值，如果只写一个如`translate(10px)`，等价于`translateX(10px)`，而不是`translate(10px, 10px)`。

为什么会有这样的注意？

因为这个可能会在脑抽时<strong>与css属性值的简写混淆</strong>。

比如我们写`margin: 10px`，等价于`margin: 10px 10px 10px 10px`。

那当我们写`transform: translate(10px)`时，可能会当成`transform: translate(10px, 10px)`。

反正我脑抽时会有这种错觉。。。

所以需要清醒的认识到，<strong>`translate`是一个函数，括号里的值是函数的参数</strong>，函数参数如果也像css属性值简写了，那岂不是乱套了！！！

# transform本质

## transform本质就是对元素进行仿射变换。

仿射变换：对一个向量空间进行一次线性变换，再加上一个平移，变成另一个向量空间。

所有的仿射变换都可以用一个矩阵来表示。因此，所有的transform-function（translate、scale、rotate等）都可以用矩阵来表示。

<strong>这个矩阵不是二维笛卡尔坐标系中的矩阵，而是三维笛卡尔坐标系或者齐次坐标系中的矩阵。</strong>

如果有多个变形函数，上述的矩阵就是多个变形函数所对应矩阵相乘，<strong>这也就是为什么变形函数的顺序很重要</strong>。

原理请参考下面这张图。

<image src="../images/空间坐标变换.jpeg">


## 仿射变换后整个元素的坐标系也会跟着变化
因为变成了另一个向量空间，所以坐标系也会随之变成另一个向量空间的坐标系。



# 实践
参考css揭秘这本书
## css揭秘-沿环形路径平移的动画
