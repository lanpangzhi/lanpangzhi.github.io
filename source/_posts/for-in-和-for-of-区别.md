---
title: for in 和 for of 区别
date: 2023-07-16 17:59:18
tags: [javascript]
keywords: for in 和 for of 区别
---
# for in 和 for of 区别
for...in 和 for...of 是 JavaScript 中的两种不同的循环语法，用于遍历对象和数组的元素。
<!--more-->

## for...in 循环
for...in 语句以任意顺序迭代一个**对象的除Symbol以外的可枚举属性**，包括**继承的可枚举属性**。
for...in 循环不推荐用于遍历数组，因为它可能会遍历数组的所有属性，包括**数组原型链上的属性**，从而导致不可预料的结果。
```
Object.prototype.a = '123'
const obj = { name: 'lanpz', age: 60, sex: '男' };
for (let key in obj) {
  console.log(key + ': ' + obj[key]);
}

// 输出
// "name: lanpz"
// "age: 60"
// "sex: 男"
// "a: 123"
```

## for...of 循环
for...of语句在**可迭代对象（包括 Array，Map，Set，String，TypedArray等）**上创建一个迭代循环。

```
const arr = [1, 2, 3];
Array.prototype.arrCustom = 5
for (let value of arr) {
  if (value == 2) {
    continue
  }
  console.log(value);
}

// 输出
// 1
// 3
```

## for in 和 for of 区别
- for in 不仅会遍历当前对象，还包括原型链上的可枚举属性。可能需要通过 hasOwnProperty() 方法来检查是否为对象自身的属性，以避免遍历到原型链上的属性。
- for of 可以使用break，continue，return终止循环、for in 不支持。
- for of 按顺序遍历，for...in 循环不保证遍历对象属性的顺序。