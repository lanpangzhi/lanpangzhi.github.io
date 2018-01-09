---
title: Node模块机制
date: 2018-01-08 16:11:02
tags: Node.js
---
# Node模块机制
JavaScript没有模块系统、标准库比较少、没有标准接口、缺乏包管理系统。
所以JavaScript社区提出了commonjs规范来解决这些问题。
<!-- more -->
一个Node应用由模块组成，每个js文件就是一个独立模块。
npm基于commonjs实现包的管理使我们开发Node.js更方便。

## commonjs规范
### 引用模块
在commonjs规范中，定义了 require() 方法，这个方法接受一个模块的标识。
```
var math = require('math');
```
### 定义模块
模块有自己的作用域。在模块里面定义的变量、函数、类，都是私有的，对其他文件不可见。

上下文中提供了一个 exports 对象可以导出当前模块的方法或者变量，并且它是唯一导出的出口。在模块中，还存在一个 module 对象，它代表当前模块，exports 是 module 的属性。
```
// math.js
function add(a,b){
    return a + b;
}
exports.add = add;  # 导出一个add的方法
```
再新建一个文件就可以用 require()引用这个模块了
```
// app.js
var math = require('math');
console.log(math.add(1,2)); # 3
```

### 模块标识
模块标识就是传递给 require() 方法的参数，它必须是符合小驼峰命名的规范，或者以  .. 开头的相对路径，或者绝对路径。它可以没有文件后缀名.js。

## 模块缓存
加载模块后会被缓存,多次加载还是同一个对象。
查看模块缓存 require.cache
查看模块绝对路径  require.resolve(./math.js)
删除模块的缓存 require.cache(require.resolve(./math.js))

## 模块的循环加载
```
// a.js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');

// b.js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');

// main.js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);
```
当 main.js 加载 a.js 时，a.js 又加载 b.js。 此时，b.js 会尝试去加载 a.js。 为了防止无限的循环，会返回一个 a.js 的 exports 对象的 未完成的副本 给 b.js 模块。 然后 b.js 完成加载，并将 exports 对象提供给 a.js 模块。

当 main.js 加载这两个模块时，它们都已经完成加载。 因此，该程序的输出会是：

```
node main.js
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true，b.done=true
```

## module对象
module.children  被该模块引用的模块对象。
module.id   模块的标识符。 通常是完全解析后的文件名。
module.parent 最先引用该模块的模块。
module.paths 模块的搜索路径。
... 更多去官网查询

## Node的模块
在Node中，模块分为两类：一类是Node提供的模块，称为核心模块。另外一类是用户编写的模块，称为文件模块。
核心模块定义在 Node.js 源代码的 lib/ 目录下。
require() 总是会优先加载核心模块。 例如，require('http') 始终返回内置的 HTTP 模块，即使有同名文件。

## module.exports和exports区别
exports是module.exports对象的引用
```
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // 模块代码在这。在这个例子中，定义了一个函数。
    function someFunc() {}
    exports = someFunc;
    // 此时，exports 不再是一个 module.exports 的快捷方式，
    // 且这个模块依然导出一个空的默认对象。
    module.exports = someFunc;
    // 此时，该模块导出 someFunc，而不是默认对象。
  })(module, module.exports);
  return module.exports;
}
```

# 参考
[http://nodejs.cn/api/modules.html#modules_cycles](http://nodejs.cn/api/modules.html#modules_cycles) 