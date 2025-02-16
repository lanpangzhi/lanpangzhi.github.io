---
title: JS设计模式-观察者模式
date: 2025-01-19 15:45:00
tags: [观察者模式, 设计模式, javascript]
keywords: JS设计模式-观察者模式
---
观察者模式是一种“一对多”依赖关系设计模式。
 - 被观察者（Subject）：保存着所有观察者的列表，当自身状态改变时，负责通知所有观察者。
 - 观察者（Observer）：实现一个更新接口，当接收到通知时自动执行相应操作。
<!--more-->

# 观察者模式实现
```
// 被观察者类
class Subject {
  constructor() {
    this.observers = [];  // 存储所有观察者
  }
  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }
  // 删除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  // 通知所有观察者，传递相关数据
  notifyObservers(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// 观察者类
class Observer {
  constructor(name) {
    this.name = name;
  }
  // 当被观察者状态变化时调用该方法
  update(data) {
    console.log(`${this.name} 收到更新：${data}`);
  }
}

// 示例使用
const subject = new Subject();
const observer1 = new Observer("观察者1");
const observer2 = new Observer("观察者2");

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 被观察者状态发生改变，通知所有观察者
subject.notifyObservers("状态 A 已更新");

// 删除其中一个观察者后再次通知
subject.removeObserver(observer1);
subject.notifyObservers("状态 B 已更新");

```

# demo
[demo地址](https://jsbin.com/figavehado/edit?js,console)