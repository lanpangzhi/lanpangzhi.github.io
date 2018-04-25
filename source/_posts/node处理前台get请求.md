---
title: node处理前台get请求
date: 2018-03-02 10:07:32
tags: Node.js
keywords: Node.js处理get请求
---
# node.js处理前台get请求
下面代码实现了用node.js接收前台发送的get请求。用到了http模块和url模块。
<!--more-->

## 服务端代码 
```
const http = require('http');
const url = require('url');

let app = http.createServer((req, res) => {
    let getUrl = url.parse(req.url, true);
    if (getUrl.pathname === '/getUser'){
        console.log(url.parse(req.url, true).query);
        res.end(url.parse(req.url, true).query.user);
    }
});

app.listen(8000);
```
先搭一个服务器监听8000端口，再把请求的链接用URL模块解析成对象，判断请求路径，返回user。

## 客户端代码
```
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="http://localhost:8000/getUser" method="get">
        <input type="text" name="user" /> </br>
        <input type="password" name="pass" /> </br>
        <input type="submit" value="提交"/>
    </form>
</body>
</html>
```
在命令行执行 node http.js。
打开index.html 输入数据，点击提交按钮。
node输出 { user: '123', pass: 'abc' }  123和abc 就是你输入的数据。
前台页面会显示你输入的user。