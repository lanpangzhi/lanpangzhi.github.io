---
title: npm install 报错提示请使用管理员
date: 2017-12-27 11:07:20
tags: npm
keywords: npm install 报错 Please try running this command again as root/Administrator
---
# npm install 报错提示请使用管理员
之前把node升级了，npm自动升级到 **npm5** 再npm install xxx 会报如下图错误
<!--more-->
**Please try running this command again as root/Administrator**
![](http://hexo-1252491761.file.myqcloud.com/npminstall%E6%8A%A5%E9%94%99%E6%8F%90%E7%A4%BA%E8%AF%B7%E4%BD%BF%E7%94%A8%E7%AE%A1%E7%90%86%E5%91%98/20171227111201.png)

解决方案: 后面加上--no-optional 或者降级 5.3 版本 升级更高版本

```
	npm install  hexo-cli -g --no-optional
```  

# 参考 
[https://stackoverflow.com/questions/46020018/error-eperm-operation-not-permitted-unlink-d-sources-node-modules-fseven](https://stackoverflow.com/questions/46020018/error-eperm-operation-not-permitted-unlink-d-sources-node-modules-fseven)