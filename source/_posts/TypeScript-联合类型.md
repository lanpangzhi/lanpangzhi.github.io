---
title: TypeScript-联合类型
date: 2024-03-22 20:11:51
tags: [TypeScript, 联合类型]
keywords: TypeScript-联合类型
---
# 联合类型
联合类型是 TypeScript 中的一个高级类型，允许一个变量是几种类型之一。你可以使用管道符（|）来定义一个联合类型，这告诉 TypeScript，该变量可以存储管道符两侧任何一种类型的值。例如，string | number 类型的变量可以接受字符串或数字。
<!--more-->

## 用法
```
let langpz:string | number; // 联合类型  
console.log(langpz!.toString()); // 公共方法
langpz = 10;
console.log(langpz!.toFixed(2)); // number方法
langpz = 'lan';
console.log(langpz!.toLowerCase()); // 字符串方法
langpz = true // error Type 'boolean' is not assignable to type 'string | number'
```
在这个例子中，langpz 被定义为可以是 string 或 number 类型。给它赋值字符串或数字都是允许的，但如果尝试赋值其他类型的值，TypeScript 编译器将会报错。

## 使用场景
联合类型在很多情况下都非常有用，特别是在处理多种输入类型但又不想失去类型安全性的情况下。一些常见的使用场景包括：

函数参数：当你希望一个函数能接受不同类型的参数时。
返回类型：当一个函数可能返回多种类型的值时。
数组和其他集合：当数组或其他数据结构中可能包含多种类型的元素时。