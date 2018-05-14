---
title: 使用express-generator快速生成express应用
date: 2018-05-14 16:08:03
tags: [Express, Node.js,express-generator]
keywords: 使用express-generator快速生成express应用
---
# 使用express-generator快速生成express应用
express-generator是Express应用的快速生成器，可以随意使用此结构或者对其进行修改以最大程度满足自己的需求。
<!--more-->

## 安装
```
npm install -g express-generator
```
需要全局安装。

## 使用
在要创建应用的文件夹下面执。
```
express -e myapp
```
-e： 使用ejs模板
myapp： 应用名字

然后安装依赖项：
```
cd myapp
npm install
```

执行应用
```
set DEBUG=myapp:* & npm start  
```
生成完应用的时候会有提示因为我是Windows系统所以提示set。
MacOS 或 Linux 上不用使用set
```
DEBUG=myapp:* npm start
```
然后在浏览器中输入 http://localhost:3000/ 以访问此应用程序。
可以根据自己的需要修改文件，来满足自己项目的需要。

## 更多参数
```
    --version        输出版本号
-e, --ejs            添加ejs引擎支持
    --pug            添加pug引擎支持
    --hbs            添加handlebars引擎支持
-H, --hogan          添加hogan.js引擎支持
-v, --view <engine>  添加以下模板引擎支持(dust|ejs|hbs|hjs|jade|pug|twig|vash) 默认jade  
    --no-view        使用静态HTML代替视图模板引擎
-c, --css <engine>   添加样式扩展语言 (less|stylus|compass|sass) 默认css  
    --git            添加 .gitignore 忽略文件
-h, --help           输出帮助信息
```

# 参考
[https://github.com/expressjs/generator](https://github.com/expressjs/generator)