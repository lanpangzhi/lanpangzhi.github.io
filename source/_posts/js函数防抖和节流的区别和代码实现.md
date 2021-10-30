---
title: js函数防抖和节流的区别和代码实现
date: 2021-10-24 13:13:10
tags: [javascript, 面试题]
keywords: js函数防抖和节流的区别和代码实现
---
# js函数防抖和节流的区别

<!--more-->
函数防抖：<font color="red">触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。</font>例如游戏角色放技能被打断了，然后重新释放技能，重新计算释放时间。
函数节流：<font color="red">高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率。</font>就相当于游戏角色有霸体释放技能无法被打断。3秒一个技能，不管中间发生了什么。

## 防抖函数
```
function debounce(fn, delay) {
    var timer = null;
    return function() {
        clearTimeout(timer);
        var that = this,
            args = arguments;
        timer = setTimeout(function() {
            fn.apply(that, args)
        }, delay)
    }
}
```
一般用于input或者srcoll事件上。输入框搜索防止输入过快向后端发很多个请求，就是限制多长时间才能执行一次。重复操作会重新计算时间。

## 防抖节流

``` 
function throttle(fn, delay) {
    var timer = null,
        flag = false;
    return function() {
        if (flag) {
            return
        } 
        flag = true
        var that = this,
            args = arguments;
        timer = setTimeout(function() {
            clearTimeout(timer);
            flag = false
            fn.apply(that, args)
        }, delay)
    }
}
```
一般用于mousemove或者resize事件上，避免触发N次事件，限制多少毫秒内只能执行一次，提高性能。