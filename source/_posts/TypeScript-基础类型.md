---
title: TypeScript-基础类型
date: 2023-10-14 10:00:09
tags: [TypeScript, 基础类型]
keywords: TypeScript-基础类型
---
# 基础类型
TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举等类型方便我们使用。
TS中冒号后面的都为类型标识。
<!--more-->
## 布尔值
```
let bool:boolean = true;
```

## 数字
和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。

```
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## 字符串
```
let str:string = 'hello langpz';
```

## 数组
声明数组中元素数据类型
```
let arr1:number[] = [1,2,3];
let arr2:string[] = ['1','2','3'];
let arr3:(number|string)[] = [1,'2',3]; // 联合类型  
let arr4:Array<number | string> = [1,'2',3]; // 泛型方式来声明
```

## 元组类型
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
```
let tuple:[string, boolean] = ['langpz',true];
// 像元组中增加数据，只能增加元组中存放的类型
tuple.push(1); // 会报错 Argument of type '1' is not assignable to parameter of type 'string | boolean'
```

## null 和 undefined
任何类型的子类型,如果**strictNullChecks**的值为true，则不能把null 和 undefined付给其他类型。
```
let name:number | boolean;
name = null;
```

## void类型
只能接受null，undefined。一般用于函数的返回值。**严格模式**下不能将null赋予给void。
```
let a:void;
a = undefined;
```

## any类型
不进行类型检测，可以任意赋值。
```
let s:any = 'langpz'
s = 10
```

## 枚举类型
```
enum USER_ROLE {
    USER, // 默认从0开始
    ADMIN,
    MANAGER
}
// {"0": "USER", "1": "ADMIN", "2": "MANAGER", "USER": 0, "ADMIN": 1, "MANAGER": 2}
```
默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值。

```
enum USER_ROLE {
    USER = 'langpz',
    ADMIN = 1,
    MANAGER,
}
// {"1": "ADMIN", "2": "MANAGER", "USER": "langpz", "ADMIN": 1, "MANAGER": 2} 
```

## never类型
任何类型的子类型,never代表永不存在的值。不能把其他类型赋值给never。
```
function error(message: string): never {
    throw new Error("err");
}
function loop(): never {
    while (true) { }
}
function fn(x:number | string){
    if(typeof x == 'number'){

    }else if(typeof x === 'string'){

    }else{
        console.log(x); // never
    }
}
```
## Symbol类型
Symbol的值是不可变且唯一的。
```
const s1 = Symbol('langpz');
const s2 = Symbol('langpz');
console.log(s1 == s2); // false
```

## BigInt类型
JavaScript 中可以用 Number 表示的最大整数为 2^53 - 1，可以写为 Number.MAX_SAFE_INTEGER。如果超过了这个界限，可以用 BigInt来表示，它可以表示任意大的整数。
```
const theBiggestInt: bigint = 9007199254740991n
const alsoHuge: bigint = BigInt(9007199254740991)
const hugeString: bigint = BigInt("9007199254740991")

console.log(theBiggestInt === alsoHuge) // true
console.log(theBiggestInt === hugeString) // true
```

## object对象类型
object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
```
let create = (obj:object):void=>{}

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
```

## 类型断言
类型断言允许您告诉编译器一个值的类型，并且您可以使用两种语法进行类型断言。
```
let value: any = "langpz";
let length: number = (value as string).length;
// 或者
let length2: number = (<string>value).length;
```
