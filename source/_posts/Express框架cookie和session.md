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
npm install cookie-parser -S
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
这样使用cookie不安全，敏感信息容易被篡改，所以要使用带签名的cookie。

带签名的cookie
```
// app.js
const express = require('express');
const cookieParser = require('cookie-parser');

let app = express();

app.use(cookieParser('abc123456abc')); // 设置cookieParser 中间件  使用签名必须要设置字符串。

app.get('/', (req, res) => {
    console.log(req.cookies); // 获取cookie
    console.log(req.signedCookies); // 获取带签名的cookie
    res.cookie('user', 'lanpangzhi', {
        signed: true // 设置带签名的cookie
    }); 
    res.send('OK');
});

app.listen(8000);
```
再执行，就会发现浏览器cookie的值变成了s%3Alanpangzhi.i6hEUuhD%2Fd0miBMsGyRdktiDFmi%2BYfiJhQTcqKpQqIc ，再修改cookie的值，控制台就会输出{ user: false }，这样cookie就不会被简单的篡改了。

req.cookies 获取cookie。
res.cookie(name, value [, options]);
    name: cookie的名称(string)。
    value: cookie的值，(string or object)。
    options：options参数是一个可以具有以下属性的对象。
### 如下
| 值 | 类型 | 说明 |
|:----:|:----:|:----|
|domain | String | cookie的域名。 默认为网站的域名。|
|encode | Function | 用于cookie值编码的同步函数。 默认为encodeURIComponent。|
|expires | Date | cookie的有效期（如果未指定或设置为0），则创建会话cookie。|
|httpOnly | Boolean | 将cookie标记为仅可由Web服务器访问。默认false|
|maxAge | Number | 设置cookie的到期时间、相对于当前时间的到期时间（以毫秒为单位）。|
|path | String | cookie的路径。 默认为“/” |
|secure | Boolean | 将cookie标记为仅与HTTPS一起使用。默认false|
|signed | Boolean | 对cookie进行签名。默认false|

## Express操作session
先安装cookie-session。
```
npm install cookie-session -S
```
```
// app.js
const express = require('express');
const cookieSession = require('cookie-session');

let app = express();

app.use(cookieSession({
    secret: 'aaaa'
}));  // 设置cookieSession中间件

app.get('/', (req, res) => {
    if (req.session['num']) {
        req.session['num']++;
    }else{
        req.session['num'] = 1; // 设置session
    }
    res.send(`访问${req.session["num"]}次`);
});

app.listen(8000);
```
在cmd执行 node app.js 浏览器输入http://localhost:8000/  刷新浏览器就可以看到访问几次，把所有浏览器都关闭session就失效了，再进入页面就从第一次开始了。
更多方法还有详细参数可以去github自行参考。

# 参考
[http://expressjs.com/en/4x/api.html](http://expressjs.com/en/4x/api.html)
[https://github.com/expressjs/cookie-parser](https://github.com/expressjs/cookie-parser)
[https://github.com/expressjs/cookie-session](https://github.com/expressjs/cookie-session)