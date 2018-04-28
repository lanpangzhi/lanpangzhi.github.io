---
title: EJS模板引擎
date: 2018-04-27 13:36:44
tags: EJS
keywords: EJS模板引擎
---
# EJS模板引擎
模板引擎（这里特指用于Web开发的模板引擎）是为了使用户界面与业务数据（内容）分离而产生的，它可以生成特定格式的文档，用于网站的模板引擎就会生成一个标准的HTML文档。
Express默认的模板引擎是Jade，为什么要选择EJS呢，因为它非常简单而且不破坏原有HTML代码结构。只需要用JavaScript编写你想要的HTML。
<!--more-->
## 安装EJS
```
npm install ejs
```

## Express设置EJS模板
```
app.set('view engine', 'ejs'); # view engine, 模板引擎
app.set('views', './views');   # views, 放模板文件的目录
```

## 将值输出到模板（HTML转义）
```
// index.ejs
<%= arr %>

// Node
res.render('index', {arr: [1,2,3,4]});
```

## 判断
```
<%  if (user) { %>
    <p> <%= user %> </p>
<% } %>
```

## 循环
```
<% for (var i = 0; i < arr.length; i++) { %>
    <li><%= arr[i] %></li>
<% } %>
```

## include（不转义）
```
<%- include('./common/header.ejs') %>
```

## EJS标签
- <%    '脚本' 标签，用于流程控制，无输出。
- <%_   删除其前面的空格符
- <%=   输出数据到模板（输出是转义 HTML 标签）
- <%-   输出非转义的数据到模板
- <%#   注释标签，不执行、不输出内容
- <%%   输出字符串 '<%'
- %>    一般结束标签
- -%>   删除紧随其后的换行符
- _%>   将结束标签后面的空格符删除