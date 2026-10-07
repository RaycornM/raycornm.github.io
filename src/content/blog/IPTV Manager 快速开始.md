---
title: 'IPTV Manager 快速开始'
description: '一个可自部署的 IPTV 直播源管理工具'
pubDate: 'Oct 07 2026'
tags: [iptv, NAS, 自托管, 工具, 教程]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/aa314e0d-f88b-4437-8bc0-e0d616897208.png'
---

一个可自部署的 IPTV 直播源管理工具：**订阅 → 检测 → 去重优选 → 导出 / 内网代理播放**。

本教程覆盖：部署（绿联 NAS 面板 / 命令行 Docker / 裸机）→ 首次使用 → 播放器对接 → 常见问题。

---

### 一、部署前准备

| 项目 | 要求 |
|---|---|
| 设备 | NAS（绿联/群晖/威联通等）或任意常开机的电脑/服务器 |
| Docker | 已安装 Docker 与 Docker Compose（绿联 UGOS 自带） |
| 磁盘 | 约 500MB（镜像 + 数据） |
| 网络 | 仅内网使用即可；**不要暴露公网**（原因见 FAQ-12） |

获取项目文件：把整个 `iptv-manager` 文件夹放到 NAS 上（如绿联的 `/volume1/docker/iptv-manager`）。

---

### 二、部署方式

#### 方式 A：绿联 NAS Docker 面板（推荐 NAS 用户）

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160042413.png)

1. 打开 UGOS「Docker」→「项目」→「创建项目」
2. 项目名称填 `iptv-manager`，Compose 配置粘贴项目根目录 `docker-compose.yml` 的内容（也可直接从目录内直接导入）：

```yaml
services:
  iptv-manager:
    build: .
    image: iptv-manager:latest
    pull_policy: build
    container_name: iptv-manager
    ports:
      - "8080:8080"        # 左侧端口可改，如 "9180:8080"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 512M
    environment:
      - TZ=Asia/Shanghai
```

3. 构建路径（Build Context）选择你上传的 `iptv-manager` 文件夹
4. 点「构建」。**首次构建约 10~20 分钟**，日志应能看到 `[frontend] npm ci`、`[backend] go mod download`、`apk add ffmpeg` 等阶段
5. 构建完成后浏览器打开 `http://NAS的IP:8080`

> 国内构建如果遇到网络超时，先看 FAQ-1 / FAQ-2 / FAQ-3。

#### 方式 B：命令行 Docker Compose（群晖/威联通/Linux）

```bash
cd iptv-manager
docker compose up -d --build
```

#### 方式 C：不用 Docker（需要 Go 1.22+、Node 20+、ffmpeg）

```bash
cd frontend && npm ci && npm run build && cd ..
rm -rf backend/web && cp -r frontend/dist backend/web
cd backend && CGO_ENABLED=0 go build -o iptv-manager . && ./iptv-manager
```

环境变量：`PORT`（默认 8080）、`DATA_DIR`（默认 ./data）、`TZ`。

#### 验证部署成功

- 浏览器直接访问 `http://NAS的IP:8080/api/subscriptions`，应显示 `[]`
- 首页侧边栏「直播源检测与管理」下方有一行灰色小字 `build 2026-...`

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/aa314e0d-f88b-4437-8bc0-e0d616897208.png)

---

### 三、首次使用流程

#### 第 1 步：添加订阅（「订阅」页）

两种方式任选：

- **订阅链接**：粘贴 m3u/m3u8 订阅地址，如 `https://example.com/iptv.m3u`

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160254930.png)

- **粘贴内容**：直接把 m3u 文本或 txt（`分组,#genre#` 格式）粘进去

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160313864.png)

点「添加订阅」后会立即拉取并解析，列表里显示「ok（N 个源）」即成功。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160503943.png)

#### 第 2 步：全量检测（「仪表盘」页）

点「开始全量检测」。系统会用 ffprobe/ffmpeg 真实拉流，检测每个源的：

- 连通性、延迟
- 分辨率、视频/音频编码
- 实测码率、速度比（≥1 表示跟得上实时播放）
- 停顿次数，并综合给出 0-100 健康分

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160607584.png)

频道多时需要一些时间，进度实时可见，可随时「停止」。

