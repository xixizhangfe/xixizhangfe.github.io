---
title: React组件为什么要用super(props)
date: 2017-07-23 12:14:31
tags:
categories:
---
要在es5中实现继承，首先定义一个父类：

	//父类
	function sup(name) {
		this.name = name;
	}
	
	// 定义父类原型上的方法
	sup.prototype.printName = function () {
		console.log(this.name);
	}
	
	function sub(name, age) {
		sup.call(this, name) // 调用call方法，继承sup超类属性
		this.age = age;
	}
	
	sub.prototype = new sup() // 把子类sub的原型对象指向父类的实例化对象，这样可以继承父类sup原型对象上的属性和方法
	sub.prototype.constructor = sub; // 这时会有个问题，子类的constructor属性会指向sup，手动把constructor属性指向子类sub
	// 这时候就能在父类的基础上添加属性和方法了
	sub.prototype.printAge = function () {
		console.log(this.age)
	}
	
这时候调用父类生成一个实例化对象:
	
	let jack = new sub('jack', 20)
	jack.printName() // jack
	jack.printAge() // 20
	

而在es6中实现继承：

	class sup {
		constructor(name) {
			this.name = name
		}
		
		printName() {
			console.log(this.name)
		}
	}
	
	
	class sub extends sup {
		constructor(name, age) {
			super(name)
			this.age = age;
		}
		
		printAge () {
			console.log(this.age)
		}
	}
	
	let jack = new sub('jack', 20)
	jack.printName() // jack
	jack.printAge() // 20
	
对比发现，在es5中实现继承：
	
1、首先得先调用函数的call方法把父类的属性给继承过来

2、通过new关键字继承父类原型的对象上的方法和属性

3、最后再通过手动指定constructor属性指向子类对象

而在es6中实现继承，直接调用super(name)，就可以直接继承父类的属性和方法，所以super作用就相当于上述的实现继承的步骤，不过es6提供了super语法糖，简单化了继承的实现	
	
	
	
	
	
	
	
	
	
	
	
	
	