---
title: Git生成SSH公钥
date: 2018-05-05 16:40:31
tags: [Git, SSH公钥]
keywords: Git生成SSH公钥
---
# Git生成SSH公钥
大多数 Git 服务器都会选择使用 SSH 公钥来进行授权。系统中的每个用户都必须提供一个公钥用于授权，没有的话就要生成一个。生成公钥的过程在所有操作系统上都差不多。 首先先确认一下是否已经有一个公钥了。SSH 公钥默认储存在账户的主目录下的 ~/.ssh 目录。
<!--more-->

## 查看公钥是否生成过
```
cd ~/.ssh
ls  # 在Git bash下执行
```
或者 C:\Users\Administrator\.ssh 访问这个目录。
看有没有用 something 和 something.pub 来命名的一对文件，这个 something 通常就是 id_dsa 或 id_rsa。有 .pub 后缀的文件就是公钥，另一个文件则是密钥。如果有公钥直接打开 id_rsa.pub 文件添加到GitHub和coding的SSH公钥里面，建议coding有效期选永久。

## 生成公钥
执行下面的命令。
```
ssh-keygen
```
它先要求你确认保存公钥的位置（.ssh/id_rsa），然后它会让你重复一个密码两次，如果不想在使用公钥的时候输入密码，可以留空。
直接回车就行。
然后去C:\Users\Administrator\.ssh目录 找到id_rsa.pub 文件就是生成好的公钥，添加到GitHub和coding。
公钥的大概样子，全部复制。
```
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
NrRFi9wrf+M7Q== schacon@agadorlaptop.local
```
## 测试公钥是否添加成功
测试GitHub。
```
ssh git@github.com
```
![](http://hexo-1252491761.file.myqcloud.com/Git%E7%94%9F%E6%88%90SSH%E5%85%AC%E9%92%A5/QQ%E5%9B%BE%E7%89%8720180505165306.png)
现在就添加成功了。

测试Coding
```
ssh -T git@git.coding.net
```
![](http://hexo-1252491761.file.myqcloud.com/Git%E7%94%9F%E6%88%90SSH%E5%85%AC%E9%92%A5/QQ%E5%9B%BE%E7%89%8720180505170650.png)

# 参考
[https://git-scm.com/book/zh/v1/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5](https://git-scm.com/book/zh/v1/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)