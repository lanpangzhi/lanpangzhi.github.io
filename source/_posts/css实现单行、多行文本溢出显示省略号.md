---
title: css实现单行、多行文本溢出显示省略号
date: 2017-12-19 10:58:41
tags: css
keywords: css实现单行、多行文本溢出显示省略号
---
# css实现单行文本溢出显示省略号

```
	white-space: nowrap;  		// 规定段落中的文本不进行换行
	overflow: hidden; 		// 溢出隐藏
	text-overflow: ellipsis;	// 文本溢出显示省略号
```
<!--more-->

![](http://hexo-1252491761.file.myqcloud.com/css%E5%AE%9E%E7%8E%B0%E5%8D%95%E8%A1%8C%E3%80%81%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E6%BA%A2%E5%87%BA%E6%98%BE%E7%A4%BA%E7%9C%81%E7%95%A5%E5%8F%B7/20171219111057.png)

# css实现多行文本溢出显示省略号

```
	display: -webkit-box; 		// 设置弹性盒子模型
	overflow : hidden;		// 溢出隐藏
	text-overflow: ellipsis;	// 文本溢出显示省略号
	-webkit-line-clamp: 2;		// 限制在一个块元素显示的文本的行数
	-webkit-box-orient: vertical; 	// 属性规定框的子元素应该被水平或垂直排列。
```
![](http://hexo-1252491761.file.myqcloud.com/css%E5%AE%9E%E7%8E%B0%E5%8D%95%E8%A1%8C%E3%80%81%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E6%BA%A2%E5%87%BA%E6%98%BE%E7%A4%BA%E7%9C%81%E7%95%A5%E5%8F%B7/20171219111828.png)

注：因为用了webkit的私有属性，建议只在移动端使用。