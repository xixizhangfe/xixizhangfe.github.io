---
title: vue-loader源码解析
date: 2019-06-11 22:47:33
tags:
---
首先看一下vue-loader源码结构：

```
vue-loader/lib/
  │
  ├─── codegen/   生成代码的
  │      ├─── customBlock.js/      生成custom block的代码
  │      ├─── hotReload.js/        生成热加载的代码
  │      ├─── styleInjection.js/   生成style注入的代码
  │      ├─── utils.js/            工具
  ├─── loaders/   内部用到的loader
  │      ├─── pitcher.js/          vue-loader的pitch,将所有的请求拦截转成合适的请求
  │      ├─── stylePostLoader.js/  处理scoped css的loader
  │      ├─── templateLoader.js/   处理template的loader，将template转成js
  ├─── runtime/
  │      ├─── componentNormalizer.js/  将组件标准化
  ├─── index.d.ts/
  ├─── index.js/    vue-loader的核心代码
  ├─── plugin.js/   vue-loader-plugin的核心代码
  ├─── select.js/   根据不同query类型（script、template等）传递content、map给下一个loader
```

接下来，我们将通过一个例子，来看vue-loader是怎么工作的(这个例子来自vue-loader/example/)。

<details>
<summary>展开查看例子代码</summary>
<pre>

```javascript
// main.js
import Vue from 'vue'
import Foo from './source.vue'

new Vue({
  el: '#app',
  render: h => h(Foo)
})

```
```javascript
// source.vue
<template lang="pug">
  div(ok)
    h1(:class="$style.red") hello
</template>

<script>
export default {
  data () {
    return {
      msg: 'fesfff'
    }
  }
}
</script>

<style scoped>
.red {
  color: red;
}
</style>

<foo>
export default comp => {
  console.log(comp.options.data())
}
</foo>
```
```javascript
// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('../lib/plugin')

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: path.resolve(__dirname, './main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  devServer: {
    stats: "minimal",
    contentBase: __dirname,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        resourceQuery: /blockType=foo/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]'
                }
              }
            ]
          },
          {
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              data: '$color: red;'
            }
          }
        ]
      }
    ]
  },
  resolveLoader: {
    alias: {
      'vue-loader': require.resolve('../lib')
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```
</pre>
</details>

# vue-loader-plugin

在webpack开始执行后，会先合并webpack.config里的配置，接着实例化compiler，然后就去挨个执行所有plugin的apply方法。这里则是执行vue-loader-plugin的apply方法。

<details>
<summary>webpack源码</summary>
<pre>

```javascript
// webpack/lib/webpack.js
const Compiler = require("./Compiler")

const webpack = (options, callback) => {
  ...
  options = new WebpackOptionsDefaulter().process(options) // 初始化 webpack 各配置参数
  let compiler = new Compiler(options.context)             // 初始化 compiler 对象，这里 options.context 为 process.cwd()
  compiler.options = options                               // 往 compiler 添加初始化参数
  new NodeEnvironmentPlugin().apply(compiler)              // 往 compiler 添加 Node 环境相关方法
  for (const plugin of options.plugins) {
    plugin.apply(compiler);
  }
  ...
}
```
</pre>
</details>


我们在webpack中配置的vue-loader-plugin就是这里的plugin.js，这个是vue-loader强依赖的，如果不配置vue-loader-plugin，就会抛出错误。那么它到底做了哪些事情？

<details>
<summary>展开plugin.js</summary>
<pre>

```javascript
class VueLoaderPlugin {
  apply (compiler) {
    // ...

    // 事件注册
    compiler.hooks.compilation.tap(id, compilation => {
      let normalModuleLoader = compilation.hooks.normalModuleLoader
      normalModuleLoader.tap(id, loaderContext => {
        loaderContext[NS] = true
      })
    })

    // ...

    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    // ...

    const clonedRules = rules
      .filter(r => r !== vueRule)
      .map(cloneRule)

    // ...

    // global pitcher (responsible for injecting template compiler loader & CSS
    // post loader)
    const pitcher = {
      loader: require.resolve('./loaders/pitcher'),
      resourceQuery: query => {
        const parsed = qs.parse(query.slice(1))
        return parsed.vue != null
      },
      options: {
        cacheDirectory: vueLoaderUse.options.cacheDirectory,
        cacheIdentifier: vueLoaderUse.options.cacheIdentifier
      }
    }

    // replace original rules
    compiler.options.module.rules = [
      pitcher,
      ...clonedRules,
      ...rules
    ]
  }
}

function createMatcher (fakeFile) {}

function cloneRule (rule) {}

VueLoaderPlugin.NS = NS
module.exports = VueLoaderPlugin
```

