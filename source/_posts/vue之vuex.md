---
title: vue之vuex
date: 2017-07-20 11:01:35
tags:
categories:
---
Vuex是一种**状态管理模式**，采用集中式存储管理应用的所有组件的状态。

## Vuex的核心——store
### store的特点
store包含应用中大部分的状态（state）。

Vuex和单纯的全局对象有以下两点不同：

1\. **Vuex的状态存储是响应式的**。当Vue组件从store中读取状态的时候，若store中的状态发生变化，那么响应的组件也会更新。

2\. **不能直接改变store中的状态**。唯一途径就是显示提交mutations（commit mutations）。这样设计的目的是：我们能跟踪每一个状态的变化。

### store的创建
store创建时包含：

state, getters, mutations, actions, modules

这里给一个例子，在项目里新建store.js，写如下代码

	import Vue from 'vue'
    import Vuex from 'vuex'

    Vue.use(Vuex)

    // root state object.
    // each Vuex instance is just a single state tree.
    const state = {
      count: 0
    }

    // mutations are operations that actually mutates the state.
    // each mutation handler gets the entire state tree as the
    // first argument, followed by additional payload arguments.
    // mutations must be synchronous and can be recorded by plugins
    // for debugging purposes.
    const mutations = {
      increment (state) {
        state.count++
      },
      decrement (state) {
        state.count--
      }
    }

    // actions are functions that causes side effects and can involve
    // asynchronous operations.
    const actions = {
      increment: ({ commit }) => commit('increment'),
      decrement: ({ commit }) => commit('decrement'),
      incrementIfOdd ({ commit, state }) {
        if ((state.count + 1) % 2 === 0) {
          commit('increment')
        }
      },
      incrementAsync ({ commit }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit('increment')
            resolve()
          }, 1000)
        })
      }
    }

    // getters are functions
    const getters = {
      evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
    }

    // A Vuex instance is created by combining the state, mutations, actions,
    // and getters.
    export default new Vuex.Store({
      state,
      getters,
      actions,
      mutations
    })

### getters创建

getters会暴露为store.getters对象。

getters传入的参数：

第一个是state对象，第二个参数（可选），可以是其他getters，比如

	getters: {
  		// ...
 		doneTodosCount: (state, getters) => {
    		return getters.doneTodos.length
  		}
	}



### store里状态的使用
有了store，那么怎么在组件中使用呢？

下面给个例子，新建count.vue文件，

	<template>
      <div id="app">
        Clicked: {{ $store.state.count }} times, count is {{ evenOrOdd }}.
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementIfOdd">Increment if odd</button>
        <button @click="incrementAsync">Increment async</button>
      </div>
    </template>

    <script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
      // computed: mapGetters([
      //   'evenOrOdd'
      // ]),
      computed: {
        // 使用getters的方式
        evenOrOdd () {
          return this.$store.getters.evenOrOdd;
        }
      },
      methods: mapActions([
        'increment',
        'decrement',
        'incrementIfOdd',
        'incrementAsync'
      ])
    }
    </script>
    
下面开始详细介绍  
#### 先说怎么获取state
一个组件从store中读取状态的最简单的办法是在计算属性中返回某个状态：

比如上面代码中，可以在computed里加上：

	count() {
		return this.$store.state.count;
	}

当一个组件需要获取多个状态时，可以使用mapState辅助函数帮助我们生成计算属性。

可以把刚才写的count(){}函数替换为：

	mapState({
		count: state => state.count,
		countAlias: 'count',
		countPlusLocalState (state) {
      		return state.count + this.localCount
    	}
	})
	
当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

	computed: mapState([
  		// 映射 this.count 为 store.state.count
  		'count'
	])


#### 再说怎么获getters
也是在computed属性里写，如同count.vue里所写，可以用普通函数的形式，也可以用mapGetters.	

mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性，可以使用对象展开运算符将getters混入computed对象中：

	computed: {
  		// 使用对象展开运算符将 getters 混入 computed 对象中
    	...mapGetters([
      		'doneTodosCount',
      		'anotherGetter',
      		// ...
    	])
  	}


### mutations和actions区别
**mutations只支持同步函数。**

每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用 —— 实质上任何在回调函数中进行的的状态的改变都是不可追踪的。

Action 类似于 mutation，不同在于：

* Action 提交的是 mutation，而不是直接变更状态。
* Action 可以包含任意异步操作。


action里面的方法可以通过store.dispatch('increment')触发。
















