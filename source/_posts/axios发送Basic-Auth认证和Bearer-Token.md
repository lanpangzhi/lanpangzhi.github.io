---
title: axios发送Basic Auth认证和Bearer Token
date: 2023-02-03 20:43:16
tags: axios
keywords: axios发送Basic Auth认证和Bearer Token
---
# Basic Auth认证
<!--more-->
axios配置如下只需要增加 auth 参数即可，`auth: {username: 'lanpz',password: '123456789'}`。

```
axios.post('xxx', {x: 1}, auth: {username: 'lanpz',password: '123456789'} , {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
}).then(({data}) => console.log(data));
```

# Bearer Token
在axios请求拦截器里面自定义下请求头即可。
```
service.interceptors.request.use(async request => {
  request.headers['Authorization'] = `Bearer ${token}`
})
```