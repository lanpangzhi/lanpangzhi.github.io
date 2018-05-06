---
title: Express框架cookie和session
date: 2018-05-06 17:32:54
tags: [Express, cookie, session]
keywords: Express框架 cookie session
---
# Express框架cookie和session
HTTP协议是无状态的，所以要通过一些机制来记录用户的信息。cookie是存在浏览器端的，session是存在服务器端。
<!--more-->

## cookie
cookie存在浏览器端，每次请求都会带上。
    缺点：不安全(用户可以随便串改)，大小（4k）。

## session
session只存在服务器端。
    优点：容量不限，比较安全（用户接触不到）。
    session实现是基于cookie的。
风险：session_id 被泄露漏 session劫持。
    提醒用户不在在控制台输入(console)输入代码。
    session_id 足够复杂，定期更换。

## Express操作cookie
先安装cookie-parser。
```
npm install cookie-parser -D
```
```
// app.js
const express = require('express');
const cookieParser = require('cookie-parser');

let app = express();

app.use(cookieParser()); // 设置cookieParser 中间件

app.get('/', (req, res) => {
    console.log(req.cookies); // 获取cookie
    res.cookie('user', 'lanpangzhi'); // 设置cookie
    res.send('OK');
});

app.listen(8000);
```
在cmd执行 node app.js 浏览器输入http://localhost:8000/ 第一次控制台输出{}，再刷新就输出{user: 'lanpangzhi' }。
现在就能获取和设置cookie了，但是有个问题，浏览器执行document.cookie = "user=aaa",浏览器再刷新控制台就会输出{user: 'aaa' }。


## Express操作session
先安装cookie-session。
```
npm install cookie-session -D
```