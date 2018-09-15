---
title: react元素、react组件、react组件支撑实例
date: 2017-07-23 10:00:48
tags:
categories:
---
# React元素是什么
**react元素可以理解为我们说的虚拟DOM。**（虚拟DOM：是DOM在特定时间段应该是怎样的结构的描述）

**react元素仅仅是由一些属性构成的js简单对象，用来描述组件的HTML的结构应该是什么样的，这个对象上不包含任何方法(methods)，仅仅只有数据。**

如果我们平时使用react+JSX，可能不会涉及到这个概念。但实际上呢，JSX语法实际被编译成了React.createElement(), React.createElement()产生的就是React元素，让我们看一个转换过程的例子：

	// 使用JSX语法
	var helloworld = <div>hello world!</div>
	
	// 然后是JSX被编译成JS的结果
	var helloworld = React.createElement(
		"div",
		null,
		"hello world"
	);
	
	// 再是处理成JS简单对象后看起来类似这样
	var helloWorld = {
		key: null,
		props: {
			children: "hello world!" // more stuff in here
		},
		ref: null,
		type: 'div'
		// more stuff in here
	}
	
# React组件
是React组件类的实例。

一般在JS中我们要得到一个类的实例，通常用new操作符，而React不需要new，而是用ReactDOM.render()把一个React元素渲染成一个特定的DOM元素，并返回一个React组件实例。

ReactDOM.render()干了什么呢？

* 接收一个虚拟DOM元素，将其渲染成一个真实DOM元素，返回（React元素type指定的）组件实例。
* 对虚拟DOM执行高效的diff算法。

# 组件支撑实例是什么

	...
	// 组件实例
	var componentInstance = ReactDOM.render(<CustomForm />, document.getElementById('root'));
	// DOM实例
	var domInstance = ReactDOM.findDOMNode(componentInstance);

组件实例并不是真实的DOM节点，我们可以使用ReactDOM.findDOMNode(),并将组件实例作为其参数。

**组件支撑实例就是引用的真实DOM节点。**


# 总结
JSX语法被转译为React.createElement()调用，最终返回我们称之为“React元素”的JS简单对象，你可以将React元素视为基础构建单元。

React组件实例表示下一个抽象层，ReactDOM.render()接收一个React元素，引用一个真实DOM节点，返回一个React组件实例。该实例可以访问组件类中定义的方法。

React元素和React组件实例都不是真实DOM元素。

渲染组件实例产生的DOM元素称之为组件支撑实例，访问它的主要方式是使用ReactDOM.findeDOMNode().





转载：

https://segmentfault.com/a/1190000009169542




















	
	
