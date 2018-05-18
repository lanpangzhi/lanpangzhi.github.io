---
title: 使用Express开发小说API接口服务1.0(二)
date: 2018-05-18 13:26:05
tags: [Express,Node.js, API]
keywords: 使用Express开发小说API接口服务1.0（二）
---
# 使用Express开发小说API接口服务1.0(二)
之前完成了首页和搜索的接口，现在就开始写剩下的接口。
<!--more-->
## 获取小说源
因为追书神器正版源是收费加密的，所以只能使用盗版源，所以要封装一个获取小说源的接口。
修改app.js 文件路由中间件配置，增加一个路由
```
let sourceRouter = require('./routes/source');
app.use('/source', sourceRouter);
```
在routes下面新建 source.js
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  获取小说源
  返回盗版源和正版源
  param id {String} 是首页和搜索返回接口 books[i].id
  param n {Number || String}  使用第几个源，可以不用传参默认 1
  http://api.zhuishushenqi.com/atoc?view=summary&book=${bookID}
*/
router.get('/', function (req, res, next) {
    if (!req.query.id) {
        res.send(JSON.stringify({ "flag": 0, "msg": "请传入ID..." }));
    }
    // req.query.id 编码转义
    let id = encodeURI(req.query.id);
    request.get(`${common.API}/atoc?view=summary&book=${id}`, function (err, response, body){
        if(err){
            res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
        }
        
        // 解析返回的数据
        body = JSON.parse(body);
        // 判断是否返回内容
        if (body.length == 0){
            res.send(JSON.stringify({ "flag": 0, "msg": "没有获取到小说源，换个小说看吧" }));
        }

        // 第一个源是正版源，是收费加密的，所以默认选中第二个源
        let n = parseInt(req.query.n);
        if (isNaN(n) || n == 0){
            n = 1;
        }

        // 判断n是否大于源数据的长度
        if (n >= body.length){
            res.send(JSON.stringify({ "flag": 0, "msg": "n的参数值不正确，没有那个源" }));
        }else{
            res.send(JSON.stringify({ "flag": 1, "books": body[n], "msg": "OK" }));
        }
    });
});

module.exports = router;
```
访问http://localhost:3000/source/?id=50864bf69dacd30e3a000014&n=3 就可以看到返回第四个源的数据。

## 小说文章列表
修改app.js 文件路由中间件配置，增加一个路由
```
let chapterRouter = require('./routes/chapter');
app.use('/chapter', chapterRouter);
```
在routes下面新建 chapter.js
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  获取小说文章列表
  返回小说文章列表
  param id {String} 是小说源接口 books.id
  http://api.zhuishushenqi.com/atoc/${id}?view=chapters
*/
router.get('/', function (req, res, next) {
    if (!req.query.id){
        res.send(JSON.stringify({ "flag": 0, "msg": "请传入ID..." }));
    }
    // req.query.id 编码转义
    let id = encodeURIComponent(req.query.id);
    request.get(`${common.API}/atoc/${id}?view=chapters`, function (err, response, body) {
        if (err) {
            res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
        }

        if (body == "wrong param"){
            res.send(JSON.stringify({ "flag": 0, "msg": "传入错误的ID..." }));
        }else{
            // 解析返回的数据
            body = JSON.parse(body);
            if (body.chapters.length > 0) {
                res.send(JSON.stringify({ "flag": 1, "chapters": body.chapters, "msg": "OK" }));
           }
        }
        
    });
});

module.exports = router;
```
访问http://localhost:3000/chapter/?id=57416370ccc94e4b41df80cc 就可以看到数据。id小说源接口返回的id。

## 小说文章内容
修改app.js 文件路由中间件配置，增加一个路由
```
let articleRouter = require('./routes/article');
app.use('/article', articleRouter);
```
在routes下面新建 article.js
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  获取小说文章内容
  返回小说文章内容
  param link {String} 是小说文章列表接口 chapters[0].link
  http://chapter2.zhuishushenqi.com/chapter/${link}
*/
router.get('/', function (req, res, next) {
    if (!req.query.link) {
        res.send(JSON.stringify({ "flag": 0, "msg": "请传入link..." }));
    }
    // req.query.link 编码转义
    let link = encodeURIComponent(req.query.link);
    request.get(`${common.CHAPTER}/chapter/${link}`, function (err, response, body) {
        if (err) {
            res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
        }

        // 解析返回的数据
        body = JSON.parse(body);

        if (body.ok){
            res.send(JSON.stringify({ "flag": 1, "chapter": body.chapter, "msg": "OK" }));
        }else{
            res.send(JSON.stringify({ "flag": 0, "msg": "传入link有错误" }));
        }
    });
});

module.exports = router;
```
访问http://localhost:3000/article?link=http://www.69shu.com/txt/1463/4861037 就可以看到数据。

## 排行榜
修改app.js 文件路由中间件配置，增加一个路由
```
let rankingRouter = require('./routes/ranking');
app.use('/ranking', rankingRouter);
```
在routes下面新建 ranking.js
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  获取排行榜
  返回排行榜
  param id {String} 没有传参数就是获取全部榜单，否则根据参数获取榜单
  http://api.zhuishushenqi.com/ranking/gender
  http://api.zhuishushenqi.com/ranking/${id}
*/

router.get('/', function (req, res, next) {
    // 获取全部榜单
    request.get(`${common.API}/ranking/gender`, function (err, response, body) {
        if (err) {
            res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
        }

        // 解析返回的数据
        body = JSON.parse(body);

        if (body.ok) {
            let ranking = {
                male: body.male,
                picture: body.picture,
                epub: body.epub,
                female: body.female
            };
            res.send(JSON.stringify({ "flag": 1, "ranking": ranking, "msg": "OK" }));
        } else {
            res.send(JSON.stringify({ "flag": 0, "msg": "出错了" }));
        }
    });
});

router.get('/:id', function (req, res, next) {
    if (req.params.id) {
        // req.param.id 编码转义
        let id = encodeURIComponent(req.params.id);

        // 根据id获取榜单
        request.get(`${common.API}/ranking/${id}`, function (err, response, body) {
            if (err) {
                res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
            }

            // 解析返回的数据
            body = JSON.parse(body);

            if (body.ok) {
                res.send(JSON.stringify({ "flag": 1, "ranking": body.ranking, "msg": "OK" }));
            } else {
                res.send(JSON.stringify({ "flag": 0, "msg": "传入id错误" }));
            }
        });
    }else{
        res.send(JSON.stringify({ "flag": 0, "msg": "id没有传" }));
    }
});

module.exports = router;
```
分别访问http://localhost:3000/ranking/ 和 http://localhost:3000/ranking/54d43437d47d13ff21cad58b 就可以获取到榜单的数据。
1.0版本的开发就告于段落了。
github仓库访问地址[https://github.com/lanpangzhi/novel-api](https://github.com/lanpangzhi/novel-api)

# 参考
[https://github.com/expressjs/morgan](https://github.com/expressjs/morgan)
[https://juejin.im/entry/593a3fdf61ff4b006c737ca4](https://juejin.im/entry/593a3fdf61ff4b006c737ca4)
[https://github.com/jianhui1012/bookreader/wiki/API-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3](https://github.com/jianhui1012/bookreader/wiki/API-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3)