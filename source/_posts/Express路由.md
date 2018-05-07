---
title: Express路由
date: 2018-05-07 17:50:08
tags: [Express, 路由]
keywords: Express路由
---
# Express路由
之前在Express入坑里面简单讲了下路由的用法，现在就讲下如果再项目中怎么配置路由。
<!--more-->

一个网站下面可能有很多地址例如:
www.langpz.com/aaa
user/
www.langpz.com/user/aaa
www.langpz.com/user/bbb
www.langpz.com/user/ccc
vip/
www.langpz.com/vip/aaa
www.langpz.com/vip/bbb
www.langpz.com/vip/ccc
等等。。。
咱们可以拆分成vip和user两个目录目录下再放子路由。
```
const express = require('express');
const cookieSession = require('cookie-session');

let app = express();

let routerVip = express.Router();
let routerUser = express.Router();

app.use('/user', routerUser);

app.use('/vip', routerVip);

routerUser.get('/', (req, res) =>{
    res.send('我是user根目录')
});

routerUser.get('/aaa', (req, res) => {
    res.send('我是user/aaa目录')
});

routerUser.get('/bbb', (req, res) => {
    res.send('我是user/bbb目录')
});

routerVip.get('/', (req, res) => {
    res.send('我是vip根目录')
});

routerVip.get('/aaa', (req, res) => {
    res.send('我是vip/aaa目录')
});

routerVip.get('/bbb', (req, res) => {
    res.send('我是vip/bbb目录')
});
app.listen(8000);
```