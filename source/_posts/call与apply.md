---
title: call与apply
date: 2017-07-29 21:42:22
tags:
categories:
---
### this指向
直接看代码：

```
function fn() {
  console.log(this);
}
fn();//window

fn.call(1);//this=>数字1的包装类对象Number，相当于new Number(1)
fn.call('str'); // this=>字符串'str'的包装类对象String，相当于new String('str')

fn.call([1,2,3]); // this=>数组[1,2,3]
fn.call({}); // this=>对象

fn.call();//window
fn.call(null);//window
fn.call(undefined);//window

function fn1(name, age){
  console.log(this, name, age);
}

fn1.call(null, '张三', 20); //window, '张三',20

fn1.apply(null, ['张三',20]); //windwo, '张三',20
```

