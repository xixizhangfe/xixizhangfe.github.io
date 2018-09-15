---
title: 利用html5 video打造播放器(四)
date: 2017-07-17 17:19:44
tags: 前端，html5，video
categories:
---

（1）今天实现全屏、小屏切换
	首先要获取到小屏、大屏情况下的视频的宽高
	
		pro.initInfo = function() {
        var that = this;
        // 在onload状态下，offsetHeight才会获取到正确的值
        window.onload = function() {
            that.miniInfo = { // mini状态时的样式
                zIndex: 1,
                width: that.video.offsetWidth + 'px',
                height: that.video.offsetHeight + 'px',
                position: that.vRoom.style.position,
                // transform: 'translate(0,0) rotate(0deg)'
                
            }
            var info = [
                    document.documentElement.clientWidth || document.body.clientWidth,
                    document.documentElement.clientHeight || document.body.clientHeight
                ],
                w = info[0],
                h = info[1],
                cha = Math.abs(h - w) / 2;
            that.maxInfo = { // max状态时的样式
                zIndex: 99,
                width: h + 'px',
                height: w + 'px',
                position: 'fixed',
                transform: 'translate(-' + cha + 'px,' + cha + 'px) rotate(90deg)'
            }

        }
    }
    
    
（2）其次就是切换小屏、大屏
	这里默认初始是小屏，所以应该在初始化时加上`this.isMax = false;`
	如下：
	
	var myVideo = function(dom) {
        var that = this;
        console.log('this',this);
        $.ready(function() {
            that.video = document.querySelector(dom || 'video');
            that.vRoom = that.video.parentNode;
            // 元素初始化
            that.initEm();
            // 事件初始化
            that.initEvent();
            // //  记录信息
            that.initInfo();
            // 当前播放模式false为mini播放
            that.isMax = false;
        });
    }
    
当点击全屏按钮时，应该触发切换事件：
	
		this.vControls.querySelector('.fill').addEventListener('tap', function() {
            that.switch();
        })
切换事件函数如下：

	pro.switch = function() {
        var vR = this.vRoom;
        var info = this.isMax ? this.miniInfo : this.maxInfo;
        for (var i in info) {
            vR.style[i] = info[i];
        }
        this.isMax = !this.isMax;
    }
    
    
（3）接下来实现快进快退

		// 快进快退
        // 视频手势右滑动事件
        this.video.addEventListener('swiperight', function(e) {
            console.log('right');
            this.currentTime += 5;
        })
        // 视频手势左滑动事件
        this.video.addEventListener('swipeleft', function(e) {
            console.log('left');
            this.currentTime -= 5;
        })

这样是可以实现小屏模式下的快进快退，但是大屏模式下就不行了，难道手机横放还要上下快进快退？

（4) 处理大屏模式下的快进快退

这时候我们先给video注册一个事件列表

	var events = {};
    // 增加或者删除事件
    // 给video事件添加一个代理来删除添加事件，
    // isF就是在新增这个事件是否删除之前的这个相同的事件，
    // 因为添加事件用匿名函数的话，是不能删除的，这样设置一个代理就可以把动态添加的事件记录在events里面，便于操作
    pro.eve = function(ename, callback, isF) {
        if (callback && typeof(callback) == 'function') {
            isF && arguments.callee(ename);
            events[ename] = callback;
            this.video.addEventListener(ename, events[ename]);
            console.log('删除事件:' + ename);
            return fun;
        }
        var fun = events[ename] || function() {};
        this.video.removeEventListener(ename, fun);
        console.log('删除事件：' + ename);
        return fun;
    }
    
这时候补上修改当前播放进度和音量的功能：

	//跳转视频进度 单位 秒
    pro.setCurrentTime = function(t) {
        this.video.currentTime += t;
    }
    //设置音量大小 单位 百分比 如 0.1
    pro.setVolume = function(v) {
        this.video.volume += v;
    }

再通过代理给video事件添加左右上下滑动的事件（（3）中那个就不需要了）：

	    //视频手势右滑动事件
        this.eve('swiperight',function(){
            if(that.isMax){
                return that.setVolume(0.2);
            }
            that.setCurrentTime(5);
        });
        
        //视频手势左滑动事件
        this.eve('swipeleft', function() {
            if(that.isMax){
                return that.setVolume(-0.2);
            }
            that.setCurrentTime(-5);
        });
        
        //视频手势上滑动事件
        this.eve('swipeup',function(){
            if(that.isMax){
                return that.setCurrentTime(-5);    
            }
            that.setVolume(0.2);
        });
        
        //视频手势下滑动事件
        this.eve('swipedown', function() {
            if(that.isMax){
                return that.setCurrentTime(5);    
            }
            that.setVolume(-0.2);
        });
	

<a href="https://github.com/xixizhangfe/html5">github源码</a>


参考：https://segmentfault.com/a/1190000006461476

感谢作者！！