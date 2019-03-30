---
title: Hexo博客从Coding迁移到腾讯云COS
date: 2019-03-30 17:34:07
tags: [Hexo, COS]
---
# Hexo博客从Coding迁移到腾讯云COS
最近coding的Pages 服务一直不稳定，这两天访问还出现404，重新部署也无法解决。国内访问GitHub Pages  不是很快，而且百度SEO也爬不到。码云自定义域名收费，只好迁移到腾讯云COS上了。

## 创建存储桶
[https://console.cloud.tencent.com/cos5/bucket](https://console.cloud.tencent.com/cos5/bucket) 首先要创建存储桶。区域看各自情况任选，访问权限必须要选择公有读私有写。
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/Hexo%E8%BF%81%E7%A7%BB/1.png)

### 在`基础设置`开启静态网站
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/Hexo%E8%BF%81%E7%A7%BB/2.png)
索引文档一定要填index.html，错误文档就看自定义的是什么文件了。

### 在`域名管理`开启自定义加速域名（CDN加速）
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/Hexo%E8%BF%81%E7%A7%BB/3.png)
填写上自己的域名就可以了。

### 域名解析
在域名解析这里添加上刚才配置的自定义加速域名的CNAME地址。
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/Hexo%E8%BF%81%E7%A7%BB/4.png)

## 安装发布COS插件
```
npm install hexo-deployer-cos-enhanced-dev --save
```

### 配置_config.yml
把之前deploy的配置替换掉
``` yml
deploy: 
  type: cos
  bucket: blog-1251123456
  region: ap-shanghai
  secretId: AKIDIgxxxxxxxxxxxxxxxxxxxx0SepjX
  secretKey: qXPCbxxxxxxxxxxxxxxxxxxxxsJZfdR
    cdnConfig:
      enable: true
      cdnUrl: http://yourCdnSite.com
      bucket: static-1251123456
      region: ap-shanghai
      folder: static-1251123456
      secretId: AKIDIgxxxxxxxxxxxxxxxxxxxx0SepjX
      secretKey: qXPCbxxxxxxxxxxxxxxxxxxxxsJZfdR
```
`secretId`  `secretKey` 包括cdnConfig下面这两个字段都可以不用填写， 直接从环境变量取


`type`： 是固定死的，只能是 cos。

`cdnUrl`： 是你的对象存储绑定的CDN域名，没有启用 CDN的话，推荐使用 [https://github.com/sdlzhd/hexo-deployer-cos](https://github.com/sdlzhd/hexo-deployer-cos)

`bucket` 和 `region`： 在腾讯云的对象存储中，新建或找到你的 bucket，然后找到 **默认域名** 信息，会看到一个类似这样的域名: `blog-1251123456.cos.ap-shanghai.myqcloud.com`，第一个点前面的 `blog-1251123456` 就是 `bucket` 名称，第二个点和第三个点之间的 `ap-shanghai`，就是你的 COS 所在地域，填写到 `region` 中。

`secretId` 和 `secretKey`：在 COS控制台中，找到左侧的**密钥管理**，点进去，按照提示添加子账号，并设置秘钥。同时要给子账号赋予 COS相关的权限，还有CDN刷新的权限。不会配置的可以参考 [官方示例](https://cloud.tencent.com/document/product/228/14867)

```
hexo d
```
直接就发布到腾讯云COS上了，访问速度相当快，对SEO也好。

## 添加持续集成自动发布到COS（Travis CI）
我的博客使用Travis CI，而且备份也是在GitHub公开仓库， `secretId`  `secretKey`  这两个字段我只能写到Travis CI环境变量里面。

```
script 
- hexo d
env:
 global:
   - SecretId: ${SecretId}
   - SecretKey: ${SecretKey}
```
只需要在.travis.yml 文件 script 下面加 hexo d 全局变量增加SecretId和SecretKey 这两个变量。
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/Hexo%E8%BF%81%E7%A7%BB/5.png)