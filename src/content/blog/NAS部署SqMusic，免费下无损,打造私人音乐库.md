---
title: NAS部署SqMusic，免费下无损，打造私人音乐库
description: 在 NAS 上部署 SqMusic，聚合多平台音源，免费下载无损音乐并自动整理成私人音乐库。
pubDate: 'Sep 18 2026'
tags: [自托管, 工具, NAS]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916164606122.png'
---

> **项目地址**  
> [https://github.com/59799517/simple\_sq\_music\_plus](https://github.com/59799517/simple_sq_music_plus)

### **项目特色**

- 🎯 聚合多平台音源，搜歌、试听、下载
- 🎵 支持无损格式（FLAC、APE）和高码率MP3（320kbps），按需选码率
- 🏷️ 自动整理成「歌手/专辑/曲目」目录结构，写入ID3标签、封面、歌词
- 🎬 下载完直接被绿联自带的「音乐」、Emby、Jellyfin，道理鱼等识别
- 🔌 支持填入平台Cookie同步自己的会员歌单
- 📁 目录模板支持自定义，老司机还能用SpEL表达式玩花活

### 快速开始

项目需要三个容器：

| sqmusic\_main | 主服务  |
| ------------- | ------- |
| sqmusic\_web  | WEB服务 |
| mysql         | 数据库  |

#### **部署步骤：**

- 先在文件管理里建一个目录，比如/volume1/docker/sqmusic
- 打开Docker应用 → 项目→ 创建
- 项目名填 sqmusic（自己起），路径选刚才建的 sqmusic 文件夹
- Compose配置，把下面代码粘进去

_注意：_  
_1.映射的音乐目录改成你自己的，这个是存储下载的音乐的路径_  
_    volumes:_  
_      # 将宿主机的/music目录挂载到容器内的音乐目录_  
_      - /volume1/音乐:/music_  
_2.MySQL 5.7 启动比较慢，第一次如果报"连不上数据库"，多启动几次_

_docker-compose如下：_

```plaintext
version: '3.8'
services:
  # 主应用服务：sqmusic_main
  sqmusic_main:
    # 使用的镜像，来自阿里云仓库
    image: registry.cn-hangzhou.aliyuncs.com/sqdockler/simple_sq_music_plus:v3.0.28
    container_name: sqmusic_main  # 容器名称
    environment:
      - DB_IP=mysql  # 数据库IP地址，指向mysql服务
      - DB_PORT=3306  # 数据库端口
      - DB_NAME=sqmusicv3  # 数据库名称
      - DB_USERNAME=root  # 数据库用户名
      - DB_PASSWORD=sqmusicv3password  # 数据库密码
    volumes:
      # 将宿主机的/music目录挂载到容器内的音乐目录
      - /volume1/音乐:/music
    depends_on:
      # 确保mysql服务在启动此容器之前已准备好并处于健康状态
      mysql:
        condition: service_healthy
    networks:
      - sq-app-network  # 使用指定的网络
    expose:
      - "8099"  # 仅暴露端口8099给其它容器，不映射到宿主机
    restart: always  # 容器崩溃后自动重启
  # Web前端服务：sqmusic_web
  sqmusic_web:
    # 使用的镜像，来自阿里云仓库
    image: registry.cn-hangzhou.aliyuncs.com/sqdockler/simple_sq_music_plus_web:v3.0.15
    container_name: sqmusic_web  # 容器名称
    ports:
      # 将容器的80端口映射到宿主机的8096端口
      - "8096:80"
    networks:
      - sq-app-network  # 使用指定的网络
    depends_on:
      # 确保sqmusic_main服务在启动此容器之前已启动
      - sqmusic_main
    restart: always  # 容器崩溃后自动重启
  # 数据库服务：mysql
  mysql:
    # 使用的MySQL镜像版本5.7
    image: docker.1ms.run/mysql:5.7
    container_name: sqmusic_mysql  # 容器名称
    environment:
      # 设置数据库的root密码
      MYSQL_ROOT_PASSWORD: sqmusicv3password
      # 设置数据库名称
      MYSQL_DATABASE: sqmusicv3
    volumes:
      # 将宿主机的/mysql_data目录挂载到容器内的/var/lib/mysql目录，存储数据库数据
      - ./mysql_data:/var/lib/mysql
      # 可以取消下面注释来使用Docker卷来持久化数据
      # - sqmusic-db:/var/lib/mysql
    networks:
      - sq-app-network  # 使用指定的网络
    healthcheck:
      # 检查MySQL服务是否健康，尝试ping数据库
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s  # 每10秒检查一次
      timeout: 5s  # 每次检查最多等5秒
      retries: 5  # 重试5次
    restart: always  # 容器崩溃后自动重启
# 网络配置
networks:
  sq-app-network:
    driver: bridge  # 使用bridge驱动，适合容器之间的通信
```

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916164427043.png)

