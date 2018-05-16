---
title: 使用travis-ci自动构建Hexo
date: 2018-05-15 16:30:49
tags: [travis-ci, 自动构建, 持续集成, Hexo]
keywords: 使用travis-ci自动构建Hexo
---
# 使用travis-ci自动构建Hexo
持续集成(CI)是一种软件开发实践，即团队开发成员经常集成他们的工作，通过每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。
<!--more-->
Travis CI是在软件开发领域中的一个在线的，分布式的持续集成服务，用来构建及测试在GitHub托管的代码。这个软件的代码同时也是开源的，可以在GitHub上下载到，尽管开发者当前并不推荐在闭源项目中单独使用它。

## 构建流程
本地写完文章  =>  push github  =>  GitHub触发Travis CI构建  =>  执行命令  =>  部署  =>   完成。


## 用github登陆travis-ci
[https://travis-ci.com](https://travis-ci.com)然后添加到你要激活的存储库。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180515180738.png)
然后选择你要使用的仓库，我这里选择的是lanpangzhi.github.io，我放hexo博客的仓库。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180515180908.png)

然后生成SSH公钥
```
ssh-keygen -t rsa -C "你的邮箱"
```
然后找到 C:\Users\windows\.ssh  下的 id_rsa.pub， 把内容添加到github和coding的hexo仓库的部署公钥里面。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180516144527.png)
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180516144704.png)

然后在git仓库根目录 添加 .travis.yml 文件。
```
language: node_js
node_js:
- 8.9.0
cache:
  directories:
  - node_modules
before_install:
- git config --global user.name "lanpangzhi"
- git config --global user.email 875727617@qq.com
- npm install hexo-cli -g
install:
- npm install
script:
- hexo clean
- hexo generate
- hexo deploy
branches:
  only:
  - indigo
```

下载ruby(如果你电脑有就不需要下载了)
[下载地址](https://rubyinstaller.org/downloads/)，选择你需要的版本下载，我直接下载最新版64位了。

gem设置国内镜像
```
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
```
安装travis  
```   
gem install travis
```
安装完后登陆travis
```
travis login --auto
```
输入你github的登陆账号和密码。如下图就登陆成功了。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180516152543.png)

下一步开始用travis提供的工具加密刚才生成SSH公钥,并上传到travis供日常使用。
把之前生成的id_rsa.pub文件放到项目根目录，然后执行。
```
travis encrypt-file id_rsa.pub --add -r github用户名/hexo仓库
```
成功后会生成一个id_rsa.pub.enc 并且 .travis.yml 会自动添加一些内容，不要去改内容。 然后把id_rsa.pub 文件删除。

然后新建文件夹 .travis 然后把id_rsa.pub.enc 文件移到 .travis 文件夹里面， 在里面再新建  ssh_config 文件添加如下内容。
```
Host github.com
  User git
  StrictHostKeyChecking no
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

.travis.yml 文件最终版本，可以参考。
```
language: node_js
node_js:
- 8.9.0
cache:
  directories:
  - node_modules
before_install:
  - openssl aes-256-cbc -K $encrypted_43f1702cd897_key -iv $encrypted_43f1702cd897_iv
    -in .travis/id_rsa_github.enc -out ~/.ssh/id_rsa -d
  - chmod 600 ~/.ssh/id_rsa
  - eval $(ssh-agent)
  - ssh-add ~/.ssh/id_rsa
  - cp .travis/ssh_config ~/.ssh/config
  - git config --global user.name "lanpangzhi"
  - git config --global user.email 875727617@qq.com
  - npm install hexo-cli -g
install:
  - npm install
script:
  - hexo clean
  - hexo generate
  - hexo deploy
branches:
  only:
  - indigo
```

# 参考
[https://docs.travis-ci.com/user/for-beginners](https://docs.travis-ci.com/user/for-beginners)
[https://zh.wikipedia.org/wiki/Travis_CI](https://zh.wikipedia.org/wiki/Travis_CI)
[https://baike.baidu.com/item/%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90/6250744](https://baike.baidu.com/item/%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90/6250744)
[https://zespia.tw/blog/2015/01/21/continuous-deployment-to-github-with-travis/](https://zespia.tw/blog/2015/01/21/continuous-deployment-to-github-with-travis/)