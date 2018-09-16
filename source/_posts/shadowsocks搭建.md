---
title: shadowsocks搭建
date: 2018-09-16 12:56:23
tags:
---
上一篇文章讲了一下shadowsocks翻墙原理（[shadowsocks翻墙原理](https://xixizhangfe.github.io/2018/09/16/shadowsocks%E6%90%AD%E5%BB%BA/)）,这里要理论与实践结合了。开始~

这里我定义一些规则，避免混淆:

* VPS = 你在搬瓦工购买的机器
* ss服务端口号 = 执行shadowsocks.sh打印出的Your Server Port = shadowsocks.json里的port
* ss服务IP = VPS的IP = 执行shadowsocks.sh打印出的Your Server IP
* ss服务IP != shadowsocks.json里的server
* 加密方式 = 执行shadowsocks.sh打印出的Your Encryption Method = shadowsocks.json里的method
* ssserver = 你在VPS上启动的shadowsocks服务 = shadowsocks服务端
* sslocal = 你在自己的电脑上安装的shadowsocks客户端 = shadowsocks客户端
* ssserver密码 = 执行shadowsocks.sh打印出的password = shadowsocks.json里的password


文章里可能出现各种叫法，是为了适应不同的语境，不理解的话可以按照上述规则查看。

# 购买VPS
我是在[搬瓦工](https://www.bwh1.net/vps-hosting.php)购买的，当然这是师兄推荐的，否则以我的性格又得纠结死在哪儿买...哈哈哈

我买的是19.9$/年，512M，应该足够用了（嗯，其实就是看这个最便宜 嘿嘿）

![搬瓦工套餐选择](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__%E6%90%AC%E7%93%A6%E5%B7%A5%E8%B4%AD%E4%B9%B0-1.png?raw=true)

# 配置
购买以后呢，就可以在[我的账户](https://www.bwh1.net/clientarea.php)里，点击Services-My service，就能看到了。

![购买详情](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__%E6%90%AC%E7%93%A6%E5%B7%A5%E8%B4%AD%E4%B9%B0-2?raw=true)

然后点击右边的KiwiVM Control Panel进入管理界面。

![管理界面](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__%E6%90%AC%E7%93%A6%E5%B7%A5%E8%B4%AD%E4%B9%B0-3.png?raw=true)

在Main control里可以看到相关配置信息

![main control](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__vps%E9%85%8D%E7%BD%AE-2.png?raw=true)

然后你可以选择重装系统，也可以使用默认的。我是重新安装了，如果要重新安装，需要先在Main controls里点击stop进行关机，然后点右侧Install new OS,选择右边的操作系统(我选择的是centos-7-x86_64)，然后点击同意，最后点击reload。大概等个1-2分钟，就好了。

![reload](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__vps%E9%85%8D%E7%BD%AE-1.png?raw=true)

Reload后会给一个随机的root用户密码，以及随机端口号。然后点击Main controls，就可以看到你的VPS的IP地址(IP address)和端口号（SSH Port）了，这个是会用到的。（注意：这个端口号只有在登录的时候才会用到，后面配置shadowsocks的时候都不会用到。不要和shadowsocks服务的端口混淆。）

![reload port](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__vps%E9%85%8D%E7%BD%AE-3.png?raw=true)

稍后，就可以进入虚拟机了，用自带的工具，或者其他ssh工具即可。

![command](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__vps%E9%85%8D%E7%BD%AE-4.png?raw=true)

我觉得自带的不好用，用的是ssh,即在本地终端，用ssh连接：

```
ssh -p 分配的端口号(就是上面说的SSH Port)   VPS的IP地址
```
然后命令行会提示你输入密码，密码要是不知道，可以通过点击Root password modification，随机产生新的密码。

输入后，就可以进入登录到你的VPS操作了。


# 安装shadowsocks server端
这一步安装的就是上一篇文章中的ss server。

此处可以利用一个共享的python一键安装脚本。用root用户执行下面的语句：

```
yum install -y wget
wget --no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh
chmod +x shadowsocks.sh
./shadowsocks.sh 2>&1 | tee shadowsocks.log
```

成功后，就会打出日志，最后几行就是ss server的信息。在后面配置ss local的时候都会用到。

![打印的信息](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__ssserver%E5%AE%89%E8%A3%85-1.png?raw=true)

其中，Your password(密码)、Your Encryption Method(加密方式)是那个一键安装脚本里写的默认值，你可以修改那个脚本。密码可以不用改，Your Encryption Method这个是必须要改的，因为脚本默认的是aes-256-gcm，但是后面我们配置ss local时是没有这个选项的，所以我改成了aes-256-cfb。更改的方式也很简单，就是打开/etc/shadowsocks.sh这个脚本，然后找到下图里的内容，应该就在脚本的前面，然后把aes-256-cfb放到第一个（注意：本来aes-256-cfb本来不是在第一个的，第一个是aes-256-gcm，图中是我修改后的）。

![sh脚本](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__ssserver%E5%AE%89%E8%A3%85-2.png?raw=true)

改完后，重新执行以下命令：

```
./shadowsocks.sh 2>&1 | tee shadowsocks.log
```

执行完毕后，打印出来的信息就是你刚才修改的。


这只是修改密码和加密方式的一种方式。你还可以通过/etc/shadowsocks.json来修改。这种方式更简单明了，推荐推荐推荐！！！  

如果你已经通过上面那个脚本修改了，打开这个文件，就会看到port、password、method和刚才修改后打印出的日志是一样的，但server不一样，是0.0.0.0（表示可以接收任意IP的请求），因此注意这个server不需要修改。

```
{
    "server":"0.0.0.0",
    "port":"xxxx",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "password":"teddysun.com",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open":false
}
```

如果你想修改port、password、method，就可以改这个文件。然后执行命令：

```
service shadowsocks restart
```

以后你想修改port、password、method，都可以只修改这个shadowsocks.json文件，然后重启一下shadowsocks就可以了。

到此，你的ss server就配置成功了。

当然，如果不放心，你可以做一些验证。


* 在你自己的电脑，打开终端：

	- 测试你的VPS是否能ping通：

	```
	ping VPS的IP
	```

	- 测试shadowsocks服务端口是否已通
	
	```
	telnet ss服务IP ss服务端口号
	```

* 在你的VPS机器上
	- 查看进程里是否有ssserver，如果打印出信息就代表ssserver在运行
	```
	ps aux |grep ssserver
	```
	- 查看服务端口是否在监听，如果打印出信息，则代表端口号在监听
	```
	lsof -i:shadowsocks.json里的端口号
	```
	- 查看服务状态
	```
	service shadowsocks status
	```

另外，提供一些常用命令：

```
启动ssserver: service shadowsocks start
停止ssserver: service shadowsocks stop
重启ssserver: service shadowsocks restart
查看ssserver状态: service shadowsocks status
	
```

## 配置多用户
如果你想配置多用户，可以把shadowsocks.json改成下图，即把port和password合并：

```

{
    "server":"0.0.0.0",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "port_password":{
	"port1":"password1",
	"port2":"password2"
    },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open":false
}
```


# 安装shadowsocks客户端

我的是mac，大家可以根据自己的需要在网上下载，应该很多。这里给出一个地址[下载链接](https://github.com/shadowsocks/ShadowsocksX-NG/releases)。

安装后，就会在浏览器看到一个小图标，点击图标，选择服务器-服务器设置，就会弹出下图设置框：

![sslocal配置](https://github.com/xixizhangfe/markdownImages/blob/master/shadowsocks%E6%90%AD%E5%BB%BA__sslocal%E9%85%8D%E7%BD%AE.jpg?raw=true)

* 点击+号，新建一个服务器
* 地址是ss服务IP, 冒号后面的是端口号，就是ss服务端口号
* 加密方式就是加密方式
* 密码就是ssserver密码
* 备注随便填
* 点击确定
* 另外有三种模式可以选择：PAC自动模式、全局模式、手动模式，PAC自动模式只有在访问被墙的网页时才会走ssserver，全局模式是所有访问的网页都会走ssserver，一般情况下我们就用PAC自动模式就好了，如果访问的某些网站比较慢，比如MDN，可以采用全局模式

至此，全部配置完毕。可以愉快的上网学习了！


# 可能出现的问题
配置后，发现还是无法翻墙。可能是ss服务端口号被防火墙阻挡了，因此，可以登录你的VPS，把防火墙关闭，或者把你的ss服务端口号加入到防火墙允许的列表中。

