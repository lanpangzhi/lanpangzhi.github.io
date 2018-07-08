---
title: javascript数据类型转换
date: 2018-05-05 17:14:25
tags: [javascript, 数据类型转换, 面试题]
keywords: javascript数据类型转换
---
# javascript数据类型转换
在面试中经常会碰见问类型转换的问题，例如[] == false、[] == {}返回的是真还是假等等。。。
<!--more-->

## 默认是false的五个值
```
null undefined NaN 0 ''
```
记住只有这五个值是假的剩下的全部是真的。

## 转换规则
1. 如果是一个值判断是否是真假，除了默认是false的五个值剩下的全部是true。
2. 如果是两个值比较是否相等，遵循如下规则。
    val1 == val2 如果两个值可能不是同一数据类型，如果是==比较的话，会默认进行数据转换。
    2.1 object == object，比较永远不相等。
    2.2 object == string 先将对象转换成字符串（调用toString方法），然后再比较。
        [] 转换成字符串 ""
        {} 转换成字符串 "[object Object]"
    2.3 object == boolean 先将对象转换成字符串（toString），再把字符串转换成数字（Number）、布尔值转换成数字（true 转换成 1 false 换成成 0）然后让两个数字进行比较。
        Number("") 会输出 0
    2.4 object == number  先将对象转换成字符串（toString），再把字符串转换成数字（Number），再进行比较。
    2.5 number == boolean 布尔值转换成数字，然后再比较。
    2.6 number == string  字符串转换成数字，然后再比较。
    2.7 string == boolean 都转换成数字，，然后再比较。
    2.8 null == undefined 结果是true。
    2.9 null 或者 undefined 比较另外的所有值，结果都是false，不相等。

例如：
    [] == false 返回 true 2.3规则。
     [] == []  返回 false 2.1规则。
     2 == true 返回 false 2.5规则。
=== 三个等号还会比较数据类型。
这些规则背下来，就能完美的应付这样的面试题了，加油！

