---
title: Git配置https免用户名和密码提交
date: 2018-01-03 14:15:36
tags: Git
keywords: Git配置https免用户名和密码提交
---
# Git配置https免用户名和密码提交
    我们如果是通过git clone https://xxx 下载的项目每次Push的时候需要输入用户名和密码，其实Git可以通过配置实现免密码提交。
<!--more-->
在Git Bash 里面输入命令。
```
    git config --global credential.helper store
```
然后再提交输入用户名和密码提交完成后，用户名和密码就被保存了，下次再提交就不用再输入了。