部署完成以后，浏览器访问_ __[http://NAS\_IP:8096](http://NAS_IP:8096)_

- 默认账号：admin
- 默认密码：admin

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916164606122.png)

<span style="color: rgb(25, 27, 31)">点击右上角【</span><span style="color: rgb(25, 27, 31)"><strong><em>设置</em></strong></span><span style="color: rgb(25, 27, 31)">】，可以填写相关信息，一些音乐平台的cookie需要在这个页面填写。</span>

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916164704303.png)

<span style="color: rgb(25, 27, 31)">点开某音乐平台，按</span><span style="color: rgb(25, 27, 31)"><strong><em>F12</em></strong></span><span style="color: rgb(25, 27, 31)">进入开发者模式，选择【</span><span style="color: rgb(25, 27, 31)"><strong><em>Network</em></strong></span><span style="color: rgb(25, 27, 31)">】，刷新该音乐平台的页面，随便点某个项目，在右边找到【</span><span style="color: rgb(25, 27, 31)"><strong><em>Cookie</em></strong></span><span style="color: rgb(25, 27, 31)">】，</span>复制请求头里的 Cookie。

<span style="color: rgb(25, 27, 31)">接着返回设置，点击对应的音乐平台，找到【XX音乐用户的信息】，点击修改，然后将上方的cookie粘贴进去。</span>

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916165019758.png)

<span style="color: rgb(25, 27, 31)">设置完成后，就可以搜索音乐进行下载，</span>点「同步歌单」也能把你收藏的几百首歌全拉下来

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260916165357596.png)

#### **自定义目录模板（高级）**  
**下载歌曲默认目录是「歌手/专辑/歌曲」，在「设置」→「下载模板」里可以改。模板支持变量：**

| 变量         | 含义                 |
| ------------ | -------------------- |
| ${musicName} | 歌曲名               |
| ${artists}   | 全部歌手             |
| ${artist}    | 主要歌手（仅第一个） |
| ${album}     | 专辑名               |
| ${albumYear} | 专辑年份             |

比如改成 ${albumYear}/${artist}/${album}/${musicName} 就是「年份/歌手/专辑/歌曲」四级结构，方便按年代听歌。  
再狠一点，项目还支持SpEL表达式（Spring表达式语言），能在模板里写 if/else/三元/方法调用

### 常见问题

***为什么我设置完了，显示下载成功，文件夹里没有音乐文件***

<span style="color: rgb(51, 51, 51)">在 Docker Compose 的 volumes 配置项中，冒号 : 是一个标准的语法分隔符，用来区分“宿主机路径”和“容器内路径”。</span>  
<span style="color: rgb(51, 51, 51)">它的标准格式是：</span>  
<span style="color: rgb(51, 51, 51)">- 宿主机路径:容器内路径</span>  
<span style="color: rgb(51, 51, 51)">具体到你的例子</span>  
<span style="color: rgb(51, 51, 51)">代码行：- /volume1/音乐:/music</span>  
<span style="color: rgb(51, 51, 51)">冒号左边 (/volume1/音乐)：这是宿主机（也就是你的 NAS 或服务器）上的实际文件夹路径。这里存放着你真实的音乐文件。</span>  
<span style="color: rgb(51, 51, 51)">冒号右边 (/music)：这是容器内部（sqmusic_main 这个软件运行环境里）的路径。</span>  
<span style="color: rgb(51, 51, 51)">冒号的作用：它告诉 Docker，“请把左边的文件夹‘映射’或‘挂载’到右边的位置”。</span>  
<span style="color: rgb(51, 51, 51)">通俗解释：</span>  
<span style="color: rgb(51, 51, 51)">这就好比给容器开了一扇“窗户”。虽然容器是一个独立的隔离环境，但通过这个冒号定义的映射，容器里的程序（Simple SQ Music Plus）就能直接读取到你 NAS 硬盘里 /volume1/音乐 文件夹下的所有歌曲，而不用把文件复制进容器里。</span>  
<span style="color: rgb(51, 51, 51)">总结</span>  
<span style="color: rgb(51, 51, 51)">所以，在你之前的提问中，: / 并不是一个整体符号，而是冒号（作为映射分隔符）紧挨着斜杠（作为容器内路径的开头）。</span>  
<span style="color: rgb(51, 51, 51)">正确写法：/volume1/音乐:/music （中间没有空格，或者空格不影响解析，关键是那个冒号）。</span>  
<span style="color: rgb(51, 51, 51)">意思：把 NAS 里的 /volume1/音乐 目录，挂载到容器里的 /music 目录。</span>
