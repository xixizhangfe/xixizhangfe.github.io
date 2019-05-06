---
title: js模块系统详解(二)
date: 2019-05-06 09:26:27
tags:
---
## 各个模块系统的语法
CommonJS的语法是`require` `module.exports`

ES6的语法是`import` `export` `export default`

NodeJS的语法是`require` `exports` `module.exports`

## `require` `import` `export` `module.exports`混用
通常我们所做的项目，会遇到`require` `import` `export` `module.exports`混合使用的情况。

比如，我所做的一个项目使用了node，在node层schema.js里导出了一个属性：

```
// schema.js
exports.rules = {
  name: [{
    pattern: /\w+/,
    message: '支持英文字母、数字、下划线',
  },
  {
    min: 4,
    max: 32,
    message: '长度范围必须在4~32字符之间',
  }]
};
```

然后，在前端vue文件里引入：

```
// test.vue
import { rules } from '/path/to/schema.js';
```

对于nodejs模块规范来说，使用exports导出，应该使用require引入。而上面这个例子，是import引入的。那么为什么可以这样做？

这里我看到了一篇文章，非常好，https://juejin.im/post/5a2e5f0851882575d42f5609，推荐给大家。下面的内容，也都是抄的这篇文章的。目的是为了加深自己的记忆与理解。

链接的文章主要从这几个问题入手：

1. 为什么有的地方使用`require`去引用一个模块时需要加上`default`？`require('xx').default`
2. 经常在各大UI组件引用的文档上会看到说明`import { button } from 'xx-ui'`这样会引入所有组件内容，需要添加额外的babel配置，比如`babel-plugin-component`?
3. 为什么可以使用es6的import去引用commonjs规范定义的模块，或者反过来也可以？
4. 我们在浏览一些npm下载下来的UI组件模块时（比如说element-ui的lib文件夹下），看到的都是webpack编译好的js文件，可以使用import或require再去引用。但是我们平时编译好的js是无法再被其他模块import的，这是为什么？
5. babel在模块化的场景中充当了什么角色？以及webpack？哪个起到了关键作用？
6. 听说es6还有tree-shaking功能，怎么才能使用这个功能？


### webpack在模块化中的作用
webpack本身维护了一套模块系统，这套模块系统兼容了所有前端历史进程下的模块规范，包括`amd` `commonjs` `es6`等。下面只对`commonjs` `es6`规范进行说明。

模块化的实现其实就在最后编译的文件内。

先看一下这个demo

```
// webpack

const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  }
};
```

```
// main.js
import a from './a';

export default a;
console.log(a);
```

```
// a.js

export default 333;
```

```
// webpack编译后的js

(function(modules) {


  function __webpack_require__(moduleId) {
    var module =  {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }

  return __webpack_require__(0);
})({
  "./client/a.js":
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(exports, '__esModule', { value: true });
    /* harmony default export */ __webpack_exports__["default"] = (333);
  }),
  "./client/main.js":
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(exports, '__esModule', { value: true });
    /* harmony import */ var _a_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a.js */ "./client/a.js");
    /* harmony default export */ __webpack_exports__["default"] = ('main.js');
    console.log('a', _a_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
  })
});
```

上面这段js就是使用webpack编译后的代码（经过精简），其中就包含了webpack的运行时代码，就是关于模块的实现。

其实这段js就是一个自执行函数，这个函数的入参是个对象（注意原文可能由于webpack版本问题，写的是数组。本文用的是webpack4），对象的内容包括了所有依赖的模块。

自执行逻辑相信大家都知道。那么最关键的，也是与require、import有关的，是`__webpack_require__`这个函数。它是`require`或者`import`的替代。而`__webpack_exports__`就是模块的`module.exports`的引用。比如，入口模块中调用了`__webpack_require__(1)`, 那么就会得到1这个模块的`module.exports`。


注意上面的例子，我们都是采用es6的规范，如果把引入的方式改成commonjs呢？

```
// main.js
let a = require('./a.js');

export default a;
console.log(a);
```

```
// webpack编译后的js

(function(modules) {


  function __webpack_require__(moduleId) {
    var module =  {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }

  return __webpack_require__(0);
})({
  "./client/a.js":
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(exports, '__esModule', { value: true });
    /* harmony default export */ __webpack_exports__["default"] = (333);
  }),
  "./client/main.js":
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(exports, '__esModule', { value: true });
    let a = __webpack_require__(/*! ./a.js */ "./client/a.js");
    /* harmony default export */ __webpack_exports__["default"] = ('main.js');
    console.log('a', a);
  })
});
```

此时，发现编译后的结果少了把a.js转换的过程，

`/* harmony import */ var _a_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a.js */ "./client/a.js");`

变成了

`let a = __webpack_require__(/*! ./a.js */ "./client/a.js");`

这说明，webpack在模块化时如果发现是es6规范，就会通过__webpack__require将其转成webpack规范。

目前这种编译后的js，将入口模块的输出(即`module.exports`)进行输出没有任何作用，只会作用于当前作用域。这个js并不能被其他模块继续以`require`或`import`的方式引用。


