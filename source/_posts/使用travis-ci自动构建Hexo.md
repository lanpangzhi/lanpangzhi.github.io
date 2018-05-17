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

然后生成github和coding的Token。
先生成github的Token。
[https://github.com/settings/tokens](https://github.com/settings/tokens)
点击Generate new token。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180517132208.png)
然后生成Token。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517132418.png)
开始生成coding的Token。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517132723.png)

点击新建令牌。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517132941.png)
复制令牌。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517133513.png)

登陆travis-ci把github和coding的Token复制到环境变量。
[https://travis-ci.com/](https://travis-ci.com/)
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517133828.png)
点击Settings。
添加CI_TOKEN和CO_TOKEN环境变量。
CI_TOKEN是github的Token。
CO_TOKEN是coding的Token。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517134401.png)

在项目根目录新建.travis.yml 文件
```
language: node_js
node_js:
- 8.9.0
cache:
  directories:
  - node_modules
before_install:
- npm install hexo-cli -g
install:
- npm install
script:
- hexo clean
- hexo generate
after_script:
  - cd ./public
  - git init
  - git config user.name "github用户名"
  - git config user.email "github邮箱"
  - git add .
  - git commit -m "TravisCI 自动部署"
  # Github Pages
  - git push --force --quiet "https://${CI_TOKEN}@${GH_REF}" master:master 
  # Coding Pages
  - git push --force --quiet "https://coding用户名:${CO_TOKEN}@${CO_REF}" master:master

branches:
  only:
  - indigo   这里替换你要监听的分支

env:
 global:
   # Github Pages
   - GH_REF: github.com/lanpangzhi/lanpangzhi.github.io  这里替换你的github仓库地址
   # Coding Pages
   - CO_REF: git.coding.net/bule/bule.coding.me.git  这里替换你的coding仓库地址
```

然后提交github，travis-ci就会自动构建了。
现在写博客只需要两步操作，第一步 hexo new "新的文章"，第二步提交到github。travis-ci会帮你自动部署的。
省去了 hexo clean hexo g -d 的环节。

看到这张图就代表成功了。
![](http://hexo-1252491761.file.myqcloud.com/%E4%BD%BF%E7%94%A8travis-ci%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BAHexo/QQ%E5%9B%BE%E7%89%8720180517131546.png)

## 如果使用git子模块的话请使用https地址，或者在.travis.yml文件禁用子模块，否则构建会报错，提示没有权限。

# 参考
[https://docs.travis-ci.com/user/for-beginners](https://docs.travis-ci.com/user/for-beginners)
[https://zh.wikipedia.org/wiki/Travis_CI](https://zh.wikipedia.org/wiki/Travis_CI)
[https://baike.baidu.com/item/%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90/6250744](https://baike.baidu.com/item/%E6%8C%81%E7%BB%AD%E9%9B%86%E6%88%90/6250744)
[https://blog.csdn.net/qinyuanpei/article/details/79388983](https://blog.csdn.net/qinyuanpei/article/details/79388983)