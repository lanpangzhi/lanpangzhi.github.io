---
title: TypeScript-函数类型
date: 2023-11-11 15:50:07
tags: [TypeScript, 函数类型]
keywords: TypeScript-函数类型
---
# 函数类型
在 TypeScript 中，函数不仅是代码结构的组成部分，还是类型系统的核心。通过函数类型，我们能够更清晰地定义函数的输入和输出，并让 TypeScript 编译器在编译时进行更强大的类型检查。
<!--more-->
## 函数的两种声明方式
- 通过function关键字来进行声明
```
function add(a: number, b: number):number {
    return a + b;
}
add(1, 2)
```
- 通过表达式方式声明
```
type Add = (x: number, b1: number) => number;
let add: Add = (x, y) => {
    return x + y
};
add(1, 2)
```
可以用来限制**函数的参数和返回值类型**，上面的例子声明了一个名为 add 的函数，该函数接收两个参数 x 和 y，它们的类型分别为 number，并且函数返回值的类型也被指定为 number。

## 可选参数
在函数参数中，有时候我们希望某个参数是可选的（非必传）。可以使用 **?** 表示可选参数。
```
let sum = (a: string, b?: string):string => {
    return a + b;
};
sum('langpz');
```
**可选参数必须在其他参数的最后面。**

## 默认参数
在函数参数中，有时候我们希望希望给参数设置一个默认值。可以使用 **=** 表示默认参数。
```
let sum = (a: string, b: string = '.com'):string => {
    return a + b;
};
sum('langpz');
```
**默认参数不能同时和可选参数使用。**

## 剩余参数
有时我们希望一个函数可以接受任意数量的参数。可以使用 **...** 表示剩余参数。
```
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, val) => acc + val, 0);
}

const result = sum(1, 2, 3, 4); // 10
```

## 函数重载
TypeScript 允许我们为同一个函数提供多个类型定义，称之为函数重载。你可以在不同的情况下为函数提供不同的输入和输出类型定义，让编译器能够更精确地推断和检查函数调用。
```
function toArray(value: number): number[]
function toArray(value: string): string[]
function toArray(value: number | string) {
    if (typeof value === 'string') {
        return value.split('');
    } else {
        return value.toString().split('').map(item => Number(item));
    }
}
toArray(123);  // [1, 2, 3] 
toArray('123'); // ["1", "2", "3"] 
```
根据传入不同类型的数据 返回不同的结果。