---
title: 手写EventHub(发布订阅)
date: 2023-04-29 14:07:39
tags: [设计模式, EventHub，发布订阅]
keywords: 手写EventHub(发布订阅)
---
EventHub 是一种事件发布-订阅模式的实现。
订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。
<!--more-->

# 实现
 - 每个实例有一个**调度中心**。负责存储消息与订阅者的对应关系，有消息触发时，负责通知订阅者。
 - **on方法**订阅的事件注册（Subscribe）到调度中心。
 - **once方法**只订阅一次，执行后移除订阅事件。
 - **off方法**从调度中心移除订阅的事件。
 - **emit方法**发布事件，并通过调度中心通知所有的订阅者

```
class EventHub {
  constructor() {
    // 调度中心
    this.channel = {}
  }

  on(name, fn) {
    this.channel[name] = this.channel[name] || []
    this.channel[name].push(fn)
  }

  off(name, fn) {
    const list = this.channel[name] || []
    const index = list.indexOf(fn)
    if(index < 0) return
    list.splice(index, 1)
  }

  once(name, fn) {
    this.channel[name] = this.channel[name] || []
    let one = (arg) => {
      fn.call(null, arg)
    }
    // 记录下绑定事件
    one.fn = fn
    // 添加移除方法
    one.off = () => { this.off(name, one) }
    this.on(name, one)
  }

  emit(name, data) {
    let list = this.channel[name] || []
    let ones = []
    list.forEach(fn => {
      fn.call(null, data)
      fn.off && ones.push(fn)
    })
    // 移除once订阅事件、执行完再移除不会导致删除数组后执行顺序不对问题
    ones.forEach(fn => fn.off())
  }
}
```

测试
```
// 发布者
let q = new EventHub()
// 订阅者
q.on('click', function(data) {
  console.log('on')
})
// 订阅者只订阅一次
q.once('click', function() {
  console.log('once')
})

// 发布者发布消息通知click的订阅者
q.emit('click')
q.emit('click')
// 输出 on、once、on
```

# demo
[demo地址](https://jsbin.com/wibilapihi/edit?js,console)