---
title: 使用Express开发小说API接口服务1.0（三）
date: 2018-05-26 10:54:41
tags: [Express,Node.js, API]
keywords: 使用Express开发小说API接口服务1.0（三）
---
# 使用Express开发小说API接口服务1.0（三）
之前发现追书神器API详情页竟然没有下一章和上一章的返回值，只能自己动手封装一下。
<!--more-->
# app.js 增加错误处理
```
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
```
这些代码放到module.exports = app; 上面就可以了。

## 列表页增加返回ID
找到routes/chapter.js 29行替换
```
  res.send(JSON.stringify({ "flag": 1,"id": body._id,  "chapters": body.chapters, "msg": "OK" }));
```

## 详情页增加上一章和下一章的返回值
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
            // 再次请求列表页获取上一页和下一页
            if(req.query.id){
                // req.query.id 编码转义
                let id = encodeURIComponent(req.query.id);
                let n = parseInt(req.query.n);
                if (isNaN(n)){
                    n = 0;
                }

                request.get(`${common.API}/atoc/${id}?view=chapters`, function (err, response, body2) {
                    if (err) {
                        res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
                    }

                    if (body2 == "wrong param"){
                        res.send(JSON.stringify({ "flag": 0, "msg": "传入错误的ID..." }));
                    }else{
                        // 解析返回的数据
                        body2 = JSON.parse(body2);
                        // 检查页码是否超过小说的章节数
                        if(n > body2.chapters.length - 1){
                            res.send(JSON.stringify({ "flag": 0, "msg": "传入的页码过大" }));
                        }else{
                            // 如果有上一页或者下一页就返回link否则返回false
                            let prev,next;
                            body2.chapters[n - 1] ? prev = body2.chapters[n - 1].link : prev = false;
                            body2.chapters[n + 1] ? next = body2.chapters[n + 1].link : next = false;

                            if (body2.chapters.length > 0) {
                                res.send(JSON.stringify({ "flag": 1,"id": id, "chapter": body.chapter, "prev": prev,"next": next, "msg": "OK" }));
                            }
                        }
                    }
                });
            }else{
                res.send(JSON.stringify({ "flag": 1, "chapter": body.chapter, "msg": "OK" }));
            }
            
        }else{
            res.send(JSON.stringify({ "flag": 0, "msg": "传入link有错误" }));
        }
    });
});

module.exports = router;
```
访问http://localhost:3000/article?link=http://www.69shu.com/txt/1463/4861037&n=2648&id=577b6c81ccb7bf00499d036c
新增n和id参数。
n 代表是第几页。
id 是书籍ID。