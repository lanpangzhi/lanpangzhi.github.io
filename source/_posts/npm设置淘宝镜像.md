---
title: npm设置淘宝镜像
date: 2017-12-15 16:06:34
tags: npm
keywords: npm设置淘宝镜像
---
## npm设置淘宝镜像

> 我们通过npm install xxx 安装包的过程会特别慢，或者安装半天突然报错。这是因为npm镜像地址在国外，所以访问会慢有的时候还访问不到.....（天朝的万能的防火墙）

<!--more-->

## 我们可以通过设置淘宝镜像来解决问题

> 淘宝镜像同步频率目前为10分钟一次以保证尽量与官方服务同步。

设置成淘宝镜像

```
npm config set registry http://registry.npm.taobao.org
```

查看设置是否成功

```
npm get registry 
```
![](http://hexo-1252491761.file.myqcloud.com/npm%E8%AE%BE%E7%BD%AE%E6%B7%98%E5%AE%9D%E9%95%9C%E5%83%8F/20171215161837.png)

## 注意如果你换成淘宝镜像的话，会影响你发布模块，这时候需要换回npm官网的镜像

```
npm config set registry https://registry.npmjs.org
```