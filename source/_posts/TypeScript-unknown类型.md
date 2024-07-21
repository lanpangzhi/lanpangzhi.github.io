---
title: TypeScript-unknown类型
date: 2024-07-20 10:42:30
tags: [TypeScript, unknown]
keywords: TypeScript-unknown类型
---
# unknown类型
unknown 类型是 TypeScript 3.0 引入的一种类型，用于表示未知类型。与 any 类型类似，它可以赋值给任何类型的变量，但与 any 不同的是，unknown 类型更安全，因为它强制在使用之前进行类型检查。
<!--more-->

## unknown
```
let x:unknown;
x = true; // 正确
x = 42; // 正确
x = 'langpz'; // 正确
x.length // 报错

let bolg:unknown = { name: 'langpz' };
bolg.name  // 报错
```
- unknown类型跟any类型的不同之处在于，不能直接访问unknown类型上的属性和方法，不能作为函数、类来使用

联合类型中的unknown
```
type UnionUnknown = unknown | null | string | number;
```
- 联合类型与unknown都是unknown类型。

交叉类型中的unknown
```
type UnionUnknown = unknown & null
```
- 交叉类型与unknown都是其他类型, 如上类型就是null类型。

## 使用unknown 类型的上的属性和方法
在使用 unknown 类型的值之前，必须先进行类型检查或类型断言，以确保类型安全。这样做的目的是防止运行时错误和确保代码的类型安全。

```
let value: unknown;

// 使用typeof进行类型检查
if (typeof value === "string") {
    console.log(value.length); // 现在TypeScript知道value是一个string
} else if (typeof value === "number") {
    console.log(value.toFixed(2)); // 现在TypeScript知道value是一个number
}
```


## unknown 类型的优势
1. 类型安全：unknown 类型强制在使用之前进行类型检查或类型断言，确保类型安全。
2. 避免类型错误：使用 unknown 类型可以避免运行时类型错误。
3. 增强代码可读性：通过显式的类型检查，可以提高代码的可读性和可维护性。