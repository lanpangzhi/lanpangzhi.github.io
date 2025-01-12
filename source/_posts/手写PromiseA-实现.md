---
title: 手写PromiseA+ 实现
date: 2024-12-31 19:28:49
tags: [Promise]
keywords: 手写PromiseA+ 实现
---
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

<!--more-->

[PromiseA+规范中文版](https://github.com/fe-doc/Promises-A-)

## 实现
```
class MyPromise {
  constructor(executor) {
    // 2.1 Promise状态和值
    this.status = "pending";    // 2.1.1 初始状态为pending
    this.value = undefined;     // 2.1.2.2 fulfilled状态的值 2.1.3.2 rejected状态的值
    this.onResolvedCallbacks = [];  // 2.2.6.1 存储fulfilled的回调
    this.onRejectedCallbacks = [];  // 2.2.6.2 存储rejected的回调

    // 3.1 确保异步执行
    this.useMicroTask = typeof queueMicrotask === 'function' || typeof process?.nextTick === 'function';

    const resolve = (value) => {
      // 2.3.2 如果value是Promise，递归解析
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      
      // 3.1 确保异步执行
      this.asyncTask(() => {
        if (this.status === 'pending') {
          this.value = value;
          this.status = 'resolved';  // 状态从pending转换为fulfilled
          // 2.2.6.1 调用所有fulfilled回调
          this.onResolvedCallbacks.forEach(fn => fn(value));
        }
      });
    };

    const reject = (reason) => {
      // 3.1 确保异步执行
      this.asyncTask(() => {
        if (this.status === 'pending') {
          this.value = reason;
          this.status = 'rejected';  // 状态从pending转换为rejected
          // 2.2.6.2 调用所有rejected回调
          this.onRejectedCallbacks.forEach(fn => fn(reason));
        }
      });
    };

    try {
     // 2.1.1、2.3 执行 executor 函数 resolve/reject 改变状态
      executor(resolve, reject);
    } catch (e) {
      reject(e); // 2.2.7.2 捕获 executor 内的异常，并以 reject 的形式处理
    }
  }

  // 3.1 异步任务处理函数
  asyncTask(fn) {
    if (this.useMicroTask) {
      // 优先使用微任务
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(fn);
      } else if (typeof process?.nextTick === 'function') {
        process.nextTick(fn);
      }
    } else {
      // 降级使用宏任务
      setTimeout(fn, 0);
    }
  }

  // 2.2 then方法
  then(onFulfilled, onRejected) {
    // 2.2.1 参数可选
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value; // 2.2.1.1
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }; // 2.2.1.2

    // 2.2.7 then必须返回一个新的Promise
    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        // 3.1 确保异步执行
        this.asyncTask(() => {
          try {
            const x = onFulfilled(this.value); // 2.2.5 调用onFulfilled
            resolvePromise(promise2, x, resolve, reject); // 2.2.7.1 处理返回值
          } catch (e) {
            reject(e); // 2.2.7.2 捕获异常
          }
        });
      };

      const handleRejected = () => {
        // 3.1 确保异步执行
        this.asyncTask(() => {
          try {
            const x = onRejected(this.value); // 2.2.5 调用onRejected
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 2.2.2 和 2.2.3 根据状态调用对应的回调
      if (this.status === 'resolved') {
        handleFulfilled();
      } else if (this.status === 'rejected') {
        handleRejected();
      } else {
        // 2.2.6 注册回调
        this.onResolvedCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    // 2.2.3.2 实现catch方法
    return this.then(null, onRejected);
  }

  static resolve(value) {
    // 如果是Promise直接返回
    return value instanceof MyPromise ? value : new MyPromise(resolve => resolve(value));
  }
}

// 2.3 Promise解决过程
function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1 防止循环引用
  if (promise2 === x) {
    reject(new TypeError('循环引用'));
    return;
  }

  let called = false;  // 2.3.3.3.3 确保只调用一次

  // 2.3.3 如果x是对象或函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // 2.3.3.1 获取then方法
      const then = x.then;
      if (typeof then === 'function') {
        // 2.3.3.3 调用then方法
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject); // 2.3.3.3.1 递归处理
          },
          r => {
            if (called) return;
            called = true;
            reject(r); // 2.3.3.3.2 处理reject
          }
        );
      } else {
        // 2.3.3.4 如果then不是函数，直接resolve
        resolve(x);
      }
    } catch (e) {
      // 2.3.3.2 捕获异常
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 2.3.4 如果x不是对象或函数，直接resolve
    resolve(x);
  }
}
```

## 测试
```
MyPromise.deferred = function () {
  const obj = {};

  obj.promise = new MyPromise(function (resolve, reject) {
    obj.resolve = resolve;
    obj.reject = reject;
  });

  return obj;
};
```
保存MyPromise代码和上面代码创建 test.js 文件，并运行以下命令测试
```
npx promises-aplus-tests test.js
```
可以看到MyPromise通过 872个测试 符合 Promise/A+ 规范了！