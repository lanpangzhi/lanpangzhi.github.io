---
title: TypeScript-类型保护
date: 2024-05-25 12:48:08
tags: [TypeScript, 类型保护]
keywords: TypeScript-类型保护
---
# 类型保护
在 TypeScript 中，类型保护（Type Guards）通过在运行时检查变量的类型，可以在特定的代码块中自动识别变量的属性和方法，从而确保代码的类型安全，提示并规避不合法的操作。
<!--more-->

## typeof类型保护
typeof 操作符可以用来判断基本类型，如 string、number 等。
```
function langpz(value: string | number) {
  value.toFixed(2) // 报错 类型“string”上不存在属性“toFixed”
    if (typeof value === 'string') {
        console.log(value.toUpperCase()); // value 被识别为 string
    } else if (typeof value === 'number') {
        console.log(value.toFixed(2)); // value 被识别为 number
    }
}

langpz("hello"); // 输出: "HELLO"
langpz(123.456); // 输出: "123.46"
```
通过 typeof 操作符，我们可以对变量进行识别类型，避免调用字符串或者数字方法报错。

## instanceof类型保护

```
class Cat {
    miao() {
        console.log("喵喵");
    }
}
class Dog {
    wang() {
        console.log("汪汪");
    }
 }

const speak: (animal: Cat | Dog) => void = (animal) => {
    if (animal instanceof Dog) {
        animal.wang(); // animal 被识别为 Dog
    } else if (animal instanceof Cat) {
        animal.miao(); // animal 被识别为 Cat
    }
}

const dog = new Dog();
const cat = new Cat();

speak(dog); // 输出: "汪汪!"
speak(cat); // 输出: "喵喵!"

```
instanceof 检查使得 TypeScript 能够在不同的代码块中识别 animal 是 Dog 还是 Cat 的实例，并调用相应的方法。

## in类型保护
in 操作符用于检查对象上是否存在某个属性。它适用于检查具有不同属性的联合类型。
```
interface Fish {
    swim(): void;
}
interface Bird {
    fly(): void;
}
function getType(animal: Fish | Bird) {
    if ('swim' in animal) {
        animal.swim(); // animal 被识别为 Fish
    } else {
        animal.fly(); // animal 被识别为 Bird
    }
}
const fish: Fish = { swim: () => console.log("Swimming") };
const bird: Bird = { fly: () => console.log("Flying") };
getType(fish); // 输出: "Swimming"
getType(bird); // 输出: "Flying"
```

## 自定义类型保护
自定义类型保护通常是一个函数，它接受一个参数，并返回一个类型谓词，即一个表达式，其结果为布尔值，用于确定参数是否属于某个特定的类型。
```
interface Fish {
    swim(): void;
}
interface Bird {
    fly(): void;
}
function isBird(animal: Fish | Bird):animal is Bird {
    return 'fly' in animal
}
function getAniaml (animal:Fish | Bird){
    if(isBird(animal)){
        animal.fly(); // animal 被识别为 Bird
    }else{
        animal.swim(); // animal 被识别为 Fish
    }
}

const fish: Fish = { swim: () => console.log("Swimming") };
const bird: Bird = { fly: () => console.log("Flying") };

getAniaml(fish); // 输出: "Swimming"
getAniaml(bird); // 输出: "Flying"
```
自定义类型保护函数 isBird 通过检查 fly 方法是否存在来识别 animal 是否为 Bird 类型。


## 可辨识联合类型
可辨识联合类型是一种特殊的联合类型，它允许我们根据某个字段（通常称为“标签”或“可辨识字段”）的值来区分不同的类型。
```
interface Fish {
    kind: "fish";
    swim(): void;
}

interface Bird {
    kind: "bird";
    fly(): void;
}

type Animal = Fish | Bird;

function makeSound(animal: Animal) {
    switch (animal.kind) {
        case "fish":
            animal.swim(); // 在这里，animal 被识别为 Fish 类型
            break;
        case "bird":
            animal.fly(); // 在这里，animal 被识别为 Bird 类型
            break;
        default:
            // 这是一个类型永远不会到达的分支，但可以为了完整性而保留
            throw new Error("Unknown animal kind");
    }
}

const myFish: Fish = { kind: "fish", swim: () => console.log("langpz fish") };
const myBird: Bird = { kind: "bird", fly: () => console.log("langpz bird") };

makeSound(myFish); // 输出: "langpz fish"
makeSound(myBird); // 输出: "langpz bird"

```