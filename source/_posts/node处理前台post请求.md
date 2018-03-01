---
title: node处理前台post请求
date: 2018-03-01 10:29:37
tags: Node.js
---
# node.js处理前台post请求
这里就不讲如何处理get请求了，直接req.url就可以接收到请求的参数。
<!--more-->

## 服务端代码 
```
// http.js
let http = require('http');
let querystring = require('querystring');

let app = http.createServer((req, res) => {
    let str = '';
    if (req.url === '/post'){
        req.on('data', (data) => {
            str += data;
        });

        req.on('end', () => {
            console.log(querystring.parse(str));
        });
    }
});

app.listen(8000)
```
先搭一个服务器监听8000端口，判断请求路径，再绑定data事件接收客户端发过来的post请求，接受用querystring模块处理接收的数据。

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
    <form action="http://localhost:8000/post" method="post">
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