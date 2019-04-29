---
title: js模块系统详解
date: 2019-03-25 09:37:44
tags:
---
前端涉及到的模块规范有：CommonJS、AMD、ES6的模块系统、NodeJS的模块系统。

## CommonJS
nodeJS的诞生标志着”JavaScript模块化编程“的正式诞生。在浏览器环境下，没有模块化编程，倒也不是很大的问题，毕竟网页程序的复杂性有限。但是在服务端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。

nodejs的模块系统，就是参考commonjs规范实现的。

## AMD
AMD的全称是Asynchronous Module Define，异步模块定义。

### 为什么AMD会诞生呢？

在有了服务端模块后，我们自然也想要客户端模块，而且最好这两个能兼容，一个模块都不用修改，在服务端和客户端可以同时运行。

但是，CommonJS有一个重大的局限，导致它不适合在浏览器环境运行。

```
var math = require('math);
math.add(2, 3);
```

看上面的代码，乍一看似乎没有什么问题。但实际上，第二行代码需要在第一行代码执行后，才能执行。因此必须要等到math.js加载完成后。如果math.js加载时间很长，整个应用就卡在这里了。

这对于服务端编程并不是一个问题，因为服务端所有的模块都放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时取决于网速，可能要等很长时间。

因此，浏览器的模块，不能采用”同步加载”，而是要异步加载，因此AMD就诞生了。


###
AMD也是采用require语句，但是语法与CommonJS不同。

```
require([module], callback);
```

其中，第一个参数`[module]`是所有依赖的模块，是一个数组；第二个参数`callback`，则是加载成功之后的回调。

上面的那个代码，如果用AMD实现，则是：

```
require(['math'], function() {
  math.add(2, 3);
});
```

math.add()与math模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD比较适合浏览器环境。


参考：

http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html
