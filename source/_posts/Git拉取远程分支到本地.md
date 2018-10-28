---
title: Git拉取远程分支到本地
date: 2018-10-25 20:42:31
tags: [Git]
keywords: Git拉取远程分支到本地
---
# Git拉取远程分支到本地
经常会碰见拉取远端的分支到本地，步骤和命令经常记不住所以只好做个笔记。
<!--more-->

## 拉取分支
首先你得先查看你是否和远端的仓库建立连接。
```
git remote -v
```
如果没有的话那就自行添加一下
```
git remote add origin  xxxx(你远程分支的git仓库地址)
```
如果每天要提交代码 ，可以绕过上面这一步，直接切换分支
```
git checkout -b Q3 origin/Q3
```
这个时候操作失败提示如下：
- fatal: 'origin/Q3' is not a commit and a branch 'Q3' cannot be created from it
代表你本地没有Q3这个远程分支。

可以执行 git branch -r 来检查本地是否有Q3远程分支。
拉取远程分支到本地并切换分支。
```
git fetch origin Q3
git checkout -b Q3 origin/Q3
```
拉取远程分支到本地
```
git pull origin Q3
```

# 参考
[https://curder.gitbooks.io/blog/git/remote_repository_pull.html](https://curder.gitbooks.io/blog/git/remote_repository_pull.html)