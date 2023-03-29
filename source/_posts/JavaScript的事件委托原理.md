---
title: JavaScript的事件委托原理
date: 2023-03-26 15:48:44
tags: [javascript, 事件委托]
keywords: JavaScript的事件委托原理
---
# 事件委托
事件委托是JavaScript中常用的一种事件处理方式，也称为事件代理。它可以让我们在处理多个相似元素事件时，减少重复代码，提高性能和代码可维护性。
<!--more-->

事件委托的原理是将**事件绑定在元素的祖先元素上**，然后通过**事件冒泡**的机制，把事件传播到目标元素。

## 代码实现

### 原始版
```
<ul id="a">
  <li>11</li>
  <li>22</li>
  <li>33</li>
</ul>

let a = document.querySelector('#a')
let aLi = a.querySelectorAll('li')
for (let i = 0; i < aLi.length; i++) {
  aLi[i].addEventListener('click', function(event) {
    console.log(event.target.innerText)
  })
}
```
给每个li添加一个click事件，如果数量过多每个LI都会添加事件这样会添加N个事件。
### 委托版
```
<ul id="aa">
  <li>111</li>
  <li>222</li>
  <li>
    <span>333</span>
  </li>
</ul>

let aa = document.querySelector('#aa')
aa.addEventListener('click', function(event) {
  if (event.target.tagName.toLocaleLowerCase() == 'li') {
    console.log(event.target.innerText)
  }
})
```
通过把事件委托到祖先元素上冒泡机制触发，然后再判断用户是不是点击的是li再执行某些操作。但是这样写会有一个问题，**li里面又包了一个span标签再点击li里面的span就不会再执行某些操作**。

### 最终版
```
<ul id="aaa">
  <li>1111</li>
  <li>2222</li>
  <li>
    <span>3333</span>
  </li>
</ul>

function onEvent(element, eventType, selector, fn) {
  element.addEventListener(eventType, e => {
    let el = e.target
    while (!el.matches(selector)) {
      if (element === el) {
        el = null
        break
      }
      el = el.parentNode
    }
    el && fn.call(el, e, el)
  })
  return element
}

onEvent(document.querySelector('#aaa'), 'click', 'li', function(ev, el) {
  console.log(el.innerText)
})
```
**最终版**利用[Element.matches()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches)来匹配。
**onEvent函数** 最后封装好的方法
1. 第一个参数祖先元素，
2. 第二个参数绑定的事件
3. 第三个参数绑定的元素，可以是**css选择器** 例: '.ax img'、'"input[name='xxx']:checked"'
4. 第四个参数触发的函数

## 优点
- 减少了DOM操作次数，提高了性能。事件委托利用事件冒泡机制，将事件绑定在父元素上，可以在子元素触发事件时进行响应，避免了对每个子元素都绑定事件的开销，减少了DOM操作次数，提高了性能。

- 动态监听绑定事件，减少代码量。在动态添加子元素时，如果采用传统的事件绑定方式，需要对每个新添加的子元素都进行事件绑定操作，代码量会非常大。而事件委托只需要在父元素上绑定一次事件即可。

## 缺点
- 事件委托无法处理一些不能冒泡的事件，例如focus、blur等，需要对这些事件进行单独处理。

- 调试比较复杂，不容易确定监听者。因为所有子元素的事件都被绑定在一个父元素上。

# Demo
[Demo地址](https://jsbin.com/kogojehiso/6/edit?html,js,console,output)