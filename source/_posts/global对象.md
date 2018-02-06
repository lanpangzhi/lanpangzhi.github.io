---
title: global对象
date: 2018-02-02 14:33:27
tags: Node.js
---
# global全局对象
在Node.js里面有一个叫global的对象，它的属性和方法可以在全局中访问到，即全局变量。
在游览器Javascript中全局对象是window，而Node.js中全局对象是global。
<!--more-->
## 全局变量在所有模块中均可使用。 但以下变量的作用域只在模块内
```
__dirname
__filename
exports
module
require()
```

## __dirname
```
console.log(__dirname) # 获取当前模块的文件所在的文件夹名称的绝对路径
```

## __filename
```
console.log(__filename) # 获取当前模块的文件名称-解析后的绝对路径
```

## setImmediate(callback[, ...args])
```
setImmediate(() => {
	console.log('坑呀') # 把参数函数放到下一个时间环中执行
});
```

## clearImmediate(immediate)
```
let a = setImmediate(() => {
	console.log('坑呀') # 取消一个由 setImmediate() 创建的 Immediate 对象
});
clearImmediate(a)
```

## process 进程
### process.cwd()
```
console.log(process.cwd()) # 方法返回 Node.js 进程当前工作的目录。
```

### process.argv
```
// a.js
console.log(process.argv) 

// 执行
node a.js a=1 b=2

// 输出
[ 'C:\\Program Files\\nodejs\\node.exe',
  'c:\\Users\\windows\\Desktop\\新建文件夹\\a.js',
  'a=1',
  'b=2' ]
```
process.argv 属性返回一个数组，这个数组包含了启动Node.js进程时的命令行参数。第一个元素为process.execPath。如果需要获取argv[0]的值请参见 process.argv0。第二个元素为当前执行的JavaScript文件路径。剩余的元素为其他命令行参数。

### process.env
```
console.log(process.env) # 返回一个包含用户环境信息的对象
```
可以修改这个对象
```
process.env.foo = 'bar';
console.log(process.env.foo); # 输出bar
```
但是不可以用这种方法去修改
```
node http.js  'process.env.foo = "bar"'
```
用 delete从process.env中删除一个属性
```
process.env.foo = 'bar';
delete process.env.foo;
console.log(process.env.foo); # 输出 undefined
```
注: 在process.env中新增一个属性，会将属性值转换成字符串、 在Windows系统下，环境变量是不区分大小写的。

### process.memoryUsage()
```
console.log(process.memoryUsage()) # 返回Node.js进程的内存使用情况的对象，该对象每个属性值的单位为字节。

// 输出
{ rss: 23588864,
  heapTotal: 7708672,
  heapUsed: 4430656,
  external: 8224 }
```
rss（resident set size）：所有内存占用，包括指令区和堆栈。
heapTotal："堆"占用的内存，包括用到的和没用到的。
heapUsed：用到的堆的部分。
external： V8 引擎内部的 C++ 对象占用的内存。

### process.chdir(directory)
```
  console.log(process.cwd())
  process.chdir('..') # 方法变更Node.js进程的当前工作目录，如果变更目录失败会抛出异常(例如，如果指定的目录不存在)。
  console.log(process.cwd())

  // 输出   '..'切换到上一级目录
  C:\Users\windows\Desktop\新建文件夹
  C:\Users\windows\Desktop
```

### process.nextTick(callback[, ...args])
```
process.nextTick(function(){
  console.log('nextTick'); # 放到当前任务末尾执行
})
```

# 参考
[http://www.ruanyifeng.com/blog/2017/04/memory-leak.html](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html) 
[http://nodejs.cn/api/process.html#process_process](http://nodejs.cn/api/process.html#process_process) 
[http://nodejs.cn/api/globals.html](http://nodejs.cn/api/globals.html) 