#### 第 3 步：浏览频道（「频道」页）

- 同名频道自动合并（如 `CCTV-1 高清` / `cctv1` / `CCTV1 FHD` 合并为一个频道、多个源）
- 展开频道可看：每个源的健康分、码率、延迟、速度比、停顿次数、近 14 天可用率曲线、EPG 当前节目
- 「设为优先」可手动锁定某个源；「重测」单独复测一个源

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007160815095.png)

#### 第 4 步：导出（「导出」页）

| 格式 | 适用播放器 |
|---|---|
| M3U | TiviMate、Kodi、PotPlayer、VLC 等绝大多数 |
| TXT（`分组,#genre#`） | DIYP、百川影音等 |

- 可按分组筛选导出
- 「复制订阅链接」交给播放器定时拉取，频道更新后播放器自动同步
- 「使用本机代理转发地址」：源失效时自动切换备用源，**仅内网设备可播放**

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161009600.png)

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161104335.png)

#### 第 5 步（可选）：节目单（「节目单」页）

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161128165.png)

添加 xmltv 格式的 EPG 地址（支持 `.xml` / `.xml.gz`），如：

```
https://epg.112114.xyz/pp.xml
```

可添加多个源，互不影响；按 `epg.cron_interval_h`（默认 12 小时）自动更新。频道页展开频道即可看到「正在播出 / 接下来」。

---

### 四、主要设置项（「设置」页）

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161200034.png)

| 设置 | 默认 | 说明 |
|---|---|---|
| check.concurrency | 8 | 检测并发数，NAS 建议 4-8 |
| check.probe_timeout_s | 10 | ffprobe 超时，慢源/国外源可调大到 20-30 |
| check.measure_window_s | 10 | 实际拉流测速窗口（秒） |
| check.min_score_export | 40 | 低于该分的源不导出（0 = 不过滤） |
| check.cron_enabled | true | 是否定时自动检测 |
| check.cron_interval_h | 6 | 自动检测间隔（小时） |
| check.retention | 100 | 每频道保留检测历史条数 |
| check.retry_count | 2 | 检测失败自动重试次数（0 = 不重试） |
| check.retry_delay_s | 3 | 重试间隔（秒） |
| sub.auto_update_h | 24 | 订阅自动更新间隔（小时） |
| epg.cron_interval_h | 12 | EPG 自动更新间隔（小时） |
| proxy.max_streams | 20 | 内网转发并发上限 |
| net.proxy | 空 | 检测/拉取用代理，`http://` 或 `socks5://` |

---

### 五、常见问题（FAQ）

#### 构建部署类

**FAQ-1：构建卡在 `go mod download`，提示 `proxy.golang.org ... i/o timeout`**

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/fc335b03625c1d6c55cfe4142911042a.png)

Go 官方模块代理国内不可达。项目 Dockerfile 已默认开启 `GOPROXY=https://goproxy.cn,direct`，请确认 NAS 上的 `Dockerfile` 是最新版本（第 13 行 `ENV GOPROXY=...` 不带 `#` 注释）。

**FAQ-2：部署日志提示 `registry-1.docker.io ... context deadline exceeded`**

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161453317.png)

Docker Hub 国内不可达。两个动作：

1. 绿联 UGOS：Docker → 设置 → 镜像库/加速器，添加 `https://docker.1ms.run` 后保存
2. 确认 compose 里有 `pull_policy: build`（新版已加），防止面板去 Docker Hub 拉镜像

**FAQ-3：构建卡在 `apk add ffmpeg` 超时**

打开 `Dockerfile`，找到这行并取消注释（换成阿里云 apk 镜像）：

```dockerfile
RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.aliyun.com|g' /etc/apk/repositories
```

**FAQ-4：点「重新部署」后界面还是老样子**

「重新部署/重启」多数面板只重建容器、**不重新构建镜像**。必须点「重新构建/构建」（如果没有该按钮，把 Compose 配置改个空格再保存也会触发重建）。判断标准：部署日志开头应有大段 `=> [frontend]`、`=> [backend]` 构建行；如果一上来就是 `[+] create`，说明没构建。

**FAQ-5：本地 `npm install` 过再 `docker compose build` 报错**

