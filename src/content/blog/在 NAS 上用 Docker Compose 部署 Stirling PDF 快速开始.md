---
title: '在 NAS 上用 Docker Compose 部署 Stirling PDF 快速开始'
description: '> **Stirling PDF** 是 GitHub 上排名第一的开源 PDF 处理平台，提供 50+ 种 PDF 工具'
pubDate: 'Oct 19 2026'
tags: [NAS, 自托管, 工具, 教程]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019140533245.png'
---

> **Stirling PDF** 是 GitHub 上排名第一的开源 PDF 处理平台，提供 50\+ 种 PDF 工具：编辑、合并、拆分、签名、OCR、压缩、格式转换、水印、打码（Redact）等。所有文件都在本地处理，不会上传到任何第三方服务器——这正是把它部署在 NAS 上的最大意义：**7×24 小时在线的家庭/团队 PDF 工作站，数据完全留在自己手里**。

本文基于 [Stirling PDF 官方文档](https://docs.stirlingpdf.com/)整理，目标是在常见的 NAS 系统（群晖 Synology、威联通 QNAP、TrueNAS、Unraid 等）上用 Docker Compose 完成部署。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019155619064.png)

**Stirling-PDF 能干什么？**

介绍几个最常用的功能：

1. **页面操作：**

合并多个 PDF、拆分单页、提取指定页面、旋转、裁剪。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019155817871.png)

2. **格式转换：**

PDF 与 Word/Excel/PPT/图片/Web/电子书多种格式相互转换。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019160252543.png)

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019160305216.png)

3. **OCR 文字识别和 PDF 文字编辑：**

扫描版 PDF、图片 PDF 转换为能修改文本的 PDF 文件。可以直接在 Stirling-PDF 中编辑文本，也可以识别后转换为 Word 文档。

4. **编辑和标注：**
   加文字、加图片、加水印、加页码、加签名。合同盖章不用再打印出来签完再扫描了，直接在 PDF 上签名就行。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019160642396.png)

5. **安全和压缩：**  
   加密解密、加密码、压缩体积
  
![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019160900871.png)

---

## 一、部署前准备

### 硬件要求

| 项目 | 最低                             | 推荐                           |
| ---- | -------------------------------- | ------------------------------ |
| 内存 | 2 GB                             | 4 GB（完整版）/ 6 GB（fat 版） |
| 磁盘 | 2 GB（精简版）/ 5 GB\+（完整版） | 10 GB\+（含 OCR 语言包）       |
| CPU  | 任意 x86\_64                     | 支持即可，OCR 时占用较高       |

> OCR 识别、Office 格式转换（PDF ↔ Word/Excel）是内存大户，NAS 内存紧张时建议优先使用 `latest-ultra-lite` 镜像。

### 软件要求

NAS 上需要可用的 Docker 环境，任选其一：

- **群晖 Synology**：Container Manager（DSM 7.2\+，推荐）或旧版 Docker 套件
- **威联通 QNAP**：Container Station
- **TrueNAS SCALE**：内置 Kubernetes 的 Apps 商店，直接搜索 "Stirling PDF" 一键安装（社区维护）
- **Unraid**：安装 Community Applications 插件后搜索 "Stirling PDF"
- **通用方案**：SSH 到 NAS，确认 Docker 与 Compose 可用：

```plaintext
docker -v                # Docker Engine 20.10+
docker compose version   # Docker Compose v2.0+
```

> 下文以「SSH \+ docker compose」为主线讲解（通用性最强），Portainer / Container Manager 用户可以照搬 YAML 内容。

## 二、镜像版本怎么选

官方镜像地址（二选一，同一个项目）：

```plaintext
docker.stirlingpdf.com/stirlingtools/stirling-pdf   # 官方推荐（新）
frooodle/s-pdf                                      # 旧名称，向后兼容
```

| 标签                | 体积    | 包含内容                             | 适用场景                       |
| ------------------- | ------- | ------------------------------------ | ------------------------------ |
| `latest`            | ~1.5 GB | 完整功能 \+ OCR \+ LibreOffice 转换  | **NAS 部署首选**               |
| `latest-fat`        | ~2.5 GB | 完整功能 \+ 全部依赖 \+ 安全登录组件 | 企业/生产环境                  |
| `latest-ultra-lite` | ~300 MB | 仅基础 PDF 操作，无 OCR/Office 转换  | 低内存设备（ARM NAS、轻量机型） |

