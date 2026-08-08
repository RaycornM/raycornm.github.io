---
title: 'Memos笔记工具'
description: 'Memos是一个开源、自托管的笔记记录解决方案，专为无缝部署和多平台访问而设计。'
pubDate: 'Jun 01 2025'
tags: [笔记, 自托管, 工具, NAS]
heroImage: 'https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251014134406912.png'
---

**Memos**是一个开源、自托管的笔记记录解决方案，专为无缝部署和多平台访问而设计。轻松体验轻松的纯文本写作，并辅以强大的 Markdown 语法支持，以增强格式设置。让我们可以在自己的服务器上搭建完全属于自己的笔记平台。

![image.png](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDWlNo7OHKBGt9a3z6JmS_THOl256f8gACciAAAiy-aVeBKixlUnPb1TYE.png)

‍

## 特征

隐私优先 🏡 ： 你的数据由自己掌控。所有运行时数据都安全地存储在本地数据库中。
快速创建✍️ ：将内容编写并保存为纯文本以便快速访问，Markdown 支持快速格式化和轻松共享。
轻量级但功能强大 ⚡ ：使用 Go 和 React.js 构建，将紧凑的架构与强大的性能相结合。
可自定义 🧩 ：通过自定义服务器名称、图标、描述、主题和执行脚本来个性化体验。
开源 🦦 ：完全开源，所有代码都可以在 GitHub 上使用，以实现透明度和协作。
免费使用 💸 ：免费享受所有功能，无隐藏费用，无订阅。
界面简洁：采用现代化的用户界面设计，操作直观简单，专注于内容创作而不会被复杂的功能所干扰。

![image-3.png](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDWlJo7OHKP3zMTlRgabXVkdTmA-6rWAACcSAAAiy-aVdmDkWBYThj5TYE.png)

个性化定制：提供丰富的个性化选项，可以自定义界面主题、服务器名称等元素，打造独一无二的使用体验。

![image-4.png](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDWlRo7OHLBAxtik4GI4XJAi7chbWioQACcyAAAiy-aVeHjB4pvWaljjYE.png)

## 安装指南

搭建 Memos 的过程出人意料的简单，只需要在终端中运行一条命令：

docker部署：

```
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable
```

docker compose部署：

```
version: '3.8'
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    ports:
      - "5230:5230"
    volumes:
      - ./memos:/var/opt/memos
    environment:
      - MEMOS_MODE=prod
      - MEMOS_PORT=5230
    restart: unless-stopped
```

‍

注意：此命令仅适用于 Unix/Linux 系统，Windows系统按照官方提供的文档进行配置：[https://www.usememos.com/docs/install/container-install#docker-on-windows](https://www.usememos.com/docs/install/container-install#docker-on-windows)

这条命令会自动下载并启动 Memos 服务，其中  **~/.memos/**  文件夹将作为数据存储目录，而 /var/opt/memos 是 Docker 中卷的目录，不要修改。

官方文档：[https://www.usememos.com/docs/install](https://www.usememos.com/docs/install)

部署完成后，通过浏览器访问 **http://localhost:5230**就能开始使用了，部署在服务器上的就是：
**http://服务器ip或域名:5230**

项目地址：[https://github.com/usememos/memos](https://github.com/usememos/memos)
