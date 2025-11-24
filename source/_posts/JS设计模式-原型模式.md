---
title: JS设计模式-原型模式
date: 2025-10-18 10:00:00
tags: [原型模式, 设计模式, javascript]
keywords: JS设计模式-原型模式
---

# 原型模式

（Prototype Pattern）原型模式是一种创建型设计模式，通过复制现有对象来创建新对象，而不是通过实例化类来创建。这种模式允许你通过克隆原型对象来创建新对象，避免了重复的初始化代码。

在 JavaScript 中，原型模式是语言的核心特性之一，因为 JavaScript 本身就是基于原型的语言。

<!-- more -->

## 核心概念

### 原型对象

每个 JavaScript 对象都有一个原型对象`（prototype）`，新对象可以从原型对象继承属性和方法。

### 原型链

当访问一个对象的属性时，如果对象本身没有这个属性，JavaScript 会沿着原型链向上查找，直到找到该属性或到达原型链的末端。

```javascript
// 原型链查找示例
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating.`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 继承属性
  this.breed = breed;
}

// 建立原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking!`);
};

const dog = new Dog('旺财', '中华田园犬');
dog.eat();  // 旺财 is eating. (从 Animal.prototype 继承)
dog.bark(); // 旺财 is barking!

// 原型链查找过程：
// 1. dog.eat() -> dog 自身没有 eat 方法
// 2. 查找 Dog.prototype -> 也没有 eat 方法
// 3. 查找 Animal.prototype -> 找到 eat 方法并执行

console.log(dog.hasOwnProperty('name'));  // true (实例自身属性)
console.log(dog.hasOwnProperty('eat'));   // false (从原型继承)
```

## 实现方式

### 1. Object.create() 方式

```javascript
// 原型对象
const carPrototype = {
  wheels: 4,
  engine: 'V8',
  drive() {
    console.log(`驾驶这辆 ${this.brand} ${this.model}`);
  },
  getInfo() {
    console.log(`品牌: ${this.brand}, 型号: ${this.model}, 引擎: ${this.engine}`);
  }
};

// 通过原型创建新对象
const car1 = Object.create(carPrototype);
car1.brand = 'Tesla';
car1.model = 'Model S';

const car2 = Object.create(carPrototype);
car2.brand = 'BMW';
car2.model = 'X5';

car1.drive(); // 驾驶这辆 Tesla Model S
car2.getInfo(); // 品牌: BMW, 型号: X5, 引擎: V8
```

### 2. 构造函数与原型

```javascript
// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在原型上添加方法
Person.prototype.introduce = function() {
  console.log(`大家好，我是 ${this.name}，今年 ${this.age} 岁`);
};

Person.prototype.sayHello = function() {
  console.log(`你好，我是 ${this.name}`);
};

// 创建实例
const person1 = new Person('张三', 25);
const person2 = new Person('李四', 30);

person1.introduce(); // 大家好，我是 张三，今年 25 岁
person2.sayHello(); // 你好，我是 李四

// 所有实例共享原型上的方法
console.log(person1.introduce === person2.introduce); // true
```

### 3. 克隆方法实现

```javascript
class Prototype {
  constructor() {
    this.data = {};
  }

  // 浅克隆
  clone() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this)
    );
  }

  // 深克隆
  deepClone() {
    const cloned = this.clone();

    for (let key in cloned) {
      if (cloned.hasOwnProperty(key) && typeof cloned[key] === 'object') {
        cloned[key] = JSON.parse(JSON.stringify(cloned[key]));
      }
    }

    return cloned;
  }
}

class Product extends Prototype {
  constructor(name, price, features) {
    super();
    this.name = name;
    this.price = price;
    this.features = features;
  }

  display() {
    console.log(`产品: ${this.name}, 价格: ${this.price}元`);
    console.log('特性:', this.features);
  }
}

// 创建原型对象
const originalProduct = new Product('iPhone', 6999, {
  color: '白色',
  storage: '128GB',
  camera: '双摄'
});

// 浅克隆
const clonedProduct = originalProduct.clone();
clonedProduct.name = 'iPhone Pro';
clonedProduct.price = 8999;
clonedProduct.features.camera = '三摄'; // 会影响原对象

