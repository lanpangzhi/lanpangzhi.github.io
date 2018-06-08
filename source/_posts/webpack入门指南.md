---
title: webpack4.0入门指南（一）安装和转换es6语法
date: 2018-06-08 10:35:24
tags: [webpack,打包工具]
keywords:  webpack4.0入门指南（一）安装和转换es6语法
---
# webpack4.0入门指南（一）安装和转换es6语法
webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。 webpack v4.0.0 开始，可以不用引入一个配置文件。
<!--more-->

## 安装
```
npm install -g webpack
npm install -g webpack-cli
```
需要先全局安装你才可以使用webpack命令，然后再安装到你的项目依赖。
如果你使用 webpack 4+ 版本，你还需要安装 CLI。

## 新建项目
```
mkdir webpack-demo && cd webpack-demo  //创建并进入webpack-demo文件夹
npm init -y   // 初始化项目package.json文件
npm install -D webpack webpack-cli  // 本地安装 webpack和webpack-cli
```

## 使用默认配置去构建
```
mkdir demo1 && cd demo1
touch index.html
mkdir src && cd src
touch index.js
```
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
  <!--  webpack会把src/index.js文件打包到dist目录mian.js -->
  <script src="./dist/main.js"></script>
</body>
</html>
```
src/index.js
```
let a = 1;
alert(a);
```
执行 webpack 命令。就可以看到文件被打包到dist文件夹了。打开index.html文件就会弹出1。
webpack4.0可以不用写配置文件，然而大多数项目会需要很复杂的设置，需要你自己去配置。

## 使用配置文件
```
cd .. // 返回到webpack-demo文件夹
touch webpack.config.js  // 创建配置文件
touch index.html
mkdir demo2 && cd demo2  // 创建demo2文件夹
mkdir src && cd src
touch index.js
```
webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',  // 入口文件
  output: {  // 出口文件
    filename: 'bundle.js',   // 打包后命名为bundle.js
    path: path.resolve(__dirname, 'dist') // 输出的路径
  }
};
```
在项目的demo2目录执行webpack。如下图就代表打包成功。打开demo2下面的index.html 就可以弹出我的博客地址。
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180608132222.png)

## 使用babel转换es6语法 => es5

### 安装babel
在webpack-demo路径下执行命令
```
npm install --save-dev babel-loader babel-core babel-preset-env
```

把demo2复制一份命名为demo3，在src目录下再新建a.js。
src/a.js
```
export default lanpangzhi = "blog.langpz.com";
```
src/index.js
```
import lanpz from "./a.js";
console.log(lanpz);
```
webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',  // 入口文件
  output: {  // 出口文件
    filename: 'bundle.js',   // 打包后命名为bundle.js
    path: path.resolve(__dirname, 'dist') // 输出的路径
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有.js结尾的文件
        exclude: /node_modules/,  // 忽略node_modules文件夹
        use: {
          loader: 'babel-loader'  // 使用babel-loader转义
        }
      }
    ]
  }
};
```
新建 .babelrc 文件
```
touch .babelrc
```
.babelrc
```
{
  "presets": ["env"]
}
```
执行webpack就可以看见打包成功了。
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180608145725.png)

### babel-polyfill
由于 Babel 只转换语法(如箭头函数)， 你可以使用 babel-polyfill 支持新的全局变量，例如 Promise 、新的原生方法如 String.padStart (left-pad) 等。
在webpack-demo路径下执行命令
```
npm install --save babel-polyfill  // 安装babel-polyfill
```
在 webpack.config.js 中，将 babel-polyfill 加到你的 entry 数组中。
```
module.exports = {
  entry: ["babel-polyfill", "./src/index.js"]
};
```
执行webpack命令，如下图就成功了。
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180608151354.png)

# demo仓库地址
[https://github.com/lanpangzhi/webpack-demo](https://github.com/lanpangzhi/webpack-demo)

# 参考
[https://www.babeljs.cn/](https://www.babeljs.cn/)
[https://webpack.docschina.org/](https://webpack.docschina.org/)