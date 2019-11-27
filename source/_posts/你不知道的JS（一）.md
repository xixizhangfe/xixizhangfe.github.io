---
title: 你不知道的JS（一）
date: 2019-11-07 09:14:01
tags:
---
把《You dont't know Javascript》上篇看了一些，第一部分作用域和闭包看完了，第二部分除了第4、6章，其他都看完了。

本篇文章想通过几个例子，深入到作用域、变量提升、this的原理。

# 提升
我们都知道变量会提升，那么这些面试题你能保证都做对吗？

先看一下这些题，由简到难：

```javascript
// eg1
var a;
console.log(a);
a = 2;

// eg2
console.log(a);
var a = 2;

// eg3
foo()
function foo () {
  var a;
  console.log(a);
  a = 2;
}

// eg4
foo()
var foo = function () {
  var a;
  console.log(a);
  a = 2;
}

// eg5
bar()
var foo = function bar() {
  var a;
  console.log(a);
  a = 2;
};

// eg6
foo()
bar()
var foo = function bar() {
  var a;
  console.log(a);
  a = 2;
};

// eg7
foo()
var foo = function () {
  console.log(1);
};
function foo () {
  console.log(2);
}

// eg8
foo()
var foo = function () {
  console.log(1);
};
function foo () {
  console.log(2);
}
function foo () {
  console.log(3);
}

// eg9
foo()
var a = true;
if (a) {
  function foo () {
    console.log("a");
  }
} else {
  function foo () {
    console.log("b");
  }
}

```

答案：
1. 2
2. undefined
3. undefined
4. TypeError: foo is not a function
5. ReferenceError: bar is not defined
6. TypeError: foo is not a function (ReferenceError: bar is not defined，这个错误不会出现，因为被前一个错误中断了)
7. 2
8. 3
9.  b
