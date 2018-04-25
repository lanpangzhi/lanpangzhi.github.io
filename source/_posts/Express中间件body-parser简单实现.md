---
title: Express中间件body-parser简单实现
date: 2018-04-18 11:49:16
tags: Express
keywords: Express中间件body-parser简单实现
---
# Express中间件body-parser简单实现
之前文章写了怎么用body-parser中间件处理post请求，今天就大概实现下body-parser中urlencoded 这个方法。
<!--more-->
首先通过命令提示输入 mkdir lib && cd lib。
再输入touch body-parser.js。
把下面的代码在body-parser.js 敲一遍。
```
// lib/body-parser.js
const querystring = require('querystring');

module.exports.urlencoded = function (req, res, next) {
    let chunks = [];
    req.on('data', data => {
        chunks.push(data);
    });

    req.on('end', () => {
        // 合并Buffer。
        let buf = Buffer.concat(chunks).toString();
        // 把querystring解析过的json 放到 req.body上。
        req.body = querystring.parse(buf);
        next();
    });
}
```
下面是主程序代码。
```
// app.js
const express = require('express');
const bodyParser = require('./lib/body-parser');

let app = express();

app.use(bodyParser.urlencoded);


app.post('/', (req, res) => {
    res.send(req.body);
});

app.listen(8000);
```
现在就完成和body-parser中间件类似的功能了，req.body上面有请求过来的post数据。