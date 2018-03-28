---
title: express简单入坑
date: 2018-03-19 13:38:00
tags: Express
---
# express简单入坑
Express 是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。
<!--more-->
## 安装
```
npm init 
npm install express --save
```

## 创建第一个应用
```
// app.js
const express = require('express');

let app = express();

app.get('/',(req,res) => {
    res.send('express');
});

app.listen(8000);
```
在命令行执行 node app.js 浏览器输入 http://localhost:8000/就可以访问了。

## 路由控制

### app.get(path, (request, response) => {})
根据path处理客户端发过来的GET请求。
第一个参数：path请求的路径。
第二个参数：回调函数，request(请求),response(响应)
```
app.get('/',(req,res) => {
    res.send('home');
});
app.get('/hello',(req,res) => {
    res.send('hello');
});
```

### app.post(path, (request, response) => {})
根据path处理客户端发过来的POST请求。
参数和app.get()方法一样。
```
app.post('/', (req, res) => {
    res.send('home');
});
app.post('/hello', (req, res) => {
    res.send('hello');
});
```

### app.all(path, (request, response) => {})
根据path处理客户端发过来的所有http(GET,POST,PUT,DELETE,HEAD)请求。
参数和app.get()方法一样。

res.send()  发送各种类型的响应。
res.download() 提示下载文件。
res.redirect() 重定向请求。
res.sendStatus() 设置响应状态代码，并将其以字符串形式作为响应体的一部分发送。

## 静态文件
Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
只需要把文件目录作为参数传给express.static，之后就可以访问到静态文件。
```
app.use(express.static('./public'))
```
注： 所有文件的路径都是相对于存放目录的，因此，存放静态文件的目录名不会出现在 URL 中。

## 中间件
Express应用就是在调用各种中间件完成功能的，如cookie解析、文件上传、静态文件等。
中间件（Middleware） 是一个函数。它可以访问请求对象（request object (req)）, 响应对象（response object (res)）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。
如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。
```
app.use((req, res, next) => {
    console.log('aaa');
    next();
})

app.use((req, res, next) => {
    console.log('bbb');
    next()
})

app.use((req, res, next) => {
    console.log('ccc');
})
```
可以看到next 的作用，把控制器交给下一个中间件。
可以利用中间件特性来处理登陆用户。
1. 检查数据是否合法。
2. 检查数据是否存在。
3. 检查数据密码是否正确。
```
app.get('/login', (req, res, next) => {
    if(合法){
        next()
    }else{
        res.send('用户名不合法')
    }
})

app.get('/login', (req, res, next) => {
    if(存在){
        next()
    }else{
        res.send('用户名不存在')
    }
})

app.get('/login', (req, res, next) => {
    if(密码正确){
        res.send('登陆成功')
    }else{
        res.send('密码不正确')
    }
})
```
中间件的大概用法就是这样。

## 模板引擎
先安装ejs模板
npm install ejs -S
```
app.set('view engine', 'ejs'); # view engine, 模板引擎
app.set('views', './views');   # views, 放模板文件的目录
```

```
// index.js
const express = require('express');
const ejs = require('ejs');

let app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index',{title: 'hello'});
});

app.listen(8000);
```

```
// index.ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <%= title %>
</body>
</html>
```
在命令行里执行node index.js，就可以看到模板了。