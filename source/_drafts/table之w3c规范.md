---
title: table之w3c规范
date: 2019-12-16 11:45:02
tags:
---
```html
<html>
  <style>
    table {
      /*table-layout: fixed;*/
      width: 1300px;
      /*margin-left: 20px;
      margin-right: 20px;*/
      /*border: 1px solid #ccc;*/
      border-collapse: collapse;
      height: 10px;
    }

    th, td {
    	/*border: 1px solid #ccc;*/
    }
  </style>

  <body>
  	<table>
  			<!-- <col style="width: 100px" />
  			<col style="width: 200px" />
  			<col style="width: 100px" />
  			<col style="width: 100px" />
  			<col style="width: 100px" /> -->
	      <thead>
	        <tr>
	          <th>序号</th>
	          <th>姓名</th>
	          <th>年龄</th>
	          <th>性别</th>
	          <th>星座</th>
	        </tr>
	      </thead>
	      <tbody>
	        <tr>
	          <td>1</td>
	          <td>张三</td>
	          <td>1</td>
	          <td>女</td>
	          <td>处女座</td>
	          <!-- <td>金牛座</td> -->
	        </tr>
	        <tr>
	          <td>2张三</td>
	          <td>张三</td>
	          <td>1</td>
	          <td>女</td>
	          <td>处女座</td>
	        </tr>
	        <tr>
	          <td colspan="2">1</td>
	          <td>张三</td>
	          <td>1</td>
	          <td>女</td>
	          <!-- <td>处女座</td> -->
	        </tr>
	      </tbody>
	    </table>
  </body>
  <script type="text/javascript">
  	// 当且仅当table-layout设置为fixed，且设置非auto的width，才会遵循fixed table layout。
  	// 如果table-layout设置为fixed，但没有设置非auto的width，就会遵循automatic table layout。
  	// 如果没有设置table-layout，则会遵循automatic table layout，无论是否设置了width。
  	/*
  		fixed table layout：
			每个column的宽度取决于：
			1. 如果只有部分column设置了不为auto的width，或者第一行cell的width不为auto（注意是第一行！第一行！！第一行！！！），则这些column的width等于设置的width。如果这些设置了width的column的总宽度小于table的width，则剩下的column的宽度等于剩余空间的等分；否则，整个table的宽度等于这些column的总宽度，且剩下的column宽度将为0，其展示与否取决于table的overflow属性。
			4. 如果每个column都没有设置width，则所有column平分table的width。
			5. 如果所有column都设置了width，且width总和小于等于table的width，则所有column的width按照所设置的width的比例分table的width。
			6. 如果所有column都设置了width，且width总和大于table的width，则table的width等于这些column的宽度总和。
			7. 如果非第一行的列数多于第一行的，则多出来的column可能不会被渲染，但如果渲染的话，CSS2.1并没有定义这些column的宽度及table的宽度，即取决于各个UA的实现。但无论如何，第一行的column都不会被忽略。
			8. 所以，当UA一旦得到第一行的信息，就可以渲染table了。接下来的cells并不会影响column widths。（此处有疑问：谷歌浏览器里，如果其他行的column数多于第一行，则第一行的未设置width的column宽度将会受到影响。）
  	*/
  	/*
			automatic table layout(没有强制UA按照这个规则实现，以下讲的是常见UA的实现):
			1. 先计算每个cell的最小宽度、最大宽度
				1.1 最小宽度等于所设置width与换行后所占宽度(MCW)的最大值。
				1.2 最大宽度等于不换行所占的宽度。
			2. 每个column的最小宽度等于其所有cell最大的最小宽度，最大宽度等于所有cell最大的最大宽度
			3. 再计算caption的最小宽度
			4. 如果table设置了width，则table的宽度是width、所有column最小宽度和、caption最小宽度的最大值。
				4.1 如果该最大值大于所有column最小宽度和
					a. 如果有column设置了宽度，则多出的部分按比例分到没有设置width的column上。
					b. 如果column都没有设置宽度，则多出的部分按比例分到所有column上。
					c. 如果所有column都设置了宽度，则多出的部分按比例分到所有column上。
			5. 如果table的width是auto，则table宽度是table的containing block的宽度、CAPMIN、所有column最小宽度和的最大值。但是如果CAPMIN、或者所有column最大值之和小于containing block，则取CAPMIN、所有column最大值之和的最大值。

			特殊：第4步，谷歌浏览器实现方式是：
			如果table设置了width，且width大于所有column最小宽度和，则table最终渲染为所设置的width，每个column宽度按照4.1执行；
			如果table设置的width小于所有column最小宽度和，但大于所有MCW之和，则没有设置宽度的column变为MCW，剩下的每个column按比例缩小；
			如果table设置的width小于所有MCW之和，则所有column变为MCW。
  	*/
  </script>
</html>
```
