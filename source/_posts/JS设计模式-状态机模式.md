---
title: JS设计模式-状态机模式
date: 2025-07-26 10:18:49
tags: [状态机模式, 设计模式, javascript]
keywords: JS设计模式-状态机模式
---
# 状态机模式

状态机模式（State Pattern）是一种行为设计模式，它允许对象在内部状态改变时改变它的行为。简单来说，就像一个开关，不同的状态下会有不同的行为表现。
<!--more-->
状态机由以下几个核心组件构成：
- **状态（State）**：对象在某一时刻的特定条件或模式。
- **事件（Event）**：导致状态从一个状态转换到另一个状态的动作或触发器。
- **转换（Transition）**：从一个状态到另一个状态的改变，通常由事件触发，并且可能伴随某些动作。

可以想象一下你的手机：
- **待机状态**：屏幕黑屏，按电源键可以唤醒
- **解锁状态**：屏幕亮起，可以滑动解锁
- **使用状态**：可以打开应用、拨打电话等
- **充电状态**：显示充电图标，限制某些功能

每个状态都有特定的行为，状态之间可以相互转换，这就是状态机的核心思想。

## 为什么要使用状态机模式？

### 传统方式的问题

```javascript
// 传统的if-else方式处理状态
class TrafficLight {
  constructor() {
    this.state = 'red';
  }
  
  changeLight() {
    if (this.state === 'red') {
      this.state = 'green';
      console.log('绿灯亮起，可以通行');
    } else if (this.state === 'green') {
      this.state = 'yellow';
      console.log('黄灯亮起，准备停车');
    } else if (this.state === 'yellow') {
      this.state = 'red';
      console.log('红灯亮起，禁止通行');
    }
  }
  
  // 如果要添加新状态或新行为，代码会变得越来越复杂
  handleEmergency() {
    if (this.state === 'red') {
      // 红灯时的紧急处理
    } else if (this.state === 'green') {
      // 绿灯时的紧急处理
    } else if (this.state === 'yellow') {
      // 黄灯时的紧急处理
    }
  }
}
```

### 状态机模式的优势

1. **代码更清晰**：每个状态的逻辑独立，易于理解
2. **易于扩展**：添加新状态不影响现有代码
3. **减少bug**：状态转换规则明确，避免非法状态
4. **便于维护**：修改某个状态的行为只需修改对应的状态类

## 状态机模式的实现

### 基础实现

```javascript
// 状态接口
class State {
  handle(context) {
    throw new Error('子类必须实现handle方法');
  }
}

// 具体状态类
class RedLight extends State {
  handle(context) {
    console.log('红灯亮起，禁止通行');
    context.setState(new GreenLight());
  }
}

class GreenLight extends State {
  handle(context) {
    console.log('绿灯亮起，可以通行');
    context.setState(new YellowLight());
  }
}

class YellowLight extends State {
  handle(context) {
    console.log('黄灯亮起，准备停车');
    context.setState(new RedLight());
  }
}

// 上下文类（状态机）
class TrafficLight {
  constructor() {
    this.state = new RedLight();
  }
  
  setState(state) {
    this.state = state;
  }
  
  changeLight() {
    this.state.handle(this);
  }
}

// 使用示例
const trafficLight = new TrafficLight();
trafficLight.changeLight(); // 红灯亮起，禁止通行
trafficLight.changeLight(); // 绿灯亮起，可以通行
trafficLight.changeLight(); // 黄灯亮起，准备停车
trafficLight.changeLight(); // 红灯亮起，禁止通行
```

## 实际案例：音乐播放器

让我们用一个更贴近生活的例子——音乐播放器来演示状态机模式：

```javascript
// 播放器状态基类
class PlayerState {
  play(player) {
    throw new Error('子类必须实现play方法');
  }
  
  pause(player) {
    throw new Error('子类必须实现pause方法');
  }
  
  stop(player) {
    throw new Error('子类必须实现stop方法');
  }
}

// 停止状态
class StoppedState extends PlayerState {
  play(player) {
    console.log('开始播放音乐 🎵');
    player.setState(new PlayingState());
  }
  
  pause(player) {
    console.log('当前已停止，无法暂停');
  }
  
  stop(player) {
    console.log('当前已经是停止状态');
  }
}

// 播放状态
class PlayingState extends PlayerState {
  play(player) {
    console.log('当前正在播放中');
  }
  
  pause(player) {
    console.log('暂停播放 ⏸️');
    player.setState(new PausedState());
  }
  
  stop(player) {
    console.log('停止播放 ⏹️');
    player.setState(new StoppedState());
  }
}

// 暂停状态
class PausedState extends PlayerState {
  play(player) {
    console.log('继续播放 ▶️');
    player.setState(new PlayingState());
  }
  
  pause(player) {
    console.log('当前已经是暂停状态');
  }
  
  stop(player) {
    console.log('停止播放 ⏹️');
    player.setState(new StoppedState());
  }
}

// 音乐播放器类
class MusicPlayer {
  constructor() {
    this.state = new StoppedState();
    this.currentSong = '';
  }
  
  setState(state) {
    this.state = state;
  }
  
  play() {
    this.state.play(this);
  }
  
  pause() {
    this.state.pause(this);
  }
  
  stop() {
    this.state.stop(this);
  }
  
  loadSong(song) {
    this.currentSong = song;
    console.log(`加载歌曲: ${song}`);
  }
}

// 使用示例
const player = new MusicPlayer();
player.loadSong('陈奕迅 - 爱情转移');

player.play();  // 开始播放音乐 🎵
player.play();  // 当前正在播放中
player.pause(); // 暂停播放 ⏸️
player.pause(); // 当前已经是暂停状态
player.play();  // 继续播放 ▶️
player.stop();  // 停止播放 ⏹️
player.pause(); // 当前已停止，无法暂停
```

