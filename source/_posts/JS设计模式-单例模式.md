---
title: JS设计模式-单例模式
date: 2025-02-22 09:40:26
tags: [单例模式, 设计模式, javascript]
keywords: JS设计模式-单例模式
---
单例模式（Singleton Pattern），其核心思想是保证一个类只有一个实例，并提供一个全局访问点。
<!--more-->
单例模式可以用来管理一些共享资源，例如全局配置、应用配置管理器、事件总线等。
# 单例模式实现
```
class Single {
  constructor() {
    if (Single.instance) {
      return Single.instance;
    }

    this.data = []
    Single.instance = this;
  }
  addData(data) {
    this.data.push(data)
  }
  getData() {
    return this.data
  }
}

const single1 = new Single()
const single2 = new Single()
single1.addData(1)
console.log(single2.getData()) // [1]
console.log(single1 === single2) // true, single1 和 single2 为同一实例
```
例子中，构造函数检查 Single.instance 是否已存在。如果存在则返回已有实例，否则创建新实例并缓存。这样，无论调用多少次构造函数，都只能得到同一个实例。

# 单例模式的优缺点
## 优点

| 优点 | 描述 |
| --- | --- |
| 节省资源 | 只创建一个实例，避免重复创建和销毁对象 |
| 保证数据一致性 | 所有代码访问的都是同一个对象实例 |
| 全局访问点 | 提供一个全局访问点，方便在应用的不同部分使用 |

## 缺点

| 缺点 | 描述 |
| --- | --- |
| 全局状态 | 单例引入了全局状态，可能导致代码耦合度增加 |
| 测试困难 | 单例对象的状态在测试之间可能会相互影响，使测试变得困难 |
| 隐藏依赖 | 使用单例可能会隐藏类之间的依赖关系 |