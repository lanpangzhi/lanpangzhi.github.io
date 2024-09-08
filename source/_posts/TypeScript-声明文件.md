---
title: TypeScript-声明文件
date: 2024-09-07 10:16:01
tags: [TypeScript, 声明文件]
keywords: TypeScript-声明文件
---
# 声明文件
TypeScript 声明文件（.d.ts）是用来描述 JavaScript 库或模块的类型信息的文件。它告诉 TypeScript 编译器，这些库或模块中的变量、函数、类等具有什么样的类型，从而使我们在使用这些库时能够获得类型检查和代码补全等功能，提高开发效率和代码质量。
<!--more-->

# 创建声明文件的场景
声明文件通常用于以下场景：
1. JavaScript 库没有内置的类型定义：比如老旧的 JavaScript 库或者一些专用的小型库没有提供 .d.ts 文件，这时你可以手动创建一个声明文件来为该库添加类型支持。
2. 当需要编写自己的 JavaScript 库或模块时，需要定义其类型信息以便其他开发者能够更好地使用它。
3. 为第三方库添加类型：有些库可能已经在 DefinitelyTyped 上有类型定义，但你可能需要根据项目需求进行扩展或修改。

# 声明全局变量

全局变量的声明
```
declare const _: {
  map<T>(arr: T[], fn: (item: T) => any): T[];
};
```
声明了一个全局变量 _，它是一个对象，其中有一个名为 map 的方法。

函数的声明
```
declare function lanpz(name: string): void;
```
声明了一个名为 lanpz 的函数，接受一个 string 类型的参数，并且不返回任何值（void）。

类的声明
```
declare class Person {
  constructor(name: string, age: number);
  greet(): string;
}
```
声明了一个 Person 类，带有构造函数和一个方法。

模块的声明
```
declare module "lodash" {
  export function map<T>(arr: T[], fn: (item: T) => any): T[];
}
```
声明了一个 lodash 模块，其中包含一个 map 函数。

全局变量的声明

```
declare global {
  interface Window {
    name: string;
  }
}
```
Window 接口添加了一个名为 name 的属性，并且将其类型定义为 string。TypeScript 在任何地方引用 window.name 时都会认为它是一个 string 类型的值。

还可以使用 **declare namespace** 来声明一个命名空间; **declare enum** 来声明一个枚举类型; **declare interface** 来声明一个接口; **declare type** 来声明一个类型别名等。

## 编写第三方声明文件
假设我们有一个名为 langpz-lib 的第三方库，它导出了一个对象，里面包含几个方法和属性：
```
// langpz-lib.js
module.exports = {
  name: "LangpzLib",
  version: "1.0.0",
  hello: function () {
    console.log("Hello, LangpzLib!");
  },
  config: {
    setting1: true,
    setting2: "default"
  }
};

```
TypeScript 声明文件示例
```
// langpz-lib.d.ts
declare module "langpz-lib" {
  export const name: string;
  export const version: string;

  export function hello(): void;

  export interface Config {
    setting1: boolean;
    setting2: string;
  }

  export const config: Config;
}
```
declare module 一般用于定义 CommonJS 模块或其他非 ES6 模块系统中的模块。

# 使用第三方 @types 包
在很多情况下，你不需要手动编写声明文件，因为大部分流行的 JavaScript 库都已经由社区编写好了类型定义文件，并发布到了 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 仓库中。你可以通过 npm 安装这些声明文件，通常以 @types 前缀命名。
```
npm install @types/lodash -D
```
当使用lodash时默认会查找 node_modules/@types/lodash/index.d.ts 文件，无需手动配置。TypeScript 将自动引用这些类型声明文件。

