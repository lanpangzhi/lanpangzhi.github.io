---
title: 手写bind、call、apply方法实现
date: 2023-05-13 15:07:23
tags: [javascript]
keywords: 手写bind、call、apply方法实现
---
**bind、call、apply**方法常用于改调用函数并指定函数执行时的上下文（即this关键字的值）以及参数列表。例如将一个类数组对象转换为真正的数组，以便使用数组的方法、Object原型上的toString方法判断数据类型等功能。
<!--more-->

# call
call 方法调用执行函数并用第一个参数改变函数执行时的上下文，可以传多个参数列表

## 实现
```
Function.prototype.myCall = function(context, ...args) {
    // 有bug NaN 0 '' 也会指向window
    context = context || window
    // 使用Symbol 防止替换context属性
    const symbol = Symbol();
    // 通过x.xx() 执行改变 this 上下文
    context[symbol] = this
    const result = context[symbol](...args);
    delete context[symbol];
    return result;
}
```
测试一下
```
var x = 1000
function b(...arg) {
    console.log(this.x ,arg)
}
let a = {
  x: 1
}

b.call(a, 2, 3, 4)
// 输出 1 [2, 3, 4]  this 就变成 a 参数列表也打印了

b.myCall(null, 2, 3, 4)
// 输出 1000 [2, 3, 4] this 是window
```

[demo](https://jsbin.com/qidebuhebo/edit?js,console)

# apply
call 方法调用执行函数并用第一个参数改变函数执行时的上下文，第二个参数是一个数组（或一个类数组对象）的形式提供的参数。 和**call 的区别在于第二个参数 call 是参数列表**

## 实现
```
Function.prototype.myApply = function(context, args) {
    // 有bug NaN 0 '' 也会指向window
    context = context || window
    // 使用Symbol 防止替换context属性
    const symbol = Symbol();
    // 通过x.xx() 执行改变 this 上下文
    context[symbol] = this
    const result = context[symbol](...args);
    delete context[symbol];
    return result;
}
```
测试一下
```
var x = 1000
function b(...arg) {
    console.log(this.x ,arg)
}
let a = {
  x: 1
}

b.apply(a, [2, 3, 4])
// 输出 1 [2, 3, 4]  this 就变成 a 参数列表也打印了

b.myApply(null, [2, 3, 4])
// 输出 1000 [2, 3, 4]  this 是window
```

[demo](https://jsbin.com/fedagicuro/1/edit?js,console)


# bind
bind方法和call、apply都不一样，先绑定context 上下文和参数，创建一个新的函数返回。参数将作为新函数的参数，供调用时使用。

## 实现
```
Function.prototype.myBind = function(context, ...args1) {
  const fn = this;
  return function(...args2) {
    context = context || this;
    return fn.apply(context, [...args1, ...args2]);
  }
}
```
测试一下
```
Function.prototype.myBind = function(context, ...args1) {
  const fn = this;
  return function(...args2) {
    context = context || this;
    return fn.apply(context, [...args1, ...args2]);
  }
}

var x = 1000
function b(...arg) {
    console.log(this.x ,arg)
}
let a = {
  x: 1
}

let bind1 = b.bind(a, 2, [3, 4])
bind1()
// 输出 1 [2, [3, 4]]
let bind2 = b.myBind(null, 2, [3, 4])
bind2()
// 输出 1000 [2, [3, 4]]
```