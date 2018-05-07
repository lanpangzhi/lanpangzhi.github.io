---
title: Express路由
date: 2018-05-07 17:50:08
tags: [Express, 路由]
keywords: Express路由
---
# Express路由
之前在Express入坑里面简单讲了下路由的用法，现在就讲下如果再项目中怎么配置路由。
<!--more-->

一个网站下面可能有很多地址例如:
www.langpz.com/aaa
user/
www.langpz.com/user/aaa
www.langpz.com/user/bbb
www.langpz.com/user/ccc
vip/
www.langpz.com/vip/aaa
www.langpz.com/vip/bbb
www.langpz.com/vip/ccc
等等。。。
咱们可以拆分成vip和user两个目录目录下再放子路由。
先安装express 然后在项目根目录建一个app.js和routers文件夹，routers文件夹里面再建一个index.js文件和vip、user两个目录，两个目录下面分别建立index.js文件。
```
// app.js
const express = require('express');
const routers = require('./routers');  //引入路由

let app = express();

app.use('/vip', routers.vip);   // 设置/vip路由中间件
app.use('/user', routers.user);  // 设置/user路由中间件


app.listen(8000);
```

```
// routers/index.js
let vip = require('./vip'); // 引入vip文件下面的路由
let user = require('./user');   // 引入user文件下面的路由
// 导出路由
module.exports = {
    vip,
    user
};
```

```
// routers/vip/index.js
const express = require('express'); // 必须要引入express

let routerVip = express.Router();   // 创建router实例

// 添加路由配置
routerVip.get('/', (req, res) => {
    res.send('我是vip根目录')
});

routerVip.get('/aaa', (req, res) => {
    res.send('我是vip/aaa目录')
});

routerVip.get('/bbb', (req, res) => {
    res.send('我是vip/bbb目录')
});
// 导出路由
module.exports = routerVip;
```

```
// routers/user/index.js
const express = require('express'); // 必须要引入express

let routerUser = express.Router();  // 创建router实例

// 添加路由配置
routerUser.get('/', (req, res) =>{
    res.send('我是user根目录')
});

routerUser.get('/aaa', (req, res) => {
    res.send('我是user/aaa目录')
});

routerUser.get('/bbb', (req, res) => {
    res.send('我是user/bbb目录')
});

// 导出路由
module.exports = routerUser;
```

然后执行 node app.js 再浏览器输入http://localhost:8000/user/aaa、http://localhost:8000/vip/aaa，就可以来回切换路由了，如果新增了一个路由模块就在routers文件夹下，再新建文件夹划分路由，这样路由文件比较清晰，后期维护起来也方便。