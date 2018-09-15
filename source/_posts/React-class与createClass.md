---
title: React class与createClass
date: 2017-07-23 08:55:12
tags:
categories:
---
# react创建类之class与createClass区别
以下使用class和createClass两种方式分别写一个组件：

	var InputControlES5 = React.createClass({ 
          propTypes: { 
            initialValue: React.PropTypes.string 
          }, 
          defaultProps: { 
            initialValue: '' 
          }, 
          // 设置 initial state 
          getInitialState: function() { 
            return { 
              text: this.props.initialValue || 'placeholder' 
            }; 
          }, 
          handleChange: function(event) { 
            this.setState({ 
              text: event.target.value 
            }); 
          }, 
          render: function() { 
            return (
              <div> Type something:
                <input onChange={this.handleChange} value={this.state.text} /> 
              </div> 
            ); 
          } 
        }); 


        class InputControlES6 extends React.Component { 
          constructor(props) { 
            super(props); 
            // 设置 initial state 
            this.state = { 
              text: props.initialValue || 'placeholder' 
            }; 
            // ES6 类中函数必须手动绑定 this.
            handleChange = this.handleChange.bind(this); 
          } 

          handleChange(event) { 
            this.setState({ 
              text: event.target.value 
            }); 
          } 

          render() { 
            return (
              <div> Type something:
                <input onChange={this.handleChange} value={this.state.text} /> 
              </div> 
            ); 
          } 
        } 

        InputControlES6.propTypes = { 
          initialValue: React.PropTypes.string 
        }; 
        InputControlES6.defaultProps = { 
          initialValue: '' 
        };
        
区别如下：
### 函数绑定
createClass在成员函数创建时就已经由react自动绑定好了，需要调用的时候直接使用this.whateverFn即可，函数中的this变量在函数调用时会被正确的设置。

class中，函数不是自动绑定的，必须手动绑定。有三种方法：
* 在构造函数中绑定
* 成员函数在定义时使用胖箭头函数
* 行内绑定：在调用时使用.bind（不推荐）
 
 
那么es6 class中如果react没有帮我们绑定this，那么此时的this是哪里来的呢？

有博文说到this本来是指向的生成的Dom节点的div的[支撑实例](https://segmentfault.com/a/1190000009169542)（[理解React中es6方法创建组件的this](https://mingjiezhang.github.io/2016/08/28/%E7%90%86%E8%A7%A3React%E4%B8%ADes6%E6%96%B9%E6%B3%95%E5%88%9B%E5%BB%BA%E7%BB%84%E4%BB%B6%E7%9A%84this/)）,
### 构造函数是否调用super方法
class需要接受props作为参数，并调用super(props)。

createClass并不需要这步。

### 初始化state
createClass初始化state，接受一个getInitialState函数作为参数一部分，这个函数会在组件挂载时被调用一次。

class使用构造函数，在调用super之后，直接设置state即可。

### propTypes和defaultProps的位置
createClass中将propTypes和defaultProps作为你传入的对象的属性。

class中，这些变成了类本身的属性，所以他们需要在类定义完成之后被加到类头上。

如果开启了ES7 的属性初始化器（property initializer），可以使用下面的简写法：

	class Person extends React.Component { 
          static propTypes = { 
            name: React.PropTypes.string, 
            age: React.PropTypes.string 
          }; 
          static defaultProps = { 
            name: '', 
            age: -1 
          }; 
          ... 
        }


## 所以该用哪一个呢？
Facebook 已经声明 React.createClass 最终会被 ES6 class 取代，不过他们也说「我们不会废弃 React.createClass，直到我们找到目前 mixin 用例的替代方案，并且在语言中支持类属性初始化器」。

只要有可能，尽量使用无状态函数组件。他们很简单，也会迫使你保持 UI 组件简单。

对于需要 state、生命周期方法、或（通过 refs）访问底层 DOM 节点的复杂组件，使用 class。

不过了解全部三种风格总是有好处的。当你在 StackOverflow 或别的地方查问题的时候，你可能会看到 ES5 和 ES6 两种风格的答案。ES6 风格正在积聚人气，但并不是唯一的风格。



转载自：

http://www.w3cplus.com/react/react-es5-createclass-vs-es6-classes.html
 
 
 
 
 
 
 
 
 
 
 
 
 
 