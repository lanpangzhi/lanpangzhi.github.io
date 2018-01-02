---
title: javascript数组去重
date: 2018-01-02 10:25:35
tags: 数组
---

# javascript数组去重

原理：在数组原型上扩展方法，遍历当前数组把数组的每一项存在json对象里面，如果json存在当前遍历的值就代表重复了，否则把当前遍历的值添加到一个新的数组，最后返回新的数组。
<!--more-->

```
Array.prototype.removal = function removal(){
	var hash = {},
		arr = [];
	for(var i = 0; i < this.length; i++){
		if(!hash[this[i]]){
			arr.push(this[i]);
		}
		hash[this[i]] = 1;
	}
	return arr;
}
```

![javascript数组去重](http://hexo-1252491761.file.myqcloud.com/javascript%E6%95%B0%E7%BB%84%E5%8E%BB%E9%87%8D/20180102105153.png)