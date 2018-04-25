---
title: Express处理数据请求
date: 2018-04-02 17:28:39
tags: Express
keywords: Express处理数据请求 post get
---
# Express处理数据请求
之前文章里面介绍了如何用原生Node处理数据请求。
现在通过Express框架处理post和get请求。
<!--more-->

## 处理get请求
这个比较简单(不需要使用中间件)直接req.query就能获取到。
```
// 服务端代码
const express = require('express');

let app = express();


app.get('/', (req, res) => {
    console.log(req.query);
});

app.listen(8000);
```
```
// 客户端代码
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="http://localhost:8000" method="get">
        <input type="text" name="user" /> </br>
        <input type="password" name="pass" /> </br>
        <input type="submit" value="提交"/>
    </form>
</body>
</html>
```
用命令提示行运行服务器，打开刚才写好的网页输入内容提交表单。
就可以获取到一个json对象如 { user: '123', pass: 'abc' } 方便操作。

## 处理post请求
处理post请求需要用到body-parser这个中间件。
这个中间件可以解析JSON、Raw、文本、URL-encoded格式的请求体。
先安装中间件
```
npm install body-parser
```
在项目中引用body-parser中间件。
```
// 服务端代码
const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// 引用body-parser中间件
app.use(bodyParser.urlencoded());

app.post('/', (req, res) => {
    // req.body post 提交过来的数据
    console.log(req.body);
});

app.listen(8000);
```
```
// 客户端代码
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="http://localhost:8000" method="post">
        <input type="text" name="user" /> </br>
        <input type="password" name="pass" /> </br>
        <input type="submit" value="提交"/>
    </form>
</body>
</html>
```
用命令提示行运行服务器，打开刚才写好的网页输入内容提交表单。
就可以获取到一个json对象如 { user: 'lanpangzhi', pass: '123456' } 方便操作。
这样我们就通过Express获取到get和post提交过来的数据了。

urlencoded() 方法配置参数 (options)
- extended 设置为false时，会使用querystring库解析URL编码的数据；当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。默认为true。但使用默认已被弃用。 请研究qs和querystring之间的差异并选择适当的设置。
- inflate  设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
- limit 设置最大请求头大小， 如果这是一个数字，那么该值指定字节数; 如果它是一个字符串，则将该值传递给字节库解析。默认为100kb。
- parameterLimit  用于设置URL编码值的最大参数数量， 如果请求包含的参数多于此值，那么413将返回给客户端。默认为1000。
- type  用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
- verify  这个选项仅在verify(req, res, buf, encoding)时受支持。

body-parser里面还有另外几个方法，可以自行去github看下。

# 参考
[https://github.com/expressjs/body-parser]