originalProduct.display();
// 产品: iPhone, 价格: 6999元
// 特性: { color: '白色', storage: '128GB', camera: '三摄' }

// 深克隆
const deepClonedProduct = originalProduct.deepClone();
deepClonedProduct.features.color = '黑色';

originalProduct.display();
// 产品: iPhone, 价格: 6999元
// 特性: { color: '白色', storage: '128GB', camera: '三摄' }
```

## 实际应用场景

### 1. 插件系统

```javascript
function Editor() {
  this.content = '';
}

Editor.prototype.plugins = [];

Editor.prototype.use = function(plugin) {
  this.plugins.push(plugin);
  plugin.init(this);
};

// 定义插件
const spellChecker = {
  init(editor) {
    editor.checkSpelling = function() {
      console.log('检查拼写...');
    };
  }
};

const autoSave = {
  init(editor) {
    editor.autoSave = function() {
      console.log('自动保存:', this.content);
    };
  }
};

const editor = new Editor();
editor.use(spellChecker);
editor.use(autoSave);

editor.checkSpelling(); // 检查拼写...
editor.autoSave();      // 自动保存:
```

### 2. 配置对象克隆

```javascript
// 默认配置原型
const defaultConfig = {
  theme: 'light',
  language: 'zh-CN',
  fontSize: 14,
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  display: {
    showSidebar: true,
    showToolbar: true
  }
};

// 创建用户配置
function createUserConfig(customConfig) {
  // 深克隆默认配置
  const config = JSON.parse(JSON.stringify(defaultConfig));

  // 合并自定义配置
  return Object.assign(config, customConfig);
}

const userConfig1 = createUserConfig({
  theme: 'dark',
  fontSize: 16
});

const userConfig2 = createUserConfig({
  language: 'en-US',
  notifications: {
    email: false
  }
});

console.log(userConfig1);
// { theme: 'dark', language: 'zh-CN', fontSize: 16, ... }

console.log(userConfig2);
// { theme: 'light', language: 'en-US', fontSize: 14, ... }
```

### 3. 游戏角色克隆

```javascript
class GameCharacter {
  constructor(config) {
    this.type = config.type;
    this.health = config.health;
    this.attack = config.attack;
    this.defense = config.defense;
    this.skills = [...config.skills];
  }

  clone() {
    return new GameCharacter({
      type: this.type,
      health: this.health,
      attack: this.attack,
      defense: this.defense,
      skills: this.skills
    });
  }

  display() {
    console.log(`类型: ${this.type}`);
    console.log(`生命值: ${this.health}`);
    console.log(`攻击力: ${this.attack}`);
    console.log(`防御力: ${this.defense}`);
    console.log(`技能: ${this.skills.join(', ')}`);
  }
}

// 创建战士原型
const warriorPrototype = new GameCharacter({
  type: '战士',
  health: 100,
  attack: 80,
  defense: 60,
  skills: ['冲锋', '旋风斩', '嘲讽']
});

// 创建法师原型
const magePrototype = new GameCharacter({
  type: '法师',
  health: 60,
  attack: 100,
  defense: 30,
  skills: ['火球术', '冰霜新星', '传送']
});

// 克隆角色
const warrior1 = warriorPrototype.clone();
const warrior2 = warriorPrototype.clone();
const mage1 = magePrototype.clone();

warrior1.health = 90; // 只影响当前实例
warrior1.display();
```

## 注意事项

1. 引用类型的共享问题，需在构造函数中初始化引用类型属性
2. 构造函数的 constructor 属性，重写原型对象时，记得修复 constructor 指向。
3. 虽然原型可以节省内存，但过长的原型链会影响属性查找性能。

## 与其他模式的区别

### 原型模式 vs 工厂模式

- **原型模式**：通过克隆现有对象创建新对象
- **工厂模式**：通过工厂方法创建新对象

### 原型模式 vs 单例模式

- **原型模式**：可以创建多个相似的对象实例
- **单例模式**：确保只有一个实例存在

## 总结

原型模式是 JavaScript 的基础，理解原型模式对于掌握 JavaScript 至关重要。它的核心优势包括：

- **内存效率**：通过共享方法减少内存占用
- **灵活性**：支持动态扩展和修改
- **继承机制**：通过原型链实现对象继承
