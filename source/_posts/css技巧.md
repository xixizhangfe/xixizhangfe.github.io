---
title: css技巧
date: 2019-05-13 13:22:57
tags:
---
# 两端对齐

```
// html
<div>姓名</div>
<div>手机号码</div>
<div>账号</div>
<div>密码</div>

// css
div {
    margin: 10px 0;
    width: 100px;
    border: 1px solid red;
    text-align: justify;
    text-align-last: justify;
}

// 是为了处理safari浏览器不识别text-align-last:justify;问题（但是这样有个问题，就是会多出一行，不知道有没有什么办法）
// 如果想处理IE兼容性问题，只能使用空格或者&nbsp;
div:after{
    content: '';
    display: inline-block;
    width: 100%;
}

```

# currentColor --- CSS3超高校级好用CSS变量
`currentColor`：当前的标签所继承的文字颜色

```
div {
  color: red;
  border: 5px solid currentColor;
  box-shadow: 0 0 5px solid currentColor;
}
```

以上css实现的效果是边框和阴影与文字颜色相同，都是red。

有什么应用场景呢？

比如，我们有这样一个html:

```
<a href="##" class="link"><i class="icon icon1"></i>返回</a>
```

我们希望hover的时候，icon的颜色与hover设置的颜色相同，这时候就可以这样写：

```
.icon {
    display: inline-block;
    width: 16px; height: 20px;
    background-image: url(../201307/sprite_icons.png);
    background-color: currentColor; /* 该颜色控制图标的颜色 */
}

.link:hover { color: #333; }/* 虽然改变的是文字颜色，但是图标颜色也一起变化了 */
```

# 实现文字下面波浪线动画效果
第一步是实现波浪线，有三种办法：

## text-decoration: green wavy underline;
text-decoration: green wavy underline;

这种方式有几点问题：

![text-decoration](https://github.com/xixizhangfe/markdownImages/blob/master/text-decoration@2x.png?raw=true)

1. 线的粗细不好调
2. 字符和装饰线发生重叠的时候，装饰线直接消失了，波浪线变成了一截一截的
3. 无法预知每个波浪线重复片段的宽度，想要无限运动理论上就不太可行

因此，文字或者图形的波浪线动画效果不能使用text-decoration的波浪线。

## 纯css实现(利用radial-gradient)
这种方式radial-gradient理解成本高，暂不讨论。

## 使用SVG波形矢量图作为背景
```
// css
.underline-wave {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23333' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E") repeat-x 0 100%;
    background-size: 20px auto;
}

.underline-wave {
    animation: waveMove 1s infinite linear;
}

@keyframes waveMove {
    from { background-position: 0 100%; }
    to   { background-position: -20px 100%; }
}

// html
<a href="javascript:" class="svg-wave">测试测试测试zhanghhhhha</a>
```

优点是线条边缘平滑，效果细腻，易理解，易上手，易维护。

缺点也很明显，就是波浪线的颜色无法实时跟着文字的颜色发生变化，适用于文字颜色不会多变的场景。

如果我们想要改变波浪线的颜色也很简单，修改background代码中的stroke='%23333'这部分，'%23'就是就是#，因此，stroke='%23333'其实就是stroke='#333'的意思。例如，我们需要改成红色略带橙色，可以stroke='%23F30'，也可以写完整stroke='%23FF3300'。


参考：https://www.zhangxinxu.com/wordpress/2019/04/css-wave-wavy-animation/