### babel的作用
webpack的模块化方案是把es6模块化转换成webpack的模块化，但是其余的es6语法还需要做兼容性处理。babel专门用于处理es6转换es5。当然这也包括es6的模块语法的转换。

其实两者的转换思路差不多，区别在于webpack的原生转换 可以多做一步静态分析，使用tree-shaking技术（下面会讲到）

babel能提前将es6的import等模块关键字转换成commonjs的规范。这样webpack就无需再做处理，直接使用webpack运行时定义的__webpack_require__处理。

这里就解释了问题5。

babel是如何转换es6模块的？

#### 导出模块
es6的导出模块写法有：

```
export default 123;

export const a = 123;

const b = 3;
const c = 4;
export { b, c };
```

babel会将这些统统转成commonjs的exports:

```
exports.default = 123;
exports.a = 123;
exports.b = 3;
exports.c = 4;
exports.__esModule = true;
```

babel转换es6的模块输出逻辑非常简单，即将所有输出都赋值给exports，并带上一个__esModule表明这是个由es6转换来的commonjs输出。

同样，对于import，也会转成require。

#### 引入default
对于最常见的

```
import a from './a.js';
```

es6的本意是引入`a.js`里的default输出，但是转成commonjs后，`var a = require('./a.js')`得到的是整个对象，不是es6的本意，所以需要对a进行处理。

我们在导出中提到，default输出会赋值给导出对象的default属性。

```
exports.default = 123;
```

所以babel加了个help `_interopRequireDefault`函数。

```
function _interopRequireDefault(obj) {
    return obj && obj.__esModule
        ? obj
        : { 'default': obj };
}

var _a = require('assert');
var _a2 = _interopRequireDefault(_a);

var a = _a2['default'];
```

所以这里最后的a变量就是require的值的default属性。如果原先就是commonjs规范，那么a就是那个模块的导出对象。

#### 引入*通配符
es6使用`import * as a from './a.js'`的本意是将es6模块的所有命名输出以及default输出打包成一个对象赋值给a变量。

而通过`var a = require('./a.js')`就能实现上述意图。

所以直接返回这个对象。

```
if (obj && obj.__esModule) {
   return obj;
}
```

如果本来就是commonjs规范，导出时没有default属性，需要添加一个default属性，并把整个模块对象再次赋值给default属性。

```
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    else {
        var newObj = {}; // (A)
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
```

所以`import { a } from './a.js'`直接换成`require('./a.js').a`即可。

### 总结
即使我们使用了es6的模块系统，如果借助babel的转换，es6的模块系统最终还是会转换成commonjs的规范。所以，如果我们是使用babel转换es6模块，混合使用es6的模块和commonjs的规范是没有问题的，因为最终都会转换成commonjs。

这里就解释了问题3。

### babel5 & babel6
es6的`export default`都会被转换成exports.default，即使这个模块只有这一个输出。

我们现在再把`main.js`改一下：

```
// main.js

import a from './a.js';
let a2 = require('./a.js');

export default 'main.js';

console.log('a', a);
console.log('a2', a2);
```

会发现，打印出来的内容是：

```
333
Module {default: 333, __esModule: true, Symbol(Symbol.toStringTag): "Module"}
```

会发现，通过`require`引入es6模块，得到的是整个对象，这时候需要`require('./a.js').default`得到想要的结果。

这里就解释了问题1。

在babel5时代，大部分人在用require去引用es6输出的default，只是把default输出看做是一个模块的默认输出，所以babel5对这个逻辑做了hack，如果一个es6模块只有一个default输出，那么在转换成commonjs的时候也一起赋值给module.exports，即整个导出对象被赋值了default所对应的值。这样就不需要加default。

但这样做是不符合es6的定义的，在es6的定义里，default只是个名字，没有任何意义。


### webpack编译后的js，如何再被其他模块引用
通过配置output.libraryTarget指定构建完的js的用途。

#### 默认var
如果指定了`output.library = 'test'`，入口模块返回的module.exports暴露给全局`var test = returned_module_exports`

#### commonjs
如果library: 'spon-ui'入口模块返回的module.exports赋值给`exports['spon-ui']`

#### commonjs2
入口模块返回的module.exports 赋值给module.exports

所以element-ui的构建方式采用commonjs2，导出的组件的js最后都会赋值给module.exports，供其他模块引用。

这就解释了问题4


## 模块依赖的优化
### 按需加载的原理
我们在使用各大 UI 组件库时都会被介绍到为了避免引入全部文件，请使用`babel-plugin-component`等babel 插件。

```
import { Button, Select } from 'element-ui'
```

由前文可知，import会先转换为commonjs。

```
var a = require('element-ui');
var Button = a.Button;
var Select = a.Select;
```

`var a = require('element-ui');` 这个过程就会将所有组件都引入进来了。

所以`babel-plugin-component`就做了一件事，将`import { Button, Select } from 'element-ui'`转换成了

```
import Button from 'element-ui/lib/button'
import Select from 'element-ui/lib/select'
```

即使转换成了commonjs规范，也只是引入自己这个组件的js，将引入量减少到最低。

这里解释了问题2


### tree-shaking
这个就直接看原文吧。

参考链接https://juejin.im/post/5a2e5f0851882575d42f5609
