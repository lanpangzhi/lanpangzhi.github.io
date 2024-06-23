---
title: TypeScript-条件类型
date: 2024-06-23 17:05:18
tags: [TypeScript, 条件类型]
keywords: TypeScript-条件类型
---
# 条件类型
条件类型是 TypeScript 提供的一种基于条件的类型选择机制，可以根据类型的真假条件来进行类型推导和分配。这种功能使得 TypeScript 更加灵活和强大，能够处理复杂的类型逻辑。例如 ** A extends B ? C : D **。
<!--more-->

## 条件类型基本使用
可以使用extends关键字和三元表达式，实现条件判断。
```
A extends B ? C : D
```
A extends B 是条件表达式，如果 A 能够赋值给 B（即 A 是 B 的子类型），那么结果类型就是 C，否则就是 B。

案例
```
type IsNumber<T> = T extends number ? true : false;

type B = IsNumber<number>;  // true
type A = IsNumber<string>;  // false
```
IsNumber 是一个条件类型，它检查给定的类型 T 是否是 number 类型。如果是 number，则结果类型为 true，否则为 false。

## 条件类型分发
当条件类型作用于联合类型时，TypeScript 会对联合类型中的每一个成员单独进行条件类型的检查和分发。这意味着条件类型在联合类型上会进行分配和计算，而不是直接应用于整个联合类型。
```
type Example<T> = T extends string ? 'string' : 'not string';
type Result = Example<string | number>;  // 'string' | 'not string'
```
Result 的类型是 'string' | 'not string'，因为 Example 类型应用于 string 和 number 时，分别得到了 'string' 和 'not string'。这里会用每一项依次进行分发，最终采用联合类型作为结果，等价如下。
```
type c1 = Example<string>;
type c2 = Example<number>;
type c = c1 | c2
```

## infer类型推断
infer 关键字用于在条件类型中引入类型推断。它允许从上下文中推断出某个类型，而无需显式指定。这种特性对于处理复杂的类型转换和推断非常有用。

- MyReturnType 返回值类型
```
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { a: 1, name: "lanpz" };
}

type ExampleReturnType = MyReturnType<typeof getUser>; // { a: number, name: string }
```
- MyInstanceType 实例类型
```
class Person {
  constructor(name: string, age: number) { }
}
type MyInstanceType<T> = T extends { new(...args: any): infer R } ? R : any
type MyInstance = MyInstanceType<typeof Person>
```