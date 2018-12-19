---
title: 移动端js复制内容到剪贴板
date: 2018-12-19 20:14:17
tags: [移动端, javascript，clipboard.js]
keywords: 移动端js复制内容到剪贴板、clipboard.js
---
# 移动端js复制内容到剪贴板
clipboard.js是一个没有Flash。没有框架。只需3kb gzipped，实现了将文本复制到剪贴板。兼容性做得好，不兼容的话clipboard.js会优雅地降级，会自动选中文本，用户可以自己选择复制。
<!--more-->

## 兼容性

| <img src="https://clipboardjs.com/assets/images/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="https://clipboardjs.com/assets/images/edge.png" width="48px" height="48px" alt="Edge logo"> | <img src="https://clipboardjs.com/assets/images/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="https://clipboardjs.com/assets/images/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="https://clipboardjs.com/assets/images/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="https://clipboardjs.com/assets/images/safari.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 42+ ✔ | 12+ ✔ | 41+ ✔ | 9+ ✔ | 29+ ✔ | 10+ ✔ |

## 安装
```
npm install clipboard --save
```
或者可以用[cdn地址](https://github.com/zenorocha/clipboard.js/wiki/CDN-Providers)

## 使用

``` html
从属性复制文本
<button class="btn" data-clipboard-text="http://blog.langpz.com">
    复制
</button>

从另一个元素复制文本
<input id="foo" value="https://github.com/lanpangzhi">

<button class="btn" data-clipboard-target="#foo">
    复制
</button>

从另一个元素剪切文本
<input id="xxx" value="https://api.langpz.com">

<button class="btn" data-clipboard-action="cut" data-clipboard-target="#xxx">
    复制
</button>

<script>
  new ClipboardJS('.btn')  // 传入dom节点实例化ClipboardJS
</script>
```
- data-clipboard-text: 需要复制的内容
- data-clipboard-target: 需要复制内容的选择器
- data-clipboard-action: 默认copy, 复制的动作，仅适用于input或textarea元素
[demo地址](https://jsbin.com/fisusorihu/edit?html,console,output)

clipboard 还可以绑定success 和 error 事件
```
<button class="btn" data-clipboard-text="http://blog.langpz.com">
    复制
</button>
  
<script>
  var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function(e) {
  console.info('Action:', e.action);
  console.info('Text:', e.text);
  console.info('Trigger:', e.trigger);

  e.clearSelection();
});

clipboard.on('error', function(e) {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
});
</script>
```
- e.action: 复制的动作
- e.text: 复制的内容
- e.trigger: 触发的dom
[demo地址](https://jsbin.com/yegakuboto/edit?html,console,output)

clipboard 还有一些高级用法，建议去官网查看。

# 参考
[https://clipboardjs.com/](https://clipboardjs.com/)