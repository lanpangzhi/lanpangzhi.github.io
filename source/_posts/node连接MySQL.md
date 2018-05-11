---
title: node连接MySQL
date: 2018-05-10 15:40:04
tags: [Node.js, MySQL]
keywords: node连接MySQL
---
# node连接MySQL
之前讲了怎么安装MySQL，今天就讲下这么用node去连接操作MySQL。
<!--more-->
## 安装
```
npm install mysql
```

## 连接
```
const mysql = require('mysql');

let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'test'
});

connection.connect(function(err) {
  if (err) {
    console.error('连接出错: ' + err.stack);
    return;
  }

  console.log('连接成功 id ' + connection.threadId);
});
```
host：连接的服务器
user：用户名默认是root
password：之前设置的MySQL密码
database： 要连接的库

## 常用的SQL语句
SQL 是一门 ANSI 的标准计算机语言，用来访问和操作数据库系统。SQL 语句用于取回和更新数据库中的数据。SQL 可与数据库程序协同工作，比如 MS Access、DB2、Informix、MS SQL Server、Oracle、Sybase 以及其他数据库系统。

增
```
INSERT INTO user (username, pass) VALUES ('blog.langpz.com', '123456');
```
INSERT INTO 表名称 VALUES (值1, 值2,....)
指定所要插入数据的列
INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)

删
```
DELETE FROM user  WHERE id = 0
```
DELETE FROM 表名称 WHERE 列名称 = 值
不加WHERE会删除所有行
WHERE子句用于规定选择的标准。

改
```
UPDATE user SET pass = 'bbb' WHERE username = '张三'
```
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值

查
```
SELECT * FROM user
```
SELECT 列名 FROM 表名 注： * 代表全部

## node操作MySQL
查询
```
connection.query('SELECT * FROM user WHERE username = "blog.langpz.com"', (err, results, fields) => {
    if(err){
        console.log(err);
    }
    console.log(results);
})
```
删除
```
connection.query('DELETE FROM user  WHERE id = 1', (err, results) => {
    if(err){
        console.log(err);
    }
    console.log(results);
})
```
增加
```
connection.query('INSERT INTO user(username, pass) VALUES(?, ?)',['lan', 'abc'], (err, results) => {
    if(err){
        console.log(err);
    }
    console.log(results);
})
```
修改
```
connection.query('UPDATE user SET pass = "bbb" WHERE username = "lan"', (err, results) => {
    if(err){
        console.log(err);
    }
    console.log(results);
})
```
基本操作就是这个流程，可以通过路由封装接口，写一个CRUD应用，mysql模块更多参数可以去看github。

# 参考
[https://github.com/mysqljs/mysql](https://github.com/mysqljs/mysql)