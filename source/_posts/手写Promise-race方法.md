---
title: 手写Promise.race方法
date: 2022-09-10 17:57:26
tags: [Promise]
keywords: 手写Promsie.race方法
---

# 手写Promsie.race方法
需求分析
1. Promsie.race方法接收一个参数 Promise 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型），返回一个新的Promsie
2. 数组里其中一个Promise失败或者成功，则将执行对应的回调。就采用第一个 promise 的值作为它的值
<!--more-->
```
Promise.myRace = function(list) {
    return new Promise((resolve, reject) => {
        list.map((item, index) => {
            // 把数据都处理成Promise
            Promise.resolve(item).then(
                res => {
                    resolve(res)
                },
                err => {
                    reject(err)
                }
            )
        })
    })
}
```

## demo
[demo地址](https://jsbin.com/decukesipi/4/edit?js,console)