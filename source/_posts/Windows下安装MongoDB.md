---
title: Windows下安装MongoDB
date: 2018-05-08 15:30:32
tags: [MongoDB, Windows]
keywords:  Windows下安装MongoDB
---
# Windows下安装MongoDB
MongoDB是一种面向文档的数据库管理系统，由C++撰写而成，以此来解决应用程序开发社区中的大量现实问题。
<!--more-->

## MongoDB特点
和关系型数据库比较，面向文档的数据库不再有“行”（row）的概念，取而代之的是更为灵活的“文档”（document）模型。通过再文档中嵌入文档和数组，面向文档的方法能够仅使用一条记录来表现复杂的层次关系。
另外，不再有预定义模式，文档的键（key）和值（value）不再是固定的类型和大小。由于没有固定的模式，根据需要添加或删除字段变得更容易。可以进行快速迭代，所以开发进程得到加快。

## 下载和安装
[下载地址](https://www.mongodb.com/download-center#atlas)
![](http://hexo-1252491761.file.myqcloud.com/Windows%E4%B8%8B%E5%AE%89%E8%A3%85MongoDB/QQ%E5%9B%BE%E7%89%8720180508155317.png)
点击下载，下载完安装，用默认设置。

## 运行MongoDB
命令提示符（cmd）执行，具体路径需要看安装的版本，我的是3.6版本。
```
cd C:\Program Files\MongoDB\Server\3.6\bin
mongod --dbpath d:\db
```
控制台会输出一些东西，没有报错MongoDB就启动了。

## 连接MongoDB
在打开一个命令提示符（cmd）之前运行的MongoDB那个不要关闭，因为没有注册成windows的服务，关闭就找不到数据库了。
```
cd C:\Program Files\MongoDB\Server\3.6\bin
mongod
```
这样就链接上数据库了，当然还会输出一大堆东西。

## 操作MongoDB
我们先创建一个数据库，再刚才连接MongoDB的cmd执行
```
use test02
```
创建一个test02的数据库并切换过去。
db变量指向当前数据库。
插入一条数据，之前也讲了MongoDB没有预定义模式，所以不用新建表和表结构了，
```
db.user_table.insert({"name", "lanpangzhi", "age": 18})
```
