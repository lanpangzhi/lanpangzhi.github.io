---
title: 从Travis-CI迁移到GitHub Actions
date: 2023-02-11 08:58:23
tags: GitHub Actions
keywords: 从Travis-CI迁移到GitHub Actions
---
# 从Travis-CI迁移到GitHub Actions
由于Travis-CI更改了免费政策，系统赠送的 10000 积分用完以后，就无法继续免费使用构建服务了。所以迁移到GitHub Actions。
Github Actions每月2000分钟免费额度。
<!--more-->

## GitHub Actions
GitHub Actions 是 GitHub 的持续集成服务，于2018年10月推出。
GitHub Actions 可帮助您在软件开发生命周期内自动执行任务。GitHub 操作是事件驱动的，这意味着您可以在发生指定事件后运行一系列命令。例如，每次有人为存储库创建拉取请求时，您都可以自动运行执行软件测试脚本的命令。

## GitHub Actions基本概念
（1）workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。
（2）events（事件）：事件是触发工作流程的特定活动。例如，监听推送触发工作流程等。
（3）job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
（4）step（步骤）：每个 job 由多个 step 构成，一步步完成。
（5）action （动作）：每个 step 可以依次执行一个或多个命令（action）。
（6）runners （运行器）：运行器是安装了 GitHub Actions 运行器应用程序的服务器。
## workflows文件
GitHub Actions 使用 YAML 语法来定义事件、作业和步骤。 这些 YAML 文件存储在代码仓库中名为 .github/workflows 的目录中。

## 迁移
首先在项目根目录下面创建 `.github/workflows 目录和hexo.yml` 文件。
SecretId、SecretKey、CI_TOKEN 环境变量需要在`仓库 -> Settings -> Actions secrets and variables -> New repository secret`, 添加Secrets变量

```
name: hexo
on:
  push:
    branches:
      - indigo
env:
  GH_REF: github.com/lanpangzhi/lanpangzhi.github.io
  secretId: ${{ secrets.SecretId }}
  secretKey: ${{ secrets.SecretKey }}

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout codes
        uses: actions/checkout@v3
        with:
          submodules: 'true'

      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: "10.14.0"

      - name: Install and Deploy 
        run: |
          npm install hexo-cli -g
          npm install
          hexo generate
          hexo d
      - name: Deploy github
        run: |
          cd ./public
          git init
          git config user.name "lanpangzhi"
          git config user.email "875727617@qq.com"
          git add .
          git commit -m "GitHub Actions 自动部署"
          git push --force --quiet "https://${{secrets.CI_TOKEN}}@${{env.GH_REF}}" master:master
```

## 注意
环境变量获取和写法和Travis-CI不一样
```
${{env.GH_REF}} 对应 ${GH_REF} 
${{secrets.CI_TOKEN}} 对应 ${CI_TOKEN} 因为是从配置Secrets变量直接拿所以要用 secrets.的方式
```
git 子模块需要手动配置开启
```
- uses: actions/checkout@v3
  with:
    submodules: true
```
执行脚本
```
steps:
  - name: Run build script
    run: |
      npm install hexo-cli -g
      npm install
```

# 参考
[从 Travis CI 迁移到 GitHub Actions
](https://docs.github.com/zh/actions/migrating-to-github-actions/migrating-from-travis-ci-to-github-actions)