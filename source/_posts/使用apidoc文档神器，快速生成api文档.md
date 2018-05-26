---
title: 使用apidoc文档神器，快速生成api文档
date: 2018-05-26 11:13:37
tags: [apidoc,Node.js, API]
keywords: 使用apidoc文档神器，快速生成api文档
---
# 使用apidoc文档神器，快速生成api文档
写完api接口，就需要编写api文档了，如果一个个手写的话就很麻烦，就得使用apidoc只需要通过写注释，就可以快速生成文档了。
<!--more-->

## 安装
第一步先安装全局模块apidoc。
```
npm install apidoc -g
```

## 修改接口的注释
找到novel-api项目routes下面的index.js文件，注释修改成如下
```
/**
 * @api {get} /index 请求首页数据
 * @apiVersion 1.0.0
 * @apiName 获取首页数据
 * @apiGroup index
 *
 *
 * @apiSuccess {Number} flag 是否获取到数据 1成功 0失败
 * @apiSuccess {Array} books 返回书籍内容
 * @apiSuccess {String} msg  返回信息
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "flag": 1,
 *      "books": [
 *          {
 *             "_id": "5816b415b06d1d32157790b1",
 *            "title": "圣墟",
 *            "author": "辰东",
 *            "shortIntro": "在破败中崛起，在寂灭中复苏。沧海成尘，雷电枯竭，那一缕幽雾又一次临近大地，世间的枷锁被打开了，一个全新的世界就此揭开神秘的一角……",
 *            "cover": "http://statics.zhuishushenqi.com/agent/http%3A%2F%2Fimg.1391.com%2Fapi%2Fv1%2Fbookcenter%2Fcover%2F1%2F1228859%2F1228859_fac7917a960547eb953edf0b740cef3a.jpg%2F",
 *            "site": "zhuishuvip",
 *            "majorCate": "玄幻",
 *            "minorCate": "东方玄幻",
 *            "allowMonthly": false,
 *            "banned": 0,
 *            "latelyFollower": 283375,
 *            "retentionRatio": "73.42"
 *          }
 *      ],
 *      "msg": "OK"
 *    }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     { "flag": 0, "msg": "rankingId有问题" }
 */
```
@api {method} path [title]
@api 如果没有@api apidoc会忽略这段注释
method 请求的方法
path 路径
title 标题

@apiVersion version
设置文档块的版本。
version 版本号

@apiName name
定义方法文档块的名称。名称将用于生成的输出中的子导航。
name 方法的名称

@apiGroup name
定义方法文档块属于哪个组。组将用于生成的输出中的主导航。
name 组的名称。也用作导航标题。

@apiSuccess [(group)] [{type}] field [description]
成功返回参数。
(group) 可选 所有参数将按这个名称分组。没有组，默认Success 200设置。
{type} 可选 返回类型
field 返回标识符
description 描述

@apiParamExample [{type}] [title]
                   example
参数请求示例。
{type} 可选 响应格式
title 示例的简称
example 详细的例子

@apiErrorExample [{type}] [title]
                 example
错误返回消息的示例，输出为预格式化代码。
{type} 可选 响应格式
title 示例的简称
example 详细的例子

## 配置npm run doc
打开package.json文件增加doc命令配置
```
"doc": "apidoc -i routes/ -o public/"
```
routes/ 要输出API文档的文件夹。
public/ 输出文档到public文件夹，没有回自动创建。

访问 http://localhost:3000/ 就可以看到生成好的API文档了。
![](http://hexo-1252491761.file.myqcloud.com/apidoc/111.png)

# 参考
[https://github.com/apidoc/apidoc](https://github.com/apidoc/apidoc)