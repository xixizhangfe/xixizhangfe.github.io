---
title: javascript组件化开发方式
date: 2017-07-18 19:46:07
tags:
categories:
---
![](https://github.com/xixizhangfe/markdownImages/blob/master/1.mp4?raw=true)

看到要求后，第一反应就是我们最普通的写法（小白写法）：

	<!DOCTYPE html>
    <html>
    <head>
      <title></title>
      <script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body>
      <input type="text" name="" id="inputBox"><span id="res">0</span>个字
      <script type="text/javascript">
        $(function () {
          var input = $('#inputBox');
          input.on('keyup', function () {
            var num = input.val();
            if(num.length !== 0) {
              $('#res').html(num.length);
            }else{
              $('#res').html('0');
            }
          })
          
        })
      </script>
    </body>
    </html>
    
待更新~~