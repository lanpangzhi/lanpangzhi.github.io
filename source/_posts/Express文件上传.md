---
title: Express文件上传
date: 2018-05-04 15:58:58
tags: [Express, Node.js, 文件上传]
keywords: Express文件上传-Multer中间件
---
# Express文件上传
在后台项目中会经常碰见文件上传这个需求，例如用户上传一张头像等。。。今天就用Multer这个中间件来解决文件上传。
<!--more-->

## 安装Multer
第一步先安装Multer到你的项目里。
```
npm install --save multer
```

## 创建一个form表单
这里就不用ajax去上传了。
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
    <form action="http://localhost:8000" method="post" enctype="multipart/form-data">
        <input type="file" name="image" />
        <input type="submit" value="提交" />
    </form>
</body>
</html>
```

## form表单enctype属性
| 值 | 说明 |
|:----:|:----:|
|application/x-www-form-urlencoded | 在发送前编码所有字符（默认）|
|multipart/form-data | 不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。|
|text/plain | 空格转换为 "+" 加号，但不对特殊字符编码。|

## 引用配置multer
```
// app.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploda = multer({
    dest: './uploads/' // 服务接收文件的路径
});

let app = express();

app.use(uploda.any()); // multer放到express中间件里

app.post('/', (req, res) => {
    console.log(req.files); // req.files接收到的文件信息一个数组
    // 添加后缀名，只支持一个文件上加后缀名，多文件改成递归
    let newName = req.files[0].path + path.extname(req.files[0].originalname);
    console.log(newName, req.files[0].path);
    fs.rename(req.files[0].path, newName, (err) => {
        if(err){
            console.log(err);
            res.sendStatus(500).send('error');
        }else{
            res.send('OK，上传成功。');
        }
        
    });
});

app.listen(8000);
```
在cmd执行 node app.js 打开index.html 选择文件上传，服务端就可以成功接收文件了。
multer 还有一些别的方法和参数，可自行去github查看。

# 参考
[https://github.com/expressjs/multer](https://github.com/expressjs/multer)