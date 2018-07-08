---
title: webpack4.0入门指南（二）转换es7语法解析静态资源
date: 2018-06-13 13:30:47
tags: [webpack,打包工具]
keywords:  webpack4.0入门指南（二）转换es7语法解析静态资源
---
# webpack4.0入门指南（二）转换es7语法解析静态资源
之前写了怎么转换es6的语法，如果在项目中用了es7的语法和样式，图片，字体该如何配置，下面就写一下配置。
<!--more-->

## 转换es7语法
把之前demo3文件夹一份命名为demo4。
修改demo4/src/index.js文件
```
let obj = {name: 'lanpangzhi'};
let obj2 = {blog: 'http://blog.langpz.com'};
let newObj = {...obj, ...obj2};  // es7语法
console.log(newObj);
```

安装babel插件，在项目根目录执行命令
```
npm install babel-preset-stage-0 -D  // ES7不同阶段语法提案的转码规则（共有4个阶段）
```
stage-0 包含 stage-1 stage-2 stage-3 阶段 还包含 babel-plugin-transform-do-expressionsbabel-plugin-transform-function-bind 两个插件的功能，[阶段标准](https://github.com/tc39/proposals)

修改demo4/.babelrc文件
```
{
  "presets": ["env","stage-0"]
}
```
在demo4路径下执行 webpack，就看到打包成功了打开demo4/index.js文件控制台就输出。
{name: "lanpangzhi", blog: "http://blog.langpz.com"}
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180613143713.png)

## 解析CSS
为了从 JavaScript 模块中 import 一个 CSS 文件，你需要配置如下loader。
安装babel插件，在项目根目录执行命令。
```
npm install --save-dev style-loader css-loader
```
修改demo4/webpack.config.js文件  在rules数组里添加一个规则。
```
{
  test: /\.css$/, // 匹配所有.css结尾的文件
  use: [ // use要从右往左写，先转成样式，再打包到style标签
    'style-loader',
    'css-loader'
  ]
}
```
创建css文件
```
cd src && touch index.css
```
修改demo4/src/index.css文件
```
body {
  background: red;
}
```
引入css文件
修改demo4/src/index.js文件
```
// 最上面添加一行
import './index.css';
```
在demo4路径下执行 webpack，就看到打包成功。打开demo4/index.html就有红色的背景色了。
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180613160924.png)

## 解析sass
为了从 JavaScript 模块中 import 一个 scss 文件，你需要配置如下loader。
安装babel插件，在项目根目录执行命令。
```
npm install sass-loader node-sass webpack --save-dev
```
修改demo4/webpack.config.js文件，在rules数组里添加一个规则。
```
{
  test: /\.scss$/, // 匹配所有.scss结尾的文件
  use: [ 
    'style-loader', // 将 JS 字符串生成为 style 节点
    'css-loader', // 将 CSS 转化成 CommonJS 模块
    'sass-loader' // 将 Sass 编译成 CSS
  ]
}
```
创建scss文件
```
cd src && touch index.scss
```
修改demo4/src/index.scss文件
```
$body-color: yellow;
body {
  background: $body-color;
}
```
修改demo4/src/index.js文件
```
// 最上面一行替换如下代码
import './index.scss';
```
在demo4路径下执行 webpack，就看到sass编译成功。打开demo4/index.html就有绿色的背景色了。
!()[http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180613163909.png]
如果你想解析其他预处理css语言安装对应loader，添加规则就可以编译了。
如less  less-loader。

## 解析图片
假想，现在我们正在下载 CSS，但是我们的背景和图标这些图片，要如何处理呢？使用 file-loader，我们可以轻松地将这些内容混合到 CSS 中。
安装babel插件，在项目根目录执行命令。
```
npm install --save-dev file-loader 
```
随意再网上下载一个png图片放到demo4/src/目录下，命名为1.png

修改demo4/src/index.scss文件
```
body {
  background: url(./1.png);
}
```

修改demo4/webpack.config.js文件，在rules数组里添加一个规则。
```
{
  test: /\.(png|svg|jpg|gif)$/, // 匹配所有.png和.svg和.jpg和.gif结尾的文件
  use: [
    {
      loader: 'file-loader',
      options: {
        publicPath: 'dist/' // 设置public 发布目录。
      }
    }
  ]
}
```
在demo4路径下执行 webpack，就看到图片编译成功。打开demo4/index.html就有背景图。
![](http://hexo-1252491761.file.myqcloud.com/webpack4.0%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97/QQ%E5%9B%BE%E7%89%8720180613171021.png)

## 加载字体
像字体这样的其他资源如何处理呢？file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。让我们更新 webpack.config.js 来处理字体文件。
修改demo4/webpack.config.js文件，在rules数组里添加一个规则。
```
{
 test: /\.(woff|woff2|eot|ttf|otf)$/,
 use: [
   'file-loader'
 ]
}
```
如果样式文件里面引入了字体就会被打包，这里就不演示了。

# demo仓库地址
[https://github.com/lanpangzhi/webpack-demo](https://github.com/lanpangzhi/webpack-demo)