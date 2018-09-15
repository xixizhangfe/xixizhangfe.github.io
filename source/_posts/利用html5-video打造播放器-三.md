---
title: 利用html5 video打造播放器(三)
date: 2017-07-17 16:51:53
tags: 前端，html5，video
categories:
---
<a href="http://www.xixizhang.info/2017/07/17/%E5%88%A9%E7%94%A8html5-video%E6%89%93%E9%80%A0%E6%92%AD%E6%94%BE%E5%99%A8/">利用html5 video打造播放器(一)</a>

<a href="http://www.xixizhang.info/2017/07/17/%E5%88%A9%E7%94%A8html5-video%E6%89%93%E9%80%A0%E6%92%AD%E6%94%BE%E5%99%A8-%E4%BA%8C/">利用html5 video打造播放器(二)</a>

上一篇我们已经介绍了基本样式的实现，接下来我们实现相关的事件。

---

（1）首先，在js文件里，添加如下函数：

	pro.initEvent = function() {
		var that = this;
	}
	
（2）点击播放按钮，视频开始播放，那就给按钮添加一个tap事件吧，在pro.initEvent函数里加上：

	// 给播放按钮图片添加事件
    this.vimg.addEventListener('tap', function() {
        this.style.display = 'none';
        that.video.play();
    })
    
 这时候点击按钮，就可以播放了。并且，按钮也消失了。
 
 （3）这时候光播放还不行，还得暂停啊，那就给视频加一个tap事件吧，在pro.initEvent函数里加上：
 	
 		// 视频点击暂停或播放事件
        this.video.addEventListener('tap', function() {
            if (this.paused) {
                // 如果播放完毕，就从头开始播放
                if (this.ended) {
                    this.currentTime = 0;
                }
                // 暂停时点击就播放
                this.play();
            } else {
                // 播放时点击就暂停
                this.pause();
            }
        })
 	
 这时候我们再去点击视频所在区域，发现就可以停止了。
 	
 （3）接下来就是控制条了，我们想让它在播放时消失，暂停时显现，在pro.initEvent函数里加上：
 
 		// 视频播放事件
        this.video.addEventListener('play', function() {
            that.vimg.style.display = 'none';
            that.vControls.classList.add('vhidden');

            // 注意这里我们只是把控制条变成透明了，如果我们写了控制条的点击事件，那么变成透明后点击控制条位置还是会触发事件，所以我们可以写一段定时，让控制条3.5s后隐藏
            // 这里写成3.4s只是为了保险，如果没写animation-fill-mode:forwards样式，并且这里设置定时是3.5s，就会闪一下
            that.vCtrolTime = setTimeout(function() {
                that.vControls.style.visibility = 'hidden';
            }, 3400);
        })

        this.video.addEventListener('pause', function() {
            // 暂停时显示播放按钮
            that.vimg.style.display = 'block';
            that.vControls.classList.remove('vhidden');
            that.vControls.style.visibility = 'visible';
            that.vCtrolTime && clearTimeout(that.vCtrolTime);
        })

同时呢，我们应该在css文件里写上动画：

	@keyframes vhide {0% {opacity: 1;}100% {opacity: 0;}}
	.vhidden{
  		animation: vhide 3.5s ease-in;
  		-webkit-animation: vhide 3.5s ease-in;
  		// animation-fill-mode: forwards;
  		// -webkit-animation-fill-mode: forwards;
	}
	
这样，我们就实现了播放、暂停、控制条动画。

（4）好，现在开始显示视频总时间

首先我们得获取视频元信息，在pro.initEvent函数里加上：

		// 获取视频元信息
        this.video.addEventListener('loadedmetadata', function() {
            that.vDuration = this.duration;
            that.vControls.querySelector('.duration').innerHTML = stom(this.duration);
        });

这里的stom函数是时间转换函数，如下：

	// 时间格式化
    function stom(t) {
        var h = Math.floor(t / 3600);
        h < 10 && (h = '0' + h);
        var m = Math.floor(t % 3600 / 60);
        if (m < 10) {
            m = '0' + m;
        }
        return h + ':' + m + ':' + (t % 3600 % 60 / 100).toFixed(2).slice(-2);
    }

此时发现，已经有总时间啦~

（5）下面就开始获取当前播放了多少时间

		this.video.addEventListener('timeupdate', function() {
            var currentPos = this.currentTime; // 获取当前播放的位置
            // 更新进度条
            var percentage = 100 * currentPos / that.vDuration;
            // 设置宽度
            that.vControls.querySelector('.timeBar').style.width = percentage + '%';
            that.vControls.querySelector('.current').innerHTML = stom(currentPos);
        })
至此，我们实现了进度条时间的显示。