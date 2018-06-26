---
title: ES6系列-let和const变量
date: 2018-06-26 17:08:51
tags: [ES6,javascript]
keywords: ES6系列-let和const变量
---
# ES6系列-let和const变量
ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。
<!--more-->

首先说说var声明变量的弊端。
1.可以重复声明
2.无法限制修改
3.没有块级作用域
4.变量会被提升

## let

let不可以重复声明。
```
let a = 2;
let a = 3;
alert(a)
```
如果重复声明会直接报错。
let有块级作用域。
```
{
  let a = 2;
  var b = 3;
}
console.log(b);
console.log(a);
```
会报错 a is not defined。
let不存在变量提升。
```
console.log(a)
console.log(b)
var a = 1;
let b = 2;
```
会打印出 a undefined b is not defined。

## const
const常量是不可以被修改的。
```
const a = 'lanpangzhi';
a = 11;
alert(a)
```
修改会直接报错，但是如果是对象数据类型可以在对象下添加新得属性。
```
const a = {};
a.b = 2;
console.log(a)
```
这样写不会报错，常量a存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把a指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

const不可以重复声明。
```
const a = 2;
const a = 3;
alert(a)
```
如果重复声明会直接报错。

const有块级作用域。
```
{
  const a = 2;
  var b = 3;
}
console.log(b);
console.log(a);
```
会报错 a is not defined。

const不存在变量提升。
```
console.log(a)
console.log(b)
var a = 1;
const b = 2;
```
会打印出 a undefined b is not defined。

## 例子
让i从0输出到5，按顺序输出，es5版本需要闭包来实现。
```
for (var i = 0; i <= 5; i++){
	(function(i){
		console.log(i)
	})(i)
}
```
es6版本
```
for (let i = 0; i <= 5; i++){
	console.log(i)
}
```
let和const解决了var的弊端，瞬间开发变简单了很多。

# 参考
[http://es6.ruanyifeng.com/#docs/let](http://es6.ruanyifeng.com/#docs/let)