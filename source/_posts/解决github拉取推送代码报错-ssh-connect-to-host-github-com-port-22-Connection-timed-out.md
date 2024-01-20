---
title: '解决github拉取推送代码报错:ssh: connect to host github.com port 22: Connection timed out'
date: 2024-01-20 18:49:52
tags: github
keywords: 'ssh: connect to host github.com port 22: Connection timed out'
---
# github拉代码报错
ssh: connect to host github.com port 22: Connection timed out
<!--more-->
Windows 找到用户/.ssh/config 文件
macOS ~/.ssh/config
没有config文件就创建一个
```
Host github.com
  Hostname ssh.github.com
  Port 443
```
重新拉取或提交代码，就可以正常使用了。