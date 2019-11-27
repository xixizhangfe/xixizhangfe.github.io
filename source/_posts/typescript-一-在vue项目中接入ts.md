---
title: typescript(一) 在vue项目中接入ts
date: 2019-10-12 17:18:55
tags:
---
1. 安装`typescript`: `dnpm i --save-dev typescript`
2. 根目录添加`tsconfig.json`文件，如下（以后补充）：
3. `在webpack`中添加ts配置，先安装`ts-loader`，`dnpm i --save-dev ts-loader`

   ```
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
   ```
   其中`appendTsSuffixTo: [/\.vue$/]`是为了能够使用SFC单文件组件
4. 原来的`main.js`改为`main.ts`, `app.vue`的script块要改成`lang="ts"`
5. 使用`Vue.use`报错`Property 'use' does not exist on type 'typeof Vue'`
   这是因为tsconfig.json配置没有写对，正确的配置：

   ```
   {
    "compileOnSave": true,
    "compilerOptions": {
      "outDir": "./public/assets",
      "target": "es5",
      "allowJs": true,
      "strict": true,
      "noImplicitAny": false,
      "allowSyntheticDefaultImports": true
    },
    "include": [
      "./client/**/*.ts",
      "./server/*",
      "./server/**/*"
    ]
  }
   ```
6. 报错
   vue.esm.js:5109 Uncaught TypeError: Cannot read property 'install' of undefined
    at Function.Vue.use (vue.esm.js:5109)
    at Object../client/main.ts (main.ts:13)

    tsconfig加上配置： `"esModuleInterop": true`
参考：

https://github.com/Microsoft/TypeScript-Vue-Starter#typescript-vue-starter



tsconfig.json配置说明：

"moduleResolution": "node" // https://www.typescriptlang.org/docs/handbook/module-resolution.html


使用echarts的坑：

https://www.cnblogs.com/catherinezyr/p/10768399.html
