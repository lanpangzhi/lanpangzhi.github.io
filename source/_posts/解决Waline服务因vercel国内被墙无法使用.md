---
title: 解决Waline服务因vercel国内被墙无法使用
date: 2023-03-04 16:40:24
tags: [Waline,vercel]
keywords: 解决Waline服务因vercel国内被墙无法使用
---
# Waline评论服务
最近发现博客详情页面偶尔有报错，评论无法使用，查询发现是vercel被墙了。
<!--more-->

# 解决方案自定义域名
在你的域名下面添加一个新的子域名记录类型`CNAME`记录值`cname.vercel-dns.com`
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/%E8%A7%A3%E5%86%B3Waline%E6%9C%8D%E5%8A%A1%E5%9B%A0vercel%E5%9B%BD%E5%86%85%E8%A2%AB%E5%A2%99%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8/20230304192202.png)

然后再去[vercel](https://vercel.com/) 给你的Waline服务添加上刚才的子域名

![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/%E8%A7%A3%E5%86%B3Waline%E6%9C%8D%E5%8A%A1%E5%9B%A0vercel%E5%9B%BD%E5%86%85%E8%A2%AB%E5%A2%99%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8/20230304192503.png)

然后再把hexo博客里面Waline服务地址更换成刚才的子域名

如果没有域名可以去[https://my.freenom.com/](https://my.freenom.com/) 注册免费的域名
后续继续被墙可以考虑换服务或者套个cdn中转一下

# 参考
[使用自定义域名激活Vercel部署的Waline服务
](https://lisenhui.cn/blog/use-custom-domain-active-vercel-waline.html)