## 进阶案例：订单状态管理

在电商系统中，订单状态管理是状态机模式的经典应用：

```javascript
// 订单状态基类
class OrderState {
  constructor(name) {
    this.name = name;
  }
  
  pay(order) {
    console.log(`订单${this.name}状态下无法支付`);
  }
  
  ship(order) {
    console.log(`订单${this.name}状态下无法发货`);
  }
  
  receive(order) {
    console.log(`订单${this.name}状态下无法确认收货`);
  }
  
  cancel(order) {
    console.log(`订单${this.name}状态下无法取消`);
  }
}

// 待支付状态
class PendingPaymentState extends OrderState {
  constructor() {
    super('待支付');
  }
  
  pay(order) {
    console.log('✅ 支付成功，订单进入待发货状态');
    order.setState(new PendingShipmentState());
  }
  
  cancel(order) {
    console.log('❌ 订单已取消');
    order.setState(new CancelledState());
  }
}

// 待发货状态
class PendingShipmentState extends OrderState {
  constructor() {
    super('待发货');
  }
  
  ship(order) {
    console.log('🚚 订单已发货，进入待收货状态');
    order.setState(new ShippedState());
  }
  
  cancel(order) {
    console.log('❌ 订单已取消，将退款处理');
    order.setState(new CancelledState());
  }
}

// 已发货状态
class ShippedState extends OrderState {
  constructor() {
    super('已发货');
  }
  
  receive(order) {
    console.log('📦 确认收货，订单完成');
    order.setState(new CompletedState());
  }
}

// 已完成状态
class CompletedState extends OrderState {
  constructor() {
    super('已完成');
  }
}

// 已取消状态
class CancelledState extends OrderState {
  constructor() {
    super('已取消');
  }
}

// 订单类
class Order {
  constructor(id, items) {
    this.id = id;
    this.items = items;
    this.state = new PendingPaymentState();
    this.createTime = new Date();
  }
  
  setState(state) {
    console.log(`订单状态变更: ${this.state.name} -> ${state.name}`);
    this.state = state;
  }
  
  pay() {
    this.state.pay(this);
  }
  
  ship() {
    this.state.ship(this);
  }
  
  receive() {
    this.state.receive(this);
  }
  
  cancel() {
    this.state.cancel(this);
  }
  
  getStatus() {
    return this.state.name;
  }
}

// 使用示例
const order = new Order('ORD001', ['iPhone 15', 'AirPods']);
console.log(`订单创建，当前状态: ${order.getStatus()}`);

order.pay();     // ✅ 支付成功，订单进入待发货状态
order.ship();    // 🚚 订单已发货，进入待收货状态
order.receive(); // 📦 确认收货，订单完成

// 演示错误操作
order.pay();     // 订单已完成状态下无法支付
order.cancel();  // 订单已完成状态下无法取消
```

## 使用状态机模式的最佳实践

### 1. 状态转换图

在实现状态机之前，先画出状态转换图：

```
待支付 --[支付]--> 待发货 --[发货]--> 已发货 --[确认收货]--> 已完成
   |                  |                              
   |                  |                              
   +--[取消]----------+--[取消]--------> 已取消
```

### 2. 状态验证

```javascript
class OrderStateMachine {
  constructor() {
    // 定义允许的状态转换
    this.transitions = {
      'pending_payment': ['paid', 'cancelled'],
      'paid': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };
  }
  
  canTransition(fromState, toState) {
    return this.transitions[fromState]?.includes(toState) || false;
  }
  
  transition(order, toState) {
    if (this.canTransition(order.currentState, toState)) {
      order.currentState = toState;
      console.log(`状态转换成功: ${toState}`);
    } else {
      console.log(`非法状态转换: ${order.currentState} -> ${toState}`);
    }
  }
}
```

### 3. 状态持久化

```javascript
class PersistentOrder extends Order {
  constructor(id, items) {
    super(id, items);
  }
  
  setState(state) {
    super.setState(state);
    // 保存状态到数据库
    this.saveToDatabase();
  }
  
  saveToDatabase() {
    // 模拟保存到数据库
    console.log(`保存订单 ${this.id} 状态: ${this.state.name}`);
  }
  
  static loadFromDatabase(id) {
    // 模拟从数据库加载
    const orderData = { id, state: 'paid', items: ['商品1'] };
    const order = new PersistentOrder(orderData.id, orderData.items);
    
    // 根据保存的状态恢复对象状态
    switch(orderData.state) {
      case 'pending_payment':
        order.state = new PendingPaymentState();
        break;
      case 'paid':
        order.state = new PendingShipmentState();
        break;
      // ... 其他状态
    }
    
    return order;
  }
}
```

## 总结

状态机模式是一个非常实用的设计模式，特别适合以下场景：

1. **对象行为依赖于状态**：如播放器、订单、游戏角色等
2. **状态转换规则复杂**：有多个状态和转换条件
3. **需要避免大量if-else**：让代码更清晰易维护

### 优点
- 📝 **代码清晰**：每个状态的逻辑独立
- 🔧 **易于扩展**：添加新状态不影响现有代码
- 🐛 **减少bug**：状态转换规则明确
- 🔄 **符合开闭原则**：对扩展开放，对修改关闭

### 缺点
- 📈 **增加类的数量**：每个状态都需要一个类
- 🏗️ **结构复杂**：对于简单状态可能过度设计