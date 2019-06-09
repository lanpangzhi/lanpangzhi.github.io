---
title: Git版本回退
date: 2019-06-09 18:04:28
tags: [Git]
keywords: Git版本回退
---
# Git版本回退
在工作中会碰见这个功能不要了，回退到上一个版本、或者merge错分支，下面简单记录下如何解决这些问题。

<!--more-->

## 回退指定commit
```
git log
git reset --hard 版本号
```
git log 查看之前提交的commit版本号，然后执行回退。

## 回退命令
```
git reflog
git reset --hard 版本号
```
git reflog 查看之前执行命令版本号，然后执行回退。

## cherry-pick
还有一种场景， 比如有三个commit，保留1和3，2舍去这个时候就要用到 cherry-pick
```
git reflog 
git reset --hard 1的版本号
git cherry-pick  3的版本号
```
git reflog  找到commit 1和3的版本号 回退到第一个版本，然后再执行cherry-pick把3的修改合并到1里，**如果有冲突就解决冲突**。

## 已经提交远端仓库
```
git reset --hard 版本号
git push -f origin/远端分支
```
先回退版本，然后**强制推送到远端仓库**。