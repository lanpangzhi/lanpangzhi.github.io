---
title: node爬虫
date: 2018-05-12 15:37:42
tags: [Node.js, 爬虫]
keywords: Node.js、request、爬虫
---
# node爬虫
什么是爬虫呢，是一种按照一定的规则，自动地抓取万维网信息的程序或者脚本。为什么选用node呢，因为我是前端，当然要用js实现。
<!--more-->

## 项目分析
爬取http://top.zhaopin.com  智联网站上的全国的竞争最激烈三个月内前十的岗位。不需要定时爬取。使用request和cheerio模块。node版本7.6.0、npm版本4.1.2

## 安装
```
npm install request cheerio -S
```
request 模块是一个简化的HTTP客户端。
cheerio 模块专为服务器设计的核心jQuery的快速，灵活和精益的实现。可以把爬到的内容和jQuery一样使用。

## 核心代码
```
// app.js
const request = require('request');
const cheerio = require('cheerio');

// 发起请求
request('http://top.zhaopin.com', (error, response, body) => {
    if(error){
        console.error(error);
    }
    let json = {};
    // 获取到的内容放到cheerio模块
    const $ = cheerio.load(body);

    // jQuery 遍历  #hotJobTop .topList li  是通过http://top.zhaopin.com 分析页面结构得到的
    $('#hotJobTop .topList li').each(function (index) {
        let obj = json[index] = {};
        obj.name = $(this).find('.title').text().trim();
        obj.num = $(this).find('.paddingR10').text().trim();
    });

    // 打印数据
    console.log(json);
});
```
执行 node app.js 就会得到如下结果。
```
[ { name: 'Java开发工程师', num: '340538人/天' },
  { name: '软件工程师', num: '220873人/天' },
  { name: '销售代表', num: '175053人/天' },
  { name: '会计/会计师', num: '168225人/天' },
  { name: '行政专员/助理', num: '150913人/天' },
  { name: 'WEB前端开发', num: '140979人/天' },
  { name: '助理/秘书/文员', num: '139098人/天' },
  { name: '软件测试', num: '136399人/天' },
  { name: '人力资源专员/助理', num: '123482人/天' },
  { name: '用户界面（UI）设计', num: '107505人/天' } ]
```
一个简单的爬虫就写好了，看看前十有没有你从事的岗位吧！

# 参考
[https://github.com/request/request](https://github.com/request/request)
[https://github.com/cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)