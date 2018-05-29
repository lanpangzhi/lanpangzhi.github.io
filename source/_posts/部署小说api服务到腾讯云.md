---
title: 部署小说api服务到腾讯云
date: 2018-05-29 11:00:08
tags: [部署, Express, Node.js, API]
keywords:
---
# 部署小说api服务到腾讯云
小说api1.0版本写完了，接下来就开始部署到服务器上，用到了nginx、pm2、nvm、git、OpenSSL。
<!--more-->
服务器配置: CentOS 7.4 64位 1 核 2 GB 1 Mbps
node版本: 8.9.0
nvm版本: 0.33.11
npm版本： 5.5.1
nginx版本：1.12.2
git版本: 2.9.5

## 第一步添加pm2配置文件
在小说api项目的根目录创建一个pm2.json的文件。
```
{
    "name": "novel-api",  // 服务名
    "script": "./bin/www", // 启动脚本
    "cwd": "./",   // 当前工作路径
    "watch": [  // 监控变化的目录，一旦变化，自动重启
        "bin",
        "routers"
    ],
    "ignore_watch": [  // 从监控目录中排除
        "node_modules",
        "logs",
        "public",
        "log"
    ],
    "watch_options": {
        "followSymlinks": false
    },
    "max_memory_restart": "1G", // 根据内存限制重新启动应用程序。
    "error_file": "./logs/novel-apierr.log",  // 错误日志路径
    "out_file": "./logs/novel-api-out.log",   // 普通日志路径
    "env": {
        "DEBUG": "novel-api",  // 环境变量参数，debug名字为novel-api，8080端口监听
        "PORT": "8080"
    }
}
```
package.json文件添加npm run deploy部署命令。
```
"deploy": "pm2 start pm2.json"
```
pm2 常用命令。
pm2 save  保存当前进程列表。
pm2 resurrect  启动之前保存的进程列表。
pm2 restart app.js|app_name 重启进程
pm2 start app.js  启动进程
pm2 list 查看进程列表
pm2 stop app_name |app_id 停止指定的应用。 all 停止所有应用

