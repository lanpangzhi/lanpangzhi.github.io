---
title: centos7安装MySQL
date: 2019-03-17 18:09:33
tags: MySQL
keywords: centos7安装MySQL
---
# centos7安装MySQL
先去MySQL官网找到下载链接(https://dev.mysql.com/downloads/repo/yum/)
<!--more-->

## 下载安装
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/centos7%E5%AE%89%E8%A3%85MySQL/QQ%E5%9B%BE%E7%89%8720190317194358.png)
执行下面的命令下载并安装MySQL
```
wget http://repo.mysql.com/mysql80-community-release-el7-2.noarch.rpm
rpm -Uvh mysql80-community-release-el7-2.noarch.rpm
yum update
yum install mysql-community-server
```

## 启动MySQL服务器
执行下面的命令启动MySQL
```
service mysqld start
```
执行下面的命令检测MySQL状态
```
service mysqld status
```

# 参考
[https://dev.mysql.com/downloads/repo/yum/](https://dev.mysql.com/downloads/repo/yum/)