---
title: js获取图片文件宽度和高度
date: 2021-08-29 10:15:39
tags: [javascript]
keywords: js获取图片文件宽度和高度
---
# js获取图片文件宽度和高度
这里利用FileReader对象来获取图片宽高。
<!--more-->

代码如下
```
 const reader = new FileReader()
 // 获取base64格式字符串文件内容
 reader.readAsDataURL(file)
 reader.onload = function(data) {
   const img = new Image()
   img.src = data.target.result
   let that = this
   img.onload = function() {
     console.log(this.width, this.height)
   }
 }
```

# demo
[https://jsbin.com/xalukapolu/edit?html,console,output](https://jsbin.com/xalukapolu/edit?html,console,output)

# 参考
[https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
