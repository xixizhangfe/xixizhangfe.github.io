---
title: react笔记
date: 2017-07-22 09:56:23
tags:
categories:
---
## 1、初识react
**angular缺点**：作为MVVM框架过重，不适用与移动端开发；UI封装比较复杂，难以重用。

**React**：

1、不是一个完整的MVC,MVVM框架，重点在于view层

2、react与web components不冲突

3、react比angular“轻”

4、机制：virtual DOM，单向数据绑定

5、组件化的开发思路：高度可重用

**应用场景**

1、复杂场景下的高性能

2、重用组件库，组件组合

3、“懒”

## 2、JSX语法（JS XML）
语法糖：对语言功能没有影响，更方便程序员使用，可读性更好

	const element = <h1>hello, world.</h1>;
	
这就是JSX，既不是一个字符串，也不是HTML。

* JSX更像JS，而不是XML。

* JSX产生react元素（参见最后一条）

* JSX可以嵌入表达式


```
	const element = (
		<h1>
    		Hello, {formatName(user)}!
  		</h1>
	)
```

* JSX也是一种表达式

```
	function getGreeting(user) {
  		if (user) {
    		return <h1>Hello, {formatName(user)}!</h1>;
  		}
  		return <h1>Hello, Stranger.</h1>;
	}
```
* JSX里可以指定属性

```
	const element = <div tabIndex="0"></div> 
```

```
	const element = <img src={user.avatarUrl}></img>
```

`注意`： 在属性中使用表达式时，花括号两边不能加引号

* JSX标签元素也可以包含子元素
* JSX可以阻止XSS攻击

```
	const title = response.potentialMaliciousInput;
	// this is safe
	const element = <h1>{title}</h1>
```
默认情况下，react DOM在渲染元素之前，可以escape任何嵌入在JSX中的值，这样你就无法注入任何没有在程序里明确写出来的的东西。在被渲染前，所有的东西都被转换成字符串，这就阻止了XSS攻击。

* JSX代表Objects

babel会将JSX编译成React.createElement()调用。下面两种写法是等价的：

```
	const element = (
  		<h1 className="greeting">
    		Hello, world!
  		</h1>
	);
```

```
	const element = React.createElement(
  		'h1',
  		{className: 'greeting'},
  		'Hello, world!'
	);
```

React.createElement()会帮助我们做一些检查，得到bug-free的代码，它本质上创建的对象如下：

	// 注意，这只是一个简化的结构
	const element = {
  		type: 'h1',
  		props: {
    		className: 'greeting',
    		children: 'Hello, world'
  		}
	};

这些对象叫做"React elements"。**其实就是屏幕上显示的内容的一种语言描述**。

React读取这些对象，并用他们去构建DOM树，并且保持实时更新。


## 3、如何更新渲染的元素
React element是不可改变的，一旦创建好一个element，就无法改变它的children和attribute。**一个element就像电影里的一帧：代表某个时间点的UI**。

* 更新UI的唯一方式就是创建一个新的element，并且传入ReactDOM.render().
钟表例子：
	
		function tick() {
        	const element = (
        		<div>
          			<h1>Hello, world!</h1>
          			<h2>It is {new Date().toLocaleTimeString()}.</h2>
        		</div>
      		);
        	ReactDOM.render(
          		element,
          		document.getElementById('root')
        	);
        }

        setInterval(tick, 1000);

**注意**：react应用一般只调用ReactDOM一次，以后将介绍这样的代码是如何被封装到stateful components.

### 3.1 只在必要的时候调用ReactDOM
React DOM将某个元素及其子元素与原来做比较，只在必要的时候更新DOM。
就拿上面的例子来说，打开控制台查看元素，发现其实只有时间那部分在更新，其他都没有更新。

这大概就是React内部机制之一吧~~


## 4、Components和Props
组件将UI分成独立的、可复用的块，每个组件相当于一个函数，可以接受任意输入（叫做Props），并返回能够描述屏幕内容的React Elements。

### 4\.1 functional and class components
* 函数式组件：定义组件最简单的方式就是写一个JS函数
	
	```
		function Welcome(props) {
			return <h1>hello, {props.name}</h1>
		}
	```
	
