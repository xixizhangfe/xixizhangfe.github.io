---
title: encodeURI、encodeComponent、decodeURI、decodeURIComponent
date: 2019-03-29 17:31:51
tags: js, 计算机网络
categories: JS基础知识
---
最近项目在处理sso问题，需要重定向。这时候用到了`encodeURIComponent`，突然意识到对这个api不甚了解。特此学习一番。

`encodeURI`和`encodeURIComponent`都是对URI进行编码的方法。

### 区别：
1. 输入参数不同：`encodeURI`输入的参数是一个完整的URI，`encodeURIComponent`的输入参数URI的组成部分。
2. 对字符的处理不同，这个见下面的图
3. 使用场景不同


### 一张图解释四个函数对不同字符的处理
![字符分类](https://github.com/xixizhangfe/markdownImages/blob/master/charactor-type.png?raw=true)

当URI里包含一个没在上面列出的字符或有时不想让给定的保留字符有特殊意义，那么必须编码这个字符。字符被转换成UTF-8编码，首先从UTF-16转换成相应的代码点值的替代。然后返回的字节序列转换为一个字符串，每个字节用一个“%xx”形式的转移序列表示。

### 使用场景的不同
encodeURI不会对`&`, `+`, `=`编码，而这三个在GET和POST请求中是特殊字符，所以如果一个URI要进行HTTP的GET和POST请求，不适合使用`encodeURI`进行编码，而`encodeURIComponent`则可以。

举个例子：

一个URI是:`http://0.0.0.0?comment=Thyme &time=again`，本意是`comment`是变量，值是`Thyme &time=again`, 如果不使用`encodeURIComponent`（或者使用`encodeURI`编码），服务器得到的是`http://0.0.0.0?comment=Thyme%20&time=again`，此时服务器会解析为两个键值对，`comment=Thyme`和`time=again`。

而如果使用encodeURIComponent对参数进行编码，`encodeURIComponent`得到的是`%3Fcomment%3DThyme%20%26time%3Dagain`

### 注意事项
1. 为了避免上面说的那种场景，因此，为了避免服务器收到不可预知的请求，对用户输入的URI部分的内容你都需要用encodeURIComponent进行转义。

2. `encodeURI`、`encodeURIComponent`如果编码一个非高-低位完整(参考下一篇文章)的代理字符，将会抛出一个`URIError`错误。比如：

```
// 高低位完整
alert(encodeURIComponent('\uD800\uDFFF'));

// 只有高位，将抛出"URIError: malformed URI sequence"
alert(encodeURIComponent('\uD800'));

// 只有低位，将抛出"URIError: malformed URI sequence"
alert(encodeURIComponent('\uDFFF'));
```

因此，为了防止报错影响程序运行，可以使用try/catch包裹：

```
function encodeURIFixed() {
  try {
    encodeURIComponent()
  } catch() {

  }
}
```

### 参考链接
[MDN-encodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

[一张图看懂encodeURI、encodeURIComponent、decodeURI、decodeURIComponent的区别](https://juejin.im/post/5835836361ff4b0061f38a5d)
