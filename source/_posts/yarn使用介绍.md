---
title: yarn使用介绍
date: 2018-06-12 14:19:09
tags: [yarn]
keywords: yarn使用介绍
---
# yarn使用介绍
Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。Yarn要比npm要快一些，而且还更稳定，而且和npm使用相同的软件包流程也一样，下面只介绍一些常用的方法。尽快从npm上手yarn。
<!--more-->

## 安装
```
npm install -g yarn
```

## 初始化新项目
```
yarn init
```
等同于 npm init， -y参数也是一样。

## 添加依赖包
安装全局包需要先执行yarn global bin 然后把获取到的路径添加到环境变量path里面，感觉很麻烦也可以用 npm i -g 安装
```
yarn global add create-react-app  // 全局安装等同于 npm i -g create-react-app
```
安装包信息将加入到dependencies（生产阶段的依赖） 
```
yarn add forever   // 等同于 npm install forever -S 
yarn add forever@2.0.0 // 安装2.0.0版本
```
将依赖项添加到不同依赖项类别
分别添加到 devDependencies、peerDependencies 和 optionalDependencies
```
yarn add express --dev  // 等同于 npm install forever -D 
yarn add express --peer
yarn add express --optional
```
peerDependencies “同伴依赖”，一种特殊的依赖，在发布包的时候需要。
有这种依赖意味着安装包的用户也需要和包同样的依赖。 这对于像 react 这样也被人安装的、需要单一 react-dom 副本的包很有用。
optionalDependencies 这是可选依赖，意味着依赖是……可选的。这种依赖即便安装失败，Yarn也会认为整个依赖安装过程是成功的。

## 升级包
```
yarn upgrade express  // 等同于 npm update express
yarn global upgrade express // 等同于 npm update npm update express -g
```

## 删除包
```
yarn remove express // 等同于 npm uninstall express
yarn global remove express // 等同于 npm uninstall -g express
```

## 安装项目的全部依赖
```
yarn or yarn install  // 等同于 npm install
```

## 查看包安装信息
```
yarn list  // 等同于 npm list
yarn global list  // npm list -g
```
上面就是比较常用的方法了，可以快速从npm切换到yarn上，更多方法可以去官网查看。

# 参考
[https://yarnpkg.com/zh-Hans/](https://yarnpkg.com/zh-Hans/)