* class组件：也可以使用class定义组件

	```
		class Welcome extends React.component {
			render() {
				return <h1>hello, {this.props.name}</h1>;
			}
		}
	```
**使用class定义的组件具有一些额外的特点。**
	
### 4\.2 渲染组件
react elements出来可以表示DOM 标签，还可以表示用户自定义的组件。
	
	const element = <div />;
	
	const element = <Welcome name="sara" />
	
第二行中，Welcome是一个用户自定义组件，name="sara"是属性，它会作为props传递给组件。

	function Welcome(props) {
  		return <h1>Hello, {props.name}</h1>;
	}

	const element = <Welcome name="Sara" />;
	ReactDOM.render(
  		element,
  		document.getElementById('root')
	);
以上代码会在页面上渲染出 "Hello, Sara"。

**警告**： 组件名必须是大写字母开头！！！	


### 4\.3 组件组合
一个组件里可以引用其他组件。

	function Welcome(props) {
      return <h1>hello, {props.name}</h1>;
    }

    function App() {
      return (
        <div>
          <Welcome name="sara" />
          <Welcome name="ming" />
          <Welcome name="li" />
        </div>
      )
    }

    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );

### 4\.4 组件抽象
我们先写一个例子

	function Comment(props) {
      return (
        <div className="Comment">
          <div className="UserInfo">
            <img className="Avatar" src={props.author.avatarUrl} alt={props.author.name}/>
            <div className="UserInfo-name">
              {props.author.name}
            </div>
        </div>
          <div className="Comment-text">
            {props.text}
          </div>
          <div className="Comment-date">
            {formateDate(props.date)}
          </div>
        </div>
      )
    }

    function formateDate(props) {
      return props.toLocaleDateString();
    }
    
    const comment = {
      date: new Date(),
      text: 'I hope you enjoy learning React!',
      author: {
        name: 'Hello Kitty',
        avatarUrl: 'http://placekitten.com/g/64/64'
      }
    };
    const element = (
      Comment(comment)
    );

    ReactDOM.render(
      element,
      document.getElementById('root')
    );

上述例子没有将一些功能模块抽取成组件，下面我们抽象成组件：

	
	function Comment(props) {
      return (
        <div className="Comment">
          <UserInfo user={props.author} />
          <div className="Comment-text">
            {props.text}
          </div>
          <div className="Comment-date">
            {formateDate(props.date)}
          </div>
        </div>
      )
    }

    function formateDate(props) {
      return props.toLocaleDateString();
    }

    function UserInfo(props) {
      return (
        <div className="UserInfo">
          <Avatar user={props.user} />
          <div className="UserInfo-name">
            {props.user.name}
          </div>
        </div>
      )
    }
    function Avatar(props) {
      return (
        <img className="Avatar" src={props.user.avatarUrl} alt={props.user.name} />
      );

    }
    
    const comment = {
      date: new Date(),
      text: 'I hope you enjoy learning React!',
      author: {
        name: 'Hello Kitty',
        avatarUrl: 'http://placekitten.com/g/64/64'
      }
    };
    const element = (
      Comment(comment)
    );

    ReactDOM.render(
      element,
      document.getElementById('root')
    );


### 4\.5 props是只读的
不要尝试修改props！！！


## 5、状态和生命周期
在第3部分，我们说了一个钟表的例子，现在我们利用上面讲的组件抽象，可以抽象成这个样子：
	
	function tick() {
        ReactDOM.render(
          <Clock date={new Date()} />,
          document.getElementById('root')
        );
      }
      
      function Clock(props) {
        return (
          <div>
            <h1>Hello, world!</h1>
            <h2>It is {props.date.toLocaleTimeString()}.</h2>
          </div>
        )
      }

      setInterval(tick, 1000);
但是这样写之后，Clock并不能控制date，所以我们想把它封装成这个样子：

	ReactDOM.render(
  		<Clock />,
  		document.getElementById('root')
	);
这样我们就需要引入了state。

state与props类似， 但是state是组件私有的，并且完全由组件自己控制。

第4部分，我们说过，使用class定义的组件具有一些额外的特点，那么局部state就是它的一个特点，只对class可用的特点。

