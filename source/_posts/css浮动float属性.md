---
title: css浮动float属性
date: 2017-07-19 22:17:29
tags: 前端，css，css3
categories:
---
## 浮动的本意
让文字像流水一样环绕浮动元素。

## 怎么才能实现该效果呢

用**包裹性**和**高度欺骗**

### 特性一：包裹性
![](http://upload-images.jianshu.io/upload_images/1959053-1b1dda5d416c60eb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码：
	
	<div style="border:4px solid blue;">
        <img src="img/25/1.jpg" />
    </div>
    <div style="border:4px solid red;float:left;">
        <img src="img/25/2.jpg" />
    </div>
    
block元素不指定width的话，默认是100%，一旦让该div浮动起来，立刻会像inline元素一样产生包裹性，宽度会随内容自适应。这也是通常float元素需要手动指定width的原因。

再加一个div的话，效果如下：
![](http://upload-images.jianshu.io/upload_images/1959053-2869f0891d66eee5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	<div style="border:4px solid blue;">
        <img src="img/25/1.jpg" />
    </div>
    <div style="border:4px solid red;float:left;">
        <img src="img/25/2.jpg" />
    </div>
    <div style="border:4px solid green;">
        <img src="img/25/3.jpg" /> 
    </div>

效果非常近似与display:inline-block,但相比之下，浮动能设定为左浮和右浮，display:inline-block都是从左到右排列的。（还有些细微差别，两个display:inline-block间会有空隙，但两个float间没有。这不是本篇的主题，暂时略过）。


### 特性二： 高度欺骗
首先声明：其实是CSS层级在起作用，但CSS层级适合单独写一篇，内容实在太多，不适合在这里展开，就理解为高度欺骗吧）

例1中浮动float被设在了外围div上，因此高度欺骗性没体现出来。现在给内层img元素设定float。所谓一图胜千言：

![](http://upload-images.jianshu.io/upload_images/1959053-200a5280f9711949.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
	
	<div style="border:4px solid blue;">
        <img src="img/25/1.jpg" />
    </div>
    <div style="border:4px solid red;">
        <img style="border:4px solid yellow;float:left;" src="img/25/2.jpg" />
    </div>

和例子1唯一的区别就是：将外层div的float移到内层img中。这下高度欺骗性体现出来了。例1中给外层div加上浮动，因此外层div会有包裹性，其内容是img图片，所以可以看到红色边框包裹着img。

例2中外层div没有了浮动，因此红色边框宽度默认是100%全屏。其内容img由于加上了float，使得该img具有了欺骗性。float给img施了个障眼法，让该img的inline-height高度塌陷为0了。这样外层div计算高度时，认为img的高度为0，相当于div的content的高度为0，因此红色边框看起来是一条直线。

但请注意障眼法毕竟是障眼法，并不是真的让img的高度塌陷为0了，可以看到上图中img的黄色边框还是有正常高度的。如果给div里加点文字，效果如下：

![](http://upload-images.jianshu.io/upload_images/1959053-5170f426197de08b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，外层div在没有手动设定height的前提下，其高度是由内部content的最大高度决定的，由于img的float使得img具有高度塌陷的欺骗性，让div误以为img的line-height为0，因此div的高度就是文字的匿名inline-box的inline-height。

因此浮动并不是让元素的高度塌陷了，而是让元素具有高度塌陷的欺骗性。骗谁？骗别人！但骗不了自己，元素自身还是有高度的（见上图的黄框）。

回过头再看看浮动float的本意：让文字像流水一样环绕图片。重要的事情多看几遍...给div设定一个width:200px，并加点文字吧：

![](http://upload-images.jianshu.io/upload_images/1959053-dad6d5b856f3df0f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这就是浮动元素的本意。该效果是很难被其他CSS属性等价地模拟的。

但就像开头说的，CSS强大的灵活性使得很多CSS属性被用于了创造者都没想到的场景。以float为例，就被广泛用于了布局。是好是坏呢？不知道！西红柿臭鸡蛋先别急着扔。既然撸主不知道，还废话什么？先看看float布局的问题。渣浪微博改版前的好友列表用浮动布局，效果如下:

![](http://upload-images.jianshu.io/upload_images/1959053-2dca492dbffd770f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	<ul>
      <li style="width:138px;margin:0 10px;text-align: center;float:left;">
          <div><img src="img/25/1.jpg" />尼古拉斯.旺财</div>
      </li>
      <li style="width:138px;margin:0 10px;text-align: center;float:left;">
          <div><img src="img/25/2.jpg" />功夫熊猫</div>
      </li>
      <li style="width:138px;margin:0 10px;text-align: center;float:left;">
          <div><img src="img/25/3.jpg" />月野兔</div>
      </li>
      <li style="width:138px;margin:0 10px;text-align: center;float:left;">
          <div><img src="img/25/4.jpg" />猫女郎</div>
      </li>
    </ul>

每个li都设为浮动和定宽，实现了水平布局。但如果好友再长点呢？效果如下：
![](http://upload-images.jianshu.io/upload_images/1959053-ae89f49a5463cae0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

错行啦！常见的修正方案是手动设定一个高度，让文字固定显示一行，用裁掉超行文字的代价以避免错行问题。在撸主看来这就是让CSS属性用于不合原意处的局限性。设固定高度是OK，但如果哪天设计师觉得姓名需要显示两行呢，那固定高度就需要重新计算重新变。如果设计师觉得需要拓宽俄罗斯市场，姓名要显示三行呢？再把固定高度改大点。如果未来Boss脑袋一拍，咦，能不能高度自适应呢？由姓名最大高度的好友来决定每行的高度。你是不是会有准备一下简历的冲动？

当然现实没这么夸张，高度自适应是个烂大街的技术，将浮动float改成 display:inline-block 就行了，效果如下：

![](http://upload-images.jianshu.io/upload_images/1959053-17176e9467c1dba7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码只需将上面float:left;替换成display: inline-block;，没对齐只需给li加上个vertical-align: top;（上面提到过，相比float，display:inline-block中间会有空隙，眼神好的可以从图中就能看出来，解决方案不是本篇的主题，可以问度娘）。这下高度自适应了，每行的高度都是以名字最长的高度为准。

回过头看用float来水平布局。是好是坏呢？好处是上手简单，随便什么程度的CSSer都能搞定。坏处是有时需要定高难以自适应。而display:inline-block;属性可是根正苗红的水平布局的属性，可以用其替代float。让float尽量多的干其本职工作：让文字像流水一般环绕浮动元素。所以撸主不知道答案。或许也根本没有正确答案，不停的推翻原有的认识和想法人才能进步。


## 清除浮动

这个就相对比较简单了，用clear即可，稍微要注意的是，clear是仅用作于当前元素，例如元素A是浮动元素，靠左显示。元素B是block元素，紧跟在A后面。此时要清除浮动，是在B上色设置clear:left。你在A上设置clear:right是没有用的，因为A的右边没有浮动元素。

但真的这么简单吗？

先明确一个概念，用clear确实能达到我们期望的清除浮动的效果，这点没异议。但深入点看，究竟是清除了什么样的浮动呢？一图胜千言：

![](http://upload-images.jianshu.io/upload_images/1959053-576f17a1570dda26.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码：（给页脚加上clear:left）

	<div style="border:4px solid blue;">
        <div style="width:200px;border:4px solid red;float:left;">
            我是浮动元素1
        </div>
        <div style="width:200px;border:4px solid yellow;float:left;">
            我是浮动元素2
        </div>
    </div>
    <div style="border:4px solid gray;clear:left;">我是页脚</div>
    
    
因为浮动元素的高度欺骗性，导致外层div失去了高度（蓝色边框成了一条线）。为了让页脚显示到浮动元素下面，对页脚应用了clear:left。这是常规做法，没有任何新奇之处。但是外层div的高度仍旧处于塌陷状态，我们脑海真真正期望的清除浮动后的样子难道不是下面这样吗？

![](http://upload-images.jianshu.io/upload_images/1959053-be8e95926b12dab5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

让清除浮动后，原本被欺骗的外层div获得正确的高度！借用文首大神链接的说法，我们脑中期望的其实并不是上图的清除浮动，而是下图的**闭合浮动**。

## 闭合浮动
闭合浮动的实现方法很多，常见的是最后增加一个清除浮动的子元素：

	<div style="border:4px solid blue;">
      <div style="width:200px;border:4px solid red;float:left;">
          我是浮动元素1
      </div>
      <div style="width:200px;border:4px solid yellow;float:left;">
          我是浮动元素2
      </div>
      <div style="clear:both;"></div>  //加上空白div节点来闭合浮动
    </div>
    <div style="border:4px solid gray;">我是页脚</div>
    
缺点是会增加一个DOM节点。（话说当初撸主不知道在哪里看到这个做法时，作者并未讲这么做的原因，导致撸主不明白明明页脚加一个clear属性就能搞定的事，为何要大动干戈加一个DOM节点）


方法二：同样可以在最后增加一个清除浮动的br：将上面代码中`<div style=”clear:both;”></div>`替换成`<br clear=”all” />`即可。语义上比空的div标签稍微好一点，但同样会增加一个DOM节点。


方法三：父元素设置 `overflow:hidden`（如果你还要兼顾IE6的话，加上`*zoom:1;`来触发hasLayout）
	
	<div style="border:4px solid blue;overflow:hidden;">
      <div style="width:200px;border:4px solid red;float:left;">
          我是浮动元素1
      </div>
      <div style="width:200px;border:4px solid yellow;float:left;">
          我是浮动元素2
      </div>
    </div>
    <div style="border:4px solid gray;">我是页脚</div>
    
    
这看起来很奇怪。因为子元素的浮动的高度欺骗，导致父元素误认为content高度为0（即蓝色边框为一条线），所以父元素设成overflow:hidden溢出隐藏的话，直觉上应该子元素由于溢出导致不显示才对，即整个页面只显示页脚。但实际效果，父元素设成overflow:hidden溢出隐藏后，竟然神奇地出现了闭合浮动的效果（蓝色边框正确获得了高度）。这是怎么回事呢？靠的是BFC，但BFC说起来又是很长一篇，先略过。你可以先简单地这么理解：浏览器厂商认为要让超出边框部分可以被修剪掉，那么前提就是父元素要正确获得高度，即父元素不能被欺骗导致高度塌陷。浏览器正确获得子元素的高度后给父元素重新设置高度。虽然权威解释肯定是BFC，但撸主这样理解了很久...

方法四：同上面将父元素设置 的overflow:hidden改成auto，不赘述


方法五：父元素也设成float。这样确实实现了闭合浮动，但页脚将上移，所以页脚仍旧需要clear:left。还有个缺点是由于浮动的包裹性，你确定父元素真的设成float对页面布局不会产生影响吗？

方法六：父元素设置display:table。效果OK，页脚也不需要设clear:left，但父元素的盒子模型被改变了，请先确认下这样的改动对页面布局不会产生影响吗？

方法七：用:after伪元素，思路是用:after元素在div后面插入一个隐藏文本”.”，隐藏文本用clear来实现闭合浮动：

	.clearfix:after {
      clear: both;
      content: ".";   //你头可以改成其他任意文本如“abc”
      display: block;
      height: 0;      //高度为0且hidden让该文本彻底隐藏
      visibility: hidden;
    }
    .clearfix {
        *zoom: 1;
    }


    <div style="border:4px solid blue;" class="clearfix">
      <div style="width:200px; border:4px solid red; float:left;">
          我是浮动元素1
      </div>
      <div style="width:200px; border:4px solid yellow; float:left;">
          我是浮动元素2
      </div>
    </div>
    <div style="border:4px solid gray;">我是页脚</div>
    






转载自：http://www.jianshu.com/p/07eb19957991