> 建议：**个人 NAS 直接用 **`latest`。ARM 架构的 NAS（如部分威联通、树莓派方案）官方也提供多架构镜像，直接拉取即可。

## 三、目录结构规划

在 NAS 的 Docker 数据目录下（群晖默认为 `/volume1/docker/`，以下以它为例，请按实际路径替换）创建持久化目录：

```plaintext
mkdir -p /volume1/docker/stirling-pdf/{tessdata,configs,customFiles,logs,pipeline,storage}
```

| 宿主机目录     | 容器内路径            | 作用                             |
| -------------- | --------------------- | -------------------------------- |
| `tessdata/`    | `/usr/share/tessdata` | OCR 语言数据包（中文识别需要）   |
| `configs/`     | `/configs`            | 应用配置、用户数据库、安全设置     |
| `customFiles/` | `/customFiles`        | 自定义字体、签名图片、品牌 Logo 等 |
| `logs/`        | `/logs`               | 运行日志                         |
| `pipeline/`    | `/pipeline`           | 自动化流水线配置文件             |
| `storage/`     | `/storage`            | 新版应用的文件存储               |

## 四、编写 docker-compose.yml

进入目录并创建编排文件：

```plaintext
cd /volume1/docker/stirling-pdf
vi docker-compose.yml
```

以下内容基于官方示例（`exampleYmlFiles/docker-compose-latest.yml`）整理，已针对 NAS 场景做了优化：

```plaintext
services:
  stirling-pdf:
    container_name: stirling-pdf
    # 国内 NAS 若拉取缓慢，可改用镜像加速地址或旧仓库名 frooodle/s-pdf:latest
    image: docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest
    restart: unless-stopped

    ports:
      - "8080:8080"        # 左侧可改为 NAS 上未占用的端口，如 "8380:8080"

    volumes:
      - ./tessdata:/usr/share/tessdata:rw      # OCR 语言包（持久化，否则每次重建丢失）
      - ./configs:/configs:rw                  # 配置与用户数据库，必须挂载
      - ./customFiles:/customFiles:rw          # 自定义字体/签名图
      - ./logs:/logs:rw
      - ./pipeline:/pipeline:rw
      - ./storage:/storage:rw

    environment:
      # ---------- 界面与语言 ----------
      LANGS: "en_US,zh_CN,zh_TW,ja_JP,ko_KR"   # 启用的界面语言（按需增删）
      SYSTEM_DEFAULTLOCALE: zh-CN              # 默认语言：简体中文
      UI_APPNAME: "Stirling PDF"
      UI_HOMEDESCRIPTION: "本地 PDF 工作站"

      # ---------- 安全登录（NAS 建议开启） ----------
      DOCKER_ENABLE_SECURITY: "true"           # 启用安全模块（用户/登录）
      SECURITY_ENABLELOGIN: "true"             # 打开登录页
      SECURITY_INITIALLOGIN_USERNAME: "admin"
      SECURITY_INITIALLOGIN_PASSWORD: "请改成强密码"

      # ---------- 系统限制 ----------
      SYSTEM_MAXFILESIZE: "200"                # 单文件上传上限（MB）
      METRICS_ENABLED: "true"

    # ---------- 健康检查（可选，便于 NAS 面板显示状态） ----------
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/api/v1/info/status || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

    # ---------- 内存限制（可选，防止吃光 NAS 内存） ----------
    deploy:
      resources:
        limits:
          memory: 4G
```

**内网自用、不想登录的话**，把上面三个 `SECURITY_*` 相关变量改为：

```plaintext
      DOCKER_ENABLE_SECURITY: "false"
      SECURITY_ENABLELOGIN: "false"
```

> ⚠️ 纯内网个人使用可以关闭登录；但只要 NAS 有任何对外暴露的可能（公网穿透、DDNS、反向代理），**务必保持登录开启并设置强密码**。

**简洁版本**：

```plaintext
services:
  stirling-pdf:
    image: stirlingtools/stirling-pdf:latest
    container_name: stirling-pdf
    restart: unless-stopped
    ports:
      - "8750:8080" # 冒号前面的前端端口随便改
    volumes:
      - ./trainingData:/usr/share/tessdata
      - ./extraConfigs:/configs
      - ./customFiles:/customFiles
      - ./logs:/logs
    environment:
      - SYSTEM_DEFAULT_LOCALE=zh-CN
      - DOCKER_ENABLE_SECURITY=false
```

