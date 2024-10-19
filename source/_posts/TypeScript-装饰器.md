---
title: TypeScript-5.0装饰器
date: 2024-10-19 16:08:53
tags: [TypeScript, 装饰器]
keywords: TypeScript-装饰器
---
# 装饰器
TypeScript 装饰器是一种特殊的声明，可以附加到类声明、方法、属性或参数上。它允许开发者在不修改原有代码的情况下，对类和它的成员进行额外的功能。它就像是在代码的外面包了一层，使得代码可以有更多的功能，而不用重复写同样的逻辑。装饰器本质上是一个函数，在运行时被调用，并接受被装饰的元素作为参数。
<!--more-->
在 TypeScript 5.0 中，将对全新的处于 [stage3](https://github.com/tc39/proposal-decorators) 阶段的装饰器提案提供支持。

# 语法
装饰器使用 @ 符号来表示，后面跟着一个表达式。这个表达式必须是一个函数。
```
function decorator(constructor: Function) {
  console.log('decorator');
}

@decorator
class MyClass {
  method() {}
}
// 输出：decorator
```

## 装饰器类型
```
type Decorator = (value: Input, context: {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
  };
  private?: boolean;
  static?: boolean;
  addInitializer(initializer: () => void): void;
}) => Output | void;
```

装饰器函数有两个参数。运行时，JavaScript 引擎会提供这两个参数。

- value：所要装饰的值，某些情况下可能是undefined（装饰属性时）。
- context：上下文信息对象。
装饰器函数的返回值，是一个新版本的装饰对象，但也可以不返回任何值（void）。

上下文对象也会根据被修饰的值而变化。分解属性：

1. kind：字符串，表示装饰类型，值有class、method、getter、setter、field、accessor。
2. name：被装饰的值的名称: 或者在私有元素的情况下，对其的描述（例如可读名称）。
3. access：对象，包含访问这个值的方法，即存值器和取值器。
4. static: 布尔值，该值是否为静态元素。仅适用于类元素。
5. private：布尔值，该值是否为私有元素。仅适用于类元素。
6. addInitializer：函数，允许用户增加初始化逻辑。


## 类装饰器
类装饰器是用来装饰整个类的。它可以在类定义的时候加上一些额外的功能。例如我们想在每次创建类的时候记录日志，告诉我们类被创建了。
```
function LogClass(constructor: Function) {
  console.log('类被创建了');
}

@LogClass
class MyClass {
  constructor() {
    console.log('MyClass 实例创建');
  }
}
// 输出：类被创建了
```
这个例子中，每次创建 MyClass 的实例时，控制台都会打印 "类被创建了"。

## 方法装饰器
方法装饰器是用来装饰类里面的方法的。可以通过方法装饰器来修改方法的行为，例如在方法执行前后打印一些信息。
```
// 方法装饰器
function LogMethod(target: any, context: ClassMethodDecoratorContext) {
  const originalMethod = target; // target 就是当前被装饰的 class 方法

    // 定义一个新方法
  const decoratedMethod = function (this: unknown, ...args: unknown[]) {
    console.log(`参数是：`, args); // 打印参数
    const returnValue = originalMethod.call(this, ...args); // 调用原有方法
    console.log('代码执行完了');  // 执行完后打印信息
    return returnValue;
  };
  return decoratedMethod
}

class MyClass {
  @LogMethod
  greet(name: string) {
    console.log(`Hello, ${name}!`); // 输出 Hello, lgpz!
  }
}

let m = new MyClass();
m.greet('lgpz'); // 调用方法
```
在这个例子中，每次调用 greet 方法时，控制台会先打印参数，然后再执行原来的逻辑，原有逻辑执行完再输出：代码执行完了。

## 属性装饰器
属性装饰器不直接修改属性值，但可以在属性定义时附加一些信息，比如做权限检查或设置默认值。

```
function LogProperty(target: any, context: DecoratorContext) {
  console.log(`属性 ${[context.name]} 被定义`, context.name);
}

class MyClass {
  @LogProperty
  name: string = 'TypeScript';
}
```
在这个例子中，定义 name 属性时，控制台会打印 "属性 name 被定义"。

## getter 装饰器，setter 装饰器
getter 装饰器和 setter 装饰器，是分别针对类的取值器（getter）和存值器（setter）的装饰器。
```
function logged(value: any, { kind, name }: ClassMemberDecoratorContext) {
  if (kind === "method" || kind === "getter" || kind === "setter") {
    return function (this: unknown, ...args: any[]) {
      console.log(`开始 ${[name]} with arguments ${args.join(", ")}`);
      
      const ret = value.call(this, ...args);
      console.log(`结束 ${[name]}`);
      return ret;
    };
  }
  return
}

class C {
  private _name: string = '';
  @logged
  set x(arg: any) {
    this._name = arg
  }
  @logged
  get x() {
    return this._name
  }
}

let a = new C()
a.x = 'langpz' // 输出： 开始 x with arguments langpz"  结束 x
console.log(a.x) // 输出：开始 x with arguments  结束 x  langpz
```
在这个例子中，get和set x 的时候都会打印开始和和结束。

## accessor 关键字
类装饰器引入了一个关键字accessor（自动访问器），用来属性的前缀。自动访问器与常规字段不同，它在类原型上定义 getter 和 setter。此 getter 和 setter 默认用于在私有槽上获取和设置值。accessor关键字前面，还可以加上static关键字和private关键字。

```
class C {
  accessor x = 1;
}
```
它是一种简写形式，相当于声明属性x是私有属性#x的存取接口。上面的代码等同于下面的代码。

```
class C {
  #x = 1;

  get x() {
    return this.#x;
  }

  set x(val) {
    this.#x = val;
  }
}
```

```
function logged(value: any, { kind, name }: ClassMemberDecoratorContext) {
  if (kind === "accessor") {
    let { get, set } = value;

    return {
      get() {
        console.log(`getting ${[name]}`);

        return get.call(this);
      },

      set(val: any) {
        console.log(`setting ${[name]} to ${val}`);

        return set.call(this, val);
      },

      init(initialValue:any) {
        console.log(`initializing ${[name]} with value ${initialValue}`);
        return initialValue;
      }
    };
  }

  return
}

class C {
  @logged accessor x = '1';
}

let c = new C();
// initializing x with value '1'
c.x;
// getting x
c.x = 'langpz';
// setting x to langpz
```
在这个例子中改写accessor属性的 getter 和 setter 方法。自动访问器初始化时以及每次访问时进行记录。

## addInitializer() 方法
addInitializer方法可用于为每种类型的值提供给装饰器的上下文对象。可以调用此方法将初始化函数与类或类元素关联起来，该函数可用于在定义值后运行任意代码以完成设置。
设置时机
- 类装饰器：在类完全定义之后，并且类静态字段被分配之后。
- 类静态元素
  - 方法和 Getter/Setter 装饰器：在类定义期间，在分配静态类方法之后，在初始化任何静态类字段之前。
  - 字段和访问器装饰器：在类定义期间，在应用它们的字段或访问器初始化之后立即初始化。
- 类非静态元素
 - 方法和 Getter/Setter 装饰器：在类构造期间，在任何类字段初始化之前。
 - 字段和访问器装饰器：在类构造期间，在应用它们的字段或访问器初始化之后立即初始化。

```
function bound(value: any, { name, addInitializer }:ClassMethodDecoratorContext) {
  addInitializer(function (this: any) {
    this[name] = this[name].bind(this);
  });
}

class C {
  message = "hello!";

  @bound
  m() {
    console.log(this.message);
  }
  c() {

    console.log(this.message);
  }
}

let { m, c } = new C();

m(); // hello!
```
在这个例子中addInitializer方法装饰器实现了@bound装饰器，将方法this绑定到类。

# 参考
[ts5.0装饰器](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)