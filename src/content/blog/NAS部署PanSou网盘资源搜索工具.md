---
title: 'NAS部署PanSou网盘资源搜索工具'
description: 'PanSou 是一款高性能的网盘资源搜索 API 服务，支持 TG 频道和插件搜索。'
pubDate: 'Sep 11 2026'
tags: [自托管, 工具, NAS]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911161834493.png'
---

### 一、项目介绍（官方）

> PanSou 是一款高性能的网盘资源搜索 API 服务，支持 TG 频道和插件搜索。系统设计以性能和可扩展性为核心，支持多频道多插件并发搜索、结果智能排序和网盘类型分类。Docker 集成前后端，一键启动，开箱即用。

官方提到的几个关键点：

- 高性能并发搜索，用工作池管理任务
- 自动识别并分类网盘类型：百度、阿里、夸克、天翼、UC、移动、115、PikPak、迅雷、123、磁力、电驴等
- 智能排序（插件等级、时间新鲜度、优先关键词）
- 异步插件系统，可扩展搜索源
- 二级缓存（内存 + 磁盘），提升重复查询和并发速度

它有两个版本：前后端集成版（pansou-web，自带网页）和纯后端 API 版。我们这篇装的就是前后端集成版 pansou-web，部署好直接有网页可以用。

项目基本信息：

|项|内容|
| ----------| ------------------------------------------|
|项目地址|[https://github.com/fish2018/pansou](https://github.com/fish2018/pansou)|
|体验站|[https://so.252035.xyz/](https://so.252035.xyz/)|
|开源协议|MIT|
|原作者|fish2018（GitHub）|
|版权声明|仅供学习研究，请勿以各种形式用于盈利目的|

### 二、详细部署操作指南（绿联 NAS）

下面按绿联 NAS 的界面一步步来。绿联的 Docker 里，Compose 部署叫"项目"，和"容器"是分开的。

**步骤 1：打开绿联云，进入 Docker 应用**  
在电脑上打开绿联云客户端，或者用浏览器登录绿联 NAS 的 Web 管理页（一般是 http://NAS局域网IP:9999，或你绑定的域名）。  
登录后，在「应用中心」里找到 Docker（或你已安装的 Docker 管理器），点进去。

**步骤 2：点击「新建项目」**   
进 Docker 后，切到「项目」标签，点「新建项目」。这就是用 Compose 部署的入口。  
​![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/forum.php)

**步骤 3：填写项目名，粘贴 docker-compose.yml**  
给项目起个名，比如 pansou。地址一般会自动填写，放在你的 docker 目录下，你也可以自行修改：  
​![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911161514285.png)

然后把下面这份内容整段粘贴进编辑器。这份就是 pansou-web 的部署最简 Compose， 更高级和拓展功能强烈建议继续往下看：

```dockerfile
⁠version: '3.8'
⁠services:
⁠  pansou:
⁠    # 前后端集成版（pansou-web），自带网页，一条命令开箱即用
⁠    image: ghcr.io/fish2018/pansou-web:latest
⁠    container_name: pansou-app
⁠    restart: unless-stopped
⁠    # 网页在容器内跑在 80 端口，映射到宿主机的 18111
⁠    # 外面访问用 http://NAS局域网IP:18111（左边这个数就是外部端口，可改）
⁠    ports:
⁠      - "18111:80"
⁠    environment:
⁠      # 要搜 Telegram 等墙外源才需要代理；几种写法见下方要点。纯国内源可先不填
⁠      - PROXY=socks5://你的代理IP:端口
⁠    # 数据持久化：配置/日志/缓存分别挂载，容器重建不丢
⁠    volumes:
⁠      - ./data:/app/data        # 用户配置、插件状态（含 QQPD、Weibo、历史记录等）
⁠      - ./logs:/app/logs        # 运行日志
⁠      - ./cache:/app/cache      # 缓存持久化（降低重复搜索延迟与被封风险）
⁠    # 普通健康检查：接口不通时容器被标记为不健康，便于自动重启（无需额外容器）
⁠    healthcheck:
⁠      test: ["CMD", "curl", "-f", "http://localhost/api/health"]
⁠      interval: 30s
⁠      timeout: 10s
⁠      retries: 3
⁠      start_period: 40s
```

几个要点：

- **端口怎么写**​：ports: - "18111:80" 的格式是 宿主机端口:容器端口。网页在容器里跑在 80，你把它映射到宿主机的 18111，所以外面用 http://NAS局域网IP:18111 访问。**只改左边那个数**就能换端口，比如 "18080:80" → 访问 :18080。另有一个 PANSOU\_PORT\=8888 是容器**内部**前后端通信用的后端端口，网页自己连它，你不用对外暴露、一般也不用改。
- **代理有几种形式**（按需填写，下面第四节还会细讲）：PanSou 很多源在墙外，得走代理。写法都是 协议://IP:端口，常见三种：

  - PROXY\=socks5://你的代理IP:端口 （最常用，socks5）
  - SOCKS5\_PROXY\=socks5://你的代理IP:端口
  - HTTP\_PROXY\=http://你的代理IP:端口

  选哪种看你网络环境；本教程示例统一用 socks5 的 PROXY。**纯搜国内源、不碰 Telegram 频道的话，代理可以先不填，照样能跑。**

  > [!TIP]
  > 可以配合工具[Mihomo](https://raycornm.github.io/blog/mihomo%E7%BD%91%E7%BB%9C%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8D%97/)来使用
  >

**步骤 4：点「完成 / 创建」，等镜像拉取**点创建后，绿联会去 ghcr.io 拉镜像。首次拉取在国内可能慢，等状态变成"运行中"就成功了。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911161545067.png)

**步骤 5：浏览器打开，开搜**打开 http://你的NAS局域网IP:18111，就能看到 PanSou 的搜索页，输入关键词回车即可。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911161834493.png)

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162113955.png)

### 三、从极简到强大：怎么拓展资源获取途径

装好只是个简单搜索框，下面这些才是它越用越强的地方。

1. **添加 TG 频道**

TG 频道是 PanSou 最主要的资源来源。如果用最简化的安装，其实是打包了一些 TG 频道在里面的。然后你可以通过用户界面添加 TG 频道。

路径是配置，TG 频道，添加频道，输入频道 ID。勾选之后，下滑保存配置。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162159413.png)

