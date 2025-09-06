---
title: JS设计模式-工厂模式
date: 2025-08-30 14:58:36
tags: [工厂模式, 设计模式, javascript]
keywords: JS设计模式-工厂模式
---
工厂模式是一种创建型设计模式，它提供了一种创建对象的优雅方式。将对象的创建与使用分离。我们在创建对象时不会对客户端暴露创建逻辑，客户端只需要知道如何使用对象即可。
<!--more-->
# 简单工厂模式
简单工厂模式是一种创建型设计模式，它根据参数的不同返回不同类的实例。简单工厂模式的工厂类负责创建所有的实例。
例如便利店，你告诉店员想要什么（比如一瓶可乐或一包薯片），店员直接从货架上拿给你，不需要知道商品是如何生产的。
```
// 简单工厂：集中式对象创建
class SimpleFactory {
    // 静态工厂方法，直接通过类调用
    static createProduct(type) {
        switch(type) {
            case 'cola':
                return new Cola();
            case 'crisps':
                return new Crisps();
            default:
                throw new Error('没有这种商品');
        }
    }
}

// 产品类
class Cola {
    constructor() {
        this.name = '可乐';
    }
    info() {
        console.log(this.name);
    }
}

class Crisps {
    constructor() {
        this.name = '薯片';
    }
    info() {
        console.log(this.name);
    }
}

// 客户端代码
const cola = SimpleFactory.createProduct('cola');
const crisps = SimpleFactory.createProduct('crisps');
cola.info();  // 输出：可乐
crisps.info(); // 输出：薯片
```
# 工厂方法模式
工厂方法模式定义了一个创建对象的接口，父类定义创建接口，子类负责具体实现，新增产品类型只需添加新的子类，无需改动现有代码。
就像不同的专业工厂，每个工厂只专注做一类产品。
```
class CarFactory {
    createCar() {
        throw new Error('子类必须实现createCar方法');
    }
}

// 奔驰工厂
class BenzFactory extends CarFactory {
    createCar(model) {
        console.log('使用德国工艺标准生产');
        return new BenzCar(model);
    }
}

// 宝马工厂
class BMWFactory extends CarFactory {
    createCar(model) {
        console.log('使用巴伐利亚工艺标准生产');
        return new BMWCar(model);
    }
}

// 汽车类
class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
}

class BenzCar extends Car {
    constructor(model) {
        super('奔驰', model);
        console.log(`生产了一辆${this.brand} ${this.model}`);
    }
}

class BMWCar extends Car {
    constructor(model) {
        super('宝马', model);
        console.log(`生产了一辆${this.brand} ${this.model}`);
    }
}

// 客户端代码
const benzFactory = new BenzFactory();
const benzCar = benzFactory.createCar('S级'); 
// 输出：使用德国工艺标准生产
//      生产了一辆奔驰 S级

const bmwFactory = new BMWFactory();
const bmwCar = bmwFactory.createCar('X1');
// 输出：使用巴伐利亚工艺标准生产
//      生产了一辆宝马 X1
```

# 抽象工厂模式 
抽象工厂模式提供一个接口，用于创建相关或依赖对象的家族，而不需要明确指定具体类。它强调产品之间的兼容性，确保创建的对象能够协同工作。
抽象工厂就像智能家居生态系统（如小米、苹果），每个生态系统提供一系列兼容的产品（手机、手表、耳机），这些产品专门设计为能无缝协作。
```
// 抽象工厂：声明创建一系列相关产品的接口
class AbstractFactory {
    createPhone() {
        throw new Error('必须实现createPhone方法');
    }
    
    createWatch() {
        throw new Error('必须实现createWatch方法');
    }
    
    createEarphones() {
        throw new Error('必须实现createEarphones方法');
    }
}

// 具体工厂1：小米生态系统
class XiaomiFactory extends AbstractFactory {
    createPhone() {
        return new XiaomiPhone();
    }
    
    createWatch() {
        return new XiaomiWatch();
    }
    
    createEarphones() {
        return new XiaomiEarphones();
    }
}

// 具体工厂2：苹果生态系统
class AppleFactory extends AbstractFactory {
    createPhone() {
        return new iPhone();
    }
    
    createWatch() {
        return new AppleWatch();
    }
    
    createEarphones() {
        return new AirPods();
    }
}

// 抽象产品接口
class Phone {
    call() {
        throw new Error('必须实现call方法');
    }
    
    // 与同系列设备连接的方法
    connectToWatch(watch) {
        throw new Error('必须实现connectToWatch方法');
    }
}

class Watch {
    showTime() {
        throw new Error('必须实现showTime方法');
    }
}

class Earphones {
    playSound() {
        throw new Error('必须实现playSound方法');
    }
}

// 具体产品实现
class XiaomiPhone extends Phone {
    call() {
        return '小米手机打电话';
    }
    
    connectToWatch(watch) {
        if (watch instanceof XiaomiWatch) {
            return '小米手机连接小米手表';
        }
        return '小米手机连接失败：不兼容的设备';
    }
}

class iPhone extends Phone {
    call() {
        return '苹果手机打电话';
    }
    
    connectToWatch(watch) {
        if (watch instanceof AppleWatch) {
            return '苹果手机连接苹果手表';
        }
        return '苹果手机连接失败：不兼容的设备';
    }
}

class XiaomiWatch extends Watch {
    showTime() {
        return '小米手表显示时间';
    }
}

class AppleWatch extends Watch {
    showTime() {
        return '苹果手表显示时间';
    }
}

class XiaomiEarphones extends Earphones {
    playSound() {
        return '小米耳机播放声音';
    }
}

class AirPods extends Earphones {
    playSound() {
        return 'AirPods播放声音';
    }
}

// 客户端代码
function createDeviceSuite(factory) {
    const phone = factory.createPhone();
    const watch = factory.createWatch();
    const earphones = factory.createEarphones();
    
    return {
        phone,
        watch,
        earphones,
        testCompatibility() {
            return phone.connectToWatch(watch);
        }
    };
}

// 使用示例
const xiaomiSuite = createDeviceSuite(new XiaomiFactory());
console.log(xiaomiSuite.testCompatibility()); // 小米手机连接小米手表

const appleSuite = createDeviceSuite(new AppleFactory());
console.log(appleSuite.testCompatibility()); // 苹果手机连接苹果手表
```

# 三种模式对比

| 模式  | 特点 | 适用场景 |
|------|----------|------|
| **简单工厂** | 一个工厂类负责所有产品创建 | 产品种类较少，创建逻辑简单 |
| **工厂方法** | 每个工厂类负责一种产品 | 产品种类较多，每种产品有独特的创建逻辑 |
| **抽象工厂** | 每个工厂创建一系列相关产品 | 需要创建一系列相关的产品族 |