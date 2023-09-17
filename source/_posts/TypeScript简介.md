---
title: TypeScript简介
date: 2023-09-17 12:14:50
tags: TypeScript
keywords: TypeScript简介
---
# 什么是 TypeScript？
TypeScript（简称 TS）是一种由微软开发的开源编程语言，它是 JavaScript 的超集。这意味着 TypeScript 扩展了 JavaScript，为其添加了额外的功能，最主要的是类型系统。TypeScript 的目标是提供更强大、更安全、更可维护的代码，同时与 JavaScript 保持高度的兼容性。
<!--more-->
# 为什么需要 TypeScript？
JavaScript 是一门非常灵活的动态类型语言，但这也意味着在编写大型应用程序时可能会出现一些潜在的问题：

- **类型错误**： 在运行时才能发现的类型错误可能会导致应用程序崩溃或产生不可预测的行为。

- **代码维护困难**： 在大型项目中，难以理解的变量命名和函数签名可能会导致代码难以维护。

- **缺少工具支持**： 缺乏类型信息可能导致开发工具无法提供有用的代码补全、重构和错误检查。

TypeScript 解决了这些问题，通过引入静态类型检查来增加代码的可靠性和可维护性。它使开发人员能够在开发阶段捕获类型错误，提供了更多的代码提示和智能感知，并提高了代码的可读性。

# TypeScript 的特点和优势
- **静态类型检查**： TypeScript 允许开发人员在编写代码时指定变量、参数和返回值的类型。这样，在编译时就可以检测到类型错误，而不是在运行时出现错误。

- **强大的工具支持**： TypeScript 受益于强大的开发工具，如编辑器（如VSCode、WebStorm）和构建工具（如Webpack）。这些工具提供了智能感知、代码补全、重构和错误检查等功能。

- **增强的可读性**： TypeScript 代码通常更具可读性，因为类型信息使得代码的意图更加明确。这有助于团队合作和代码维护。

- **渐进式采用**： 你可以将 TypeScript 逐步引入项目中，而不需要从头开始重写代码。它兼容现有的 JavaScript 代码，并允许你逐渐添加类型注解。

- **社区支持**： TypeScript 有一个庞大的社区，提供了丰富的文档、库和工具，以帮助你更好地使用它。

# 环境配置
## 全局编译TS文件
全局安装typescript对TS进行编译
```
npm install typescript -g
tsc --init # 生成tsconfig.json
```

```
tsc # 可以将ts文件编译成js文件
tsc --watch # 监控ts文件变化生成js文件
```

## 配置rollup环境
初始化项目并安装依赖
```
npm init
npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D

```
初始化**TS配置**文件
```
npx tsc --init
```
修改tsconfig.json文件module: **"module": "ESNext"**

rollup配置文件
```
// rollup.config.js
import ts from 'rollup-plugin-typescript2'
import {nodeResolve} from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import path from 'path'
export default {
    input:'src/main.ts', // 定义入口文件
    output:{
        format:'iife',
        file:path.resolve('dist/bundle.js'), 
        sourcemap:true
    },
    plugins:[
        nodeResolve({
            extensions:['.js','.ts']
        }),
        ts({
            tsconfig:path.resolve(__dirname,'tsconfig.json')
        }),
        serve({
            open:true,
            openPage:'/public/index.html',
            port:3000,
            contentBase:''
        })
    ]
}
```

创建 **/public/index.html** 和 **src/main.ts**文件
```
// /public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="/dist/bundle.js"></script>
</head>
<body>
</body>
</html>
```

```
let a:string = '123'
console.log(a)
```

package.json配置
```
"scripts": {
    "dev": "rollup -c -w --bundleConfigAsCjs"
}
```
我们可以通过**npm run dev**启动服务来使用typescript。