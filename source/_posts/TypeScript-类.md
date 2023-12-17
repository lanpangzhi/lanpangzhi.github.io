---
title: TypeScript-类
date: 2023-12-09 17:47:18
tags: [TypeScript, 类]
keywords: TypeScript-类
---
# 类
es5及以前，JavaScript 通过构造函数实现类的概念，通过原型链实现继承来创建可重用的组件。而在 ES6 中，可以使用 class。基于类的面向对象的方式。
TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法如（public，readonly）。
<!--more-->

## TS中使用类
```
class Pointer{
    x!:number; // 实例上的属性必须先声明
    y!:number;
    constructor(x:number,y?:number,...args:number[]){
        this.x = x;
        this.y = y as number;
    }
}

class SumPointer extends Pointer { 
   log():void { 
      console.log("x+y:  "+ (this.x + this.y)) 
   } 
}
let p1 = new SumPointer(100,200);
p1.log() // 打印300
```
实例上的属性需要先声明在使用，构造函数中的参数可以使用可选参数和剩余参数。

## 类的修饰符（public、private、protected等）
在 TypeScript 中，我们可以使用修饰符来限制对类的属性和方法的访问。

### public修饰符（谁都可以访问到）默认为 public
```
class Pointer{
    public x:number; // 不写修饰符默认为 public
    public constructor(x:number){
        this.x = x;
    }
}

class SumPointer extends Pointer {
   constructor(x:number){
        super(x)
        console.log(this.x)  // 子类访问
   } 
}
let p1 = new SumPointer(100);
```

### protected修饰符 (自己和子类可以访问到)
```
class Pointer{
    protected x:number; 
    constructor(x:number){
        this.x = x;
    }
}

class SumPointer extends Pointer {
   constructor(x:number){
        super(x)
        console.log(this.x)  // 子类访问
   } 
}
let p1 = new SumPointer(100);
console.log(p1.x) // // 无法访问 ts会提示报错
```

### private修饰符 （除了自己都访问不到）
```
class Pointer{
    private x:number; 
    constructor(x:number){
        this.x = x;
        console.log(this.x) // 自己可以访问到
    }
}

class SumPointer extends Pointer {
   constructor(x:number){
        super(x)
        console.log(this.x)  // 子类无法访问
   } 
}
let p1 = new SumPointer(100);
console.log(p1.x) // 无法访问
```

### readonly修饰符 （只读修饰符）
```
class Pointer{
    constructor(readonly x:number){
        this.x = x;  // 只读属性只能在constructor中被赋值
    }
}
let p1 = new Pointer(100);
p1.x = 1  // 错误! x 是只读的.
```

## 静态属性和方法
```
class Pointer{
    static x:number = 10;  // 静态属性
    static getNumber() {
        return 100
    }
}
console.log(Pointer.x, Pointer.getNumber())  //  10,  100 
```
静态属性和方法可以不用实例化，直接通过类就可以调用，并且静态属性和静态方法是可以被子类所继承的。

## 抽象类
抽象类就是供其它类继承的一个基础类。抽象类是不允许被实例化的、只能被继承，抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现,而且必须实现。
```
abstract class Animal{
    name!:string;
    abstract speak():void
}
class Cat extends Animal {
    speak(){
        console.log('喵喵喵');
    }
}
class Dog extends Animal{
    speak():string{
        console.log('汪汪汪');
        return 'wangwang'
    }
}
```