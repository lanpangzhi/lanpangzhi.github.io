---
title: path模块
date: 2018-02-26 11:17:42
tags: Node.js
---
# path模块
path模块是Node.js提供用于处理文件与目录的路径。
<!--more-->
## 连接路径
```
let path = require('path');

console.log(path.join(__dirname,'lan','pang','zi')) # 输出c:\Users\windows\Desktop\新建文件夹\lan\pang\zi
```
为什么要使用这个方法，因为Windows和liunx系统路径分隔符不一样，liunx系统是"/"，Windows系统是"\"，path.join()会正确使用当前系统的路径分隔符。

## 获取路径扩展名
```
let path = require('path');

console.log(path.extname(__filename)) # 输出 .js
```
从 path 的最后一部分中的最后一个 . 字符到字符串结束。 如果 path 的最后一部分没有 . 或 path 的文件名的第一个字符是 .，则返回一个空字符串。
```
console.log(path.extname('.lanpangzhi')) # 输出空字符串
console.log(path.extname('lanpangzhi.github.exe')) # 输出 .exe
console.log(path.extname('lanpangzhi.')) # 输出 .
console.log(path.extname('lanpangzhi')) # 输出空字符串
```

## 获取绝对路径
```
let path = require('path');

console.log(path.resolve('lan/pang','zi')) # 输出 c:\Users\windows\Desktop\新建文件夹\lan\pang\zi
```
路径的序列是从右往左被处理的。
如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上。
生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。
如果不传参数会得到当前所在的目录

## 判断是否是绝对路径
```
let path = require('path');

console.log(path.isAbsolute('/lanpangzhi')) # 输出 true
console.log(path.isAbsolute('lanpangzhi/')) # 输出 false
```
如果 path 不是一个字符串，则抛出 TypeError。

## 获取路径中的文件名
```
let path = require('path');

console.log(path.basename(__filename)) # 输出 http.js
console.log(path.basename(__filename,'.js')) # 输出 http
```
第一个参数是路径。
第二个参数是文件扩展名，如果加上只返回文件名。

## path.sep 文件路径分隔符

## path.delimiter 环境变量路径分隔符

# 参考
[http://nodejs.cn/api/path.html](http://nodejs.cn/api/path.html)