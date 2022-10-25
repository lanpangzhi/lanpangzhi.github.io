---
title: Debian9安装设置Fail2ban
date: 2022-10-22 14:47:31
tags: [Debian9, Fail2ban]
keywords: Debian9安装设置Fail2ban
---

# Fail2ban
fail2ban是一款入侵防御软件，可以监视你的系统日志，然后匹配日志的错误信息（正则式匹配）执行相应的屏蔽动作。可以防止别人恶意扫描和暴力破解SSH密码。
<!--more-->

## 安装
Python2 >= 2.7 or Python >= 3.2
```
// 更新系统
apt update && apt upgrade -y
// 安装
apt install fail2ban 
```

## 修改配置文件
vi /etc/fail2ban/jail.conf
```
[DEFAULT]

// 封禁时间秒，设置了一年。
bantime = 31536000  
// 重试时间秒，这里设置了24小时。
findtime  = 86400 
// 最大尝试次数 2。
maxretry = 2 
```
## 创建本地规则配置
vi /etc/fail2ban/jail.d/jail-debian.local
```
[sshd]
port = 你的ssh端口
// 最大重试次数，2。
maxentry = 2 
```
以上配置都保存后执行重启命令
```
systemctl restart fail2ban
```

## 常用命令
- 启动 `systemctl start fail2ban`
- 停止 `systemctl stop fail2ban`
- 重启 `systemctl restart fail2ban`
- 移除被封的IP `fail2ban-client set sshd unbanip 1.1.2.2（要解禁的IP）`
- 查看 sshd 封禁情况 `fail2ban-client status sshd`
- fail2ban状态 `service fail2ban status`