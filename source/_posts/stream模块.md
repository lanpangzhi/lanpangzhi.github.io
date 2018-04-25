---
title: stream模块
date: 2018-02-27 13:27:30
tags: Node.js
keywords: Node.js stream模块
---
# stream (流)
流（stream）在 Node.js 中是处理流数据的抽象接口。stream 模块提供了基础的 API 。使用这些 API 可以很容易地来构建实现流接口的对象。
Node.js 提供了多种流对象。 例如， HTTP 请求 和 process.stdout 就都是流的实例。
流可以是可读的、可写的，或是可读写的。所有的流都是 EventEmitter 的实例。
<!--more-->

## 为什么使用stream
我们之前读文件用的是readFile()把整个文件读入到内存，如果文件小还可以，假如你读取的文件有几个G就会把内存撑爆，这个时候就需要stream(流)了，收到一块数据，就读取一块。这样占用内存就会小很多。

## 流的类型
Node.js 中有四种基本的流类型：
Readable - 可读的流
Writable - 可写的流 
Duplex - 可读写的流 
Transform - 在读写过程中可以修改和变换数据的 Duplex 流 

## 可读流的常用事件
data 当有数据可读时触发
end 没有更多的数据可读时触发。
error  在接收和写入过程中发生错误时触发。

## 可读流
```
let fs = require('fs');

let rs = fs.createReadStream('./hello.txt',{
    encoding: 'utf8'
});

rs.on('data', data => {
    console.log('读取中--------' + data +'--------') # 如果文件过大会分几次输出数据。
});

rs.on('end', () => {
    console.log('读取完毕'); # data读取完触发 end 事件。
})
```
第一个参数是路径。
第二个参数是可配置对象。
- flags: 读取模式默认为r（只读）
- encoding: 设置编码默认null
- mode: 设置文件模式默认0o666
- start: 用整数表示文件开始读取字节数的索引位置
- end: 用整数表示文件结束读取字节数的索引位置
- highWaterMark: 最高水位线，停止从底层资源读取前，内部缓存区最多存放的字节数。默认64kb

### 暂停流对象触发 'data' 事件
```
rs.pause()
```
### 重新流对象触发 'data' 事件
```
rs.resume()
```

## 可写流
```
let fs = require('fs');

let stream = fs.createWriteStream('./1.txt')

stream.write('lan') # 写入数据
stream.write('pang') # 写入数据
stream.end('zi') # 写入数据
stream.on('finish', function() {
    console.log("写入完成。");
});
```
第一个参数是路径。
第二个参数是可配置对象。
- flags: 读取模式默认为w
- encoding: 设置编码默认utf8
- mode: 设置文件模式默认0o666
- start: 用整数表示文件开始写入字节数的索引位置
- highWaterMark: 最高水位线，内部缓存区最多存放的字节数。默认16kb

### stream.write(chunk[, encoding][, callback])
第一个参数写入的数据。
第二个参数设置编码。
第三个参数回调函数。
返回一个boolean值。
写入数据的时候内部缓冲区的大小小于创建流时设定的 highWaterMark 阈值，函数将返回 true 。如果返回值为 false ，应该停止向流中写入数据，直到 'drain' 事件被触发。

```
let fs = require('fs');

let stream = fs.createWriteStream('./1.txt',{
    highWaterMark: 10
});

let i = 0;
let max = 100;
let write = () => {
    let flag = true;
    while (i < max && flag){
        console.log('写入' + i);
        i++;
        flag = stream.write(String(i));
    }
}
write();
stream.on('drain',() => {
    console.log('继续写入'+ i);
    write();
});
```
### drain事件
如果调用 stream.write(chunk) 方法返回 false，'drain' 事件会在适合恢复写入数据到流的时候触发。

### stream.end(chunk[, encoding][, callback])
第一个参数写入的数据。
第二个参数设置编码。
第三个参数回调函数。
调用 writable.end() 方法表明接下来没有数据要被写入 Writable。通过传入可选的 chunk 和 encoding 参数，可以在关闭流之前再写入一段数据。如果传入了可选的 callback 函数，它将作为 'finish' 事件的回调函数。
在调用了 stream.end() 方法之后，再调用 stream.write() 方法将会导致错误。

## pipe()
```
let fs = require('fs');

let rs = fs.createReadStream('./1.txt');
let ws = fs.createWriteStream('./2.txt');
rs.pipe(ws)
```
readable.pipe(destination[, options])
readable 可读流对象
destination 可写流对象
readable.pipe() 绑定一个 Writable 到 readable 上， 将可写流自动切换到 flowing 模式并将所有数据传给绑定的 Writable。数据流将被自动管理。这样，即使是可读流较快，目标可写流也不会超负荷（overwhelmed）。
pipe 方法是使用流最简单的方式。通常的建议是要么使用 pipe 方法、要么使用事件来读取流，要避免混合使用两者。一般情况下使用 pipe 方法时你就不必再使用事件了。但如果你想以一种更加自定义的方式读取流，就要用到事件了。

# 参考
[http://nodejs.cn/api/stream.html](http://nodejs.cn/api/stream.html)
