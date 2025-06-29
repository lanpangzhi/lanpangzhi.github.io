---
title: JS设计模式-适配器模式
date: 2025-06-28 16:18:49
tags: [适配器模式, 设计模式, javascript]
---

适配器模式（Adapter Pattern）是一种结构型设计模式，它允许将一个类（或对象）的接口转换成客户端期望的另一个接口。适配器让那些由于接口不兼容而不能在一起工作的类可以协同工作。
<!--more-->

# 适配器模式使用场景
在以下情况下可以考虑使用适配器模式：
1. 接口兼容问题： 系统需要使用现有的类，而这些类的接口不符合系统的需求。
2. 提高代码复用性：可以复用一些现有的、功能强大的类，而无需修改其源代码。
3. 增强系统灵活性：将客户端代码与具体实现解耦。如果未来需要替换或引入新的被适配者，只需创建一个新的适配器，而无需修改客户端代码。这在集成第三方库或处理遗留代码时尤其有用。

# 适配器模式的结构
适配器模式包含以下主要角色：
1. 目标接口（Target）：定义客户端使用的与特定领域相关的接口。
2. 适配者（Adaptee）：包含一些已有的功能，但其接口与目标接口不兼容。
3. 适配器（Adapter）：将适配者的接口转换成目标接口，使客户端能够与适配者进行交互。
4. 客户端 (Client) ：使用目标接口的代码

# 适配器模式的实现
## 多种支付方式适配器
在电商系统中，我们经常需要集成多种支付方式（支付宝、微信支付、银联等），每种支付方式的接口都不相同。

### 1. 目标接口 (Target)
所有支付方式都需要提供一个统一的 pay(amount, orderId) 方法。
```
adapter.pay(amount, orderId);
```

### 2. 适配者（Adaptee）
```
// 支付宝支付类
class AlipayService {
  makePayment(amount, orderId) {
    console.log(`支付宝支付: 订单${orderId}, 金额${amount}元`);
    return {
      success: true,
      transactionId: 'alipay_' + Date.now(),
      message: '支付宝支付成功'
    };
  }
}

// 微信支付类
class WechatPayService {
  pay(money, orderNumber) {
    console.log(`微信支付: 订单${orderNumber}, 金额${money}元`);
    return {
      status: 'ok',
      wxTransactionId: 'wx_' + Date.now(),
      desc: '微信支付完成'
    };
  }
}

// 银联支付类
class UnionPayService {
  processPayment(orderInfo) {
    console.log(`银联支付: 订单${orderInfo.id}, 金额${orderInfo.amount}元`);
    return {
      code: 200,
      unionPayId: 'union_' + Date.now(),
      result: '银联支付成功'
    };
  }
}
```

### 3. 适配器（Adapter）
```
class PaymentAdapter {
  constructor(paymentService, type) {
    this.paymentService = paymentService;
    this.type = type;
  }

  pay(amount, orderId) {
    let result;
    
    switch (this.type) {
      case 'alipay':
        result = this.paymentService.makePayment(amount, orderId);
        return {
          success: result.success,
          transactionId: result.transactionId,
          message: result.message
        };
        
      case 'wechat':
        result = this.paymentService.pay(amount, orderId);
        return {
          success: result.status === 'ok',
          transactionId: result.wxTransactionId,
          message: result.desc
        };
        
      case 'unionpay':
        result = this.paymentService.processPayment({ id: orderId, amount });
        return {
          success: result.code === 200,
          transactionId: result.unionPayId,
          message: result.result
        };
        
      default:
        throw new Error('不支持的支付方式');
    }
  }
}
```

### 4. 客户端代码

```
function processOrder(paymentType, amount, orderId) {
  let paymentService;
  let adapter;
  
  switch (paymentType) {
    case 'alipay':
      paymentService = new AlipayService();
      adapter = new PaymentAdapter(paymentService, 'alipay');
      break;
    case 'wechat':
      paymentService = new WechatPayService();
      adapter = new PaymentAdapter(paymentService, 'wechat');
      break;
    case 'unionpay':
      paymentService = new UnionPayService();
      adapter = new PaymentAdapter(paymentService, 'unionpay');
      break;
  }
  
  const result = adapter.pay(amount, orderId);
  console.log('支付结果:', result);
  return result;
}

// 测试
processOrder('alipay', 100, '1');
processOrder('wechat', 200, '2');
processOrder('unionpay', 300, '3');
```

### 扩展新支付方式
新增 PayPal 支付时：
1. 新建 PaypalService 类；
2. 修改 PaymentAdapter 添加 "paypal" 的逻辑；
3. 修改 processOrder 添加 "paypal" 分支；

# 优缺点总结

## 优点
1. 代码复用 ：可以复用现有的类，无需修改其源代码
2. 解耦 ：将客户端代码与具体实现分离
3. 灵活性 ：可以轻松替换或添加新的适配器
4. 符合开闭原则 ：对扩展开放，对修改关闭

## 缺点
1. 增加复杂性 ：引入了额外的抽象层
2. 性能开销 ：可能会有轻微的性能损失
3. 维护成本 ：需要维护适配器代码