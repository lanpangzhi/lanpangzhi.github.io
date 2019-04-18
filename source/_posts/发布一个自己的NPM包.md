---
title: 发布一个自己的NPM包
date: 2019-04-18 20:01:57
tags: npm
keywords: 发布一个自己的NPM包
---
# 发布一个自己的NPM包
用了这么多次别人发布的包，今天咱们自己发布一个npm包
<!--more-->

## 首先检查npm源
```
npm get registry
# 如果不是这个地址https://registry.npmjs.org  需要设置官网源
npm config set registry https://registry.npmjs.org
```
如果是使用第三方源请设置npm官方源 `(注)：第三方源只提供下载功能`

## 创建模块
```
npm init 

# package.json 内容
{
  "name": "isnumber-lpz",
  "version": "1.0.0",
  "description": "Number\u001b[D\u001b[D\u001b[D\u001b[D\u001b[D\u001b[D\u001b[D\u001b[D\u001b[D\u001b[C\u001b[C\u001b[Cis\u001b[C\u001b[C\u001b[Number",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lanpangzhi/isNumber-lpz.git"
  },
  "author": "lanpangzhi",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/lanpangzhi/isNumber-lpz/issues"
  },
  "homepage": "https://github.com/lanpangzhi/isNumber-lpz#readme"
}

# 创建 index.js
touch index.js

function isNumber(number) {
  number = parseFloat(number)
  return number === number && typeof number === 'number' 
}

module.exports = isNumber
```
[npm使用介绍](http://blog.langpz.com/npm%E4%BD%BF%E7%94%A8%E4%BB%8B%E7%BB%8D.html)里面有里面的字段，这里就省略了，`(注)：包的name不要重名建议先去[https://www.npmjs.com/](https://www.npmjs.com/)搜索下`

## 注册npm账号（有账号跳过这步）
npm adduser用于在npmjs.com注册一个用户。
```
npm adduser
# Username: 用户名
# Password: 密码
# Email: 邮箱

# 登录
npm login
```

## 发布包
```
npm publish
```
 `(注)：发布的时候版本号要和上次的不一样，默认的发布标签是latest、前模块是一个beta版，比如2.1.1-beta，那么发布的时候需要使用tag参数`
 
## 安装并使用
```
npm i isnumber-lpz

const isNumber = require('isnumber-lpz')

console.log('12', isNumber(12))   true
console.log('12.2', isNumber(12.2))    true
console.log('x12.2', isNumber('x12.2'))   false
console.log('xacsa', isNumber('xacsa'))   false
```
 
 ## demo 地址
 [https://github.com/lanpangzhi/isNumber-lpz](https://github.com/lanpangzhi/isNumber-lpz)
