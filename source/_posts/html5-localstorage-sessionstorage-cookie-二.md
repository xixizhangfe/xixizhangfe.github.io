---
title: html5 localstorage/sessionstorage/cookie (cookie篇)
date: 2017-07-18 09:44:15
tags: html5, localStorage, 前端
categories:
---
## document对象的cookie属性
* cookie是一小段文本信息，伴随在http请求里。
* 它存储于访问者的计算机中，每当同一台计算机通过浏览器请求某个页面时，就会发送这个cookie。
* 它是**浏览器**提供的一种机制，Javascript可以调用document对象的cookie属性，并创建和获取cookie的值，因此我们可以通过document.cookie访问它
* cookie是存于用户硬盘的一个文件，这个文件通常对应于一个域名，也就是说，**cookie可以跨越同一域名下的多个网页，但不能跨越多个域名调用**。

## cookie的根本用途
cookie将信息存储于用于硬盘，因此可以作为全局变量，这是它最大的一个优点。

**它最根本的用途是能够帮助web站点保存有关访问者的信息**。

### cookie的几种小用途
* 保存用户登录信息：这是最常用的，可以通过cookie保存用户的id
* 创建购物车：把已选商品保存在cookie中，可以实现不同页面之间数据的同步（**同一域名下可以共享cookie**），同时在提交订单的时候又会把这些cookie传到后台。
* 跟踪用户行为：通过cookie记录用户的偏好信息，然后向用户推荐个性化推广信息。**这是可以禁用的，也是cookie的缺点之一**。

## cookie是如何工作的？
cookie是存在于用户硬盘中的，用户每次访问站点时，浏览器会根据URL在本地硬盘上查找与该URL有关的cookie，如果该cookie存在，就会将该cookie填充进request header里的cookie字段，与http请求一起发送到该站点。

## cookie的格式和常见的属性
![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/4.png)
字符串规律：
* 每个cookie都是键值对的形式
* 名称和值都必须是**URL编码**的
* 两对cookie之间用分号和空格隔开

![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/5.png)
name、value不必多说，自然是cookie的名和值。

domain，path，expires/max-age，size，http，secure等均是cookie的属性

我们先手动添加几个cookie，代码如下：

	document.cookie = "test1=myCookie1;"
	document.cookie = "test2=myCookie2; domain=.google.com.hk; path=/webhp"
	document.cookie = "test3=myCookie3; domain=.google.com.hk; expires=Sat, 04 Nov 2017 16:00:00 GMT; secure"
	document.cookie = "test4=myCookie4; domain=.google.com.hk; max-age=10800;"

![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/6.png)

#### domain和path
这两个共同决定了cookie能被哪些页面共享。

如果未设置domain和path，则默认为设置cookie的那个域，如test1所示；

domain可以包含子域，也可以不包含。domain选项中，可以是".google.com.hk"(不包含子域,表示它对google.com.hk的所有子域都有效)，也可以是"www.google.com.hk"(包含子域)。

path用于控制cookie发送的指定域的路径，默认为"/"，表示指定域下的所有路径都能访问，它是在域名的基础下，指定可以访问的路径。例如cookie设置为"domain=.google.com.hk; path=/webhp"，那么只有".google.com.hk/webhp"及"/webhp"下的任一子目录如"/webhp/aaa"或"/webhp/bbb"会发送cookie信息，而".google.com.hk"就不会发送，即使它们来自同一个域。
#### expries/max-age失效时间
expries 和 max-age 是用来决定cookie的生命周期的，也就是cookie何时会被删除。

expries 表示的是失效时间，准确讲是「时刻」，max-age表示的是生效的「时间段」，以「秒」为单位。

若 max-age 为正值，则表示 cookie 会在 max-age 秒后失效。如例四中设置"max-age=10800;"，也就是生效时间是3个小时，那么 cookie 将在三小时后失效。

若 max-age 为负值，则cookie将在浏览器会话结束后失效，即 session，max-age的默认值为-1。若 max-age 为0，则表示删除cookie。

#### secure
默认情况为空，不指定 secure 选项，即不论是 http 请求还是 https 请求，均会发送cookie。

是 cookie 的安全标志，是cookie中唯一的一个非键值对儿的部分。指定后，cookie只有在使用SSL连接（如HTTPS请求或其他安全协议请求的）时才会发送到服务器。

#### httponly（即http）
httponly属性是用来限制客户端脚本对cookie的访问。将 cookie 设置成 httponly 可以减轻xss（跨站脚本攻击 Cross Site Scripting）攻击的危害，

防止cookie被窃取，以增强cookie的安全性。（由于cookie中可能存放身份验证信息，放在cookie中容易泄露）

默认情况是不指定 httponly，即可以通过 js 去访问。

#### 如何利用以上属性设置cookie？
* 服务端设置
服务器通过发送一个名为Set-cookie的HTTP头来创建一个cookie，作为Response Headers的一部分，每个Set-cookie表示一个cookie（如果想设置多个cookie，需要些多个Set-cookie），每个属性也是以键值对的形式（secure除外），属性间以分号加空格隔开。格式如下(只有cookie的名字和值是必须的):

	```
	Set-cookie: name=value[; expires=GMTDate][; domain=domain][; path=path][; secure]
	```
* 客户端设置
客户端设置cookie的格式和Set-cookie头中使用的格式一样。如下：

	```
		document.cookie = "name=value[; expires=GMTDate][; domain=domain][; path=path][; secure]"
	```
	若想要添加多个cookie，只能重复执行 document.cookie（如上）。这可能和平时写的 js 不太一样，一般重复赋值是会覆盖的，

	但对于cookie，重复执行 document.cookie 并「不覆盖」，而是「添加」（针对「不同名」的）。
	
#### cookie的缺点
* 安全性： 由于cookie在http中是明文传递的，其中包含的数据都可以被他人访问，可能会被篡改、盗用
* 大小限制：cookie的大小限制在4kb左右，不适合大量存储
* 增加流量：cookie每次请求都会被自动添加到Request Header中，无形中增加了流量。cookie信息越大，对服务器请求的时间越长。



## cookie存储在哪里

面试被问到，一脸懵....

cookie失效分为3种：
1、设置过期时间失效（只要设置了过期时间cookie就会存储在硬盘里面）
2、当会话结束时失效，即关闭浏览器窗口（如果没有设置expires，cookie就会存储在内存里面）
3、手动删除cookie失效

测试1：
打开浏览器，进入控制台，输入：

	document.cookie="test=myCookie1;"
然后打开Application，找到cookie，此时就能看到我们设置的test1了，
这时候我们关闭这个网页（注意不是关闭浏览器），再重新打开刚才那个窗口，发现test1还在；
如果关闭浏览器，再重新打开刚才那个窗口，发现此时test1已经不见了。

测试2：
打开浏览器，进入控制台，输入：

	document.cookie="test3=myCookie3; expires=Sat, 04 Nov 2017 16:00:00 GMT;"
关闭浏览器，再重新打开刚才那个窗口，发现此时test3还在。

转载自：http://www.cnblogs.com/cxying93/p/6107459.html