那么如何将一个函数组件转化成class组件呢？
### 5\.1 将函数转化成class
可遵循以下步骤：
* 新建一个class扩展React.Component，名字与原函数名字相同
* 添加一个空方法render() {}
* 把函数的主体放到render方法里
* 把props替换成this.props
* 删除原来的空函数

	function tick() {
        ReactDOM.render(
          <Clock date={new Date()} />,
          document.getElementById('root')
        );
      }
      class Clock extends React.Component {
        render() {
          return (
            <div>
              <h1>Hello, world!</h1>
              <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
            </div>
          )
        }
      }

      setInterval(tick, 1000);
这样Clock是一个class，而不是函数。

这就能让我们使用额外的特点，比如局部状态和生命周期钩子。

### 5\.2 给class添加局部状态
* 把this.props.date替换成this.state.date
* 给class添加一个class constructor，并给this.state一个初始值。
* 传递props给base constructor （class组件应当都调用base constructor）
* 从`<Clock />`元素中去除`date` prop

结果如下：
	
	function tick() {
        ReactDOM.render(
          <Clock />,
          document.getElementById('root')
        );
      }
      class Clock extends React.Component {
        constructor(props) {
          super(props);
          this.state = {date: new Date()};
        }
        
        render() {
          return (
            <div>
              <h1>Hello, world!</h1>
              <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
          )
        }
      }

      setInterval(tick, 1000);

当然，经过上述修改后的只是一个静态时钟，时间不会变。

接下来我们给Clock设置自己的定时器。

### 5\.3 给class添加生命周期
当组件被销毁时，他们占用的资源应该被释放。

当Clock第一次被渲染到DOM中时，我们想**设置**一个定时器，这就是'mounting'。

当Clock对应的DOM被移除时，我们想*清除*这个定时器，这就是'unmounting'。

	class Clock extends React.Component {
        constructor(props) {
          super(props);
          this.state = {date: new Date()};
        }

        componentDidMount() {
          this.timerId = setInterval(() => this.tick(), 1000);
        }
        
        componentWillUnmount() {
          clearInterval(this.timerId);
        }

        tick() {
          this.setState({date: new Date()});
        }
        render() {
          return (
            <div>
              <h1>Hello, world!</h1>
              <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
          )
        }
      }

      ReactDOM.render(
          <Clock />,
          document.getElementById('root')
        );
此时，时钟可以正常走了。

下面我们分析一下整个工作过程：

（1）当<Clock />被传递给ReactDOM.render()，react调用Clock组件的constructor，然后初始化当前的状态，this.state。

（2）然后react调用Clock组件的render()方法，这时react就知道了该显示什么到屏幕上，react就会更新DOM去匹配Clock的render输出。

（3）当Clock输入插入DOM中时，react调用componentDidMount()生命周期钩子，在这里面，Clock组件让浏览器设置一个定时器去调用tick()函数。

（4）每隔一秒，浏览器调用tick()方法，在这里面，Clock组件通过setState去调度UI的更新。由于setState()，react知道state已经变化了，它就会再次调用render()方法去看看应该如何展示在屏幕上。这时候，render()中的this.state.date变了，react也相应的去更新DOM。

(5)如果组件从DOM中永久移除了，react调用componentWillUnmount()生命周期钩子，去清除定时器。

### 5\.4 正确使用state
#### 5\.4\.1 不要直接修改state
错误示范：
	
	// wrong
	this.state.comment = 'hello';
	
正确示范,使用setState():

	// correct
	this.setState({comment: 'hello'});
	
只有在constructor里才能使用`this.state`

#### 5\.4\.2 state的更新可能是异步的
为了性能，react可能会将多个setState()调用放到同一批更新里。

因此this.props和this.state可能更新的不同步，不应该依赖他们的值来计算下一个状态。

比如：下面这个代码就很可能无法更新counter。
	
	// Wrong
	this.setState({
  		counter: this.state.counter + this.props.increment,
	});

我们应该使用setState的第二种方式，即接收一个函数而不是一个对象，这个函数接受两个参数，原先的状态作为第一个参数，实施更新时的props作为第二个参数。

	// Correct
	this.setState((prevState, props) => ({
  		counter: prevState.counter + props.increment
	}));


