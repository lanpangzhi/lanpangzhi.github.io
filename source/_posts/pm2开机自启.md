---
title: pm2开机自启
date: 2018-11-20 09:40:00
tags: [pm2, Node.js]
keywords: pm2开机自启
---

# pm2开机自启

```
pm2 start  # 你要启动的程序，如果有多个都要先启动
pm2 save
pm2 startup
```
执行代码，重启服务器pm2会自动启动。
<!--more-->

[https://cnodejs.org/topic/556f02a98ce3684b284b55ad](https://cnodejs.org/topic/556f02a98ce3684b284b55ad) 