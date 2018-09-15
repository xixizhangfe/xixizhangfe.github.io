---
title: JS中表达式和语句的区别
date: 2017-03-15 15:19:18
tags: 前端，JS
categories:
---

## 1. 语句（statement）和表达式（expression）
JS中的表达式和语句是有区别的。

两句话总结：

* 一个表达式会产生一个值，它可以放在任何需要一个值的地方。

* 一个语句是一个行为，比如循环语句，if语句

函数参数需要的是一个值，所以函数参数可以用表达式，不能放if等语句。

举例子：

（1）以下三个都是表达式：

	myvar
	3 + x
	myfunc("a", "b")

解释一下：

	var myvar = 1; // 这里定义myvar
	myvar // 输出1， 这里得到的是一个值，所以myvar是一个表达式`

	var x = 1;
	3 + x // 4，这里得到的是一个值，所以3+x是一个表达式

	function myfunc(a,b){
    	return a+b;
	}
	myfunc("a","b") // 'ab', 这里得到的是一个值，所以myfunc("a","b")是一个表达式
（2）循环语句、if语句就是典型的语句。

## 2. 其他语法
### 2.1 if语句和条件运算符
* if语句

	// 这是语句
	var x;
	if (y >= 0) {
    	x = y;
	} else {
    	x = -y;
	}
* 条件运算符

	// 这是表达式
	var x = (y >=0 ? y : -y);

可以看出，if语句和条件运算符可以实现相同的功能，也就是说上述两段代码是等价的。
其中 `var x = (y >=0 ? y : -y);` 和 `(y >=0 ? y : -y)` 都分别是一个表达式。

### 2.2 分号和逗号表达式
JS中，使用分号可以连接两个语句：

`foo(); bar();`

要想连接两个语句，使用的是不常见的逗号运算符：
foo(), bar()

注意：逗号运算符会计算前后两个表达式，然后返回右边表达式的计算结果。例如：

	"a", "b" // 'b'
	var x = ("a", "b") 
	x // 'b'
	console.log(("a", "b")); // b

## 3. 看似语句的表达式
### 3.1 对象字面量和语句块
下面是一个对象字面量，也就是一个可以生成一个对象值的表达式：

	{
    	foo: bar(3,5)
	}
不过，同时，它也是一个完全合法的语句，这个语句的组成部分有：

* 一个代码块：一个由大括号包围的语句序列

* 一个标签：你可以在任何语句前面放置一个标签，这里的foo就是一个标签

* 一条语句：表达式语句bar(3,5)

JS可以有独立的代码块（常见的代码块是依托于循环或者if语句的），下面的代码演示了这种代码块的作用：你可以给它设置一个标签然后跳出这个代码块。

	function test(printTwo){
    	printing: {
        	console.log("one");
        	if(!printTwo){
        	break printing;
    	}
    	console.log("three");
    	}
	}
	test(false); // one three
	test(true); // one two three

### 3.2 函数表达式和函数声明
下面的代码是一个函数表达式：

	function () {}
你还可以给这个函数表达式起一个名字，将它转变为一个命名（非匿名）的函数表达式：

	function foo(){}
这个函数的函数名只存在于函数内部，比如，可以用它来做递归运算：

	var fac = function me(x) {
    	return x <= 1 ? 1: x * me(x-1);
	}
	fac(10) // 362800
	console.log(me) //Uncaught ReferenceError: me is not defined `
一个命名的函数表达式从表面上看起来,和一个函数声明并没有什么区别.但他们的效果是不同的:一个函数表达式产生一个值(一个函数).一个函数声明执行一个动作:将一个函数赋值给一个变量. 此外,只有函数表达式可以被立即调用,函数声明不可以.

下面的例子是一个立即执行的函数表达式

	(function () { return 'abc' }()) // 'abc'`
如果省略了小括号，你会得到一个语法错误（函数声明不能匿名）

	function () { return 'abc' }() // Uncaught SyntaxError: Unexpected token (`
另外一个能让表达式在表达式上下文被解析的办法是使用一元运算符，比如 + 或者 ！，但是，和使用括号不同的是，这些操作符会改变表达式的运行结果，如果你不关心结果的话，完全可以使用：

	+function () { console.log("hello")} () // hello NaN


转载：【链接】[译]JavaScript中:表达式和语句的区别
http://www.cnblogs.com/ziyunfei/archive/2012/09/16/2687589.html







