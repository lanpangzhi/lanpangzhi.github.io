---
title: url模块
date: 2018-03-01 16:03:22
tags: Node.js
---
# url模块
url模块，用于将url字符串解析为对象或将对象格式化为url字符串，用来处理get请求非常方便。
模块只有三个方法，用起来也简单。

## url结构说明
网址：http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash
![](http://hexo-1252491761.file.myqcloud.com/url%E6%A8%A1%E5%9D%97/QQ%E5%9B%BE%E7%89%8720180301164245.png)
从node.js 中文网拿的图。


<!--more-->
## url.parse(urlString[, parseQueryString[, slashesDenoteHost]])
```
let url = require('url');

console.log(url.parse('http://user:pass@langpz.com:80/aaa/ccc/ddd?callback=fn#top'))
```
把url字符串解析成url对象。输出:
```
{
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'langpz.com:80',
  port: '80',
  hostname: 'langpz.com',
  hash: '#top',
  search: '?callback=fn',
  query: 'callback=fn',
  pathname: '/aaa/ccc/ddd',
  path: '/aaa/ccc/ddd?callback=fn',
  href: 'http://user:pass@langpz.com:80/aaa/ccc/ddd?callback=fn#top' }
```
- protocol: 请求协议。
- slashes: slashes 属性是一个 boolean，如果 协议 中的冒号后面跟着两个 ASCII 斜杠字符（/），则值为 true。
- auth： URL的用户名与密码部分。
- host: URL的主机部分包括端口号。
- port：主机的端口号。
- hostname：主机名部分。
- hash： 锚点部分。
- search： 整个查询字符串部分，包括前面的?号
- query: 查询字符串部分，不包括前面的?号
- pathname：URL 的整个路径部分。
- path： pathname 与 search 组成部分的串接。
- href： 解析后的完整的 URL 字符串，protocol 和 host 都会被转换为小写的。

第二个参数是布尔值，如果是 true，query值是一个对象。 默认为 false。
第三个参数是布尔值，如果是 true，则 // 之后至下一个 / 之前的字符串会被解析作为 host。 例如，//foo/bar 会被解析为 {host: 'foo', pathname: '/bar'} 而不是 {pathname: '//foo/bar'}。 默认为 false。


## url.format(urlObject)
```
let url = require('url');

console.log(url.format({
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: 'langpz.com:80',
    port: '80',
    hostname: 'langpz.com',
    hash: '#top',
    search: '?callback=fn',
    query: 'callback=fn',
    pathname: '/aaa/ccc/ddd',
    path: '/aaa/ccc/ddd?callback=fn',
    href: 'http://user:pass@langpz.com:80/aaa/ccc/ddd?callback=fn#top'
}));
```
url.parse()的反向操作，把url对象解析成url字符串

## url.resolve(from, to)

```
let url = require('url');

console.log(url.resolve('/one/two/three','four'))  # 输出 /one/two/four
console.log(url.resolve('http://blog.langpz.com/', 'aaa'))  # 输出  http://blog.langpz.com/aaa
console.log(url.resolve('http://blog.langpz.com/aaa', 'bbb'))  # 输出 http://blog.langpz.com/bbb
```
把最后一个/没有内容后面追加to参数，有内容则替换。

# 参考
[http://nodejs.cn/api/url.html](http://nodejs.cn/api/url.html)