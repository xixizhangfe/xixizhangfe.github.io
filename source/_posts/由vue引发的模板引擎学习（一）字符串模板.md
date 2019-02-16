---
title: 由vue引发的模板引擎学习（一）字符串模板
date: 2019-02-13 20:32:25
tags:
---
### 1. 前言
又看了一遍vue官方文档，迄今为止是第三遍看了，看第一遍时无比懵逼，看第二遍时加深了一些常用api的理解，而第三遍则是工作近一年后的补盲。确实发现了不少盲点，特此记录。这一篇是讲模板引擎。为什么要写这个？因为看到vue文档说Vue.js使用了基于html的模板语法，一开始不理解什么是基于html的语法，所以进行了学习，从而有了这篇及后续几篇文章。

### 2. 模板引擎的概念
模板引擎是为了使用户界面与业务数据分离而产生的，它可以生成特定格式的文档，用于网站的模板引擎就会生成一个标准的HTML文档。

### 3. web前端模板引擎
这里将介绍三种模板引擎技术，分别是：

- 基于字符串的模板
- 基于DOM操作的模板
- 基于虚拟DOM的模板

### 4. 为什么需要模板引擎？
页面中经常有些内容依赖于后端数据。比如，我们有这样一段代码:

```
<div id="container">
	<ul>
		<li>喜洋洋</li>
		<li>懒洋洋</li>
		<li>美羊羊</li>
		<li>灰太狼</li>
		<li>红太狼</li>
	</ul>
</div>
```
实际上面的li里的内容通常是从后端获取的，并不能写死，所以在没有模板引擎的情况下，我们需要这么写：

```
// 这里data应该是请求后端接口得到的，这里只是为了模拟一下
var data = ['喜洋洋', '懒洋洋', '美羊羊', '灰太狼', '红太狼'];
var container = document.getElementById('container');
var str = '<ul>';
for (var i = data.length - 1; i >= 0; i--) {
	str += '<li>' + data[i] + '</li>';
}
str += '</ul>';
container.innerHTML = str;
```
写过的同学应该都有这样的体验：

- 开发效率低，字符串拼接写起来麻烦
- 容易出错，尤其是结构复杂的情况
- 代码看起来不清晰明了
- 可维护性低，后期改起来不方便
- 可扩展性低，想要增加新需求时更该不方便

所以这就带来了一些思考，有没有一种方式能将前端结构与数据分开，从而老司机们就创造出了各种基于字符串的模板引擎。

### 5. 基于字符串的模板引擎
这些模板引擎又分为两类：一种是不包含逻辑处理，只做数据绑定用的，如[mustache.js](https://github.com/janl/mustache.js/blob/master/mustache.js)；另一种是既有逻辑处理，也有数据绑定的，如[ejs](http://www.embeddedjs.com/)。

下面以EJS的语法为例，实现一个简单的字符串模板引擎、模板引擎的编译流程如下：

![基于字符串的模板引擎编译原理](https://github.com/xixizhangfe/markdownImages/blob/master/String-based-Template.png)

还是上面的例子，如果用EJS的语法来写，应该是这样的：

```
<div id="container">
	<ul>
		<% for (var i = 0; i < data.length; i++) {%>
			<li><%= data[i] %></li>
		<% } %>
	</ul>
</div>
```
其中，<%= 和 %>之间的是JS表达式，而在<% 和 %> 之间是普通的JS语句，可以进行逻辑判断和条件循环等操作。

<strong>
那么模板引擎需要做的事情是什么呢？就是将上述模板编译成第4小结里的js。
</strong>

那我们现在比较一下第4小结里的js与所写模板的区别，就可以知道如何将模板编译成想要的js：  
我们将例子中的模板字符串用template表示：

```
var template = `
<ul>
    <% for(var i=0; i<data.supplies.length; i++) {%>
        <li><%= data.supplies[i] %></li>
    <% } %>
</ul>
`;
```
1.我们首先需要将普通html与模板语法区分开  
这一步可以用正则表达式判断。

```
// 匹配JS语句
var senReg = /<%([\s\S]+?)%>/g;
// 匹配JS表达式
var expReg = /<%=(.+?)%>/g;
```
2.需要定义一个变量str，保存编译后的模板。普通的html无需任何处理，需当做字符串拼接到str上；JS表达式不是当做字符串而是直接拼接到str上；JS语句则不需要拼接，直接执行。  

```
var str = '';
// 需要定义一个拼接函数
function echo(html) {
	str += html;
}
template = template
	//转换JS表达式
	.replace(expReg, '`); \n echo( $1 ); \n echo(`')
	// 转换JS语句
	.replace(senReg, '`); \n $1 \n echo(`');
template = 'echo(`' + template + '`)';

// 内容为空的部分
var empty = /echo\(\"\"\);/g;
template = template.replace(empty, '');
```

到这一步，得到的template为：

```
template = 'echo(`<ul>`); 
  for (var i = 0; i < data.length; i++) { 
 echo(`<li>`); 
 echo(  data[i]  ); 
 echo(`</li>`); 
  }  
 echo(`</ul>`)';
```
3.此时，我们需要将上面写的代码封装成一个函数，并将模板字符串作为参数传递进去，该函数返回编译后的模板，该函数称之为编译函数compile。这里返回的模板应该是一个函数（实际是个字符串），并且参数是所需要的数据。

```
function compile(template) {
	// 匹配JS语句
	var senReg = /<%([\s\S]+?)%>/g;
	// 匹配JS表达式
	var expReg = /<%=(.+?)%>/g;
	
	template = template
		//转换JS表达式
		.replace(expReg, '`); \n echo( $1 ); \n echo(`')
		// 转换JS语句
		.replace(senReg, '`); \n $1 \n echo(`');
	template = 'echo(`' + template + '`)';
	
	// 内容为空的部分
	var empty = /echo\(\"\"\);/g;
	template = template.replace(empty, '');
	
	// 这里借助了es6的语法${}
	var script = `(function parse(data) {
		var str = '';
		// 需要定义一个拼接函数
		function echo(html) {
			str += html;
		}
		
		${template}
		
		return str;
	})`;
	return script;
}
```
4.由于compile函数返回的是个字符串，要想该字符串转为真正的函数执行，需要借助eval，最后再将数据传给compile的子函数parse函数，这样就得到了想到的html结构，最后只需要插入dom即可。

```
var parse = eval(compile(template));
var output = parse(['喜洋洋', '懒洋洋', '美羊羊', '灰太狼', '红太狼']);
document.getElementById('container').innerHTML = output;
```

完整的代码如下：

```
var parse = eval(compile(template));
var output = parse(['喜洋洋', '懒洋洋', '美羊羊', '灰太狼', '红太狼']);
document.getElementById('container').innerHTML = output;

function compile(template) {
	// 匹配JS语句
	var senReg = /<%([\s\S]+?)%>/g;
	// 匹配JS表达式
	var expReg = /<%=(.+?)%>/g;
	
	template = template
		//转换JS表达式
		.replace(expReg, '`); \n echo( $1 ); \n echo(`')
		// 转换JS语句
		.replace(senReg, '`); \n $1 \n echo(`');
	template = 'echo(`' + template + '`)';
	
	// 内容为空的部分
	var empty = /echo\(\"\"\);/g;
	template = template.replace(empty, '');
	
	// 这里借助了es6的语法${}
	var script = `(function parse(data) {
		var str = '';
		// 需要定义一个拼接函数
		function echo(html) {
			str += html;
		}
		
		${template}
		
		return str;
	})`;
	return script;
}
```



参考文章：[Web前端模板引擎の字符串模板](https://segmentfault.com/a/1190000010313795)