</pre>
</details>

从上面源码可以看出，vue-loader-plugin导出的是一个类，并且只包含了一个apply方法。

apply方法其实就做了3件事：

1. 事件监听：在normalModuleLoader钩子执行前调用代码：loaderContext[NS] = true
   （每解析一个module，都会用到normalModuleLoader，由于每解析一个module都会有一个新的loaderContext，为保证经过vue-loader执行时不报错，需要在这里标记loaderContext[NS] = true）
> 说明：loader中的this是一个叫做loaderContext的对象，这是webpack提供的，是loader的上下文对象，里面包含loader可以访问的方法或属性。

2. 将webpack中配置的rules利用webpack的new RuleSet进行格式化（[rules配置](https://webpack.js.org/configuration/module#modulerules)），并clone一份rules给.vue文件里的每个block使用（这里先这样理解，具体的涉及到RuleSet，有时间再看）

<details>
  <summary>展开格式化后的rules</summary>
  <pre>

  ```javascript
      rules = [{
        resource: f (),
        use: [{
          loader: "vue-loader",
          options: undefined
        }]
      }, {
        resourceQuery: f (),
        use: [{
          loader: "babel-loader",
          options: undefined
        }]
      }, {
        resourceQuery: f (),
        use: [{
          loader: "babel-loader",
          options: undefined
        }]
      }, {
        resource: ƒ (),
        oneOf: [{
          resourceQuery: ƒ (),
          use: [{
            loader: "pug-plain-loader", options: undefined
          }]
        }, {
          use: [{
            loader: "raw-loader",
            options: undefined
          }, {
            loader: "pug-plain-loader",
            options: undefined
          }]
        }]
      }]
  ```
  </pre>
</details>

3. 在rules里加入vue-loader内部提供的pitcher-loader，同时将原始的rules替换成pitcher-loader、cloneRules、rules


# vue-loader

当webpack加载入口文件main.js时，依赖到了source.vue，webpack内部会去查找source.vue依赖的loaders，发现是vue-loader，然后就会去执行vue-loader([vue-loader/lib/index.js](https://github.com/vuejs/vue-loader/blob/master/lib/index.js))。接下来，我们分析vue-loader的实现过程。

<details>
<summary>查看vue-loader源码</summary>
<pre>

```javascript
module.exports = function (source) {
  const loaderContext = this

  // 会先判断是否加载了vue-loader-plugin，没有则报错
  if (!errorEmitted && !loaderContext['thread-loader'] && !loaderContext[NS]) {
    // 略
  }

  // 从loaderContext获取信息
  const {
    target, // 编译的目标，是从webpack配置中传递过来的，默认是'web'，也可以是'node'等
    request, // 请求的资源的路径（每个资源都有一个路径）
    minimize, // 是否压缩：true/false，现在已废弃
    sourceMap, // 是否生成sourceMap: true/false
    rootContext, // 当前项目绝对路径，对本例子来说是：/Users/zhangxixi/knowledge collect/vue-loader
    resourcePath, // 资源文件的绝对路径，对本例子来说是：/Users/zhangxixi/knowledge collect/vue-loader/example/source.vue
    resourceQuery // 资源的 query 参数，也就是问号及后面的，如 ?vue&type=custom&index=0&blockType=foo
  } = loaderContext

  // parse函数返回的是compiler.parseComponent()的结果，这个compiler对应的就是vue-template-compiler
  const descriptor = parse({
    source,
    compiler: options.compiler || loadTemplateCompiler(loaderContext), // 如果loader的options没有配置compiler, 则使用vue-template-compiler
    filename,
    sourceRoot,
    needMap: sourceMap
  })

  // 如果是语言块，则直接返回
  if (incomingQuery.type) {
    return selectBlock(
      descriptor,
      loaderContext,
      incomingQuery,
      !!options.appendExtension
    )
  }

  /* 生成template请求
    import { render, staticRenderFns } from "./source.vue?vue&type=template&id=27e4e96e&scoped=true&lang=pug&"
  */
  // 略

  /* 生成script请求：
    import script from "./source.vue?vue&type=script&lang=js&"
    export * from "./source.vue?vue&type=script&lang=js&"
  */
  // 略

  /* 生成style请求：
    import style0 from "./source.vue?vue&type=style&index=0&id=27e4e96e&scoped=true&lang=css&"
  */
  // 略


  /* 生成code并return code
  */
  // 略

  module.exports.VueLoaderPlugin = plugin
```
</pre>
</details>

整个过程大体可以分为3个阶段。

## 第一阶段
这一阶段是将.vue文件解析成js module。

1. 会先判断是否加载了vue-loader-plugin，没有则报错
2. 从loaderContext中获取到模块的信息，比如request、resourcePath、resourceQuery等
3. 对.vue文件进行parse，其实就是把.vue分成template、script、style、customBlocks这几部分

<details>
<summary>parse前后对比</summary>
<pre>

```javascript
// parse之前 source是：
'<template lang="pug">\ndiv(ok)\n  h1(:class="$style.red") hello\n</template>\n\n<script>\nexport default {\n  data () {\n    return {\n      msg: \'fesfff\'\n    }\n  }\n}\n</script>\n\n<style scoped>\n.red {\n  color: red;\n}\n</style>\n\n<foo>\nexport default comp => {\n  console.log(comp.options.data())\n}\n</foo>\n'

// parse之后 得到的结果
{
  template:
    { type: 'template',
      content: '\ndiv(ok)\n  h1(:class="$style.red") hello\n',
      start: 21,
      attrs: { lang: 'pug' },
      lang: 'pug',
      end: 62
    },
  script:
    { type: 'script',
      content:
      '//\n//\n//\n//\n//\n\nexport default {\n  data () {\n    return {\n      msg: \'fesfff\'\n    }\n  }\n}\n',
      start: 83,
      attrs: {},
      end: 158,
      map:
      { version: 3,
        sources: [Array],
        names: [],
        mappings: ';;;;;;AAMA;AACA;AACA;AACA;AACA;AACA;AACA',
        file: 'source.vue',
        sourceRoot: 'example',
        sourcesContent: [Array] }
    },
  styles:
    [ { type: 'style',
        content: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.red {\n  color: red;\n}\n',
        start: 183,
        attrs: [Object],
        scoped: true,
        end: 207,
        map: [Object]
      }
    ],
  customBlocks:
    [ { type: 'foo',
        content:
        '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nexport default comp => {\n  console.log(comp.options.data())\n}\n',
        start: 222,
        attrs: {},
        end: 285
      }
    ],
  errors: []
}
```
</pre>
</details>

4、在这一步区分.vue请求与block请求。如果是.vue请求，则需要生成js module。否则就执行selectBlock。第一阶段是.vue请求，因此会生成js module：分别生成template、script、style、customBlock的请求路径（这里会在query上添加'vue'，比如./source.vue?vue&type=script&lang=js，这会在第二阶段用到）；添加热加载逻辑。

<details>
<summary>vue-loader第一阶段生成的js module</summary>
<pre>

```javascript
import { render, staticRenderFns } from "./source.vue?vue&type=template&id=27e4e96e&scoped=true&lang=pug&"
import script from "./source.vue?vue&type=script&lang=js&"
export * from "./source.vue?vue&type=script&lang=js&"
import style0 from "./source.vue?vue&type=style&index=0&id=27e4e96e&scoped=true&lang=css&"
import normalizer from "!../lib/runtime/componentNormalizer.js"
var component = normalizer(
  script,
  render,
  staticRenderFns,
  false,
  null,
  "27e4e96e",
  null
)
import block0 from "./source.vue?vue&type=custom&index=0&blockType=foo"
if (typeof block0 === 'function') block0(component)
if (module.hot) {
  var api = require("/Users/zhangxixi/knowledge collect/vue-loader/node_modules/_vue-hot-reload-api@2.3.3@vue-hot-reload-api/dist/index.js")
  api.install(require('vue'))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('27e4e96e', component.options)
    } else {
      api.reload('27e4e96e', component.options)
    }
    module.hot.accept("./source.vue?vue&type=template&id=27e4e96e&scoped=true&lang=pug&", function () {
      api.rerender('27e4e96e', {
        render: render,
        staticRenderFns: staticRenderFns
      })
    })
  }
}
component.options.__file = "example/source.vue"
export default component.exports
```
</pre>
</details>

## 第二阶段
第一阶段返回的js module交与webpack继续解析，这样就会接着请求所依赖的template、script、style、customBlock。

我们以template的请求为例：
`import { render, staticRenderFns } from "./source.vue?vue&type=template&id=27e4e96e&scoped=true&lang=pug&"`，webpack解析出这个module需要的loaders是：pitcher-loader、pug-plain-loader、vue-loader。这里之所以能解析出pitcher-loader，是因为queyr里vue，我们回过头来看一下pitcher-loader的代码，会看到pitcher-loader是通过query是否有vue进行匹配的。

```javascript
    // global pitcher (responsible for injecting template compiler loader & CSS
    // post loader)
    const pitcher = {
      loader: require.resolve('./loaders/pitcher'),
      resourceQuery: query => {
        const parsed = qs.parse(query.slice(1))
        return parsed.vue != null
      },
      options: {
        cacheDirectory: vueLoaderUse.options.cacheDirectory,
        cacheIdentifier: vueLoaderUse.options.cacheIdentifier
      }
    }
```

pitcher-loader里含有pitch方法，这里需要说明一下webpack中loader的执行顺序([loader顺序](https://webpack.js.org/api/loaders))：

<details>
<summary>webpack loader执行顺序</summary>
<pre>

```javascript
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'a-loader',
          'b-loader',
          'c-loader'
        ]
      }
    ]
  }
};
```

```
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

```
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```
</pre>
</details>

也就是说，会先按顺序执行每个loader的pitch方法，再按相反顺序执行loader的正常方法，如果loader的pitch方法有返回值，则直接掉头往相反顺序执行。

那我们来看一下vue-loader内部的这个pitcher-loader到底做了什么：

1. 剔除eslint-loader
2. 剔除pitcher-loader自身
3. 根据不同的query进行拦截处理，返回对应的内容，跳过后面的loader执行部分

<details>
<summary>pitcher-loader代码</summary>
<pre>

```javascript
// vue-loader/lib/loaders/pitcher.js
module.exports = code => code
module.exports.pitch = function (remainingRequest) {
  // ...
  const query = qs.parse(this.resourceQuery.slice(1))
  let loaders = this.loaders

  // if this is a language block request, eslint-loader may get matched
  // multiple times
  if (query.type) {
    // if this is an inline block, since the whole file itself is being linted,
    // remove eslint-loader to avoid duplicate linting.
    if (/\.vue$/.test(this.resourcePath)) {
      loaders = loaders.filter(l => !isESLintLoader(l))
    } else {
      // This is a src import. Just make sure there's not more than 1 instance
      // of eslint present.
      loaders = dedupeESLintLoader(loaders)
    }
  }

  // remove self
  loaders = loaders.filter(isPitcher)

  // ...

  // Inject style-post-loader before css-loader for scoped CSS and trimming
  if (query.type === `style`) {
    const cssLoaderIndex = loaders.findIndex(isCSSLoader)
    if (cssLoaderIndex > -1) {
      const afterLoaders = loaders.slice(0, cssLoaderIndex + 1)
      const beforeLoaders = loaders.slice(cssLoaderIndex + 1)

      const request = genRequest([
        ...afterLoaders,
        stylePostLoaderPath,
        ...beforeLoaders
      ])

      return `import mod from ${request}; export default mod; export * from ${request}`
    }
  }

  // for templates: inject the template compiler & optional cache
  if (query.type === `template`) {
    const path = require('path')
    const cacheLoader = cacheDirectory && cacheIdentifier
      ? [`cache-loader?${JSON.stringify({
        // For some reason, webpack fails to generate consistent hash if we
        // use absolute paths here, even though the path is only used in a
        // comment. For now we have to ensure cacheDirectory is a relative path.
        cacheDirectory: (path.isAbsolute(cacheDirectory)
          ? path.relative(process.cwd(), cacheDirectory)
          : cacheDirectory).replace(/\\/g, '/'),
        cacheIdentifier: hash(cacheIdentifier) + '-vue-loader-template'
      })}`]
      : []

    const preLoaders = loaders.filter(isPreLoader)
    const postLoaders = loaders.filter(isPostLoader)

    const request = genRequest([
      ...cacheLoader,
      ...postLoaders,
      templateLoaderPath + `??vue-loader-options`,
      ...preLoaders
    ])

    // the template compiler uses esm exports
    return `export * from ${request}`
  }

  // if a custom block has no other matching loader other than vue-loader itself
  // or cache-loader, we should ignore it
  if (query.type === `custom` && shouldIgnoreCustomBlock(loaders)) {
    return ``
  }

  // When the user defines a rule that has only resourceQuery but no test,
  // both that rule and the cloned rule will match, resulting in duplicated
  // loaders. Therefore it is necessary to perform a dedupe here.
  const request = genRequest(loaders)

  return `import mod from ${request}; export default mod; export * from ${request}`
}
```
</pre>

对于style的处理，先判断是否有css-loader，有的话就生成一个新的request，这个过程会将vue-loader内部的style-post-loader添加进去，然后返回一个js module。根据pitch的规则，pitcher-loader后面的loader都会被跳过，然后就开始编译这个返回的js module。js module的内容是：

```javascript
import mod from "-!../node_modules/_vue-style-loader@4.1.2@vue-style-loader/index.js!../node_modules/_css-loader@1.0.1@css-loader/index.js!../lib/loaders/stylePostLoader.js!../lib/index.js??vue-loader-options!./source.vue?vue&type=style&index=0&id=27e4e96e&scoped=true&lang=css&";
export default mod; export * from "-!../node_modules/_vue-style-loader@4.1.2@vue-style-loader/index.js!../node_modules/_css-loader@1.0.1@css-loader/index.js!../lib/loaders/stylePostLoader.js!../lib/index.js??vue-loader-options!./source.vue?vue&type=style&index=0&id=27e4e96e&scoped=true&lang=css&"
```

对于template的处理类似，也会生成一个新的request，这个过程会将vue-loader内部提供的template-loader加进去，并返回一个js module：

```javascript
export * from "-!../lib/loaders/templateLoader.js??vue-loader-options!../node_modules/_pug-plain-loader@1.0.0@pug-plain-loader/index.js!../lib/index.js??vue-loader-options!./source.vue?vue&type=template&id=27e4e96e&scoped=true&lang=pug&"
```

其他block也是类似的。

## 第三阶段
经过第二阶段后，会继续解析每个block对应的js module。

对于style：

会按照vue-style-loader的pitch、css-loader的pitch、style-post-loader的pitch、vue-loader的pitch、vue-loader（分离出style block）、style-post-loader（处理scoped css）、css-loader（处理相关资源的引入路径）、vue-style-loader（动态创建style标签插入css）的顺序执行。


对于template：

会按照template-loader的pitch、pug-plain-loader的pitch、vue-loader的pitch、vue-loader（分离出template block）、pug-plain-loader（将pug模板转化为html字符串）、template-loader（编译 html 模板字符串，生成 render/staticRenderFns 函数并暴露出去）的顺序执行。

其他模块类似。


会发现，在不考虑pitch函数的时候，第三阶段里最先执行的都是vue-loader，此时query是有值的，所以会进入到selecBlock阶段。（这就是vue-loader执行时与第一阶段不同的地方）

```javascript
  // ...
  // 如果是语言块，则直接返回
  if (incomingQuery.type) {
    return selectBlock(
      descriptor,
      loaderContext,
      incomingQuery,
      !!options.appendExtension
    )
  }
  // ...
```
selectBlock来自select.js，那么我们来看看select.js做了什么：

select.js其实就是根据不同的query类型，将相应的content和map传递给下一个loader。（如果没有下一个loader怎么办呢？）

<details>
<summary>select.js</summary>
<pre>

```javascript
module.exports = function selectBlock (
  descriptor,
  loaderContext,
  query,
  appendExtension
) {
  // template
  if (query.type === `template`) {
    if (appendExtension) {
      loaderContext.resourcePath += '.' + (descriptor.template.lang || 'html')
    }
    loaderContext.callback(
      null,
      descriptor.template.content,
      descriptor.template.map
    )
    return
  }

  // script
  if (query.type === `script`) {
    if (appendExtension) {
      loaderContext.resourcePath += '.' + (descriptor.script.lang || 'js')
    }
    loaderContext.callback(
      null,
      descriptor.script.content,
      descriptor.script.map
    )
    return
  }

  // styles
  if (query.type === `style` && query.index != null) {
    const style = descriptor.styles[query.index]
    if (appendExtension) {
      loaderContext.resourcePath += '.' + (style.lang || 'css')
    }
    loaderContext.callback(
      null,
      style.content,
      style.map
    )
    return
  }

  // custom
  if (query.type === 'custom' && query.index != null) {
    const block = descriptor.customBlocks[query.index]
    loaderContext.callback(
      null,
      block.content,
      block.map
    )
    return
  }
}
```
</pre>
<details>

=========================正文结束================================

补充知识

vue-loader的执行过程离不开webpack。因此，我们首先看一下webapck loader的整体运行流程(详解参考文章[webpack loader十问](https://juejin.im/post/5bc1a73df265da0a8d36b74f#heading-11))。

![webpack loader运行流程图](https://github.com/xixizhangfe/markdownImages/blob/master/webpack-loader?raw=true)