## 第二步购买服务器和域名
购买服务器[https://buy.cloud.tencent.com/cvm?tab=lite](https://buy.cloud.tencent.com/cvm?tab=lite)，我买的是CentOS 7.4 64位 1 核 2 GB 1 Mbps的服务器。如果只是尝试部署流程，可以选择按时计费。
购买域名[https://dnspod.cloud.tencent.com/?from=qcloudProductDns](https://dnspod.cloud.tencent.com/?from=qcloudProductDns)建议选.com的域名。

## 第三步设置子域名
添加一个api开头的子域名[https://console.cloud.tencent.com/domain](https://console.cloud.tencent.com/domain)，然后添加解析。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529113617.png)

## 第四步登陆服务器安装软件
登陆到服务器然后执行以下安装命令。
### 安装nginx
```
yum install -y nginx
nginx -v
```
### 安装nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm --version
```
### 安装node和pm2、apidoc
```
nvm install 8.9.0
nvm use 8.9.0
node -v
npm -v
npm install -g pm2 apidoc
```
### 安装git
```
yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel tar
yum install -y gcc-c++ perl-ExtUtils-MakeMaker
cd /usr/src
wget https://www.kernel.org/pub/software/scm/git/git-2.9.5.tar.gz
tar xf git-2.9.5.tar.gz
cd git-2.9.5
make configure
make profix=/usr/git
make install
echo "export PATH=$PATH:/usr/git/bin" >> /etc/profile
source /etc/profile
git --version 
// 配置git
git config --global user.name "用户名称"
git config --global user.email 电子邮件地址
```

## 在服务器上克隆git仓库
先进入home路径创建wwwroot文件夹。
```
cd /home && mkdir wwwroot
cd wwwroot
git clone https://github.com/lanpangzhi/novel-api.git
cd novel-api
npm install
npm run doc
npm run deploy
```
这个应用就pm2被启动了。

## 配置nginx
先启动nginx。
```
nginx
```
http://123.206.45.87 在浏览器输入服务器ip就可以看到nginx已经启动了。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529134733.png)
进入nginx配置目录，新建文件。
```
cd /etc/nginx/conf.d
touch api.langpz.com-8080.conf
```
如果一台服务器的server比较多，建议用域名和端口做配置文件名。 
编辑api.langpz.com-8080.conf 配置文件。
```
vi api.langpz.com-8080.conf
```
把下面代码复制粘贴过去。
```
upstream novel-api {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name 你自己的域名;
    location / {
        proxy_pass http://novel-api;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_redirect     off;
    }
}
```
ctrl + c 输入:wq  退出并保存。再执行nginx -s reload 在浏览器输入你的域名就可以看到文档，[http://api.langpz.com](http://api.langpz.com)

### gzip压缩
```
cd /etc/nginx/
vi nginx.conf
```
把下面代码复制粘贴过去。
```
## gzip压缩
gzip on;
# ie6不启用gzip
gzip_disable "msie6";
gzip_vary on;
gzip_proxied any;
# 压缩等级 1-9
gzip_comp_level 2;
gzip_buffers 16 8k;
gzip_http_version 1.1;
# 为除“text/html”之外的MIME类型启用压缩
gzip_types text/plain text/css application/json application/x-javascript image/gif image/jpeg image/png image/tiff image/x-icon application/font-woff application/vnd.ms-fontobject text/javascript;
```
ctrl + c 输入:wq  退出并保存。再执行nginx -s reload。可以去站长之家看你的压缩率[http://tool.chinaz.com/gzips/](http://tool.chinaz.com/gzips/)
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529140415.png)

### 隐藏nginx版本号
还是修改nginx.conf这个文件
```
vi nginx.conf

// 把下面代码复制过去
# 隐藏nginx版本号
server_tokens off;
```
ctrl + c 输入:wq  退出并保存。再执行nginx -s reload。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529140928.png)
这里就不显示nginx版本号了。

### 配置ssl证书https，给你的网站加个小绿锁
我用的是腾讯云的免费证书，也可以自己生成。[https://cloud.tencent.com/product/ssl?from=qcloudHpHeaderSsl](https://cloud.tencent.com/product/ssl?from=qcloudHpHeaderSsl)，使用域名免费版。

#### 申请腾讯云ssl证书
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529141439.png)
直接点下一步，然后用推荐选项验证。申请很快不到十分钟就下来，到时候还会有邮件和短信通知。

#### 下载证书上传到服务器
找到腾讯云的ssl证书管理去下载证书。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529142105.png)
压缩包里面有三个文件夹找到Nginx这个文件夹。
在服务器进入nginx所在目录新建一个文件夹。
```
cd /etc/nginx/
mkdir api.langpz.com
```
然后把Nginx文件夹里面两个文件上传到服务器/etc/nginx/api.langpz.com 这个文件夹里面。
可以下载一个FileZilla软件或者下载一个别的ftp工具，还可以用命令行，我这里下载了FileZilla使用它去上传。

#### 加强 HTTPS 安全性
首先在目录 /etc/nginx/api.langpz.com 运行以下代码生成 dhparam.pem 文件
```
cd /etc/nginx/api.langpz.com	
openssl dhparam -out dhparam.pem 2048
```

#### 修改配置文件
```
cd /etc/nginx/conf.d
touch api.langpz.com-8080.conf
```
把下面代码覆盖api.langpz.com-8080.conf文件。
```
upstream novel-api {
    server 127.0.0.1:8080;
}

# 配置共享会话缓存大小
ssl_session_cache shared:SSL:10m;
# 配置会话超时时间
ssl_session_timeout 10m;

# 强制跳转https
server {
    listen 80;
    server_name api.langpz.com;
    return 301 https://$server_name$request_uri;
}

server {
 listen 443 ssl;
 server_name api.langpz.com;

 # 证书文件
 ssl_certificate      /etc/nginx/api.langpz.com/1_api.langpz.com_bundle.crt;
 # 私钥文件
 ssl_certificate_key  /etc/nginx/api.langpz.com/2_api.langpz.com.key;
 # 设置长连接
 keepalive_timeout    70;
 # 优先采取服务器算法
 ssl_prefer_server_ciphers on;
 # 使用DH文件
 ssl_dhparam /etc/nginx/api.langpz.com/dhparam.pem;
 ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
 # 定义算法
 ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
 # HSTS策略
 add_header Strict-Transport-Security "max-age=31536000; includeSubDomains;preload" always;
 # 防XSS攻擊
 add_header X-Xss-Protection 1;
 # 禁止服务器自动解析资源类型
 add_header X-Content-Type-Options nosniff;

 
 location / {
    proxy_pass http://novel-api;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header   Host             $http_host;
    proxy_set_header   X-NginX-Proxy    true;
    proxy_redirect     off;
 }
}
```
ctrl + c 输入:wq  退出并保存。再执行nginx -s reload。
现在就可以访问[https://api.langpz.com](https://api.langpz.com)。如果访问http协议就会强制跳转到https协议。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529143306.png)

## SSL安全测试
[](https://www.ssllabs.com/ssltest/index.html)
输入你的域名。
之前在nginx配置加强 HTTPS 安全性，所以结果是A+。
![](http://hexo-1252491761.file.myqcloud.com/%E9%83%A8%E7%BD%B2%E5%B0%8F%E8%AF%B4api%E6%9C%8D%E5%8A%A1%E5%88%B0%E8%85%BE%E8%AE%AF%E4%BA%91/QQ%E5%9B%BE%E7%89%8720180529143835.png)

## 总结
这种部署比较麻烦，部署完发现pm2也有部署功能，2.0用koa.js重构的时候用pm2部署，docker 生成镜像。

# 参考
[https://nginx.org/en/docs/](https://nginx.org/en/docs/)
[https://github.com/creationix/nvm](https://github.com/creationix/nvm)
[https://www.thinkjs.org/zh-cn/doc/3.0/deploy.html](https://www.thinkjs.org/zh-cn/doc/3.0/deploy.html)
[https://www.cnblogs.com/chyingp/p/pm2-documentation.html](https://www.cnblogs.com/chyingp/p/pm2-documentation.html)
[http://www.runoob.com/git/git-install-setup.html](http://www.runoob.com/git/git-install-setup.html)
[https://nginx.rails365.net/chapters/install.html](https://nginx.rails365.net/chapters/install.html)
[https://www.cnblogs.com/nuccch/p/7681592.html](https://www.cnblogs.com/nuccch/p/7681592.html)
[https://aotu.io/notes/2016/08/16/nginx-https/index.html](https://aotu.io/notes/2016/08/16/nginx-https/index.html)