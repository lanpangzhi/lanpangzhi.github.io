---
title: 手写Promise.allsettled方法
date: 2022-11-05 11:21:30
tags: [Promise]
keywords: 手写Promise.allsettled方法
---

# 手写Promise.allsettled方法
之前实现过Promsie.all方法，但是all这个方法如果有一个失败了就相当于全部失败了，这种对体验和交互都不友好，Promise.allsettled就是改进版，有失败还会继续执行，等所有的Promsie执行完返回一个对象数组。
<!--more-->
1. Promise.allsettled方法和Promsie.all方法接收参数一样。
2. 执行完返回一个数组对象每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason 。

## 代码实现
```
Promise.myAllsettled = function(list) {
    if (list.length === 0) return Promise.resolve([])
    const results = []
    let count = 0

    const settled = (index, status, res, resolve) => {
        results[index] = {
            status,
            ...res
        }
        count += 1
        if (count == list.length) {
            resolve(results)
        }
    }
    return new Promise((resolve) => {
        list.map((item, index) => {
            // 把数据都处理成Promise
            Promise.resolve(item).then(
                res => {
                    settled(index, 'fulfilled', {value: res}, resolve)
                },
                err => {
                    settled(index, 'rejected', {reason: err}, resolve)
                }
            )
        })
    })
}
```

## demo
[demo地址](https://jsbin.com/royefenade/edit?js,console)

# 参考
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)