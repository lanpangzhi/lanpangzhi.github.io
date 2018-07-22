---
title: node定时任务
date: 2018-07-08 18:09:23
tags: [Node.js, 定时任务]
keywords: node定时任务
---
# node定时任务
我们再开发过程中，会经常碰见这样的场景例如每天早上八点执行一个操作或者执行一个爬虫，下面就说一下如何用node-cron处理这些定时任务。
<!--more-->
## 安装node-cron
```
npm i cron -S
```
## 使用
cron值的范围。
Seconds: 0-59 (秒)
Minutes: 0-59 (分钟)
Hours: 0-23   (小时)
Day of Month: 1-31 (天)
Months: 0-11 (Jan-Dec) (月)
Day of Week: 0-6 (Sun-Sat) (星期)

### 每隔十秒执行一次
```
var CronJob = require('cron').CronJob;
var job = new CronJob('*/10 * * * * *', function() {
  console.log("执行了")
  },
  function () {
    /* 定时任务停止时执行此功能 */
  },
  true /* 马上开始定时任务 */
);
```
### 每个工作日早上7点执行一次
```
var CronJob = require('cron').CronJob;
var job = new CronJob('00 00 7 * * 1-5', function() {
  console.log("执行了")
  },
  function () {
    /* 定时任务停止时执行此功能 */
  },
  true  /* 马上开始定时任务 */
);
```
### 手动执行定时任务
```
var cron = require('cron');

var job1 = new cron.CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
    console.log('开始工作');
  },
  onComplete: function() {
    console.log('停止工作')
  },
  start: false
});
// 执行job1定时任务
job1.start();
```
### 手动停止定时任务
```
var cron = require('cron');

var job1 = new cron.CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
    console.log('开始工作');
  },
  onComplete: function() {
    console.log('停止工作')
  },
  start: false
});
job1.start()

setTimeout(() => {
    //  五秒钟后停止定时任务并触发停止回调
    job1.stop();
} ,5002);
```

### 捕获异常
```
try {
	new CronJob('invalid cron pattern', function() {
		console.log('this should not be printed');
	})
} catch(ex) {
	console.log("cron pattern not valid");
}
```
以上提供了几种常用场景，更多使用可以去github查看api。

# 参考
[https://github.com/kelektiv/node-cron](https://github.com/kelektiv/node-cron)