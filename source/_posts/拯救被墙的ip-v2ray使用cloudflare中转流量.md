---
title: '拯救被墙的ip,v2ray使用cloudflare中转流量'
date: 2022-05-25 18:40:58
tags: [v2ray,cloudflare, 被墙]
keywords: 拯救被墙的ip,v2ray使用cloudflare中转流量
---

# 拯救被墙的ip
最近ip又被墙了，只能套cloudflare通过cdn来中转v2ray的WebSocket 流量，搬瓦工付费换ip太贵，也容易继续被墙。
坏处就是速度变慢，时不时抽风连不上。v2ray我这里使用的是V2Ray一键安装脚本[https://github.com/233boy/v2ray/tree/master](https://github.com/233boy/v2ray/tree/master)
<!--more-->

## 首先注册一个免费域名
[https://my.freenom.com/](https://my.freenom.com/) 最好先注册一个免费的顶级域名。最长一年时间，域名期限在到期14天内可以重复续上一年时间。
注：freenom 这个网站的个人信息地址要和申请注册ip地址一样否则申请域名失败。

## Cloudflare 
[https://dash.cloudflare.com/login](https://dash.cloudflare.com/login)注册一个账号，然后好给你的域名提供cdn加速。
注册完之后添加站点这个时候输入您刚注册的域名。

## 添加域名解析和域名设置自定义dns
Cloudflare 找到刚才添加的站点左侧菜单dns，找到Cloudflare 名称服务器会有两个地址，把两个地址添加到 freenom 网站上域名自定义dns 服务器设置上。
管理 （你的域名） 的 DNS添加记录，添加一个 A 记录的域名解析，假设你的域名是 langpz.com，并且想要使用 www.langpz.com 作为翻墙的域名。
那么在 DNS 那里配置，Name 写 www，IPv4 address 写你的 VPS IP，务必把云朵点灰， 保存解析记录即可。
(如果你已经添加域名解析，请务必把云朵点灰。)

## VPS设置v2ray
如果没安装就去安装，安装的改下协议，传输协议选择 **WebSocket + TLS (即是选择 4 )**，V2Ray 端口随便，不要是 80 和 443 即可，然后输入你的域名，域名解析 Y ，自动配置 TLS 也是 Y ，其他就默认吧，一路回车。等待安装完成。
然后输入 v2ray status 查看一下运行状态，**请确保 V2Ray 和 Caddy 都在运行**

## 收尾
然后去dns 解析那里把云朵点亮，再进入左侧菜单SSL/TLS 勾选 **完全（严格）**

v2ray info 或者 v2ray qr 生成 V2Ray 配置二维码链接把配置添加到你的客户端。就可以正常使用了。


# 参考
[https://github.com/233boy/v2ray/wiki/%E4%BD%BF%E7%94%A8Cloudflare%E4%B8%AD%E8%BD%ACV2Ray%E6%B5%81%E9%87%8F](https://github.com/233boy/v2ray/wiki/%E4%BD%BF%E7%94%A8Cloudflare%E4%B8%AD%E8%BD%ACV2Ray%E6%B5%81%E9%87%8F)