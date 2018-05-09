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

## MongoDB基本概念
文档是MongoDB中数据的基本单元，非常类似于关系型数据库管理系统中的行。
集合(collection)可以看作是一个拥有动态模式(dynamic schema)的表。
MongoDB的一个实例可以拥有多个相互独立的数据库(database)，每一个数据库都拥有自己的集合。
每一个文档都有一个特殊的键“_id”，这个键在文档所属的集合中是唯一的。

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
这样启动比较麻烦，每次都要启动，所以可以把它注册成windows 的服务
```
// 使用管理员权限运行
mongod --install --dbpath d:\data\db --logpath d:\data\log\log.txt
net start MongoDB  // 启动服务
```

```
services.msc // 查看服务
net stop mongodb   // 停止服务
```
删除服务
```
mongod --remove --serviceName MongoDB  // MongoDB是服务名
```
MongoDB 还可以通过配置文件启动
可以去官网查看[https://docs.mongodb.com/manual/reference/configuration-options/](https://docs.mongodb.com/manual/reference/configuration-options/)

## 连接MongoDB
在打开一个命令提示符（cmd）之前运行的MongoDB那个不要关闭，因为没有注册成windows的服务，关闭就找不到数据库了。
```
cd C:\Program Files\MongoDB\Server\3.6\bin
mongo
```
这样就链接上数据库了，当然还会输出一大堆东西。

## 操作MongoDB
我们先创建一个数据库，再刚才连接MongoDB的cmd执行
```
use test02
```
创建一个test02的数据库并切换过去。
db变量指向当前数据库。
向集合里插入文档，之前也讲了MongoDB没有预定义模式，所以不用新建表和表结构了。
insert方法 把一条文档保存到集合里。
```
db.user_table.insert({"name", "lanpangzhi", "age": 18})
```
查看集合里面的文档。
find和findOne方法可以用于查询集合里的文档。只想查看一个文件，可以用findOne
```
db.user_table.find()
db.user_table.findOne()
```
find和findOne还可以接受一个查询文档作为限定条件。
```
db.user_table.find({"name": "lanpangzhi"})
```
更新集合里面的文档
update方法接受（至少）两个参数：第一个是限定条件（用于匹配待更新的文档），第二个是新的文档。
```
db.user_table.update({name: lanpangzhi},{"name": "lanpangzhi", "age": 18, "sex": 1});
```
删除集合里面的文档
remove方法可将数据库的集合永久删除，如果不加参数默认把集合里面所有的文档删除。它可以接受一个限定条件的文档作为参数。
```
db.user_table.remove({"name": "aaa"})
```