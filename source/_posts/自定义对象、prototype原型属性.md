---
title: 自定义对象、prototype原型属性
date: 2017-07-16 21:24:17
tags: 前端，js
categories:
---
## 自定义对象
1\. JS没有类，但只要有函数即可创建对象	
2\. 自定义对象的几种方式

* 方式1: 使用无参的函数创建对象

		```
		function person() {};
		var p1 = new person();
		p1.id = "1";
		p1.name = "张三";
		console.log(p1); // person {id: "1", name: "张三"}
		var p2 = new person();
		console.log(p2); // person {}
		```
	
	这种方式创建的对象的属性不会共享。
	
* 方式2: 使用带参数的函数创建对象

		```
		function person(id, name) {
			this.id = id;
			this.name = name;
		}
		var p1 = new person(2, "李四");
		coonsole.log(p1); // person {id: 2, name: "李四"}
		var p2 = new person(3, "王五");
		console.log(p2); // person {id: 3, name: "王五"}
		```
		
* 方式3: 使用Object函数创建对象，JS默认创建了一个function Object(){}.
		
		```
		var p1 = new Object();
		p1.id = 1;
		p1.name = "张三";
		console.log(p1);//Object {id: 1, name: "张三"}
		```
		
* 方式4: 使用对象字面量的方式创建

		```
		var p1 = {
			id: 1, // key加不加引号都可以
			name: "张三"
		}
		console.log(p1); //Object {id: 1, name: "张三"}
		```
		
3\. 有了上述基础知识，那我们来实现一个简单的需求：

编写一个js文件，在js文件中自定义一个数组工具对象，该工具对象要有一个找到最大值的方法，与找元素对应的索引值的方法。
如果抛开以上知识，我们可能会这么写：

	<script type="text/javascript">
    function arrayTool(arr, target) {
      var max=arr[0];
      var index = null;
      for(var i=0; i <arr.length; i++){
        if(arr[i] > max) {
          max = arr[i];
        }
        if(arr[i] == target){
          index = i;
        }
      }
      return [max, index];
    }
    console.log(arrayTool([1,3,2,6], 1)); // 
    </script>

这样写没错，输出结果是：
  
  ![result](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/1.png)
  
但是，如果有时候我们只想获得最大值，而不想获得索引值呢？那好办，返回的结果取第一个值，`console.log(arrayTool([1,3,2,6], 1)[0])`不就行了。那如果这个数组工具有很多很多返回的值呢，难不成我们要一个个数是返回数组的第几个值？或者当我们想要其中的一部分返回值的时候，又怎么办呢？是不是很麻烦？
  
so，我们就可以利用上面学到的方法啦~
	
	<script type="text/javascript">
    function arrayTool(arr, target) {
      this.getMax = function (arr) {
        var max=arr[0];
        for(var i=0; i <arr.length; i++){
          if(arr[i] > max) {
            max = arr[i];
          }
        }
        return max;
      }
      this.getIndex = function (arr, target) {
        for(var i=0; i <arr.length; i++){
          if(arr[i] == target){
            return i;
          }
        }
        return -1;
      }
    }
    var tool = new arrayTool();
    var arr = [1,3,2,6];
    console.log(tool.getMax(arr));
    console.log(tool.getIndex(arr, 1));
    </script>

  
  输出结果是：
  
  ![result](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/2.png)
  
  这样我们想得到什么就去调用对应的方法，多简单！
  
## prototype原型属性

1\. 如果我们想把上述getMax与getIndex方法添加到数组对象中呢？

	// 以下这种方式是不行的，因为Array是内置对象。
	function Array() {
		this.getMax = function () {
		}
		this.getIndex = function () {
		}
	}

2\. Prototype注意的细节
	* prototype是函数(function)的一个必备属性（书面一点的说法是“保留属性”），只要是function，就一定有一个prototype属性
	* prototype的值是一个对象
	* 可以修改任意函数的prototype属性的值
	* 一个对象会自动拥有prototype的所有成员属性和方法

	// 猜想Array对象内部结构：
	function Array() {
		this.prototype = new Object(); // Array对象的必备属性，并且是一个对象
	}
	Array.prototype.getMax = function () {
		// Array对象的prototype对象的getMax方法
	}
	new Array(); // 这个对象就自动拥有了prototype的所有成员属性和方法，即这里的getMax方法。

	
3\. 作用：给一个方法追加一些功能，就可以使用prototype。（jquery使用较多）
4\. 解决需求：
	
	Array.prototype.getMax = function () {
      var max=this[0];
        for(var i=0; i <this.length; i++){
          if(this[i] > max) {
            max = this[i];
          }
        }
      return max;
    }
    Array.prototype.getIndex = function (target) {
      for(var i=0; i <this.length; i++){
          if(this[i] == target){
            return i;
          }
        }
      return -1;
    }
    var arr = [1,3,2,6];
    console.log(arr.getMax());
    console.log(arr.getIndex(1));

5\. 练习：给字符串对象添加一个toCharArray的方法，然后再添加一个reverse(翻转)的方法。

	String.prototype.toCharArray = function () {
      var arr = new Array();
      for (var i=0; i < this.length; i++) {
        arr.push(this.charAt(i)); // 注意这里也可以用this[i]，因为字符串是类数组，可以通过下标获取值，但推荐还是用charAt
      }
      return arr;
    }
    
	// 方式一：
    // String.prototype.reverse = function () {
    //   var str = new String();
    //   for(var i=this.length; i--; i>=0) {
    //     str += this[i];
    //   }
    //   return str;
    // }
    
    // 方式二(推荐)：利用toCharArray的方法,因为数组本身就具有reverse方法
    String.prototype.reverse = function () {
      var charStr = this.toCharArray();
      charStr.reverse();
      return charStr.join("");
    }
    var str = "we are family";
    
    console.log(str.toCharArray()); // (13) ["w", "e", " ", "a", "r", "e", " ", "f", "a", "m", "i", "l", "y"]
    console.log(str.reverse()); // ylimaf era ew

	
	
  
  
  
	
	
	
	
	
	
	
	
	
	
	
	