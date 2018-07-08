---
title: vue2.0的生命周期
date: 2018-06-14 09:48:11
tags: [vue2.0,生命周期]
keywords: vue2.0的生命周期
---
# vue2.0的生命周期
每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。
<!--more-->

## 生命周期钩子函数
[代码演示地址](http://jsbin.com/piwohumoxa/edit?html,console,output)
beforeCreate 在实例初始化之后调用，数据和事件都没绑定。
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614112537.png)
所以在beforeCreate访问不到任何东西。
created 在实例创建完成后被立即调用。数据和事件已经绑定，但是模板没有渲染，$el属性不可见 。
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614113214.png)
在created数据和事件都可以访问了，就能打印出数据。
beforeMount 模板渲染前调用
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614114126.png)
beforeMount的时候可以访问到 $el 但是并没有渲染到页面上（virtual DOM）数据也还是{{ xxx }}这样的格式，所以不能操作DOM。
mounted 模板渲染到页面上调用
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614114126.png)
mounted 的时候就可以操作dom，可以把dom操作放到这个生命周期。
beforeUpdate 数据更新时调用，发生在虚拟 DOM 打补丁之前。
在控制台执行 vm.lanpangzhi = 3
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614130548.png)
beforeUpdate 这个钩子函数可以访问更新前的dom元素。这里的dom元素并没有更新掉。
updated 数据更新完触发。
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614132057.png)
当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
beforeDestroy 实例销毁之前调用。
在控制台执行 vm.$destroy()
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614132548.png)
当这个钩子被调用时实例还可以用。
destroyed 实例销毁后调用。
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614132830.png)
调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

## 个人总结
created （实例创建完） 这个钩子函数可以用来请求数据发ajax。
mounted （模板渲染完） 这个钩子函数可以用来操作dom一些方法，如果你用了jQuery需要把代码放到这个钩子函数里面。
beforeUpdate （数据更新完） 这个钩子函数通常最好使用计算属性或 watcher 取而代之。
destroyed （实例销毁之前调用） 这个钩子函数触发的时候可以用来清理定时器变量。
还有几个钩子函数没有说到，建议自行去官网查看。

## 生命周期图示
![](http://hexo-1252491761.file.myqcloud.com/vue2.0%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/QQ%E5%9B%BE%E7%89%8720180614101803.png)

## beforeCreate
在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
## created
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
## beforeMount
在挂载开始之前被调用：相关的 render 函数首次被调用。
该钩子在服务器端渲染期间不被调用。
## mounted
el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。
注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
该钩子在服务器端渲染期间不被调用。
## beforeUpdate
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
## updated
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。
注意 updated 不会承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 vm.$nextTick 替换掉 updated
该钩子在服务器端渲染期间不被调用。
## beforeDestroy
实例销毁之前调用。在这一步，实例仍然完全可用。
该钩子在服务器端渲染期间不被调用。
## destroyed
Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
该钩子在服务器端渲染期间不被调用。

# 参考
[https://cn.vuejs.org/v2/api/#beforeCreate](https://cn.vuejs.org/v2/api/#beforeCreate)