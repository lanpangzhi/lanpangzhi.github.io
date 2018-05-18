---
title: 使用Express开发小说API接口服务1.0（一）
date: 2018-05-17 15:10:56
tags: [Express,Node.js, API]
keywords: 使用Express开发小说API接口服务1.0（一）
---
# 使用Express开发小说API接口服务1.0（一）
1.0版本技术栈使用express-generator、express、request、morgan、file-stream-rotator。接口用追书神器API。
目前接口设计有首页，小说详情页，搜索，小说文章列表页，排行API。
<!--more-->
## github创建仓库
先创建一个仓库放文件
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8Express%E5%BC%80%E5%8F%91%E5%B0%8F%E8%AF%B4API%E6%8E%A5%E5%8F%A3%E6%9C%8D%E5%8A%A1/QQ%E5%9B%BE%E7%89%8720180517153417.png)
然后克隆创建好的仓库
```
git clone https://github.com/lanpangzhi/novel-api.git
```

## 安装 express-generator 快速生成项目
```
npm install -g express-generator
```
然后再之前克隆仓库的上一级目录执行
```
express --no-view novel-api
cd novel-api
npm install 
npm install request file-stream-rotator -S
DEBUG=novel-api:* npm start
```
生成好的目录结构和文件
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8Express%E5%BC%80%E5%8F%91%E5%B0%8F%E8%AF%B4API%E6%8E%A5%E5%8F%A3%E6%9C%8D%E5%8A%A1/QQ%E5%9B%BE%E7%89%8720180517154349.png)

## 设置cors 跨域
打开项目根目录app.js,放在路由上面。
```
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next()
});
```

## 日志写入本地文件
按时间分割log日志并写入本地磁盘，需要在app.js文件中引入fs和file-stream-rotator模块。
```
let fs = require('fs'); 
let FileStreamRotator = require('file-stream-rotator');  // 日志按时间分割模块

// 下面代码写在var app = express();下面
let logDir = path.join(__dirname, 'log');

// 检查是否存在logDir这个目录没有则创建
fs.existsSync(logDir) || fs.mkdirSync(logDir);

// 日志分割流
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDir, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

// 日志中间件
app.use(logger('combined', { stream: accessLogStream }));
```

## 创建公共文件
项目根目录创建common文件夹，再里面再新建一个common.json文件
```
{
    "API": "http://api.zhuishushenqi.com",
    "PIC": "http://statics.zhuishushenqi.com",
    "CHAPTER": "http://chapter2.zhuishushenqi.com"
}
```
API域名: http://api.zhuishushenqi.com
图片域名: http://statics.zhuishushenqi.com
章节域名: http://chapter2.zhuishushenqi.com

## 首页接口
1.0版本首页接口直接返回最热榜前20条数据。
修改app.js 文件路由中间件配置
```
app.use('/index', indexRouter);
```
修改routes/index.js 文件
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  首页数据追书最热榜 Top100
  获取单一排行榜
  http://api.zhuishushenqi.com/ranking/{rankingId}
*/
router.get('/', function(req, res, next) {
  // 请求追书最热榜 Top100
  request.get(`${common.API}/ranking/54d42d92321052167dfb75e3`, function (error, response, body) {
    if (error){
      res.send(JSON.stringify({"flag": 0, "msg": "请求出错了..."}));
    }
    
    // 解析返回数据取前20条，并添加图片url链接
    body = JSON.parse(body);

    if (body.ok){
      let books = body.ranking.books.slice(0, 19);
      books.forEach(element => {
        element.cover = common.PIC + element.cover;
      });

      res.send(JSON.stringify({ "flag": 1, "books": books, "msg": "OK" }));
    }else{
      res.send(JSON.stringify({ "flag": 0, "msg": "rankingId有问题" }));
    }  
  });
});

module.exports = router;
```
访问http://localhost:3000/index 就可以看到返回的数据了。

## 搜索接口
1.0版本的搜索接口只取前40条数据，可以模糊查询。
修改app.js 文件路由中间件配置，把users删掉。
```
let searchRouter = require('./routes/search');
app.use('/search', searchRouter);
```
然后把routes文件夹下面的users.js删除，新建search.js
```
let express = require('express');
let request = require('request');
let common = require('../common/common.json'); // 引用公共文件
let router = express.Router();

/** 
  模糊搜索接口
  返回模糊搜索前40条数据
  http://api.zhuishushenqi.com/book/fuzzy-search?query={name}
*/
router.get('/', function(req, res, next) {
  // 判断query参数有没有传递过来
  if (req.query.query){
    // req.query.query 编码转义
    let query = encodeURIComponent(req.query.query);
    request.get(`${common.API}/book/fuzzy-search?query=${query}`, function (error, response, body) {
      if (error){
        res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
      }

       // 解析返回数据
      body = JSON.parse(body);

      if (body.ok){
        if (body.books.length == 0){
          res.send(JSON.stringify({ "flag": 0, "msg": "没有找到书籍，换个名字试试吧。" }));
        }
        
        // 取前40条，并添加图片url链接
        let books = body.books.slice(0, 39);
        books.forEach(element => {
          element.cover = common.PIC + element.cover;
        });

        res.send(JSON.stringify({ "flag": 1, "books": books, "msg": "OK" }));
      }else{
        res.send(JSON.stringify({ "flag": 0, "msg": "请求出错了..." }));
      }
    });
  }else{
    res.send(JSON.stringify({"flag": 0, "msg": "请传入query参数"}));
  }
  
});

module.exports = router;
```
访问http://localhost:3000/search/?query=遮天 就可以看到返回的数据了。



# 参考
[https://github.com/expressjs/morgan](https://github.com/expressjs/morgan)
[https://juejin.im/entry/593a3fdf61ff4b006c737ca4](https://juejin.im/entry/593a3fdf61ff4b006c737ca4)
[https://github.com/jianhui1012/bookreader/wiki/API-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3](https://github.com/jianhui1012/bookreader/wiki/API-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3)