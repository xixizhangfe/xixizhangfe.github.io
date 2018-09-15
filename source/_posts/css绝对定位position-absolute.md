---
title: 'css绝对定位position:absolute'
date: 2017-07-19 08:57:21
tags: 前端，css，css3
categories:
---
absolute的特点：**包裹性**和**高度欺骗**。

## 包裹性
区别就是：下面的图div增加了absolute
![](http://upload-images.jianshu.io/upload_images/1959053-ab541f1e916cbddd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	<div style="border:4px solid blue;">
  		<img src="img/25/1.jpg" />
	</div>
	<div style="border:4px solid red; position: absolute;">
  		<img src="img/25/2.jpg" />
	</div>

**一旦给元素加上absolute或float就相当于给元素加上了display:inline-block;**。什么意思呢？比如内联元素span默认宽度是自适应的，你给其加上width是不起作用的。要想width定宽，你需要将span设成display:block。但如果你给span加上absolute或float，那span的display属性自动就变成block，就可以指定width了。因此如果看到CSS里absolute/float和display:block同时出现，那display:block就是多余的CSS代码。


## 高度欺骗
上例中给图片外层的div加上absolute，因此高度欺骗未能很好的体现出来，将absolute移到内部图片上，效果就出来了：

![](http://upload-images.jianshu.io/upload_images/1959053-7302eeff8ca71445.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	<div style="border:4px solid blue;">
  		<img src="img/25/1.jpg" />
	</div>
	<div style="border:4px solid red;">
 		<img style="position: absolute;" src="img/25/2.jpg" />
	</div>


如果你看过CSS浮动float详解会发现效果是一样的。但其背后的原理其实是有区别的，并不完全相同。加点文字就看出来了：

![](http://upload-images.jianshu.io/upload_images/1959053-08b7a209c48de873.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


	<div style="border:4px solid blue;">
  		<img src="img/25/1.jpg" />
	</div>
	<div style="border:4px solid red;">
  		<img style="position: absolute;" src="img/25/2.jpg" />
  		我是一个绝对定位的absolute元素
	</div>
从图中明显看出文字被图片遮盖了，这点和float不同。float是欺骗父元素，让其父元素误以为其高度塌陷了，但float元素本身仍处于文档流中，文字会环绕着float元素，不会被遮蔽。

但absolute其实已经不能算是欺骗父元素了，而是**出现了层级关系**。如果处于正常的文档流中的父元素算是凡人的话，那absolute已经得道成仙，用现在的话说已经不在一个次元上。**从父元素的视点看，设成absolute的图片已经完全消失不见了，因此从最左边开始显示文字。而absolute的层级高，所以图片遮盖了文字。**

## 如何确定定位点

* Case1: 用户只给元素指定了absolute，未指定left/top/right/bottom。此时absolute元素的左上角定位点位置就是**该元素正常文档流里的位置**。如上面图例中，图片熊猫是父元素的第一个孩子，因此左上角定位点就是父元素的content的左上角

如果将图片熊猫和下面的文字顺序改一下，让其成为父元素的第二个孩子，一图胜千言：
![](http://upload-images.jianshu.io/upload_images/1959053-b71f5cac9b0c127a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	<div style="border:4px solid red;">
  		我是一个绝对定位的absolute元素
  		<img style="position: absolute;" src="img/25/2.jpg" />
	</div>

**结论重复一遍：未指定left/top/right/bottom的absolute元素，其在所处层级中的定位点就是正常文档流中该元素的定位点。**

* Case2: 用户给absolute元素指定了left/right，top/bottom

先简单点，让absolute元素没有position:static以外的父元素。此时absolute所处的层是铺满全屏的，即铺满body。会根据用户指定位置的在body上进行定位。

**通过对left/top/right/bottom的组合设置，由于没有position:static以外的父元素，此时absolute元素可以去任意它想去的地方，天空才是它的极限。**


## 与relative相爱相杀

通常我们对relative的认识是：relative主要用于限制absolute

上面已经说了，如果absolute元素没有position:static以外的父元素，那将相对body定位，天空才是它的极限。**而一旦父元素被设为relative，那absolute子元素将相对于其父元素定位**，就好像一只脚上被绑了绳子的鸟。

比如你要实现下图iOS里APP右上角的红色圈圈：
![](http://upload-images.jianshu.io/upload_images/1959053-e67ca5077f4b182a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通常的做法是将APP图片所处的div设成relative，然后红色圈圈设成absolute，再设top/right即可。这样无论用户怎么改变APP图片的位置，红色圈圈永远固定在右上角，例如：

![](http://upload-images.jianshu.io/upload_images/1959053-d15f458bbf4934fa.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

	.tipIcon {
  		background-color: #f00;
  		color: #fff;
  		border-radius:50%;
  		text-align: center;
  		position: absolute;
  		width: 20px;
  		height: 20px;
  		right:-10px;  //负值为自身体积的一半
  		top:-10px;
	}

	<div style="display: inline-block;position:relative;">
  		<img src="img/25/2.jpg" />
  		<span class="tipIcon">6</span>
	</div>
这样做效果是OK的，兼容性也OK。但CSS的世界里要实现一个效果可以有很多种方式，具体选用哪个方案是见仁见智的。**我比较看重的标准：一个是简洁，另一个是尽量让每个属性干其本职工作。**

用这两个标准看待上述实现方法，应该是有改进的空间的。**首先外层div多了relative未能简洁到极致。** **其次relative的本职工作是让元素在相对其正常文档流位置进行偏移，但父层div并不需要任何位置偏移**，之所以设成relative唯一的目的是限制absolute子元素的定位点。因此在我看来这并没有让relative干其本职工作。好比小姐的本职工作是服务业，顺便陪客户聊聊天，但纯聊天聊完一个钟，恐怕会被投诉。

那怎么改进呢？答案在上面探讨absolute定位点时已经说了：未指定left/top/right/bottom的absolute元素，其在所处层级中的定位点就是正常文档流中该元素的定位点。因此改进如下：

	.tipIcon2 {
      background-color: #f00;
      color: #fff;
      border-radius:50%;
      text-align: center;
      position: absolute;
      width: 20px;
      height: 20px;
      margin:-10px 0 0 -10px;   //不需要top和right了，改用margin来进行偏移
    }

    <div style="display: inline-block;">  //父元素不需要relative了
      <img src="img/25/2.jpg" /><!--
     --><span class="tipIcon2">6</span> 
    </div>
    //img和soan间的HTML注释的目的是消除换行符，你也可以将span紧跟在img后面写到一行里

更深入一点看，多一个属性意味着多一层维护。如果用父relative + 子absolute来实现定位，万一将来页面布局要调整，父元素的尺寸需要变换呢？

![](http://upload-images.jianshu.io/upload_images/1959053-cf38208d2939eeef.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


	<div style="display: inline-block; position:relative;width: 200px;">
      <img src="img/25/2.jpg" />
      <span class="tipIcon">6</span>
    </div>


上面仅仅由于父元素的width做了些改变，导致右上角absolute图标错位了。由于absolute和relative耦合在了一起，父元素有点风吹草动（如尺寸变化，或干脆需要去掉relative），子元素需要重新寻找定位点。苦逼的前端仔拿着微薄的工资在那里加班加点，那是大大地不划算。但如果用上例中absolute自身的定位特性，无论父元素怎么折腾，红色的圈圈都牢牢黏在图片的右上角。


这么说来relative和absolute是否应该彻底断绝关系呢？不是这样的，这段的标题是“和relative相爱相杀”，刚才说的想杀部分，现在说下什么相爱部分。

用absolute常见的一个案例是透明层覆盖元素。要实现对全屏加一层滤镜怎么办？很容易：

![](http://upload-images.jianshu.io/upload_images/1959053-e3e176326bfcb447.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


	.cover {
        position: absolute;
        left: 0;right: 0;top: 0;bottom: 0;
        background-color: #fff;
        opacity: .5;filter: alpha(opacity=50);
    }

    <div style="display: inline-block;">
      <img src="img/25/2.jpg" /><!--
      --><span class="tipIcon2">6</span>
    </div>
    现在是全屏滤镜时间
    <span class="cover"></span>

CSS里有个细节值得关注：用absolute的left: 0;right: 0;top: 0;bottom: 0;来实现全屏拉伸，对于absolute元素来说，如果同时设置left和right会水平拉伸，同时设置top和bottom会垂直拉伸。那为何不设width/height为100%呢？代码都贴给你了，可以自己试试。算了告诉你答案吧，前面说了，不设top/right/top/bottom的话absolute会从正常文档流应处的位置开始定位，因此做不到全屏。除非你设置width/height为100%后，同时再设left: 0; top: 0;。这样就显得很啰嗦。

那我不想全屏滤镜，只希望给图片部分设置滤镜呢？用js计算图片的大小尺寸和定位点后，设置absolute滤镜的尺寸和定位点？太麻烦了。用relative吧

![](http://upload-images.jianshu.io/upload_images/1959053-3047c6a5bb0e3491.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


	<span class="cover"></span> //CSS部分不变
    <div style="display: inline-block;position: relative;">
        <span class="cover"></span>
        <img src="img/25/2.jpg" />
        <!--
  --><span class="tipIcon2">6</span>
    </div>

结论：

1.相对定位时，不必拘泥于relative+absolute，试试就去掉relative，充分利用absolute自身定位的特性，将relative和absolute解耦。耦合度越低维护起来越容易，前端仔腾出时间陪女朋友吃饭才是正道。

2.拉伸平铺时，用relative可以有效限制子absolute元素的拉伸平铺范围（注意是拉伸，不是缩小。要缩小请再加上width/height:100%;）

## 和z-index的关系

z-index被太多的滥用了。几乎成了个定势思维：只要设了absolute就需要同步设置z-index。其实不是这样的。上面所有例子都没有用到z-index，同样正常分层正常覆盖。

以下情况根本不需要设z-index：

* 让absolute元素覆盖正常文档流内元素（不用设z-index，自然覆盖）
* 让后一个absolute元素覆盖前一个absolute元素（不用设z-index，只要在HTML端正确设置元素顺序即可）


那什么时候需要设置z-index呢？当absolute元素覆盖另一个absolute元素，且HTML端不方便调整DOM的先后顺序时，需要设置z-index: 1。非常少见的情况下多个absolute交错覆盖，或者需要显示最高层次的模态对话框时，可以设置z-index > 1。

比较好的是京东，查看首页源码，设置z-index的地方也只设了1,2,3。少数地方设了11,12,13。我更倾向于理解为是一种内部潜规则，表明更高层级的一种需要。

**如果你的页面不比京东更复杂，那z-index通常设成1,2,3足够了。**

## 减少重绘和回流的开销

例如将元素隐藏，你或许会用display:none。

（这里插一句题外话，用display:none隐藏容易显示难，如果你用的是JQuery等插件，你或许会疑惑，直接用show/hide API不就行了，难在哪里？其中一个难点就是保存隐藏前元素的display属性值。例如A隐藏前display:block，B隐藏前display:inline，A和B都改成none隐藏后，要显示出来时，你必须事先保存元素的display属性值，否则做不到显示后display仍旧是原先的值。而这些工作JQuery插件都替你做好了，才让你产生了隐藏显示很容易的错觉。）

**其实我更推荐的是absolute控制隐藏和显示。方法当然相当简单，如absolute+ top:-9999em，或absolute + visibility:hidden。**

优点是absolute由于层级的关系，隐藏和显示只会重绘，但不会回流（其实我对absolute不会导致回流这一观点是持怀疑态度的，说不会回流显得过于武断，应该是**absolute的回流开销小于正常DOM流中回流的开销**。但我战斗力不够，尚未找到靠谱合理的检测回流的方法）。而**用display:none会导致render tree重绘和回流**。

另外，考虑到重绘和回流的开销，可以将动画效果放到absolute元素中，避免浏览器将render tree回流。



## 转载自：

链接：http://www.jianshu.com/p/a3da5e27d22b

來源：简书

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
