---
title: centos7安装MongoDB
date: 2018-12-16 19:22:11
tags: MongoDB
keywords: centos7安装MongoDB
---
# centos7安装MongoDB
先去MongoDB官网的文档中的[Install on Red Hat](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum)，检查是否有更新，当前MongoDB版本4.0。
<!--more-->

## 配置包管理系统（yum）
```
cd /etc/yum.repos.d/   // 进入这个目录
touch mongodb-org-4.0.repo  // 创建一个新的YUM存储库配置文件
```
vim 编辑 mongodb-org-4.0.repo 然后把如下代码复制到文件里
```
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
```
ESC  :wq 退出并保存

## 安装
```
sudo yum install -y mongodb-org
```
- mongodb-org-server- mongod守护程序，以及相应的init脚本和配置。
- mongodb-org-mongos- mongos守护进程。
- mongodb-org-shell - mongo shell，一个MongoDB的交互式JavaScript接口，用于执行命令行的管理任务。
- mongodb-org-tools - 包含几个MongoDB工具，用于导入和导出数据，统计信息以及其他实用程序。

## 启动MongoDB
安装完成后，启动MongoDB
```
sudo service mongod start  // 启动
sudo service mongod stop  // 停止
sudo service mongod restart // 重启
```
设置MongoDB将在系统重新启动后启动
```
sudo chkconfig mongod on
```

## 验证是否安装成功
```
mongo
db.version()  // 会出现版本号，我这里是4.0.4
```

# 参考
[https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum)

[https://linuxize.com/post/how-to-install-mongodb-on-centos-7/](https://linuxize.com/post/how-to-install-mongodb-on-centos-7/)