## 五、在 NAS 上启动服务

### 方式 A：SSH 命令行（通用）

```plaintext
cd /volume1/docker/stirling-pdf

# 校验配置语法
docker compose config

# 拉取镜像并后台启动（首次约 1~2 GB，耐心等待）
docker compose pull
docker compose up -d

# 查看启动日志，出现 Started 字样即就绪
docker compose logs -f
```

启动成功标志：

```plaintext
Stirling-PDF Started
```

健康状态也可以通过 API 验证：

```plaintext
curl -s http://127.0.0.1:8080/api/v1/info/status
# 返回：{"status":"UP","version":"x.x.x"}
```

### 方式 B：Portainer（图形化）

1. 打开 Portainer → **Stacks → Add stack**
2. 命名（如 `stirling-pdf`），粘贴上面的 YAML
3. 先在 **Environment variables** 里填好密码等敏感变量（或用 `${VAR}` 引用），再 **Deploy the stack**

### 方式 C：群晖 Container Manager

1. 打开 Container Manager → **项目 → 新增**
2. 项目名称 `stirling-pdf`，路径选刚才建好的目录
3. 它会自动读取目录下的 `docker-compose.yml`，勾选「自动启动」后完成

### 访问

浏览器打开：

```plaintext
http://<NAS的IP>:8080
```

群晖若改过端口映射，用映射后的端口（如 `http://192.168.1.10:8380`）。

## 六、首次使用配置

1. **登录**：用 `SECURITY_INITIALLOGIN_USERNAME/PASSWORD` 设置的账号登录；**首次登录后立即在账户设置中修改默认密码**（初始账号只在第一次启用安全时创建）。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019160931670.png)

2. **界面语言**：默认已设简体中文；如未生效，点右上角地球图标切换。
3. **OCR 中文语言包**（首次使用 OCR 前）：

```plaintext
cd /volume1/docker/stirling-pdf/tessdata
# 下载简体中文 + 英文识别库（每个约 10~40 MB）
wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/chi_sim.traineddata
wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/eng.traineddata
```

下载后无需重启，OCR 工具里即可选择「中文（简体）」。

**或是启动后在设置界面选择下载**：  
打开 ***设置-高级***，在下载更多 ***tessdata*** 语言中选择图中的几个语言包，点击下载所选语言，就会出现下载连接，点击这些连接逐个下载。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019162949093.png)

下载后，把文件放在 trainingData 目录下

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261019163241194.png)

4. **快速体验**：拖入几个 PDF 试试右侧工具栏——**合并、拆分、压缩、PDF 转 Word、添加水印/密码、OCR** 等全部本地完成。

## 七、常用环境变量速查表

| 变量                                 | 默认值       | 说明                                 |
| ------------------------------------ | ------------ | ------------------------------------ |
| `SYSTEM_DEFAULTLOCALE`               | en-US        | 界面默认语言，中文用 `zh-CN`         |
| `LANGS`                              | en\_GB 等    | 启用的语言列表，逗号分隔             |
| `DOCKER_ENABLE_SECURITY`             | false        | 启用安全模块（多用户/登录）          |
| `SECURITY_ENABLELOGIN`               | false        | 是否弹出登录页                       |
| `SECURITY_INITIALLOGIN_USERNAME`     | —            | 初始管理员用户名（仅首次启动生效）   |
| `SECURITY_INITIALLOGIN_PASSWORD`     | —            | 初始管理员密码                       |
| `SYSTEM_MAXFILESIZE`                 | —            | 上传文件大小上限（MB）               |
| `METRICS_ENABLED`                    | false        | 开启 `/actuator/prometheus` 监控端点 |
| `UI_APPNAME`                         | Stirling PDF | 页面标题/名称                        |
| `UI_HOMEDESCRIPTION`                 | —            | 首页描述文字                         |
| `INSTALL_BOOK_AND_ADVANCED_HTML_OPS` | true         | 是否安装书籍/HTML 高级转换依赖       |

> 完整变量列表见官方文档的 Configuration 章节：`configs/settings.yml` 生成后，也可以在文件里直接改（需重启容器生效）。

