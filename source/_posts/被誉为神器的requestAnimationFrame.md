---
title: 被誉为神器的requestAnimationFrame
date: 2017-07-28 16:56:26
tags:
categories:
---
### setTimeout和setInterval的问题

我们知道js动画的核心技术是计时器。编写动画循环的关键是要知道延迟多长时间执行。一方面，循环时间必须足够短，才能让不同的动画效果显得平滑流畅；另一方面，循环间隔还要足够长，这样才能保证浏览器有能力渲染产生的变化。

大多数电脑显示器的刷新频率是60Hz，大概相当于每秒重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有所提升，因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms。

而setTimeout和setInterval的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览区UI线程队列中，以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后才执行，

### requestAnimationFrame的好处
requestAnimationFrame采用系统时间间隔，保持最佳绘制效率。不会因为间隔时间过短，造成过度重绘，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

### requestAnimationFrame的特点
* requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
* 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流。这当然意味着更少的CPU、GPU和内存使用量
* requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的使用，并且如果页面不是激活状态的话，动画会自动暂停，有效节省了CPU开销。


### requestAnimationFrame的使用
equestAnimationFrame的用法与settimeout很相似，只是不需要设置时间间隔而已。requestAnimationFrame使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。它返回一个整数，表示定时器的编号，这个值可以传递给cancelAnimationFrame用于取消这个函数的执行。

	requestID = requestAnimationFrame(callback); 
	//控制台输出1和0
	var timer = requestAnimationFrame(function(){
    	console.log(0);
	}); 
	console.log(timer);//1

### cancelAnimationFrame方法用于取消定时器

	//控制台什么都不输出
	var timer = requestAnimationFrame(function(){
    	console.log(0);
	}); 
	cancelAnimationFrame(timer);


### cancelAnimationFrame的兼容性
IE9-浏览器不支持该方法，可以使用setTimeout来兼容。

	if(!window.requestAnimationFrame){
            var lastTime = 0;
            window.requestAnimationFrame = function(callback){
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0,16.7-(currTime - lastTime));
                var id  = window.setTimeout(function(){
                    callback(currTime + timeToCall);
                },timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            }
        }

取消动画

	if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }























