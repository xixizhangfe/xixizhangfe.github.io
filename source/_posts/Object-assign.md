---
title: Object.assign
date: 2018-10-15 09:31:42
tags: javascript
---
语法：
Object.assign(target, ...source)

1、Object.assign是将一个或多个源对象的<strong>自身的</strong>且<strong>可枚举</strong>的属性复制到目标对象。即，继承属性和不可枚举属性是不能拷贝的。

```
var obj1 = Object.create({foo: 1}, { // foo是个继承属性
	bar: {
		value: 2, // bar是个不可枚举属性。
	},
	baz: {
		value: 3,
		enumerable: true, // baz是个自身可枚举属性。
	}
});

var copy = Object.assign({}, obj);
console.log(copy); // {baz: 3}
```

2、 该方法使用源对象的[[Get]]和目标对象的[[Set]]，所以它会调用相关getter和setter。
3、 String类型和Symbol类型的属性都会被拷贝

```
var obj1 = {a: 1};
var obj2 = {[Symbol('foo)]: 2};
var obj = Object.assign({}, obj1, obj2);
console.log(obj); // {a: 1, [Symbol('foo')]: 2}
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
```

4、 在出现错误的情况下，会打断后续拷贝任务，但已拷贝的会保留在目标对象

```
var target = Object.defineProperty({}, 'foo', {
	value: 1,
	writable: false,
}); // target的foo属性是个只读属性

Object.assign(target, {bar: 2}, {foo2: 3, foo: 3, foo3: 3}, {baz: 4});
// TypeError: 'foo' is read-only
// 注意这个异常是在拷贝第二个源对象的第二个属性时发生的
console.log(target); // {bar: 2, foo2: 3, foo: 1}
```

5、 不会跳过值为null或undefined的对象

6、 针对深拷贝，需要使用其他方法。因为Object.assign()拷贝的是属性值。如果源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值。

```
var obj1 = {a: 0, b: {c: 0}};
var obj2 = Object.assign({}, obj1);
console.log(JSON.stringify(obj2)); // {a: 0, b: {c: 0}}

obj1.a = 1;
console.log(JSON.stringify(obj1)); // {a: 1, b: {c: 0}}
console.log(JSON.stringify(obj2)); // {a: 0, b: {c: 0}} obj2.a不会受影响

obj2.b.c = 3;
console.log(JSON.stringify(obj1)); // {a: 1, b: {c: 3}} obj1.b.c也会变化
console.log(JSON.stringify(obj2)); // {a: 0, b: {c: 3}}

// 深拷贝
obj1 = {a: 0, b: {c: 0}};
var obj3 = JSON.parse(JSON.stringify(obj1));
obj1.a = 4;
obj1.b.c = 4;
console.log(JSON.stringify(obj3)); // {a: 0, b: {c: 0}}
```

7、原始类型会被包装成对象

```
var v1 = "abc";
var v2 = true;
var v3 = 10;
var v4 = Symbol('foo');

var obj = Object.assign({}, v1, null, v2, undefined, v3, v4);

// 原始类型会被包装，null和undefined会被忽略
// 注意，只有字符串的包装对象才可能有自身可枚举属性
console.log(obj); // {0: 'a', 1: 'b', 2: 'c'}
```
