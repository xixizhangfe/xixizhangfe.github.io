---
title: nodejs之koa2框架
date: 2017-07-20 12:31:55
tags:
categories:
---
koa2会自己吧服务器框架搭建好，如果自己用nodejs，需要引入一些http的包，然后写端口，写一堆乱七八糟的，用koa2的话，都只有一个入口文件，就是路由文件，里面包括几大块：

* 静态文件目录的生命，告诉服务器那个目录是用来放静态文件的，就是一些html，css，js，image什么。

* 还有一块就是路由地址的指向，路由文件给每个子路由文件都分配了一个地址，比如smallCourse，给他分配的可能就是/smallCourse/api。

* 还有一部分是服务器的简单配置，端口号啊等等。

浏览器拿到一个URL地址后，先通过localhost:3000后面的前几个名字去总的路由文件里匹配，找到一样的就去下面的文件下面再匹配，找到一样的地址的函数，就调用。


### express
express的入门非常简单，通过创建express的Application就构建了一个expressweb实例。下面我们看看例子来感受一下：

	var express = require('express');
	var app = express();

	app.get('/', function (req, res) {
  		res.send('Hello World!');
	});

	var server = app.listen(3000, function () {
  		var host = server.address().address;
  		var port = server.address().port;

  		console.log('Example app listening at http://%s:%s', host, port);
	});
	
	
express本身封装了路由模块，因此，可以利用express直接处理各种http路由请求。

在express用四个主要模块：

* Application：web服务器模块，抽象了web服务器的主要接口，如监听、事件、加载中间件、get\post请求等
* Request：请求
* response：响应
* Router：路由

express用Application、Request、Response、Router四个主要模块，模拟了一个完整的web服务器功能，对了，express还在相当长的一段时期中受到了Connect的影响。在使用express的过程中，你会发现express是一个极简的、灵活的 web 应用开发框架，它提供的这一系列强大的特性，可以帮助你快速创建各种 web 和移动设备应用。


### koa
koa 是由 express原班人马打造的（TJ），致力于构建更小、更富有表现力、更健壮的 web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 koa 应用变得得心应手。
Koa 包含了像 content-negotiation（内容协商）、cache freshness（缓存刷新）、proxy support（代理支持）和 redirection（重定向）等常用任务方法。 与提供庞大的函数支持不同，Koa只包含很小的一部分，因为Koa并不绑定任何中间件。

koa中也包含4个主要模块，Application、Request、Response、Context。此时，router已经被排除在内核之外了。其实，koa只是一个“中间架”，几乎所有的功能都需要由第三方中间件来协同完成。例如koa的router模块，就有20多个，优胜劣汰，自由选择......虽然有不规范之嫌，但是，koa是规范的这就足够了。使用koa，可以最大限度的发挥自己的想象力，利用koa，构建各种个性化的web与移动应用。下面我们看看例子来感受一下：

	var koa = require('koa');
	var app = koa();

	app.use(function *(){
  		this.body = 'Hello World';
	});

	app.listen(3000);


没错，就是这么简单，使用了Generator函数，这也是koa和express最大的不同，express是回调函数，koa是用Generator来作为响应器的。


另外，那个替代了router的context是怎样的呢？下面我们看看例子来感受一下：

	app.use(function *(){
  		this; // is the Context
  		this.request; // is a koa Request
  		this.response; // is a koa Response
	});


另外，koa中还有co这个工具。co是一个“皮”，通过co来包装Generator和yeild，下面我们看看例子来感受一下：

### koa2

目前，koa2结合了async/await已经成为了最好的web开发框架。上一节，已经讲了koa的主要模块和实现原理，此处，我只是简单说说koa2和koa不同之处，下面我们看看例子来感受一下：


	const Koa = require('koa');
	const app = new Koa();

	app.use(ctx => {
  		ctx.body = 'Hello World';
	});

	app.listen(3000);

函数式编程，async/await功能，程序简单，好用，真可谓是居家旅行的不二之选呀。通过查看代码，koa2去除了co中间件，进一步的精简了内核，这一点也正好符合当下性冷淡风格的设计潮流......不禁想赞叹一句，TJ不愧是设计师出身呀......


作者：白昔月
链接：http://www.jianshu.com/p/3806417a1991
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

