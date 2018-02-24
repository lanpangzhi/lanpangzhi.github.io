---
title: fs模块
date: 2018-02-22 14:32:19
tags: Node.js
---
# fs模块
fs模块是Node.js提供来操作本地文件（读、写、复制、删除...）等功能的模块。
所有的方法都有异步和同步的形式。
异步方法最后一个参数都是一个回调函数，回调函数的第一个参数是异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。
当使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。
<!--more-->
## 读取文件
### 同步方法 readFileSync()

```
let fs = require('fs');

try{
    let buf = fs.readFileSync('./hello.txt', { encoding: 'utf-8' });
    console.log(buf); # 输出: 入坑了..
}catch(err){
    console.log('读取失败了: ' + err.message)
}
```
readFileSync方法的第一个参数是文件路径可以是（string|Buffer|URL|integer）类型，第二个参数可以是一个表示配置的对象。默认的配置对象是{ encoding: null, flag: 'r' }，encoding：文件编码默认为null，flag：读取模式默认为r（只读）。如果第二个参数不指定编码（encoding），readFileSync方法返回原始的 buffer。

### 异步方法 readFile()
```
let fs = require('fs');
fs.readFile('./hello.txt', { encoding: 'utf-8' }, (err,data) => {
    if (err){
        throw err;
    }
    console.log(data); # 输出: 入坑了..
});
```
和readFileSync方法参数一样，只多了一个回调函数。
回调有两个参数 (err, data)，其中 data 是文件的内容。

## 写入文件
### 同步方法 writeFileSync()
```
let fs = require('fs');

fs.writeFileSync('./1.txt','node入坑指南...',{encoding: 'utf8'})
```
第一个参数是路径
第二的参数是写入的数据
第三个参数是一个可配置的对象{encoding：utf8, mode: 0o666, flag: 'w'}
- encoding: 文件编码默认为utf8
- mode：  设置文件模式(权限)，文件创建默认权限为 0o666(可读，可写)。
- flag：  文件打开模式默认为w(写入)

如果 options 是一个字符串，则它指定了字符编码。例如：
```
fs.writeFileSync('./1.txt', '111...', 'utf8')
```

### 异步方法 writeFile()
```
let fs = require('fs');

fs.writeFile('./2.txt','蓝胖纸',(err) => {
    if(err){
        throw err;
    }
    console.log('写入成功');
})
```
异步地写入数据到文件，如果文件已经存在，则替代文件。 data 可以是一个字符串或一个 buffer。
如果 data 是一个 buffer，则忽略 encoding 选项。它默认为 'utf8'。
和writeFileSync方法参数一样，只多了一个回调函数。

## 创建目录
### 同步方法 mkdirSync()
```
fs.mkdirSync('./hello',0o777);
```
在当前目录下面创建一个hello的文件夹。
第一个参数是路径。
第二个参数是设置文件模式(权限)，默认为0o777。

### 异步方法 mkdir()
```
fs.mkdir('./lanpangzhi', 0o777, function (err) {
    if (err) throw err;
});
```
和mkdirSync方法参数一样，只多了一个回调函数。
注： 所有的异步方法最后一个参数都是回调函数，回调函数的第一个参数都是异常。

## 读取目录
### 同步方法 readdirSync()
```
let a = fs.readdirSync(process.cwd())
console.log(a)
```
输出当前工作目录下的文件数组列表。
第一个参数是路径。
第二个参数是设置编码。

### 异步方法 readdir()
```
fs.readdir(process.cwd(),(err, files) => {
    if (err){
        throw err;
    }
    console.log(files)
})
```
和readdirSync方法参数一样，只多了一个回调函数。
回调函数有两个参数，第二个参数是文件数组列表。

## 查看文件信息
### 同步方法 statSync()
```
let stats = fs.statSync('./a.js');
console.log(stats)
```
接受一个路径参数，返回一个 fs.Stats 实例。

#### fs.Stats 实例的方法

| 方法                    |    描述 | 
|         :--:           | :--------|
| stats.isFile()         | 如果是文件返回 true，否则返回 false。|
| stats.isDirectory()    |   如果是目录返回 true，否则返回 false。 |
| stats.isBlockDevice()  | 如果是块设备返回 true，否则返回 false。|
| stats.isCharacterDevice()	  | 如果是字符设备返回 true，否则返回 false。|
| stats.isSymbolicLink()	  | 如果是软链接返回 true，否则返回 false。|
| stats.isFIFO()  | 如果是FIFO，返回true，否则返回 false。FIFO是UNIX中的一种特殊类型的命令管道。|
| stats.isSocket()	  | 如果是 Socket 返回 true，否则返回 false。|

#### Stat 时间值
| 属性                    |    描述 | 
|         :--:           | :--------|
| atime         | "访问时间" - 文件数据最近被访问的时间。|
| mtime     |   "修改时间" - 文件数据最近被修改的时间。 |
| ctime | "变化时间" - 文件状态最近更改的时间。|
| birthtime	  |"创建时间" - 文件创建的时间。 |

### 异步方法 stat()
```
let fs = require('fs');

fs.stat('./hello', (err, stats)=>{
    if(err){
        throw err;
    }
    console.log(stats);
});

```
和statSync方法参数一样，只多了一个回调函数。
回调函数有两个参数，第二个参数是fs.Stats实例。

## 删除文件
### 同步方法 unlinkSync()
```
let fs = require('fs');

fs.unlinkSync('./1.txt');
```
删除当前目录下的1.txt文件，返回undefined。
第一个参数是路径。
### 异步方法 unlink()
```
let fs = require('fs');

fs.unlink('./2.txt', (err) => {
    if(err){
        console.log(err)
    }
})
```
和unlinkSync方法参数一样。


# 参考
[http://nodejs.cn/api/fs.html](http://nodejs.cn/api/fs.html)
[http://www.runoob.com/nodejs/nodejs-fs.html](http://www.runoob.com/nodejs/nodejs-fs.html)
