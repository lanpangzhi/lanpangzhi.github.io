---
title: TypeScript-接口
date: 2024-01-20 17:24:42
tags: [TypeScript, 接口]
keywords: TypeScript-接口
---
# 接口
接口（Interfaces）是 TypeScript 中强大而灵活的特性之一。接口用于定义代码结构，使得代码更易读、易维护，同时提供了一种强大的方式来描述对象的形状。(接口中不能含有具体的实现逻辑)
<!--more-->

## 函数接口参数
```
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {label: "Size 10 Object"};
printLabel(myObj); //输出:  Size 10 Object
```

## 函数类型接口
```
interface IFullName {
    firstName:string,
    lastName:string
}
interface IFn {
    (obj:IFullName):string
}
const fullName:IFn = ({firstName,lastName})=>{
    return firstName + lastName
}
```
通过接口限制函数的参数类型和返回值类型

## 函数混合类型
```
interface ICounter {
    (): number; // 限制函数类型
    count: 0 // 限制函数上的属性
}
let fn: any = () => {
    fn.count++;
    return fn.count;
}
fn.count = 0;
let counter:ICounter = fn;
counter.xx = 0; // 输出: Property 'xx' does not exist on type 'ICounter'. ICounter上没有xx 属性
console.log(counter());  // 输出: 1
console.log(counter());  // 输出: 2
```
## 对象接口、可选属性、只读属性
```
interface Iinfo{
    age?:number, // 可选属性
    name:'lanpz'|'langpz',
    readonly gender: string // 只读属性
}

interface Iinfo{
    size: string
}
const info:Iinfo = {
    name: 'lanpz',
    gender: '男',
    size: '1'
}
```
?标识的属性为可选属性
readonly标识的属性则不能修改
多个同名的接口会自动合并

## 可索引接口
接口还支持可索引的成员，使我们能够通过索引访问对象的属性。
```
interface StringArray {
  readonly [index: number]: string;
}

const myArray: StringArray = ["a", "b", "c"];
let obj: StringArray = {
    0:'1',1:'2',3:'3'
}
console.log(obj[0]); // 输出: "1"
console.log(myArray[0]); // 输出: "a"
```
## 任意属性
```
interface MyObject {
  [key: string]: any;
}

const myObj: MyObject = {
  name: "John",
  age: 25,
  job: "Engineer"
};

interface MyArray {
    [index: number]: string;
}

const arr: MyArray = ['lanpz', 'aaa'];
```

## 类接口
接口中不能含有具体的实现逻辑
```
interface Speakable {
    name:string;
    speak():void;
}
interface ChineseSpeakable{
    speakChinese():void
}
class Speak implements Speakable,ChineseSpeakable{
    name!:string
    speak(){}
    speakChinese(){}
}
```
## 接口继承
接口的继承使用 extends 关键字。接口之间的（继承）允许你创建一个新的接口，该接口包含了另一个或多个已存在接口的属性和方法。
```
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

const square: Square = {
  color: "red",
  sideLength: 10
};
```