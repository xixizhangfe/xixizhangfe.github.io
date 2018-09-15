---
title: setTimeout中的this
date: 2017-07-28 21:17:17
tags:
categories:
---
setTimeout函数执行的代码是从执行上下文中调用的，与setTimeout调用的函数不同。

如果在非严格模式下，this将指向全局或者window对象，在严格模式下，是undefined。

看下面的例子：

	myArray = ['zero', 'one', 'two'];
    myArray.myMethod = function (sProperty) {
        alert(arguments.length > 0 ? this[sProperty] : this);
    };

    myArray.myMethod(); // prints "zero,one,two"
    myArray.myMethod(1); // prints "one"
    
而如果用setTimeout呢？

	setTimeout(myArray.myMethod, 1000); // prints "[object Window]" after 1 second
    setTimeout(myArray.myMethod, 1500, '1'); // prints "undefined" after 1.5 seconds
    
    
myArray.myMethod函数被传递给setTimeout，当它被调用时，它的this没有被设置，所以默认指向window对象，并且也没有选项能够传thisArg给setTimeout，使用call也是不行的。
		
	setTimeout.call(myArray, myArray.myMethod, 2000); // error: "NS_ERROR_XPC_BAD_OP_ON_WN_PROTO: Illegal operation on WrappedNative prototype object"
    setTimeout.call(myArray, myArray.myMethod, 2500, 2); // same error
    
    
### 解决方案
1、将调用的函数使用一个包裹函数包裹

	setTimeout(function(){myArray.myMethod()}, 2000); // prints "zero,one,two" after 2 seconds
    setTimeout(function(){myArray.myMethod('1')}, 2500); // prints "one" after 2.5 seconds
    
    
2、箭头函数

	setTimeout(() => {myArray.myMethod()}, 2000); // prints "zero,one,two" after 2 seconds
	setTimeout(() => {myArray.myMethod('1')}, 2500); // prints "one" after 2.5 seconds
	
3、bind

	myArray = ['zero', 'one', 'two'];
	myBoundMethod = (function (sProperty) {
    	console.log(arguments.length > 0 ? this[sProperty] : this);
	}).bind(myArray);

	myBoundMethod(); // prints "zero,one,two" because 'this' is bound to myArray in the function
	myBoundMethod(1); // prints "one"
	setTimeout(myBoundMethod, 1000); // still prints "zero,one,two" after 1 second because of the binding
	setTimeout(myBoundMethod, 1500, "1"); // prints "one" after 1.5 seconds
	
4、重写setTimeout和setInterval函数

	/ Enable setting 'this' in JavaScript timers
     
    var __nativeST__ = window.setTimeout, 
        __nativeSI__ = window.setInterval;
     
    window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
      var oThis = this, 
          aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeST__(vCallback instanceof Function ? function () {
        vCallback.apply(oThis, aArgs);
      } : vCallback, nDelay);
    };
     
    window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
      var oThis = this,
          aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeSI__(vCallback instanceof Function ? function () {
        vCallback.apply(oThis, aArgs);
      } : vCallback, nDelay);
    };
    
测试一下：

	myArray = ['zero', 'one', 'two'];
    myArray.myMethod = function (sProperty) {
        alert(arguments.length > 0 ? this[sProperty] : this);
    };

    setTimeout(alert, 1500, 'Hello world!'); // the standard use of setTimeout and setInterval is preserved, but...
    setTimeout.call(myArray, myArray.myMethod, 2000); // prints "zero,one,two" after 2 seconds
    setTimeout.call(myArray, myArray.myMethod, 2500, 2); // prints "two" after 2.5 seconds
    
    
    























    