---
title: react之生命周期
date: 2017-07-23 16:36:31
tags:
categories:
---
## 1\. mounting
* constructor()
* componentWillMount()
* render()
* componentDidMount()


#### constructor(props)

在mount之前，会调用它；

初始化state的位置；

也可以使用props来初始化state，但要注意当props更新时，state不会更新。那么除了同步props到state，还可以使用state提升。


#### componentWillMount()
当要mount的时候立即调用，它的调用发生在render()之前，所以这里设置state不会触发重新render。

这是唯一一个当服务器渲染时被调用的生命周期钩子，通常我们建议使用constructor()。

#### render()
被调用时，检查this.props，this.state，然后返回单个React元素，这个返回的React元素可以表示DOM节点，比如<div/>,也可以表示自定义的组件, 比如<My-own/>。

也可以返回null或者false，表明我们不想渲染，此时ReactDOM.findDOMNode(this)将返回null。

render()函数应该是纯函数，意味着不能修改组件的状态，它返回的是被调用时的结果，并且不能直接和浏览器交互。 如果需要和浏览器交互，需要在componentDidMount()或者其他生命周期中执行。如果shouldComponentUpdate()返回false，那么render将不执行。


#### componentDidMount()
当组件挂载之后被调用，需要得到DOM节点的操作应该在这里执行。 

如果想从远程加载数据，也应在这里执行网络请求。

这里设置state，会触发重新渲染。

## 2\. updating
* componentWillReceiveProps()
* shouldComponentUpdate()
* componentWillUpdate()
* render()
* componentDidUpdate()

#### componentWillReceiveProps(nextProps)
已经挂载的组件接收新的props之前会调用。

如果需要根据props的变化来更新状态，应该比较this.props和nextProps，并且在这里使用this.setState()执行状态转换。

即使props没有更新，这个方法也可能被调用，所以如果我们想处理变化，一定要比较当前props和下一个props。（当父组件造成子组件重新渲染时会遇到这种情况。）

在mounting期间，react不会用初始的props来调用这个方法。只有在一些组件的props可能更新的时候，才会调用这个方法。

执行this.setState不会触发这个事件。

#### shouldComponentUpdate(nextProps, nextState)
这个方法能够让react知道组件的输出是否因state或props的改变而受影响。默认就是当state一变化，就会重新渲染，大部分情况下我们使用默认的。

在rendering之前，当收到新的props或者state时，就会调用这个方法。当初始化渲染时，或者当使用forceUpdate()时，该方法不被调用。

返回false不能阻止子组件随他们的state重新渲染。如果返回false，那么componentWillUpdate(), render(), componentDidUpdate()不会被调用。

如果你发现一个组件在表示后很慢（？？？？），可以考虑变成继承式的，从React.PureComponent继承，这意味着该方法此时是shallow prop and state comparision。

如果你想自己手写，那就可以比较this.props和nextprops，以及this.state和nextState,并返回false告诉react这个更新可以跳过。

#### componentWillUpdate(nextProps, nextState)
在收到新的props或者state后，rendering之前，调用该方法。

在这里可以做一些准备工作，来为更新做准备。

这个方法在初始渲染的时候不会被调用。

这里不能设置this.setState()，如果想根据props来更新state，应该在componentWillReceiveProps(nextProps)执行。

#### componentDidUpdate
当更新时被调用。

初始渲染的时候不被调用。

当组件更新后，应该在这里操作DOM。

网络请求适合放在这里，只要你比较了当前props和前一个props（当props没变化的时候，进行网络请求可能没有必要）。

## 3\. unmounting
* componentWillUnmount()

#### componentWillUnmount()
当卸载一个组件时或者销毁一个组件时，会执行。

可以在这里做一些清除工作，比如清除定时器，取消网络请求，清除在ComponentDidMount中创建的DOM元素。


## 4\. 其他API
* setState()
* forceUpdate()

#### setState(updater, [callback])

认为setState是一个请求，而不是一个立即执行命令，会更好。因为为了更好的性能，react会延时它，并且在一个pass里同时更新好几个组件。所以react不能保证state的变化能立即生效。

setState()通常不立即更新组件。所以在componentDidUpdate或者setState的回调函数中去读取this.state，才能保证读取到的值最新的。

第一个参数是一个updater函数，
	
	(prevState, props) => stateChange

prevState是前一个状态，它不应该直接被改变，相反，应该基于prevState和props建造一个新对象，从而展示变化。

比如，假设我们想增加一个值，

	this.setState((prevState, props) => {
  		return {counter: prevState.counter + props.step};
	});
由updater函数接收的prevState和props是最新的。输出的updater将和prevState进行shallowly merged。

第二个参数是一个可选的回调函数，等setState完成并组建被重新渲染后才会执行。但是我们一般建议使用componentDidUpdate()来代替这个逻辑。

#### forceUpdate(callback)
component.forceUpdate(callback)

一般只有当state或者props变化时，组件才会重新渲染。但是如果我们想根据其他数据来渲染组件，就可以调用forceUpdate(),从而跳过shouldComponentUpdate()。这会触发子组件正常的生命周期，包括子组件的shouldComponentUpdate()方法。

一般要避免使用。


## 5\. Class properties
* defaultProps
* displayName

#### defaultProps
设置默认属性，即当一个props是undefined时，才有用。如果是null，则不会采取默认值，还是null。

举个例子：

	class CustomButton extends React.Component {
  		// ...
	}

	CustomButton.defaultProps = {
  		color: 'blue'
	};

如果props.color没有提供，则默认就是blue：

	render() {
    	return <CustomButton /> ; // props.color will be set to blue
  	}
如果props.color设置为null，则还是null：

	render() {
    	return <CustomButton color={null} /> ; // props.color will remain null
  	}


#### displayName
用于debugging信息。JSX会自动设置这个值。



## 6\. instance properties
* props
* state

#### props
this.props包含这个组件的调用者定义的props。

this.props.children是一个特殊的prop，通常是由子标签在JSX表达式中定义的，而不是在它自己的标签中。

#### state
不要直接修改this.state。

把它当做不可改变的。



















