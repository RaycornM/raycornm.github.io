---
title: '绿联nas实现动漫自动订阅下载-AutoBangumi'
description: 'AutoBangumi是基于 RSS 的全自动追番整理下载工具。只需要在Mikan Project等网站上订阅番剧，就可以全自动追番。'
pubDate: 'Oct 25 2025'
heroImage: 'https://www.autobangumi.org/image/icons/light-icon.svg'
---

### 项目说明

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/20251014150134026.png)

​**​`AutoBangumi`​**​ 是基于 RSS 的全自动追番整理下载工具。只需要在 [Mikan Project](https://mikanani.kas.pub/) 等网站上订阅番剧，就可以全自动追番。 并且整理完成的名称和目录可以直接被 [Plex](https://plex.tv/)、[Jellyfin](https://jellyfin.org/) 等媒体库软件识别，无需二次刮削。

‍

### 功能说明

- 简易单次配置就能持续使用
- 无需介入的 `RSS` 解析器，解析番组信息并且自动生成下载规则。
- 番剧文件整理:

  ```
  Bangumi
  ├── bangumi_A_title
  │   ├── Season 1
  │   │   ├── A S01E01.mp4
  │   │   ├── A S01E02.mp4
  │   │   ├── A S01E03.mp4
  │   │   └── A S01E04.mp4
  │   └── Season 2
  │       ├── A S02E01.mp4
  │       ├── A S02E02.mp4
  │       ├── A S02E03.mp4
  │       └── A S02E04.mp4
  ├── bangumi_B_title
  │   └─── Season 1
  ```
- 全自动重命名，重命名后 99% 以上的番剧可以直接被媒体库软件直接刮削

  ```
  [Lilith-Raws] Kakkou no Iinazuke - 07 [Baha][WEB-DL][1080p][AVC AAC][CHT][MP4].mp4
  >>
  Kakkou no Iinazuke S01E07.mp4
  ```
- 自定义重命名，可以根据上级文件夹对所有子文件重命名。
- 季中追番可以补全当季遗漏的所有剧集
- 高度可自定义的功能选项，可以针对不同媒体库软件微调
- 无需维护完全无感使用
- 内置 TMDB 解析器，可以直接生成完整的 TMDB 格式的文件以及番剧信息。
- 对于 Mikan RSS 的反代支持。

### 绿联部署项目：

![](https://pic3.zhimg.com/v2-aa3749c3f675f712f3c2cefe2f5845ae_r.jpg)

```text
version: "3.4"

services:
  ab:
    image: "ghcr.io/estrellaxd/auto_bangumi:latest"
    container_name: "auto_bangumi"
    restart: unless-stopped
    ports:
      - "7892:7892"
    volumes:
      - "./config:/app/config"
      - "./data:/app/data"
    network_mode: bridge
    environment:
      - TZ=Asia/Shanghai
      - AB_METHOD=Advance
      - PGID=1000
      - PUID=1000
      - UMASK=022
```

默认用户名为admin，密码为adminadmin

#### 获取聚合 RSS 链接 (以蜜柑计划的聚合 RSS 为例)

第一次进入autobangumi页面是空白的，需要先访问[MiKan Project](https://mikanani.kas.pub/)，在[MiKan Project](https://mikanani.kas.pub/)中订阅番剧， 注册账号并登录，然后点击右下角的 **RSS** 按钮，复制链接。

![mikan-rss](https://www.autobangumi.org/assets/rss-token.b1588c53.png)

获取的 RSS 地址如下：

```
https://mikanani.me/RSS/MyBangumi?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# 或者
https://mikanime.tv/RSS/MyBangumi?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# 或者
https://mikanani.kas.pub/RSS/MyBangumi?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

或者直接在番剧主页面中找到想要订阅的字幕组，点击字幕组名称右侧的**RSS** 按钮（或是番剧标题右侧的**RSS** 按钮直接订阅全部字幕组资源）

![](https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251014150909506.png)

之后回到autobangumi页面，点击右上角的加号，粘贴上在[MiKan Project](https://mikanani.me/)复制的RSS订阅链接，点击添加

![](https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251014161934033.png)

![image](https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/image-20251014162640-ssu78oz.png)

‍

#### 官方订阅贴士

由于 AutoBangumi 会解析所有获得的 RSS 信息，因此在订阅番剧的时候需要注意以下几点：

![image](https://www.autobangumi.org/assets/advanced-subscription.87187bed.png)

- 在个人设置中打开高级设置。
- 一部番剧只订阅一个字幕组，点击 Mikan Project 的番剧图片即可呼出二级菜单，选择一个字幕组订阅即可。
- 如果字幕组有简体繁体不同的字幕，Mikan Project 大多时候提供了选择订阅的方式，选择一种字幕订阅。
- 如果不提供简繁选择，那么可以在 AutoBangumi 中设置 `filter` 进行过滤，也可以在规则生成之后进入 qBittorrent 中手动过滤。
- 目前不支持 OVA 以及 剧场版 的订阅解析。

#### 配置 AutoBangumi

安装好 AB 之后，AB 的 WebUI 会自动运行，但是主程序会处于暂停状态，可以进入 `http://绿联nas的内网ip:7892` 进行配置。

1. 打开网页后，默认用户名是`admin`​默认密码是`adminadmin`。即可进入面板。 进入面板后请及时更改用户名和密码。
2. 填入下载器的地址，端口，用户名和密码。

![ab-webui](https://www.autobangumi.org/assets/downloader.ed030aec.png)

3. 点击 **Apply** 保存配置，此时 AB 会重启运行，当右上角的圆点变为绿色时，表示 AB 已经正常运行。
4. 点击右上角的添加按钮，勾选 ​**聚合 RSS**， 选择解析器类型，填入 Mikan RSS 的地址。

![ab-rss](https://www.autobangumi.org/assets/add-rss.40aeea3e.png)

等待 AB 解析聚合 RSS，解析完成会自动添加番剧并且下载管理。

#### 下载器地址

注意

请不要直接使用 127.0.0.1 或 localhost 作为下载器地址。

由于 AB 在官方教程中是以 **Bridge** 模式运行在 Docker 中的，如果你是用 127.0.0.1 或者 localhost 那么 AB 将会把这个地址解析为自身，而非下载器。

- 如果你的 qBittorrent 运行在宿主机上，那么你需要使用宿主机的 IP 地址，绿联nas的qBittorrent默认访问地址为：http://NAS_IP:8888。（具体如何配置qBittorrent看[绿联nas qBittorrent配置指南](/绿联nas%20qBittorrent配置指南.md)）

如果你以 **Host** 模式运行 AB，那么你可以直接使用 127.0.0.1 代替 Docker 网关地址。

注意

Macvlan 会隔离容器的网络，此时如果你不做额外的网桥配置将无法访问同宿主机的其他容器或者主机本身。

#### 下载器路径问题

AB 中配置的路径只是为了生成对应番剧文件路径，AB 本身不对路径下的文件做直接管理。

**下载路径** 到底写什么？

这个参数只要和你 **下载器** 中的参数保持一致即可。

- 比如 qB 中是 `/downloads`​ 那就写 `/downloads/Bangumi`​，`Bangumi`可以任意更改。

  ![image](https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251107182652311.png)

##### ​`config.json` 中的配置选项

在配置文件中对应选项如下：

配置文件部分：`downloader`

|参数名|参数说明|参数类型|WebUI 对应选项|默认值|
| ----------| --------------------| ----------| --------------------| --------------------|
|type|下载器类型|字符串|下载器类型|qbittorrent|
|host|下载器地址|字符串|下载器地址|172.17.0.1:8080|
|username|下载器用户名|字符串|下载器用户名|admin|
|password|下载器密码|字符串|下载器密码|adminadmin|
|path|下载器下载路径|字符串|下载器下载路径|/downloads/Bangumi|
|ssl|下载器是否使用 SSL|布尔值|下载器是否使用 SSL|false|

### 额外说明

由于豆瓣的动漫信息不全，建议搞好TMDB刮削。（具体如何配置 TMDB 数据源看[如何申请个人 TMDB（The Movie Database）API 密钥](/绿联nas%20如何申请个人%20TMDB（The%20Movie%20Database）API%20密钥.md)）

部分地区存在连通性的问题，Emby和绿联影视中心不一定能完整刮削到动漫图片和每集TMDB详情，需要添加以下host（注意复制粘贴完host地址需要点击右下角导入配置按钮才算添加成功）：

![](https://pic2.zhimg.com/v2-17e4518d65e9298761a8558dcc1d0567_r.jpg)

```text
104.16.61.155 image.themoviedb.org
108.138.246.55 api.themoviedb.org
91.134.1.171 webservice.fanart.tv
```

绿联影视中心获取的动漫详情：

![](https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251014161738225.png)
