---
title: Windows下安装MySQL
date: 2018-05-08 11:02:20
tags: [MySQL, Windows]
keywords:  Windows下安装MySQL
---
# Windows下安装MySQL
MySQL是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，目前属于 Oracle 旗下产品。MySQL 是最流行的关系型数据库管理系统之一，在 WEB 应用方面，MySQL是最好的 RDBMS (Relational Database Management System，关系数据库管理系统) 应用软件。
<!--more-->

## 下载
[下载地址](https://dev.mysql.com/downloads/mysql/)
![](http://hexo-1252491761.file.myqcloud.com/Windows%E4%B8%8B%E5%AE%89%E8%A3%85MySQL/QQ%E5%9B%BE%E7%89%8720180508112259.png)
点击，进入页面。注：MySQL安装程序是32位的，但会安装32位和64位二进制文件。
![](http://hexo-1252491761.file.myqcloud.com/Windows%E4%B8%8B%E5%AE%89%E8%A3%85MySQL/QQ%E5%9B%BE%E7%89%8720180508113607.png)
点击download然后跳转到页面。可以不需要登陆和注册也可以下载。
![](http://hexo-1252491761.file.myqcloud.com/Windows%E4%B8%8B%E5%AE%89%E8%A3%85MySQL/QQ%E5%9B%BE%E7%89%8720180508113906.png)
再点击，安装程序就下载了。

## 安装
打开安装程序，勾选同意协议，点击下一步(Next)
![](http://hexo-1252491761.file.myqcloud.com/Windows%E4%B8%8B%E5%AE%89%E8%A3%85MySQL/QQ%E5%9B%BE%E7%89%8720180508115626.png)
现在只安装MySQL的服务端，点击下一步然后安装。
设置MySQL密码，继续下一步。然后完成，其余配置都是用默认配置。

## 使用Navicat for MySQL 管理MySQL
[下载地址](https://www.navicat.com.cn/download/navicat-for-mysql)
可以用它去管理MySQL。新建库，新建表，修改数据删除数据。

## MySQL基本概念
库： 文件夹-用来管理，无法存放数据，一个库可以存放很多张表。
表： 文件-存放数据用的。
列: 一列(数据元素) 包含了相同的数据, 例如用户的数据。
行：一行是一组相关的数据，例如一条用户名和密码的数据。
主键：主键是唯一的。一个数据表中只能包含一个主键。你可以使用主键来查询数据。
外键：外键用于关联两个表。

## MySQL常用数据类型
| 数据类型 | 说明 |
|:-----:|:-----:|
| INT | 整数|
| FLOAT | 浮点数|
| DATE | 日期值|
| DATETIME | 混合日期和时间值|
| TIME | 时间值或持续时间|
| VARCHAR | 变长字符串|
| CHAR | 定长字符串|


# 参考
[https://github.com/jaywcjlove/handbook/blob/master/MySQL/MySQL%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.md](https://github.com/jaywcjlove/handbook/blob/master/MySQL/MySQL%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.md)