## 八、卷挂载说明

| 容器路径              | 是否必须     | 备注                                               |
| --------------------- | ------------ | -------------------------------------------------- |
| `/configs`            | ✅ 必须       | 用户、设置、数据库都在这；不挂载则重建容器后全部丢失 |
| `/usr/share/tessdata` | 推荐         | OCR 语言包；挂载后新增语言不用重新下载             |
| `/logs`               | 可选         | 排查问题用                                         |
| `/customFiles`        | 可选         | 自定义签名图、水印图、品牌文件                       |
| `/pipeline`           | 可选         | 自动化流水线配置                                   |
| `/storage`            | 推荐（新版） | 新版文件存储目录                                   |

## 九、升级与备份

### 升级

```plaintext
cd /volume1/docker/stirling-pdf
docker compose pull        # 拉取最新镜像
docker compose up -d       # 自动重建容器，数据卷不动
curl -s http://127.0.0.1:8080/api/v1/info/status
```

> 生产环境建议把 `latest` 换成具体版本号（如 `1.3.2`），升级节奏自己掌控。

### 备份

备份宿主机上整个 `stirling-pdf` 目录即可，核心是 `configs/` 和 `tessdata/`：

```plaintext
tar -czf /volume1/backups/stirling-pdf-$(date +%F).tar.gz -C /volume1/docker stirling-pdf/configs stirling-pdf/tessdata
```

配合群晖「Hyper Backup」或 NAS 自带的计划任务定期打包即可。

## 十、常见问题排查

**Q1：打不开页面 / 一直转圈？**

```plaintext
docker compose ps                    # 容器是否 Up
docker compose logs --tail 100       # 看报错
```

冷启动需要 1 分钟左右（Java 应用初始化），看到 `Started` 再访问。若端口冲突，修改 compose 左侧端口。

**Q2：OCR 里没有中文选项？**  
语言包没放进 `tessdata/` 目录，或文件名不是 `chi_sim.traineddata`。参考第六节第 3 步重新下载，无需重启。

**Q3：上传大文件报 413 / 失败？**  
调大 `SYSTEM_MAXFILESIZE`；如果 NAS 前面还有反向代理（Nginx Proxy Manager、群晖反向代理），代理本身也有 body 限制，两边都要调。

**Q4：PDF 转 Word/Excel 报错？**  
确认用的是 `latest` 或 `latest-fat` 镜像。`ultra-lite` 不包含 LibreOffice，无法进行 Office 格式转换。

**Q5：权限报错、写入 configs 失败？**  
检查宿主机目录权限，至少保证容器内用户可写：

```plaintext
chmod -R 755 /volume1/docker/stirling-pdf
```

部分平台模板（如 Unraid 社区模板）支持 `PUID` / `PGID` 环境变量指定运行用户，与 NAS 共享文件夹用户保持一致即可（Unraid 默认 `PUID=99`、`PGID=100`）。

**Q6：容器反复重启？**  
多半是内存不足，在 compose 里加 `deploy.resources.limits.memory` 限制，或换用 `latest-ultra-lite` 镜像。

## 十一、安全建议

1. **登录必开**：`SECURITY_ENABLELOGIN=true`，默认账号密码改掉。
2. **不要直接对公网暴露 8080 端口**。需要外网访问时，走 HTTPS 反向代理（群晖自带反向代理 / Nginx Proxy Manager \+ Let's Encrypt），并开启登录。
3. **API Key**：登录后在账户设置里可以查看 API Key，调用 REST API 时放 `X-API-KEY` 请求头。
4. **版本固定**：对外提供服务时把 `latest` 固定为具体版本号，避免自动滚到不兼容的新版本。
5. **定期备份** `configs/` 目录——用户数据库（SQLite）在里面。

## 附：官方资源

- 文档首页：https://docs.stirlingpdf.com/
- Docker 安装文档：https://docs.stirlingpdf.com/Server/Install/Docker/
- 生产部署清单：https://docs.stirlingpdf.com/Server/Production/
- API 文档：见文档站 API 章节
- GitHub：https://github.com/Stirling-Tools/Stirling-PDF

_本文整理自 Stirling PDF 官方文档与 GitHub 仓库示例配置，随官方版本迭代部分内容可能变化，以官方文档为准。_
