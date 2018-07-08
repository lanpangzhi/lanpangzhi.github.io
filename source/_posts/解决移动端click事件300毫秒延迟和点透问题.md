---
title: 解决移动端click事件300毫秒延迟和点透问题
date: 2018-06-21 10:53:59
tags: [点透,移动端]
keywords: 解决移动端click事件300毫秒延迟和点透问题
---
# 解决移动端click事件300毫秒延迟和点透问题
click 的 300ms 延迟是由双击缩放(double tap to zoom)所导致的，由于用户可以进行双击缩放或者双击滚动的操作，当用户一次点击屏幕之后，浏览器并不能立刻判断用户是确实要打开这个链接，还是想要进行双击操作。因此，移动端浏览器就等待 300 毫秒，以判断用户是否再次点击了屏幕。
<!--more-->

## fastclick
老项目建议用fastclick解决，这样改动起来成本比较小。
[https://github.com/ftlabs/fastclick](https://github.com/ftlabs/fastclick)
引用fastclick库就可以解决300毫秒延迟和点透问题
```
// 原生js调用
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
// jquery调用
$(function() {
	FastClick.attach(document.body);
});
```

## 使用移动端事件代替click
例如touchstart 等事件，建议使用Hammer手势库
[https://github.com/hammerjs/hammer.js](https://github.com/hammerjs/hammer.js)

```
var a = document.querySelector('.a');
var hammer = new Hammer(a);
hammer.on('tap', function(e) {
  console.log("2222!");
});
```

# 参考
[https://github.com/ftlabs/fastclick](https://github.com/ftlabs/fastclick)
[https://github.com/hammerjs/hammer.js](https://github.com/hammerjs/hammer.js)