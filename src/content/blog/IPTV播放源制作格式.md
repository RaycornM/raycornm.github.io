---
title: 'IPTV播放源制作格式'
description: 'IPTV直播源有两种播放文件格式——m3u & txt，分别可以在pc、手机和智能电视的播放软件上本地或在线加载播放'
pubDate: 'Mar 24 2025'
heroImage: 'https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/image-17-1024x550.png'
---

![image-17.png](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEDWtpo7O0H0QbRJJ-Pl5h1ZSZp0AP2UQACFiEAAiy-aVdQyuKo8Qi8UzYE.png)

IPTV直播源有两种播放文件格式——m3u & txt，分别可以在pc、手机和智能电视的播放软件上本地或在线加载播放，m3u文件支持在potplayer、zyfun、Kodi、emby等软件打开，txt文件本人目前只知道tvbox使用这种格式，其他软件有待补充。

想要自己制作直播源需要有单独频道的直播地址，需要一定的搜索能力，或者有其他格式的直播源也可以自己转换成需要的格式；

### 新建文本文档

文件第一行开头，txt格式不需要

- ###### m3u

```
#EXTM3U
```

如果想为频道分类的话接下来在下一行添加分类标题：

- ###### m3u
- ###### txt

```
#央视频道
```

```
央视频道,#genre#
```

添加频道：

- ###### m3u
- ###### txt

```
#EXTINF:-1 tvg-name="CCTV1" tvg-logo="https://live.fanmingming.com/tv/CCTV1.png" group-title="央视频道",CCTV-1 综合
http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226559/index.m3u8
```

```
CCTV-1 综合,http://ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226559/index.m3u8
```

m3u格式：tvg-logo是该频道对应logo的路径链接，group-title是该频道的分类，CCTV-1是这个源的名称，接着的链接就是直播链接；

txt格式：txt比较简单，直接直播源名称跟着直播链接就可以

剩下的频道按照上面的格式就可以继续添加了；最后文件保存为m3u或者txt格式，就可以扔到播放器或者tvbox中播放了。

#### M3U 格式中的 “注释” 规则
M3U（包括 M3U8）是一种文本格式的播放列表文件，它的 “注释” 规则和编程语言不同，但核心作用都是标注说明、不被程序解析执行，具体分为两种核心形式：

1. 纯注释行（对应 // 单行注释）
M3U 中最基础的 “注释” 是以 # 开头的行（注意不是 //），这行内容仅作为说明，播放器会完全忽略，和编程语言里 // 的作用完全一致。示例：
|m3u|
|------|
|# 这是一行纯注释，播放器不会解析|
|# 直播源列表 - 2025年12月|
|# 央视频道分组|

2. 特殊指令行（以 #EXT 开头，非纯注释但容易混淆）
需要注意：以 #EXT 开头的行（如 #EXTM3U、#EXTINF）不是注释，而是 M3U 的核心指令（播放器会解析执行），这是新手最容易搞错的点。完整示例（区分注释和指令）：
|m3u|
|------|
|#EXTM3U  # 必须放在第一行的核心指令（不是注释）|
|# 以下是央视综合频道（纯注释，仅说明）|
|#EXTINF:-1 group-title="央视频道",CCTV-1 综合  # 媒体信息指令（解析执行）|
|http://example.com/cctv1.m3u8  # 实际直播源地址|

##### 关键补充说明
注释的书写规范：
纯注释行必须以 # 开头，且不能是 #EXT（否则会被识别为指令）；
注释可以写在任意位置（除了 #EXTM3U 之前），一行一个注释，多行需每行加 #；
注释内容可以包含中文、数字、符号，仅用于人工阅读。
和编程语言 // 的对比：
类型	M3U 格式	编程语言（如 Python/Java）
单行注释符号	#（纯注释行）	//（Java/C++）、#（Python）
作用	标注说明，播放器忽略	标注说明，编译器 / 解释器忽略
特殊例外	#EXT 开头是指令，非注释	无类似例外
总结
M3U 直播源中，# 开头且非 #EXT 的行 等价于编程语言的 // 单行注释，仅作说明、不被解析；
注意区分 #（纯注释）和 #EXT（核心指令），后者是 M3U 的功能代码，并非注释；
M3U 没有多行注释语法，多行说明需每行单独加 #。

### 部分找源网址：

- [https://iptv-org.github.io/](https://iptv-org.github.io/)
- [https://tonkiang.us/](https://tonkiang.us/)
- [https://epg.pw/](https://epg.pw/)
- [https://aktv.space/](https://aktv.space/)
- [http://www.guangbomi.com/tv](http://www.guangbomi.com/tv)
- [https://www.chaojidianshi.net/gangtaizhibo/](https://www.chaojidianshi.net/gangtaizhibo/)
- [https://iptv.hacks.tools/#google_vignette](https://iptv.hacks.tools/#google_vignette)

### 在线检测m3u8工具：

[Free HLS Player - Tencent EdgeOne](https://edgeone.ai/tools/hls-player)

### 在线直播源转换工具：

[https://guihet.com/tvlistconvert.html](https://guihet.com/tvlistconvert.html)

### 个人直播源仓库：

[RaycornM/TVbox-IPTV: 自用影视源直播源配置仓库 随缘维护](https://github.com/RaycornM/TVbox-IPTV)

## 订阅链接：

### m3u直播源：

[https://raw.githubusercontent.com/RaycornM/TVbox-IPTV/main/Tivi.m3u](https://raw.githubusercontent.com/RaycornM/TVbox-IPTV/main/Tivi.m3u)

## txt直播源：

[https://raw.githubusercontent.com/RaycornM/TVbox-IPTV/main/Tivi.txt](https://raw.githubusercontent.com/RaycornM/TVbox-IPTV/main/Tivi.txt)