在 compose 的 environment 里加一行 ENABLED\_CHANNELS，多个用逗号分隔，改完重新部署生效。代码格式如下：

environment:

- ENABLED\_CHANNELS\=tgsearchers7,Aliyun\_4K\_Movies,BaiduCloudDisk,Quark\_Movies,Channel\_Shares\_115,PikPak\_Share\_Channel

 常用频道举例（挑了一批有代表性的，实际可加的远不止这些）：

|频道|大致内容|
| -------------------------------| ------------------|
|tgsearchers7|综合影视 / 网盘|
|Aliyun\_4K\_Movies|阿里云盘 4K 影视|
|BaiduCloudDisk|百度网盘|
|Quark\_Movies|夸克影视|
|Channel\_Shares\_115|115 网盘分享|
|PikPak\_Share\_Channel|PikPak 分享|
|4Kmovies / Oscar\_4Kmovies|4K 电影|
|BooksRealm|电子书|
|Netdisk\_Movies|网盘影视|
|NewAliPan / NewQuark|阿里 / 夸克新源|
|QQZYDAPP|QQ 资源|
|yunpanquark|夸克网盘|

2. **加插件**

插件是另一类搜索源，走异步，补频道覆盖不到的地方（某些网盘 / 站点）。这一栏，即便是在 Compose 里头不写，其实也能有 三十到五十几个插件供你来选择使用。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162229902.png)

同样在 environment 加 ENABLED\_PLUGINS，逗号分隔：

environment:

- ENABLED\_PLUGINS\=quark4k,quarksoo,quarktv,duoduo,dyyjpro,pansearch,javdb,nyaa,thepiratebay,libvio,alupan,weibo,qqpd,xiaozhang

常用插件举例：

|插件|大致内容|
| ------------------------------| --------------|
|quark4k / quarksoo / quarktv|夸克相关|
|duoduo|多多网盘|
|dyyjpro|电影|
|pansearch|网盘搜索|
|javdb|JAV 数据库|
|nyaa|动漫 / 种子|
|thepiratebay|种子|
|libvio|影视|
|alupan|阿里盘|
|weibo|微博|
|qqpd|QQ 频道|
|xiaozhang|小张（网盘）|

3. **开启「查询网盘链接有效性」（强烈建议）**

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162310375.png)

在网页「设置」里有个开关：​**查询网盘链接的有效性**。强烈建议打开。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162334402.png)  
打开后，每次搜索结果会​**自动检测链接是否还有效**​，有效的会在链接后面显示一个​**小绿点**​。这对判断一个资源还能不能下非常有用。  
但要注意：这功能​**也不能 100% 保证链接有效**——检测那一刻有效，过后可能失效；个别情况下检测本身也有误差。把它当参考，别全信。

4. **QQ 频道 / 资源网站**

这俩功能不是独立开关，而是**对应插件被启用之后**才会出现。插件页面中注意勾选 qqpd、weibo、gying

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20260911162402369.png)  
在网页「账号」界面，可以登录 ​**QQ、微博，以及盘链网站**，登录后就能搜对应源。

操作方法是点击服务列表这个方块，会要求你输入一个 ID，这个你可以按照你的实际 ID 来写。

点击确认之后会到登录页面，左边就会有一个二维码，你用相应的软件扫码即可登录。然后下方就是这个 ID 填写的地址。

5. **调性能 / 给网站加认证**

- **性能**​：并发 CONCURRENCY、超时 PLUGIN\_TIMEOUT / ASYNC\_RESPONSE\_TIMEOUT 等变量可调。机器弱就调小并发；搜得慢、总超时就把超时放大。
- **认证**：如果你要把服务暴露到公网，务必在 environment 加认证：

同样是在environment中添加

- AUTH\_ENABLED\=true
- AUTH\_USERS\=admin:admin123       # 前面是账号：后面是密码

6.  **调用 API（专业玩家）**

网页上有个「API」页面，点进去能看到整套系统提供的接口（搜索、链接检测等）。  
搜索接口形如 http://NAS局域网IP:18111/api/search，POST 一个 {"kw":"关键词"} 就能拿结果（具体路径以你实例的 API 页面为准）。把它接进自己的下载工具、自动化脚本里，玩法就打开了。  
也就是说，今天你搭的是一个很简单的搜索框；过阵子频道插件加满、设置调好，它就是覆盖极广的资源聚合站。从极简到强大，差的就是不断加源。