#### 5\.4\.3 state的更新被合并了
当调用setState()时，react将你提供的对象合并到当前state。

比如，你的state可能包含几个独立的变量：

	constructor(props) {
    	super(props);
    	this.state = {
      		posts: [],
      		comments: []
    	};
  	}
	
然后你用不同的setState()更新他们：

	componentDidMount() {
        fetchPosts().then(response => {
          this.setState({
            posts: response.posts
          });
        });

        fetchComments().then(response => {
          this.setState({
            comments: response.comments
          });
        });
      }

由于合并，this.setState({comments})不影响this.state.posts，但是将完整的替换this.state.comments。


### 5\.5 数据向下流动
也就是说组件不会知道他的props里的数据来自哪里。

这就是“自顶向下”或者“单一”数据流。

由指定组件拥有的任何state，以及被这个state驱动的任何data和UI只能影响其下面的元素。



无论这个组件是有状态的还是无状态的，都被视为这个组件的细节，也都是可能随时间变化的，可以在有状态组件里使用无状态组件，反之亦然。



## 6\. 处理事件
处理react元素的事件与处理DOM元素的事件类似，有以下几点区别：
* react事件使用camelCase命名，而不是全小写
* 事件处理器是一个函数，而不是一个字符串

举个例子：
	
	// HTML
	<button onclick="activateLaser()">
		Activate Lasers
	</button>
	
	// React
	<button onClick={activateLaser}>
		Activate Lasers
	</button>
	
* 不能直接返回`false`阻止默认事件，必须调用`preventDefault`。

举个例子：

	// HTML
	<a href="#" onclick="console.log('the link was clicked.'); return false">
		Click me
	</a>
	
	// React
	function ActionLink() {
		function handleClick(e) {
			console.log('the link was clicked.');
			e.preventDefaul();
		}
		return (
			<a href="#" onClick={handleClick}>
				Click me
			</a>
		);
	}

* react中一般不需要调用addEventListener来对DOM元素添加监听。

举个例子：

	class Toggle extends React.Component {
        constructor(props) {
          super(props);
          this.state = {isToggleOn: true};
           // This binding is necessary to make `this` work in the callback
          this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
          this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
          }));
        }
        render() {
          return (
            <button onClick={this.handleClick}>
              {this.state.isToggleOn?'ON':'OFF'}
            </button>
          )
        }
      }

      ReactDOM.render(
          <Toggle />,
          document.getElementById('root')
        );


这里要注意this的绑定，如果我们不在constructor里绑定this给handleClick，那么在调用handleClick时this将会是undefined。这里还有两种写法，

第二种，属性初始化语法

	// 采用属性初始化语法
	// 方式二
        handleClick = ()=>{
          this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
          }));
        }
	
第三种，使用箭头函数
	
	render() {
          return (
            <button onClick={(e) => this.handleClick(e)}>
              {this.state.isToggleOn?'ON':'OFF'}
            </button>
          )
        }
	

**第三种方式不推荐。**因为每次button渲染时都会创建一个新回调函数，当我们把这个回调函数传递给子组件时，子组件会重复渲染。



## 7\. 条件渲染
如果我们有两个组件，需要根据条件渲染其中一个，这时候就可以用if来实现：

比如我们有这么两个组件：

	function UserGreeting(props) {
  		return <h1>Welcome back!</h1>;
	}

	function GuestGreeting(props) {
  		return <h1>Please sign up.</h1>;
	}

为了实现这两个组件只渲染其中一个，我们创建一个Greeting元素，根据是否登录展示其中一个组件：

	function UserGreeting() {
        return <h1>Welcom back!</h1>
      }
      
      function GuestGreeting() {
        return <h1>Please sign up</h1>
      }

      function Greeting(props) {
        const isLoggedIn = props.isLoggedIn;
        if(props.isLoggedIn) {
          return <UserGreeting />;
        }
        return <GuestGreeting />;
      }

      ReactDOM.render(
          <Greeting isLoggedIn={true} />,
          document.getElementById('root')
        );


