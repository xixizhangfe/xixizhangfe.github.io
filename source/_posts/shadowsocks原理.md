---
title: shadowsocks原理
date: 2018-09-16 11:12:37
tags:
---
之前一直用jj师兄搭建的shadowsocks服务器，前几天师兄说他的快到期了，不打算继续用了，并且他说刚好最近[搬瓦工](https://www.bwh1.net/vps-hosting.php)上最便宜的那款(19.9$/年)有货，于是乎我赶紧抓住机会买了。在搭建的过程中，虽然参考了很多大佬的教程，但也不是那么顺畅。于是决定自己梳理原理，从源头搞起，才能知道自己搭建的哪儿有问题。搞起~
# 翻墙的原理
防火长城（Great Firewall），简称GFW，就是常说的防火墙。由于不同的请求具有不同的数据特征，不同的协议具有不同的特征，比如HTTP/HTTPS这类请求，会很明确的告诉GFW它们要请求哪些域名，再比如TCP请求，它只会告诉GFW它们要请求哪个IP。防火墙采用**黑名单**方式，有域名黑名单和IP黑名单，像常见的国外网站[谷歌](www.google.com)，[Facebook](www.facebook.com)等都是在黑名单里的（[封锁网站列表](https://zh.wikipedia.org/zh-hans/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E8%A2%AB%E5%B0%81%E9%94%81%E7%BD%91%E7%AB%99%E5%88%97%E8%A1%A8)）。 

也就是说，当你访问一个在黑名单列表里的网站时，就会被GFW拦截。但如果你有一台国外的服务器，并且这个服务器不在GFW的黑名单列表里，你就可以访问这台服务器了。因此，翻墙的一个方案就出来了：你想看什么网页，就告诉国外的机器，让国外的机器代理抓取，然后送回来。我们要做的就是保证你于国外机器通讯时不被GFW怀疑和窃听。

ssh tunnel是比较具有代表性的防窃听通讯隧道，通过ssh与境外服务器建立一条加密通道，此时GFW会将通讯当做普通的流量，但是随着用的人越来越多，GFW不干了，它开始通过一些流量特征分析，识别哪些连接是ssh隧道，并对它进行干扰，于是众多隧道都走不通了。



# shadowsocks是如何翻墙的呢？
![shadowsocks翻墙原理](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E5%8E%9F%E7%90%86.jpeg?raw=true)

## 这里要理解一个概念，就是socks5是什么？
这是一个比较成熟的代理协议，被大多数操作系统、浏览器、客户端软件支持，以前翻墙大多数是这个协议。

在GFW外面部署一个socks5协议的server，在GFW内使用一个支持socks5协议的客户端连接server，通过一定的认证和加密将数据通过TCP socket按照socks5协议发送数据包给server，在server端根据socks5协议解密后将明文包转发给某个GFW外的目标机器，从而实现翻墙。

因为数据都是经过协商加密的，所以一开始GFW是没法发现的，后来socks5协议大量被用于翻墙，GFW就开发相应的流量识别策略，毕竟连接协商阶段的流量是明文的，因此总有办法截掉你的连接，所以socks5开始变得不那么稳定了。

## 那么shadowsocks是如何做到的呢？
再看上面那张图片，shadowsocks在客户端本地部署了一个socks5 server端（也就是shadowsocks软件），用户使用一个支持socks5协议的客户端软件（如浏览器）连接这个socks5 server发送数据。

这个socks5 server是shadowsocks按照socks5协议开发的，它解密数据为明文后，按照shadowsocks自定义的一种新的通讯协议（GFW没时间来分析这个协议）加密后发送给GFW外部署的shadowsocks server，这个server按照shadowsocks定义的协议解密数据为明文，转发给墙外的目标机。

shadowsocks之所以在客户端本地启动一个socks5代理server，是因为socks5协议已被大多数操作系统、浏览器、客户端软件支持，因此我们只需要配置一下浏览器通过shadowsocks的socks5 server代理，那么shadowsocks就可以拦截到浏览器的流量，通过重新包装发送给远程的shadowsocks server了，这对于一个新的翻墙工具的普及无疑是很有利的。

## 参考资料

[shadowsocks原理](https://blog.csdn.net/weixin_42075590/article/details/80717291)

[shadowsocks原理简介及安装指南](https://blog.csdn.net/ai2000ai/article/details/80829131)

感谢以上作者！
