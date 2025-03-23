---
title: JS设计模式-代理模式
date: 2025-03-22 14:42:06
tags: [代理模式, 设计模式, javascript]
keywords: JS设计模式-代理模式
---
代理模式（Proxy Pattern）是一种设计模式，它为对象提供一个代理，以控制对该对象的访问。可以把代理理解为对象的“中间人”，在访问目标对象时，代理可以拦截操作，并进行处理、修改或限制。在 ES6 中，JavaScript 引入了 Proxy 对象，使得代理模式的实现变得更加简单和强大。
<!--more-->

# 代理模式用法
ES6 引入的 Proxy 对象让我们可以轻松创建代理。new Proxy(target, handler) 接受两个参数：target 是要代理的对象，handler 是一个对象，其中包含了代理的行为。
```
const target = {
  name: 'Lanpz',
  age: 18
};
const handler = {
  get: function(target, property) {
    console.log(`访问属性: ${property}`);
    return target[property];
  },
  set: function(target, property, value) {
    console.log(`设置 ${property} 属性为 ${value}`);
    target[property] = value;
  }
}
const proxy = new Proxy(target, handler);
proxy.name; // 访问属性: name
proxy.age = 20; // 设置 age 属性为 20
```
在上面的例子中，我们创建了一个代理对象 proxy，它代理了 target 对象。当我们访问 proxy 的属性时，会触发 get 方法，当我们设置 proxy 的属性时，会触发 set 方法。

# 代理的常见应用场景
## 1. 数据验证
代理可以用来验证数据的有效性，例如在表单提交时，我们可以使用代理来验证表单数据是否符合要求。
```
const form = {
  name: '',
  age: ''
};
const handler = {
  set: function(target, property, value) {
    if (property === 'name' && value.length < 2) {
      throw new Error('姓名长度不能小于2');
    }
    if (property === 'age' && (value < 0 || value > 150)) {
      throw new Error('年龄必须在0-150之间');
    }
    target[property] = value;
  }
}
const proxy = new Proxy(form, handler);
proxy.name = 'Lanpz'; // 正确
proxy.age = 180; // 报错提示：年龄必须在0-150之间
```

## 2.保护对象属性
代理可以用来保护对象的属性，例如在一个对象中，我们只想暴露部分属性给外部访问，但是不给外部删除和修改。
```
const obj = {
  name: 'Lanpz',
  age: 18,
  _password: '123456'
};
const handler = {
  get: function(target, property) {
    if (property === '_password') {
     return '******'
    }
    return target[property];
  },
  set: function(target, property, value) {
    if (property.startsWith('_')) {
      throw new Error('不能修改以 _ 开头的属性');
    }
    target[property] = value;
  },
  deleteProperty: function(target, property) {
    if (property.startsWith('_')) {
      throw new Error('不能删除以 _ 开头的属性');
    }
    delete target[property];
  }
}
const proxy = new Proxy(obj, handler);
console.log(proxy.name); // Lanpz
proxy.age = 20; // 正确
console.log(proxy._password); // ******
delete proxy._password; // 报错提示：不能删除以 _ 开头的属性
```
- 代理模式会带来一些性能上的开销，尤其是在频繁访问对象属性的场景下，因此在使用时需要权衡利弊。
- 过度使用代理模式可能会导致代码变得难以维护，因此在使用代理模式时需要谨慎。
- 通过代理模式，我们可以在不修改原始对象的情况下，增强对象的行为，实现各种高级功能。
