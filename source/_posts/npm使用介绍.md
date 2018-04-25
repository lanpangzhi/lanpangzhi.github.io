---
title: npm使用介绍
date: 2017-12-20 14:56:09
tags: npm
keywords: npm使用介绍
---
# npm使用介绍
npm是随同NodeJS一起安装的包管理工具、官网[https://www.npmjs.com](https://www.npmjs.com)
<!--more-->
## 创建一个模块
```
	npm init
```
会提示你输入包名等，然后生成一个package.json文件,文件内容如下
```
{
  "name": "xxx",   
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "lanpang",
  "license": "ISC"
}
```
package.json文件属性说明
- name - 包名
- version - 包的版本号
- description - 包的描述，方便在npm search中搜索
- main - main字段配置一个文件名指向模块的入口程序。如果你包的名字叫xxx，然后用户require("xxx")，main配置的模块的exports对象会被返回
- scripts - 是一个由脚本命令组成的hash对象，他们在包不同的生命周期中被执行。key是生命周期事件，value是要运行的命令
- author - 作者
- license - 许可证，让人知道使用的权利和限制的
更多说明请查看[https://github.com/ericdum/mujiang.info/issues/6/](https://github.com/ericdum/mujiang.info/issues/6/)

## 安装模块

```
	npm install (Module Name) options  # 语法
	npm install express                # 本地安装
	npm install express -g             # 全局安装
	npm install express@1.0.0          # 安装指定版本
```
npm 的包安装分为本地安装（local）、全局安装（global）两种。
- 本地安装：将安装包放在当前目录下的 ./node_modules 下。
- 本地安装：可以通过 require(Module Name) 来引入本地安装的包。
- 全局安装：node安装目录/node_modules。
- 全局安装：可以直接在命令行里使用。

**查看全局安装目录**
```
	npm list -g --depth=0
```

安装包信息将加入到dependencies（生产阶段的依赖） 
```
	npm install express --save	# npm5已经将--save变成了默认参数，执行 install 依赖包时默认都会带上，除非加上 --no-save。
	npm install express -S          # 缩写
```

安装包信息将加入到devDependencies（开发和测试阶段的依赖）
```
	npm install gulp --save-dev
	npm install gulp -D  # 缩写
```

注: 包的依赖都被写入了package.json文件后，他人git或者svn下载项目可以通过npm install 安装项目依赖的包。

## 卸载包

```
	npm uninstall gulp 	# 如果你安装的包带参数 --save 或者 --save-dev  必须npm uninstall gulp 要添加对应参数
```

## 更新包

更新本地包
```
	npm update gulp
```
更新全局包
```
	npm update gulp -g
```

## 检查包是否已经过时

检查本地包
```
	npm outdated
```
检查全局包
```
	npm outdated -g --depth=0
```

## 搜索包

```
	npm search express
```

## 查看包安装信息

查看本地包
```
	npm list
```
查看全局包
```
	npm list -g
```

## npm-scripts

可以修改package.json文件scripts增加自定义命令，执行一些操作
```
"scripts": {
    "start" : "gulp"
}
```
此时在cmd或git bash中输入npm start 就会执行gulp命令

## 包版本号

默认1.0.0
- bug修复和其他小的变化：修补程序版本，增加最后一个数字，例如1.0.1。
- 不破坏现有功能的新功能：次要版本，增加中间数字，例如1.1.0。
- 主要版本，增加第一个数字，例如2.0.0。