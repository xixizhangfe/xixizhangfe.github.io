---
title: html5 localstorage/sessionstorage/cookie (local storage篇)
date: 2017-07-18 16:05:36
tags: html5, localStorage, 前端
categories:
---
local storage与session storage用法相同，这里以local storage为例。

#### 检测浏览器是否支持localStorage

	if(window.localStorage){
		alert('support localStorage');
	}else {
		alert('does not support localStorage');
	}
#### 存储数据的方法
直接给window.localStorage添加一个属性，例如：`window.localStorage.a`或者`window.localStorage['a']`。它的读取、写、删除操作方法非常简单，是以键值对的方式存在的，如下：
	
	localStorage.a = 1; 
	localStorage['a'] = 'abc'; // 会覆盖上面的值
	localStorage.setItem('b', "isaac");
	var a1 = localStorage["a"];//获取a的值	var a2 = localStorage.a;//获取a的值	var b = localStorage.getItem("b");//获取b的值
	localStorage.removeItem("a"); //清除a的值
	
这里推荐使用的当然是setItem和getItem，removeItem。

如果希望一次性清除所有的键值，可以使用clear()。

另外，html5还提供了一个key方法，可以在不知道有哪些键值的时候使用，如下：

	var storage = window.localStorage;	function showStorage(){		for(var i=0;i<storage.length;i++){  			// key(i)获得相应的键，再用getItem()方法获得对应的值  			document.write(storage.key(i)+ " : " + 			storage.getItem(storage.key(i)) + "<br>");		}	}
##### 下面是一个简单的例子，实现计数器：
	<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <input type="button">
      <script type="text/javascript">
        function showStorage(){
          document.getElementsByTagName('input')[0].value = storage.pageLoadCount;
        }
        var storage = window.localStorage;
        if(!storage.getItem("pageLoadCount")){
          storage.setItem("pageLoadCount", 0);
        } 
        storage.pageLoadCount = parseInt(storage.getItem("pageLoadCount")) +1;
        showStorage();
      </script>
    </body>
    </html>
	
不断刷新页面就能看到数字每次加一。

**需要注意的是：html5本地存储只能存字符串，任何格式存储的时候都会被自动转成字符串，所以读取的时候，需要自己进行类型转换，这就是上面例子中使用parseInt的原因之一**	

**另外，在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误，这时一般在setItem之前，先removeItem()就ok了。**（暂时还没做过移动端）

#### storage事件
html5的本地存储，还提供了一个storage事件，可以对键值对的改变进行监听，使用方法如下：

	if(window.addEventListener){
      window.addEventListener('storage', handle_storage, false);
    }else if(window.attachEvent){
      window.attachEvent("onstorage", handle_storage);
    }

    function handle_storage(e){
      if(!e){
        e=window.event;
      }
    }
对于事件变量e，是一个StorageEvent对象，提供了一些实用的属性，可以很好的观察键值对的变化：

属性 | 类型 | 描述|
:----------|:----------:|:----------:|
key| string| 添加、删除、或者修改的名
oldValue | Any |修改前的值，如果是新加的键，该属性的值为null
newValue| Any|修改后的值，如果是新机的键，该属性的值为null
url/uri| String |触发storage键值对改变对应的方法所在页面的url/uri

##### 那怎么使用storage事件呢？
当同源页面的某个页面修改了localStorage，其余的同源页面只要注册了storage事件，就会触发。

所以，这个例子需要以下条件：

（1）同一个浏览器打开了两个同源页面

（2）其中一个网页修改了localStorage

（3）另一个网页注册了storage事件

**很容易犯的错误，在同一个网页修改本地存储，又在同一个网页监听，这样是没有效果的**

例子：
在网页A：监听了storage事件：

	<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <script type="text/javascript">
        window.addEventListener('storage', function(e){
        alert(e.newValue);
      })
      </script>
    </body>
    </html>
在网页B：修改了localStorage

	<!DOCTYPE html>
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <script type="text/javascript">
        localStorage.clear();
        localStorage.setItem('foo', 'bar');
      </script>
    </body>
    </html>

运行：将上面两个网页保存，放到同一个服务器上，然后，先打开A.html, 再打开B.html，就会看到A.html会弹出提示，注意两个网页要同源。（同源页面：一个大网站的所有小页面）

对于没有服务器的童鞋，可以这样：
比如先打开一个www.baidu.com，在控制台里输入：

	window.addEventListener('storage', function(e){
        alert(e.newValue);
再打开一个www.baidu.com，在控制台里输入：

	localStorage.clear();
    localStorage.setItem('foo', 'bar');
然后此时第一个页面就会弹出提示框了。


##### 扩展
如果非得要在同一网页监听怎么办？可以重写localStorage的方法，抛出自定义事件。

	<!DOCTYPE html>
    <html>
    <head lang="en">
        <title>A</title>
    </head>
    <body>
    <script>
        var orignalSetItem = localStorage.setItem;
        localStorage.setItem = function(key,newValue){
            var setItemEvent = new Event("setItemEvent");
            setItemEvent.newValue = newValue;
            window.dispatchEvent(setItemEvent);
            orignalSetItem.apply(this,arguments);
        }
        window.addEventListener("setItemEvent", function (e) {
            alert(e.newValue);
        });
        localStorage.setItem("nm","1234");
    </script>
    </body>
    <html>

#### 格式转换

js使用json格式比较多，而localStorage存储的是字符串，如果希望把json格式的数据存储在本地，需要调用JSON.stringify()将其转为字符串。

如果从localStorage中读取数据，可以调用JSON.parse()将其转换为json对象。

参考自：http://blog.csdn.net/csethcrm/article/details/7409862	http://blog.csdn.net/ruangong1203/article/details/52841135
	