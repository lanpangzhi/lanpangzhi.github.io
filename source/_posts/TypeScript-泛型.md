---
title: TypeScript-泛型
date: 2024-02-25 14:27:17
tags: [TypeScript, 泛型]
keywords: TypeScript-泛型
---
# 什么是泛型？
泛型是一种参数化类型的概念，允许我们在定义函数、类、接口等时使用类型变量来表示未知的具体类型。通过泛型，我们可以编写出更通用的代码，从而提高代码的复用性和可读性。在 TypeScript 中，泛型以 <T> 的形式表示，其中 T 可以是任何标识符，常用于表示类型参数。
<!--more-->
## 泛型函数
```
function getArg<T>(arg: T): T {
    return arg;
}

let output = getArg<string>("langpz");
console.log(output); // 输出：langpz

let output2 = getArg<number>(1);
console.log(output2); // 输出：1
```
getArg 函数接受一个参数 arg，并返回相同的参数。通过 <T>，使函数 getArg 成为了一个泛型函数，可以接受任意类型的参数，并返回相同类型的值。

## 泛型类
泛型类使用（<>）括起泛型类型，跟在类名后面。
```
class Info<T, U> { // 这里的 T 和 U 是使用接口的时候传入
    constructor(public name: T, public age: U) {}
}

let langpz = new Info<string, number>("langpz", 1);
console.log(langpz.name); // 输出：langpz
```
注：类的**静态属性**不能引用泛型类型。

## 泛型约束
有时候，我们希望泛型参数具有某些特定的属性或方法。可以使用泛型约束来实现。如果不约束会ts会直接报错属性或方法不存在。
```
interface Lengthwise {
    length: number;
}
function getArg<T extends Lengthwise>(arg: T): T {
    console.log(arg.length)
    return arg;
}
let output = getArg<string>("langpz");
console.log(output); // 输出：langpz

let output2 = getArg<number>(1); // 报错 Type 'number' does not satisfy the constraint 'Lengthwise'
```
使用了 extends 关键字来约束泛型 T 必须满足 Lengthwise 接口的要求，传入的参数必须包含必须 length 的属性。

## 默认泛型

```
type NameType<T = string> = {
    name: T;
};
let name1:NameType = {name:'langpz'}
```
可以通过在泛型 T 参数后面加上 = 符号和默认值来实现。