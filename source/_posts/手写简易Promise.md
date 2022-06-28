---
title: 手写简易Promise
date: 2022-06-28 21:32:50
tags:  [Promise]
keywords: 手写简易Promise
---
# 手写简易Promise
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

<!--more-->

1.  一个 Promise 必然处于以下几种状态之一：状态改变后是不可逆的。
 - 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。
 - 已兑现（fulfilled）：意味着操作成功完成。
 - 已拒绝（rejected）：意味着操作失败。

2. 两个参数
resolve, reject 都是函数来改变Promise 状态的。由 JavaScript 引擎提供。
resolve() 成功，把Promise状态设置为fulfilled，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。
reject() 失败，把Promise状态设置为rejected，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

## 实现

```
class MyPromise {
    status = 'pending'
    resloveQueue = []
    rejectQueue = []
    
    constructor(fn) {
        const reslove = data => {
            if(this.status !== 'pending') return;
            this.status = 'fulfilled';
            setTimeout(_ => {

                this.resloveQueue.forEach(fnQueue => {
                    fnQueue && fnQueue(data)
                })
            }) 
            
        }
        const reject = errer => {
            if(this.status !== 'pending') return;
            this.status = 'rejected';
            setTimeout(_ => {
                this.rejectQueue.forEach(fnQueue => {
                    fnQueue && fnQueue(errer)
                })
            }) 
        }
        fn(reslove, reject)
    }

    then(fn, ErrFn) {
        this.resloveQueue.push(fn)
        this.rejectQueue.push(ErrFn)
        return this
    }
}
```
测试
```
const p1 = new MyPromise((resolve, reject)=>{
  console.log('hi2'); 
  if(Math.random()>0.5){
    resolve('大')
  }else{
    reject('小')
  }
})
p1.then((data)=>{console.log(+ '/' +'成功1')},  (errer)=>{console.log(+ '/' +'失败1')})
.then(()=>{console.log('成功2')},  ()=>{console.log('失败2')})
.then(()=>{console.log('成功3')},  ()=>{console.log('失败3')})
console.log('end');
```

## demo
[demo地址](https://jsbin.com/qusojamelo/1/edit?js,console)

# 参考
[https://es6.ruanyifeng.com/#docs/promise](https://es6.ruanyifeng.com/#docs/promise)