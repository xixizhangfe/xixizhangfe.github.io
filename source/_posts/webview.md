---
title: webview
date: 2019-05-31 14:11:44
tags:
---
webapp: 就是我们现在开发的这些网站
nativeapp: 手机自带app

通信机制：

假如在微信中，有个h5页面，需要调用相机，怎么弄呢

方式一:
借助于webview，
webview向h5注册js代码，比如
window.bridge = { photograph: }
那么h5就可以这么调用：
window.bridge.photograph

window.bridge类似addEventListener

方式二：
封装window.prompt方式

方式三：
私协：
http
didi://
我们公司内部实现是：把所有功能通过module注册，fusion.js

h5里写：
didi://photograph&callDataName=func&callbackDataName=callback
photograph是方法，callDataName是从哪里拿参数，callbackDataName回调函数

window.func=function() {return ...}必须是个函数，且有返回值
window.callback=function() {}是个函数


