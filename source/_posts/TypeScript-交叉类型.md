---
title: TypeScript-交叉类型
date: 2024-04-27 10:20:57
tags: [TypeScript, 交叉类型]
keywords: TypeScript-交叉类型
---
# 交叉类型
在 TypeScript 中，交叉类型（Intersection Types）是一种非常有用的类型操作符，它允许我们将多个类型合并为一个新的类型。
<!--more-->
合并对象属性： 当你需要将多个对象的属性合并成一个新对象时，可以使用交叉类型。这在实现对象组合时非常有用。
```
type Name = { name: string;  };
type Age = { age: number; };

type Person = Name & Age;
let lanpz: Person = { name: 'langpz', age: '18' }
```

在上面的示例中，我们定义了两个类型 Name 和 Age，然后使用 & 符号将它们合并为一个新的类型 Person Person 类型具有 Name 和 Age 类型的所有属性。lanpz


函数参数： 当你需要定义一个函数，其参数具有多种类型的属性时，可以使用交叉类型。
```
function mixin<T, K>(a: T, b: K): T & K {
    return { ...a, ...b }
}
const lan = mixin({ name: 'langpz' }, { address: 'https://blog.langpz.com/' })
```