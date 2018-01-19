---
title: http模块
date: 2018-01-15 17:05:37
tags: Node.js
---
# http模块
http模块是node提供搭建http客户端和服务端的核心模块。
<!--more-->
## 什么是客户端和什么是服务端
客户端（Client），是指与服务器相对应，为客户提供本地服务的程序。一般安装在普通的用户机上，需要与服务端互相配合运行。互联网发展以后，较常用的客户端包括了如万维网使用的网页浏览器，收寄电子邮件时的电子邮件客户端，以及即时通信的客户端软件等。
服务端(Server)，是为客户端服务的，服务的内容诸如向客户端提供资源，保存客户端数据。是实现游戏特色化的重要途径，也是最直接可以通过游戏表现出来的技术，比如你要修改某个NPC的参数，重加载后，在游戏内立刻体现出来。

## 搭建一个服务器
```
var http = require('http');

var app = http.createServer(function(request,response){
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('入坑了...');
	response.end();
});

app.listen(8000);
```
http.createServer() 创建一个服务器的实例，它的参数是一个函数，函数里有两个参数request和response，request是从客户端的请求、response是服务端的响应。
输入 http://localhost:8000 就可以看到（入坑了...）这几个字。代表创建成功。
response.writeHead() 发送一个http响应头给请求。
response.write() 向客户端发送响应体。
response.end()  结束响应。
listen() 监听的端口。

## 客户端向HTTP服务器发起请求
### http.request(options[, callback])
options: Object | string | URL
- protocol <string> 使用的协议。默认为 http:。
- host <string> 请求发送至的服务器的域名或 IP 地址。默认为 localhost。
- hostname <string> host 的别名。为了支持 url.parse()，hostname 优先于 host。
- family <number> 当解析 host 和 hostname 时使用的 IP 地址族。 有效值是 4 或 6。当未指定时，则同时使用 IP v4 和 v6。
- port <number> 远程服务器的端口。默认为 80。
- localAddress <string> 为网络连接绑定的本地接口。
- socketPath <string> Unix 域 Socket（使用 host:port 或 socketPath）。
- method <string> 指定 HTTP 请求方法的字符串。默认为 'GET'。
- path <string> 请求的路径。默认为 '/'。 应包括查询字符串（如有的话）。如 '/index.html?page=12'。 当请求的路径中包含非法字符时，会抛出异常。 目前只有空字符会被拒绝，但未来可能会变化。
- headers <Object> 包含请求头的对象。
- auth <string> 基本身份验证，如 'user:password' 用来计算 Authorization 请求头。
- agent <http.Agent> | <boolean> 控制 Agent 的行为。 可能的值有：undefined (默认): 对该主机和端口使用 http.globalAgent。
- Agent 对象：显式地使用传入的 Agent。false: 创建一个新的使用默认值的 Agent。
- createConnection <Function> 当不使用 agent 选项时，为请求创建一个 socket 或流。 这可以用于避免仅仅创建一个自定义的 Agent 类来覆盖默认的 createConnection 函数。详见 agent.createConnection()。
- timeout <number>: 指定 socket 超时的毫秒数。 它设置了 socket 等待连接的超时时间。
```

```
### http.get(options[, callback])
```
var http = require('http');

http.get('http://blog.langpz.com', (res) => {
	const { statusCode } = res;
	console.log(statusCode)
	var html = ""
	res.on("data", (data) => {
		html += data
	})

	res.on("end", () => {
		console.log(html)
	})		
}).on('error', (e) => {
	console.error(`错误: ${e.message}`);
});	
```
# 参考
[https://zh.wikipedia.org/wiki/%E5%AE%A2%E6%88%B7%E7%AB%AF](https://zh.wikipedia.org/wiki/%E5%AE%A2%E6%88%B7%E7%AB%AF)
[https://baike.baidu.com/item/%E6%9C%8D%E5%8A%A1%E7%AB%AF](https://baike.baidu.com/item/%E6%9C%8D%E5%8A%A1%E7%AB%AF)
