---
title: Node.js使用Nodemailer发送邮件通知
date: 2022-02-28 19:53:15
tags: Node.js
keywords: Node.js使用Nodemailer发送邮件通知
---
# Node.js使用Nodemailer发送邮件通知
Nodemailer是一个用于 Node.js 应用程序的模块，可以轻松发送电子邮件。支持Windows系统，使用要求Node.js v6.0.0或更新版本。
<!--more-->

## 安装Nodemailer
```
yarn add nodemailer 
or
npm i nodemailer
```

## 使用
这里使用qq邮箱发送邮件，[开启SMTP教程](https://jingyan.baidu.com/article/6079ad0eb14aaa28fe86db5a.html)

```
const nodemailer = require('nodemailer');

// 1.创建一个Nodemailer smtp传输对象
transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: '465',
  secureConnection: true,
	secure: false, // true for 465, false for other ports
  auth: { user:'SMTP邮箱名', pass: 'SMTP授权码' }
});

// 2. 配置消息
const data = {
  subject: '标题',
  from: '发送邮箱'
  to: '接收邮箱、多邮箱拿，号分割',
  html: '支持发送html',
  text: '文本内容'
}

// 3. 发送
transporter.sendMail(data)
```
更多使用方法参考[文档](https://nodemailer.com/)

# 参考
[https://github.com/nodemailer/nodemailer](https://github.com/nodemailer/nodemailer)