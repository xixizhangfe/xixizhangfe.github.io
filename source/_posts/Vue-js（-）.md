---
title: Vue.js（-）
date: 2017-07-06 10:06:43
tags:
---
## 生命周期

![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/8.png)

![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/9.png)

我们执行以下代码：

	<!DOCTYPE html>
    <html>

    <head>
        <title></title>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/vue/2.1.3/vue.js"></script>
    </head>

    <body>
        <div id="app">
            <p>{{ message }}</p>
        </div>
        <script type="text/javascript">
        var app = new Vue({
            el: '#app',
            data: {
                message: "xuxiao is boy"
            },
            beforeCreate: function() {
                console.group('beforeCreate 创建前状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el); //undefined
                console.log("%c%s", "color:red", "data   : " + this.$data); //undefined 
                console.log("%c%s", "color:red", "message: " + this.message)
            },
            created: function() {
                console.group('created 创建完毕状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el); //undefined
                console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化 
                console.log("%c%s", "color:red", "message: " + this.message); //已被初始化
            },
            beforeMount: function() {
                console.group('beforeMount 挂载前状态===============》');
                console.log("%c%s", "color:red", "el     : " + (this.$el)); //已被初始化
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化  
                console.log("%c%s", "color:red", "message: " + this.message); //已被初始化  
            },
            mounted: function() {
                console.group('mounted 挂载结束状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el); //已被初始化
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化
                console.log("%c%s", "color:red", "message: " + this.message); //已被初始化 
            },
            beforeUpdate: function() {
                console.group('beforeUpdate 更新前状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el);
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data);
                console.log("%c%s", "color:red", "message: " + this.message);
            },
            updated: function() {
                console.group('updated 更新完成状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el);
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data);
                console.log("%c%s", "color:red", "message: " + this.message);
            },
            beforeDestroy: function() {
                console.group('beforeDestroy 销毁前状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el);
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data);
                console.log("%c%s", "color:red", "message: " + this.message);
            },
            destroyed: function() {
                console.group('destroyed 销毁完成状态===============》');
                console.log("%c%s", "color:red", "el     : " + this.$el);
                console.log(this.$el);
                console.log("%c%s", "color:red", "data   : " + this.$data);
                console.log("%c%s", "color:red", "message: " + this.message)
            }
        })
        </script>
    </body>

    </html>


![](https://raw.githubusercontent.com/xixizhangfe/markdownImages/master/10.png)


可以看出，
beforecreated：el 和 data 并未初始化 

created:完成了 data 数据的初始化，el没有

beforeMount：完成了 el 和 data 初始化 

mounted ：完成挂载



## 如何用

beforecreate : 举个栗子：可以在这加个loading事件
 
created ：在这结束loading，还做一些初始化，实现函数自执行 

mounted ： 在这发起后端请求，拿回数据，配合路由钩子做一些事情

beforeDestory： 你确认删除XX吗？ destoryed ：当前组件已被删除，清空相关内容








转载自：https://segmentfault.com/a/1190000008010666