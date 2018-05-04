---
title: Hexo+Next集成Algolia搜索
date: 2017-12-22 13:13:18
tags: Hexo
keywords: Hexo+Next集成Algolia搜索
---
# 集成Algolia搜索
起因Swiftype现在收费了，也没有免费版本。Local Search搜索体验不好，微搜索Next官网上描述太少！所以选择Algolia。
注：Algolia搜索在版本** 5.1.0 **中引入，要使用此功能请确保所使用的 NexT 版本在此之后
<!-- more -->

## 首先注册Algolia账户
[Algolia 登陆页面https://www.algolia.com/users/sign_in](https://www.algolia.com/users/sign_in)，可以使用 GitHub 或者 Google 账户直接登录，也可以注册一个新账户。我直接用谷歌账户登陆了，注册后的 14 天内拥有所有功能（包括收费类别的）。之后若未续费会自动降级为免费账户，免费账户 总共有 10,000 条记录，每月有 100,000 的可以操作数。

## 注册完成后，创建一个新的 Index，这个 index name 之后会用到


Index 创建完成后，此时这个 Index 里未包含任何数据。 接下来需要安装 Hexo Algolia 扩展， 这个扩展的功能是搜集站点的内容并通过 API 发送给 Algolia。前往站点根目录，执行命令安装：

```
npm install hexo-algolia --save  # 目前最新版本是1.2.4，下面的操作都是基于这个版本的文档
```

## 获取 Key，更新站点根目录配置
![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222140824.png)

前往站点根目录打开_config.yml添加以下代码

```
# Algolia Search API Key
algolia:
  applicationID: '你的Application ID'
  apiKey: '你的Search-Only API Key'
  indexName: '输入刚才创建index name'
```

## 修改Algolia搜索ACL（访问控制列表）
![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222142305.png)

选中后保存。

## 操作完成后执行命令
```
 export(windows 为 set) (Powershell 用 $env:) HEXO_ALGOLIA_INDEXING_KEY=你的Search-Only API key
 set (Mac和git bash 为 export) (Powershell 用 $env:) HEXO_ALGOLIA_INDEXING_KEY     #查看是否设置成功如果没有值就设置失败
 hexo algolia
```

![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222143002.png)

## 成功后修改Next主题配置文件
更改Next主题配置文件，找到 Algolia Search 配置部分：

```
# Algolia Search
algolia_search:
  enable: true
  hits:
    per_page: 10
  labels:
    input_placeholder: Search for Posts
    hits_empty: "我们没有找到任何搜索结果: ${query}"
    hits_stats: "找到约${hits}条结果（用时${time}ms）"
```

将 enable 改为 true 即可，根据需要你可以调整 labels 中的文本。这个是我修改的文本。

![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222143639.png)

## 总结一下集成遇到的BUG

### Please provide an Algolia index name in your hexo _config.yml flle
![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222144122.png)

原因：Algolia Search API Key indexName 错了

解决方案：看下之前新建index的名字

### Not enough rights to update an object near
![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222151203.png)

原因：没有修改Algolia搜索ACL（访问控制列表）

解决方案： 按1.4操作勾选上就可以

### 移动端遮罩盖住搜索
![](http://hexo-1252491761.file.myqcloud.com/Hexo-Next%E9%9B%86%E6%88%90Algolia%E6%90%9C%E7%B4%A2/20171222151807.png)

原因：遮罩的z-index值太高，我的next主题是5.1.3版本可能其他版本没有这个BUG

解决方案： 找到\themes\next\source\css\_common\components\third-party 下面的algolia-search.styl 文件 第8行追加
```	
  +mobile()
    z-index: 1000
```
# 参考
[http://theme-next.iissnan.com/third-party-services.html#algolia-search](http://theme-next.iissnan.com/third-party-services.html#algolia-search)
[https://github.com/oncletom/hexo-algolia](https://github.com/oncletom/hexo-algolia)