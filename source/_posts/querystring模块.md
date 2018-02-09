---
title: querystring模块
date: 2018-02-09 13:10:53
tags: Node.js
---
# querystring模块
querystring 模块提供了一些实用函数，用于解析与格式化 URL 查询字符串。
处理get请求参数的时候用的比较多。
<!-- more -->
## 把字符串转换成对象  querystring.parse(str[, sep[, eq[, options]]])

```
let querystring = require('querystring');

let query =  querystring.parse('name=lanpangzhi&age=18');
console.log(query); # 输出{ name: 'lanpangzhi', age: '18' }

// 添加第二个参数 sep
let query2 = querystring.parse('name=lanpangzhi@age=18','@');
console.log(query2); # 输出{ name: 'lanpangzhi', age: '18' }
// sep: 第二个参数用于界定查询字符串中的键值对的子字符串。默认为 '&'。

// 添加第三个参数 eq
let query3 = querystring.parse('name|lanpangzhi@age|18','@','|');
console.log(query3); 
// eq:  用于界定查询字符串中的键与值的子字符串。默认为 '='。
// sep eq 可以替换割分字符串的关键字，在某些特定的场景会用的。

// 第四个参数用得比较少
let query = querystring.parse('name|lanpangzhi@age|18@age2|20@age3|21@age4|555','@','|',{
    decodeURIComponent: function test(str) {
        return str+= '1'
    },
    maxKeys: 4
});
console.log(query); # 输出 { name1: 'lanpangzhi1', age1: '181', age21: '201', age31: '211' }
// 第四个参数是一个对象， 里面有 decodeURIComponent 和 maxKeys 两个参数。
// decodeURIComponent: 解码查询字符串的字符时使用的函数。默认为 querystring.unescape()。
// maxKeys: 指定要解析的键的最大数量。默认为 1000。指定为 0 则不限制。
// 我刚才指定是4  所以 age4  这个参数没输出。
```

## 把对象转换成字符串 querystring.stringify(obj[, sep[, eq[, options]]])
```
let querystring = require('querystring');

let obj = { name: 'lanpangzhi', baz: ['qux', 'quux'], age: '18' };
let str = querystring.stringify(obj);
console.log(str); # 输出 name=lanpangzhi&baz=qux&baz=quux&age=18

// 添加第二个参数 sep
let obj = { name: 'lanpangzhi', age: '18' };
let str = querystring.stringify(obj,'@');
console.log(str); # 输出 name=lanpangzhi@age=18
// sep: 第二个参数用于界定查询字符串中的键值对的子字符串。默认为 '&'。

// 添加第三个参数 eq
let obj = { name: 'lanpangzhi', age: '18' };
let str = querystring.stringify(obj,'@','|');
console.log(str);
// eq:  用于界定查询字符串中的键与值的子字符串。默认为 '='。

// 第四个参数 options  基本上用不到
// encodeURIComponent <Function> : 把对象中的字符转换成查询字符串时使用的函数。默认为 querystring.escape()。
```
querystring.stringify 和 querystring.parse 功能正好是对应的， 基本上第四个参数用不到，第二和第三个参数只有在某些特定的场景才会使用，指定切割默写字符，或者输出某些字符。
querystring 这个模块还有两个方法，但是基本上不会用到，更多可以去node中文网或者官网查看。
新年快乐2018
# 参考
[http://nodejs.cn/api/querystring.html](http://nodejs.cn/api/querystring.html) 