旧版 `.dockerignore` 不会排除 `frontend/node_modules`，会把 Windows 的依赖复制进 Linux 容器导致构建失败。请使用最新 `.dockerignore`（已改为 `**/node_modules`、`**/dist`）。

#### 界面类

**FAQ-6：打开页面或点「订阅」整页白屏**

按顺序排查：

1. `Ctrl + Shift + R` 强制刷新（排除浏览器缓存旧 JS）
2. 浏览器直接访问 `/api/subscriptions`：显示 `null` = 后端是旧版本，需要重新构建（旧版本空列表返回 `null` 导致前端崩溃，新版本返回 `[]`）
3. 看侧边栏有没有 `build 2026-...` 时间戳：没有 = 镜像还是旧的，回 FAQ-4
4. F12 → 网络面板，JS 文件名应为 `index-Yr6Mg5bD.js` 或更新

**FAQ-7：页面提示 `Failed to fetch`**

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261007161618721.png)

浏览器没收到 API 响应。分两种情况：

- **内网直连（`http://NAS的IP:8080`）正常，隧道外链失败**：是免费隧道（ugdocker.link 等）对 API 请求中转不稳定，偶发抽风，刷新重试；日常使用建议内网直连
- **内网也失败**：F12 → 网络 → 点红色的 `/api/...` 请求看状态码；容器可能在重启中，稍等 30 秒再试

**FAQ-8：旧版本的已知 bug（升级到最新构建即可）**

- 点「停用/启用」订阅会把订阅 URL 清空 → 新版已修
- 检测历史默认保留 50 条导致 14 天可用率图缺数据 → 新版默认 100
- 多个 EPG 源互相清空节目 → 新版已按源隔离

#### 检测与播放类

**FAQ-9：大量源检测失败或全部超时**

- 「设置」把 `check.probe_timeout_s` 调大到 20-30（慢源/国外源）
- `check.concurrency` 调低到 4（NAS 性能弱或带宽小）
- 需要代理才能访问的源：设置 `net.proxy`（如 `http://192.168.1.10:7890`）

**FAQ-10：检测显示有效但播放器放不了**

- 检测用的是 ffmpeg 拉流，播放器（尤其电视端）兼容性可能不同，优先选健康分 80+ 的源
- 用导出页的「本机代理转发地址」模式，由 NAS 中转并自动切换备用源

**FAQ-11：socks5 代理设置了好像没生效**

Go 侧（拉订阅/EPG）完整支持 socks5；ffmpeg/ffprobe 检测走 `http_proxy` 环境变量，socks5 支持取决于 ffmpeg 版本（6.x 支持，旧版会静默直连）。Docker 镜像里是新版 ffmpeg，不受影响。

#### 安全与数据类

**FAQ-12：能不能暴露公网访问？**

**不建议。** 本工具无鉴权，`/proxy/*` 是开放转发，暴露公网等于把你的带宽开放给所有人当中转。管理界面用内网或你自己可信的隧道；播放器的播放地址本身也只在能访问 NAS 的网络里可用。

**FAQ-13：数据在哪？怎么备份/迁移？**

全部数据（订阅、频道、检测历史、设置、EPG）都在 `./data` 目录的 SQLite 文件里（容器内 `/app/data`）。备份 = 复制整个 `data` 文件夹；迁移 = 停止容器 → 复制 `data` → 新机器启动。

**FAQ-14：端口 8080 被占用**

改 compose 里 `ports` 左侧端口，如 `"9180:8080"`，重新构建启动后用 `http://NAS的IP:9180` 访问。

**FAQ-15：HEALTHCHECK 一直 unhealthy**

容器内健康检查请求的是 `/api/stats`，刚启动几秒可能未就绪，等 1-2 分钟；持续 unhealthy 看容器日志是否有 `IPTV Manager 已启动` 字样，没有则把日志保存下来排查。

---

### 六、日常使用建议

1. 订阅源挂得快是常态，靠 **定时检测（默认 6 小时）+ 导出时自动剔除低分源** 来保证播放器里的列表始终可用
2. 播放器里填导出页的**订阅链接**而不是下载文件，这样源更新后播放器刷新即可同步
3. 常看的频道「设为优先」，导出和代理都会优先用它
4. `data` 目录定期备份（FAQ-13）
