---
title: 手写Promsie.all方法
date: 2022-07-27 20:44:39
tags: [Promise]
keywords: 手写Promsie.all方法
---

# 手写Promsie.all方法
需求分析
1. Promsie.all方法接收一个参数 Promise 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型），返回一个新的Promsie
2. 数组里其中一个Promise失败会导致Promise.all 失败
3. 所有Promise resolve 回调的结果是一个数组
<!--more-->

## 代码实现
```
Promise.myAll = function(list) {
    const results = []
    let count = 0
    return new Promise((resolve, reject) => {
        list.map((item, index) => {
            // 把数据都处理成Promise
            Promise.resolve(item).then(
                res => {
                    results[index] = res
                    count += 1
                    if (count == list.length) {
                        resolve(results)
                    }
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
[demo地址](https://jsbin.com/junavacuda/edit?js,console)

# 参考
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)