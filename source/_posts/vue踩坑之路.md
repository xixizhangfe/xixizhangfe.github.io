---
title: vue踩坑之路
date: 2017-07-24 17:05:03
tags:
categories:
---
### 1、检测数组
Vue不能检测到对象属性的添加或者删除。由于Vue在初始实例化时对属性执行getter/setter转化过程，所以属性必须在data对象上存在才能让vue转换它，这样才能让它是响应的。

对于数组，

* 直接利用索引修改某个项目，即：vm.items[indexOfItem] = newValue;
* 直接修改数组的长度，即：vm.items.length = newLength;

这两种旧方式虽然可以修改数组，但是不会同步显示在view视图中，需要改成如下方式：

* 修改数组中某个项目


```
	  // Vue.set
	  Vue.set(vm.items, indexOfItem, newValue)
	  // Array.prototype.splice
	  vm.items.splice(indexOfItem, 1, newValue)
```

* 修改数组的长度

```
	vm.items.splice(newLength)
```

### 2、检测对象

Vue不能检测到对象属性的添加或者删除。由于Vue在初始实例化时对属性执行getter/setter转化过程，所以属性必须在data对象上存在才能让vue转换它，这样才能让它是响应的。例如：

	var vm = new Vue({
		data: {
			a:1
		}
	})
	// vm.a是响应的
	vm.b = 2;
	// vm.b 是非响应的
	
**那有什么办法是在实例创建之后添加属性并且让它是响应的？**

对于Vue实例，可以使用`$set(key, value)`实例方法。Vue不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)，然而它可以使用Vue.set(object,key, value)方法将响应属性添加到嵌套的对象上。
	
```
	Vue.set(vm.someObject, 'b',2)
```
或者
```//
	this.$set(this.someObject, 'b', 2)
```	
	
有时候想向已有对象上添加一些属性，例如使用 Object.assign() 或 _.extend() 方法来添加属性。但是，添加到对象上的新属性不会触发更新(**但是呢，亲测，如果放在methods里，是可以触发更新的呀！！！只是在console中不会更新，有点奇怪！！！**)。在这种情况下可以创建一个新的对象，让它包含原对象的属性和新的属性：	

```
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b:2})
```

综上，我们来举个例子：

如下代码:

	<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>vue</title>
      <script src="https://unpkg.com/vue/dist/vue.js"></script>
      <style>
        li:hover {
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <ul>
          <li v-for="item,index in items" v-on:click="handle(index)">
            <span>{{item.name}}</span>
            <span>{{numbers[index]}}</span>
          </li>
        </ul>
      </div>
      <script>
        var vm = new Vue({
          el: ".wrap",
          data: {
            numbers: [],
            items: [
              {name: 'jjj'},
              {name: 'kkk'},
              {name: 'lll'},
            ]
          },
          methods: {
            handle: function (index) {
              // WHY: 更新数据，view层未渲染，但通过console这个数组可以发现数据确实更新了
               if (typeof(this.numbers[index]) === "undefined" ) {
                 this.numbers[index] = 1;
               } else {
                 this.numbers[index]++;
               }
            }
          }
        });
      </script>
    </body>
    </html>
  
##### 1、我们的本意是点击列表，对应的number就加1，可是，我们发现，浏览器不管怎么点都没有变化：

![这里写图片描述](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/18.png)

此时是不是应该换成我们的正确方法啦~~

	<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>vue</title>
      <script src="https://unpkg.com/vue/dist/vue.js"></script>
      <style>
        li:hover {
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <ul>
          <li v-for="item,index in items" v-on:click="handle(index)">
            <span>{{item.name}}</span>
            <span>{{numbers[index]}}</span>
          </li>
        </ul>
      </div>
      <script>
        var vm = new Vue({
          el: ".wrap",
          data: {
            numbers: [],
            items: [
              {name: 'jjj'},
              {name: 'kkk'},
              {name: 'lll'},
            ]
          },
          methods: {
            handle: function (index) {
              // WHY: 更新数据，view层未渲染，但通过console这个数组可以发现数据确实更新了
               if (typeof(this.numbers[index]) === "undefined" ) {
                 // this.numbers[index] = 1;
                 Vue.set(this.numbers, index, 1);
               } else {
                 // this.numbers[index]++;
                 Vue.set(this.numbers, index, ++this.numbers[index]);
               }
            }
          }
        });
      </script>
    </body>
    </html>

	
这次发现了，哇塞，变了！

![这里写图片描述](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/19.png)	
		
另外，大家试试第二种正确的方式，把`Vue.set(this.numbers, index, 1);`换成`this.$set(this.numbers, index, 1);`，把`Vue.set(this.numbers, index, ++this.numbers[index]);`换成`this.$set(this.numbers, index, ++this.numbers[index])`,会发现也是会变化哦~

当然我们这里说的变化时视图的变化，console里的数据老方法旧方法都是可以变的。


##### 2、点击时给items中元素添加一个属性，{"id": index}

这里有点奇怪~~~

* 如果是用老方法,也是可以渲染的，这跟网上的一些说法不同，只是在console中直接这么用确实不能渲染。

		methods: {
            handle: function (index) {
              // WHY: 更新数据，view层未渲染，但通过console这个数组可以发现数据确实更新了
               if (typeof(this.numbers[index]) === "undefined" ) {
                 // this.numbers[index] = 1;
                 // Vue.set(this.numbers, index, 1);
                 // this.$set(this.numbers, index, 1); 
                 
                 Object.assign(this.items[index], {"id": index});
               } else {
                 // this.numbers[index]++;
                 // Vue.set(this.numbers, index, ++this.numbers[index]);
                 this.$set(this.numbers, index, ++this.numbers[index])
               }
            }
          }

这样也是可以的！

如果把`Object.assign(this.items[index], {"id": index});`改成新方法`Vue.set(this.items, index, (Object.assign({},this.items[index], {"id": index})));`，当然也没问题，而且在console中使用也没问题。


所以为了确保无论如何都会渲染，那就采用新方法吧！！！
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	