### 7\.1 元素变量
我们可以使用变量存储元素。

比如这里我们有两个按钮，表示登录退出：
	
	function LoginButton (props) {
        return (
          <button onClick={props.onClick}>
            Login
          </button>
        )
      }

      function LogoutButton (props) {
        return (
          <button onClick={props.onClick}>
            Logout
          </button>
        )
      }

我们将创建一个状态组件`LoginControl`.

	class LoginControl extends React.Component {
        constructor (props) {
          super(props);
          this.state={
            isLoggedIn: false
          };
          this.handleLogoutClick = this.handleLogoutClick.bind(this);
          this.handleLoginClick = this.handleLoginClick.bind(this);
        }

        handleLogoutClick() {
          this.setState({isLoggedIn: false})
        }
        
        handleLoginClick() {
          this.setState({isLoggedIn: true})
        }

        render() {
          const isLoggedIn = this.state.isLoggedIn;
          let button = null;
          if(isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick}/>;
          } else {
            button = <LoginButton onClick={this.handleLoginClick}/>;
          }

          return (
            <div>
              <Greeting isLoggedIn={isLoggedIn}/>
              {button}
            </div>
          );
        }
      }
      
      function UserGreeting(props) {
        return <h1>Welcome back!</h1>;
      }

      function GuestGreeting(props) {
        return <h1>Please sign up.</h1>;
      }

      function Greeting(props) {
        const isLoggedIn = props.isLoggedIn;
        if (isLoggedIn) {
          return <UserGreeting />;
        }
        return <GuestGreeting />;
      }

      function LoginButton (props) {
        return (
          <button onClick={props.onClick}>
            Login
          </button>
        )
      }

      function LogoutButton (props) {
        return (
          <button onClick={props.onClick}>
            Logout
          </button>
        )
      }

      ReactDOM.render(
          <LoginControl />,
          document.getElementById('root')
        );

当我们使用一个变量，并使用`if`语句，是一个比较好的方式来渲染一个组件。但有时候，你想去使用一个更短的语法，这里有几种方式：

### 7\.2 inline if with logical && operator
通过{}，我们可以嵌入任何表达式到JSX，当然也包括JS逻辑运算符&&，这对于条件渲染时很方便的,
true && expression将取决于expression，

false && expression将取决于false。

	function Mailbox(props) {
      const unreadMessages = props.unreadMessages;
      return (
        <div>
          <h1>Hello!</h1>
          {unreadMessages.length > 0 &&
            <h2>
              You have {unreadMessages.length} unread messages.
            </h2>
          }
        </div>
      );
    }

    const messages = ['React', 'Re: React', 'Re:Re: React'];
    ReactDOM.render(
      <Mailbox unreadMessages={messages} />,
      document.getElementById('root')
    );

### 7\.3 inline if-else with Conditional Operator

就是三目运算符：condition ? true: false

	render() {
      const isLoggedIn = this.state.isLoggedIn;
      return (
        <div>
          The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
        </div>
      );
    }


### 7\.4 阻止元素渲染
在极少数情况下，我们希望组件能够隐藏自己，即使它是由另一个组件渲染的，要实现这点，只需要在它的render函数里return null即可。

	function WarningBanner(props) {
      if (!props.warn) {
        return null;
      }

      return (
        <div className="warning">
          Warning!
        </div>
      );
    }

    class Page extends React.Component {
      constructor(props) {
        super(props);
        this.state = {showWarning: true}
        this.handleToggleClick = this.handleToggleClick.bind(this);
      }

      handleToggleClick() {
        this.setState(prevState => ({
          showWarning: !prevState.showWarning
        }));
      }

      render() {
        return (
          <div>
            <WarningBanner warn={this.state.showWarning} />
            <button onClick={this.handleToggleClick}>
              {this.state.showWarning ? 'Hide' : 'Show'}
            </button>
          </div>
        );
      }
    }

    ReactDOM.render(
      <Page />,
      document.getElementById('root')
    );


## 8\. lists和keys
### 8\.1 渲染多个组件
使用map()函数：

	  const number = [1,2,3];
      const listItems = number.map((number) => {
        return <li>{number}</li>
      });

      ReactDOM.render(
          <ul>{listItems}</ul>,
          document.getElementById('root')
        );


