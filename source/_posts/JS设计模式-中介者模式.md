---
title: JS设计模式-中介者模式
date: 2025-05-25 16:04:14
tags: [中介者模式, 设计模式, javascript]
keywords: JS设计模式-中介者模式
---
中介者模式（Mediator Pattern）是一种行为型设计模式，它通过引入一个中介者对象来封装一系列对象之间的交互，从而使得这些对象之间不再相互耦合，从而使得对象之间的通信更加灵活和可维护。这种模式特别适用于管理多个对象或组件间的复杂通信。
<!--more-->

# 中介者模式案例
## 聊天系统
一个简化的聊天系统的中介者模式实现
**中介者类**
```
class ChatRoom {
  showMessage(user, message) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${user.name}: ${message}`);
  }
}
```
**用户类**
```
class User {
  constructor(name, chatRoom) {
    this.name = name;
    this.chatRoom = chatRoom;
  }
  send(message) {
    this.chatRoom.showMessage(this, message);
  }
}
```
**测试**
```
const chatRoom = new ChatRoom();
const user1 = new User('Lanpz', chatRoom);
const user2 = new User('haha', chatRoom);
user1.send('Hello, Lanpz!'); // 输出: [11:00:00] Lanpz: Hello, Lanpz!
user2.send('Hi, haha!'); // 输出: [11:00:00] haha: Hi, haha!
```
这个例子中，ChatRoom 类充当了中介者，User 类则是具体的用户。当用户发送消息时，消息会被传递给中介者，中介者打印消息。这样用户和用户之间的通信不再直接发生，而是通过中介者来进行。

## 优点
- 降低了对象之间的耦合性，使得对象之间的通信更加灵活和可维护。
- 提高了系统的可扩展性，当需要添加新的对象时，只需要修改中介者即可，不需要修改原有对象。
- 简化了对象之间的通信，使得对象之间的通信更加清晰和易于理解。

## 缺点
- 中介者对象可能会变得非常复杂，维护起来可能会比较困难。
- 中介者对象可能会成为系统的瓶颈，影响系统的性能。
- 中介者对象可能会成为系统的单点故障，影响系统的可用性。