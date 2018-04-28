---
title: css实现元素垂直水平居中-包括未知宽高的元素
date: 2018-04-28 13:14:04
tags: css
keywords: css实现元素垂直水平居中-包括未知宽高的元素
---
# css实现元素垂直水平居中-包括未知宽高的元素
这个一道很经典的面试题，做项目中也常会出现这样的需求。
现在我就用几种比较常用的方法。兼容性也列出来。
<!--more-->
## 第一种已知宽高（定位加负边距解决）兼容到IE6
```
position: absolute;
z-index: 8;
left: 50%;
top: 50%;
width: 200px;
height: 200px;
margin-left: -100px;
margin-top: -100px;
background: red;
```
[demo地址 JSBin](http://jsbin.com/xabolah/1/edit?html,output)

## 第二种未知宽高 (定位加margin解决) 兼容到IE8 移动端推荐使用
```
position: absolute;
z-index: 8;
left: 0;
top: 0;
bottom: 0;
right: 0;
width: 200px;
height: 200px;
margin: auto;
background: red;
```
如果改变宽度和高度还是垂直水平居中的。
[demo地址 JSBin](http://jsbin.com/pulamek/edit?html,css,output)

## 第三种未知宽高 (定位加transform解决) 兼容到IE9 移动端推荐使用
```
position: absolute;
z-index: 8;
left: 50%;
top: 50%;
width: 200px;
height: 200px;
transform: translate(-50%, -50%);
background: red;
```
如果改变宽度和高度还是垂直水平居中的。
[demo地址 JSBin](http://jsbin.com/noyise/edit?html,css,output)

## 第四种未知宽高 (弹性盒子模型解决) 兼容到IE10 
```
display: flex;
display: -webkit-flex;
align-items:center;
justify-content: center;
```
如果改变宽度和高度还是垂直水平居中的。
[demo地址 JSBin](http://jsbin.com/zimalig/edit?html,css,output)

## 第五种未知宽高 (table特性解决的) 兼容到IE6 PC端推荐使用
```
#box{
    width: 100px;
	height:100px;
	text-align:center;
	font-size:0;
    background: red
}
#box:after,#box span{
	display:inline-block;
	*display:inline;
	*zoom:1;
	width:0;
	height:100%;
	vertical-align:middle;
}
#box:after{
	content:'';
}
#box p{
	display:inline-block;
	*display:inline;
	*zoom:1;
	vertical-align:middle;
	font-size:16px;
}
```
[demo地址 JSBin](http://jsbin.com/pipasoq/edit?html,css,output)

# 参考
[http://demo.doyoe.com/css/alignment/](http://demo.doyoe.com/css/alignment/)