### 8\.2 基本的list组件
通常我们会在一个组件内部渲染列表：

上面的例子可以改为：

	function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) => 
          <li>{number}</li>
        );
        return (
          <ul>{listItems}</ul>
        );
      }
      
      const numbers = [1,2,3];
      ReactDOM.render(
          <NumberList numbers={numbers} />,
          document.getElementById('root')
        );

当我们运行这段代码时，发现会有警告，应该给list 元素提供一个key 的属性。“key”是一个特殊的字符串属性，当我们创建元素的list时应该包含这个属性（原因在后面），好，下面我们加上这个属性：

	function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
          <li key={number.toString()}>{number}</li>
        );
        return (
          <ul>{listItems}</ul>
        );
      }
      
      const numbers = [1,2,3];
      ReactDOM.render(
          <NumberList numbers={numbers} />,
          document.getElementById('root')
        );

### 8\.3 Keys
key有助于识别哪些项目已经更改、添加或删除。应该给数组中的元素赋予key，使元素具有稳定的标识：

	const numbers = [1, 2, 3, 4, 5];
	const listItems = numbers.map((number) =>
  		<li key={number.toString()}>
    		{number}
  		</li>
	);
	
选择key的最佳方法是使用唯一标识其兄弟之间的列表项的字符串。大多数情况下，将使用数据中的id作为key：

	const todoItems = todos.map((todo) =>
  		<li key={todo.id}>
    		{todo.text}
  		</li>
	);
如果没有稳定的id，那就使用item的index作为最后的解决方案：
	
	const todoItems = todos.map((todo, index) =>
  		// Only do this if items have no stable IDs
  		<li key={index}>
    		{todo.text}
  		</li>
	);

**不建议使用index作为key，如果items能被重排序**


### 8\.4 抽象带key的组件
key只有在数组的上下文里才有意义。

比如，如果想抽象一个ListItem组件，应该让这个key在<ListItem/>元素上，而不是在<li>元素上：

错误的写法：
	
	function ListItem(props) {
      const value = props.value;
      return (
        // Wrong! There is no need to specify the key here:
        <li key={value.toString()}>
          {value}
        </li>
      );
    }

    function NumberList(props) {
      const numbers = props.numbers;
      const listItems = numbers.map((number) =>
        // Wrong! The key should have been specified here:
        <ListItem value={number} />
      );
      return (
        <ul>
          {listItems}
        </ul>
      );
    }

    const numbers = [1, 2, 3, 4, 5];
    ReactDOM.render(
      <NumberList numbers={numbers} />,
      document.getElementById('root')
    );
	

正确的写法：

	function ListItem(props) {
      // Correct! There is no need to specify the key here:
      return <li>{props.value}</li>;
    }

    function NumberList(props) {
      const numbers = props.numbers;
      const listItems = numbers.map((number) =>
        // Correct! Key should be specified inside the array.
        <ListItem key={number.toString()}
                  value={number} />
      );
      return (
        <ul>
          {listItems}
        </ul>
      );
    }

    const numbers = [1, 2, 3, 4, 5];
    ReactDOM.render(
      <NumberList numbers={numbers} />,
      document.getElementById('root')
    );

**总结：在map()调用中的元素都需要key。**

### 8\.5 keys在兄弟之间必须是唯一的
key在他们的兄弟之间必须唯一，全局可以不唯一。

当我们产生两个不同的数组时，可以用相同的key。


key只是作为react的提示，但它不能传递到你的组件里，比如	下面的例子：

	const content = posts.map((post) =>
  		<Post
    		key={post.id}
    		id={post.id}
    		title={post.title} />
	);
上面例子，post组件能读取到props.id,但不能读取到props.key。


### 8\.6 把map()嵌入在JSX里



	function NumberList(props) {
  		const numbers = props.numbers;
  		return (
    		<ul>
      			{numbers.map((number) =>
        			<ListItem key={number.toString()}
                  value={number} />
      			)}
    		</ul>
  		);
	}

采取那种方式取决于代码和自己习惯。


## 9\. 表单













