---
title: 'PicGO实现自己的github图床'
description: '无论你是写博客、做笔记还是编写开发文档，PicGo 都能帮你一键上传图片并自动复制链接，让你专注于内容创作本身，而不是繁琐的上传步骤。'
pubDate: 'Aug 17 2026'
tags: [笔记, 自托管, 工具, 教程, 图床]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/19afbda4-1e1a-408f-b6c0-f25cae65340c.png'
---

> [!TIP] 💡 来源
> [PicGO官方文档](https://docs.picgo.app/zh/gui/guide/) https://docs.picgo.app/zh/gui/guide/

### 应用概述

**PicGo 致力于将图片上传无缝集成到你的创作工作流中。**

无论你是写博客、做笔记还是编写开发文档，PicGo 都能帮你一键上传图片并自动复制链接，让你专注于内容创作本身，而不是繁琐的上传步骤。

如果你是第一次使用 PicGo，建议从 [快速开始](https://docs.picgo.app/zh/gui/guide/getting-started) 开始。

遇到问题也可以看看 [FAQ](https://github.com/Molunerfinn/PicGo/blob/dev/FAQ.md) 以及被关闭的 [issues](https://github.com/Molunerfinn/PicGo/issues?q=is%3Aissue+is%3Aclosed)。

---

### 特色功能

#### ⚡️ 无缝写作流

- **自动复制链接**：上传成功后，链接会自动复制到你的剪贴板。
- **格式随心定义**：支持 Markdown、HTML、URL、自定义等多种格式，粘贴即用。
- **零上下文切换**：无需切换窗口。在你常用的编辑器里直接粘贴图片，让 PicGo 在后台完成上传。

  - 通过原生支持或社区插件开启该工作流： [Obsidian](https://obsidian.md/) / [VS Code](https://code.visualstudio.com/) / [Typora](https://typora.io/) / [Neovim](https://neovim.io/) / [MarkText](https://marktext.me/) / [SiYuan](https://b3log.org/siyuan/en/) / 更多……

#### 🚀 极速上传体验

- **多维上传方式**：支持拖拽图片、剪贴板粘贴、快捷键上传，甚至在 macOS/Windows 上支持右键菜单直接上传。
- **全局快捷键**​：默认 `Command+Shift+P`​ (macOS) / `Ctrl+Shift+P` (Windows/Linux) 即可唤起上传，无需离开当前窗口。快捷键可自定义。

#### 🧩 强大的插件生态

- **高度可扩展**：已有插件支持 AWS S3、Cloudflare R2、MinIO 等第三方图床。
- **更多可能**：图片压缩、水印、重命名、Markdown 图片迁移等功能插件。

  - 探索更多插件：[Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo)

#### 🛠 开发者友好

- **HTTP API**：支持通过 HTTP 请求 和 CLI 调用 PicGo 上传，方便与其他工具集成。
- **开源透明**：代码完全开源，安全可靠。
- **丰富的文档**​：插件开发请参考 [PicGo-Core 文档](https://docs.picgo.app/zh/core/)。

> 更多功能等你自己去发现，开发进度可以查看 [Projects](https://github.com/Molunerfinn/PicGo/projects)。

### 下载安装

|下载源|地址/安装方式|平台|备注|
| ----------------| ---------------| ------------| ----------------------------|
|GitHub Release|[https://github.com/Molunerfinn/PicGo/releases](https://github.com/Molunerfinn/PicGo/releases)|All|国内下载速度可能会慢|
|[山东大学镜像站](https://mirrors.sdu.edu.cn/)|[https://mirrors.sdu.edu.cn/github-release/Molunerfinn_PicGo](https://mirrors.sdu.edu.cn/github-release/Molunerfinn_PicGo)|All|感谢 [山东大学镜像站](https://mirrors.sdu.edu.cn/) 提供的镜像支持|
|[Scoop](https://scoop.sh/)|`scoop bucket add helbing https://github.com/helbing/scoop-bucket`​ & `scoop install picgo`|Windows|感谢 @helbing 的贡献|
|[Chocolatey](https://chocolatey.org/)|`choco install picgo`|Windows|感谢 @iYato 的贡献|
|[Homebrew](https://brew.sh/)|`brew install picgo --cask`|macOS|感谢 @womeimingzi11 的贡献|
|[AUR](https://aur.archlinux.org/packages/yay)|`yay -S picgo-appimage`|Arch-Linux|感谢 @houbaron 的贡献|

### 应用截图

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/picgo-2.0.gif)

![picgo-menubar](https://user-images.githubusercontent.com/12621342/34242310-b5056510-e655-11e7-8568-60ffd4f71910.gif)

---

### 配置手册

#### 基本操作预览

![2017-12-09 00 13 05-min](https://pics.molunerfinn.com/doc/34242857-d177930a-e658-11e7-9688-7405851dd5e5.gif)

PS: 如何打开本窗口，请参考[「快速入门」](https://docs.picgo.app/zh/gui/guide/getting-started#%E4%B8%BB%E7%AA%97%E5%8F%A3%E4%B8%8A%E4%BC%A0) 一章。

### 上传区

上传区支持拖拽上传或者点击区域打开文件夹上传。还包括支持剪贴板图片上传、通过URL上传等功能。

![](https://pics.molunerfinn.com/doc/picgo-2.0.gif)

#### 拖拽网页图片上传 2.3.0+

2.3.0版本开始，你可以通过直接拖拽网页图片至上传区域进行上传。它的原理其实就是用后面的「通过URL上传」这个功能实现的。

#### 通过URL上传 2.3.0+

2.3.0 版本开始，你可以通过图片 URL 来上传图片。可以用于将其他地址的图片上传至你自己的图床中。

![](https://pics.molunerfinn.com/doc/20260112213512963.png)

##### 批量 URL 上传 2.4.3+

从 `2.4.3`​ 开始，URL 上传支持一次输入多条 URL（​**一行一个 URL**）：

- 支持直接粘贴多行 URL，空行会被忽略。
- 会自动去重（保留第一次出现的顺序）。
- 非 `http(s)`​ 的行会被跳过，并提示“已跳过 N 条非法 URL”，详细内容会写入日志（`picgo.log`）方便排查。
- 当一次上传超过 10 条 URL 时会弹出确认提示；取消后会回到输入框并保留原内容。

##### URL 输入框的小技巧 2.4.3+

- 点击 URL 按钮后，PicGo 会尝试从剪贴板文本中提取 `http(s)` URL，并自动填充到输入框（不会自动开始上传，需要你确认）。
- 该输入框为多行文本框，可手动拖拽调整高度（最大高度 240px）。

##### 拖拽 URL 上传 2.4.3+

除了在输入框里粘贴外，也可以把包含 URL 的文本（或 `text/uri-list`）直接拖拽到上传区，PicGo 会按行解析并上传有效 URL。

##### 全格式上传 2.4.0+

从 `2.4.0` 版本开始，PicGo 支持「全格式上传」功能。你可以拖动非图片文件上传了。

### 全局 URL 重写 2.4.3+

从 `2.4.3` 开始，PicGo 提供了「全局 URL 重写」的图形化配置页面，用来在图片上传完成后，对生成的 URL 进行统一改写（例如：替换域名、切换 http/https、调整路径等）。

进入方式：

1. 打开 PicGo 设置页
2. 点击「URL 重写」

![](https://pics.molunerfinn.com/doc/20260112213743681.png)

#### 规则说明

每条规则包含：

- **匹配（match）** ​：JavaScript `RegExp`​ 正则（不需要写 `/.../`），用于匹配 URL。
- **替换（replace）** ​：替换后的内容，支持 `$1`​、`$2`... 捕获组。
- **标志（flags）** ​：`g`​（全局替换）与 `i`（忽略大小写）。
- **启用**：关闭后规则不生效。
- **顺序**​：规则按顺序匹配，​**仅第一条命中的启用规则生效**（first match wins）。

#### 预览

在页面底部可以输入一个 URL 进行预览，快速确认：

- 是否命中某条规则
- 重写后的输出 URL

![](https://pics.molunerfinn.com/doc/20260112213811627.png)

#### 常见例子

#### 例 1：替换域名（保持路径不变）

```
match: https://old.example.com/
replace: https://new.example.com/
```

#### 例 2：强制 https

```
match: ^http://
replace: https://
```

##### 例 3：把 GitHub 链接换成 jsDelivr 链接

![](https://pics.molunerfinn.com/doc/20260112214001033.png)

```
match: ^https://raw.githubusercontent.com/([^/]+)/([^/]+)/([^/]+)/(.*)$
replace: https://cdn.jsdelivr.net/gh/$1/$2/$3/$4
```

更详细的使用说明，参考 PicGo-Core 的[文档](https://docs.picgo.app/zh/core/guide/config#settings)。

### 相册区

支持查看你上传成功的所有图片。点击图片可以预览。点击图片下面的图标可以复制链接或者删除图片（只是删除本地数据，使其不在相册区里出现）

#### 编辑相册的图片信息 1.5.0+

有些时候可能上传的图片的url事后需要更改，比如修改http到https，比如加上一些操作后缀（例：七牛图床支持的`?imgslim`）等等。PicGo本次的更新也让你能够更方便地管理你的图片库。

![](https://pics.molunerfinn.com/doc/picgo_edit_info.gif)

#### 选择复制的链接格式 2.0.0+

之前的版本只能在上传区选择复制图片URL的链接格式，这样在相册区就不能很方便地选择复制的链接格式。2.0版本之后改进了这个用户体验，可以在相册区直接选择复制的连接格式了：

![](https://pics.molunerfinn.com/doc/50515502-17d07400-0ae0-11e9-80b9-c38f25b64922.png)

#### 全选以及shift多选支持 2.3.0+

2.3.0版本开始，相册操作区支持「全选」操作

![](https://pics.molunerfinn.com/doc/202108282136783.png)

同时，也支持简单的 `shift` 键跨图片多选。

#### 批量重写图片 URL 2.4.3+

从 `2.4.3` 版本开始，PicGo 支持在相册里对已上传图片的 URL 进行批量重写（不仅仅是修改 Host，而是可以按规则重写整条链接）。

使用方法：

1. 在相册区勾选需要处理的图片（可先用图床筛选缩小范围）
2. 在相册操作栏点击「更多」（…）按钮
3. 选择「重写选中图片 URL」

随后会弹出配置弹窗，你可以：

- 勾选 ​**应用全局 URL 重写规则**：使用你在「全局 URL 重写」页面配置的规则（会显示全局规则数量）。
- （可选）填写一条​**临时规则**​：`匹配`​ + `替换`​（支持正则与 `$1` 捕获组），临时规则优先级高于全局规则。

  - `g`：全局替换
  - `i`：忽略大小写

如果你填写了临时规则，确认后 PicGo 会询问是否将该临时规则写入全局规则列表：

- 「应用并写入」：应用到本次选中的相册图片，并把该规则保存到全局规则中
- 「仅应用」：只对本次选中的图片生效，不写入全局规则
- 「取消」：取消本次操作

操作完成后，PicGo 会提示成功/失败的数量；如果没有任何 URL 被修改，也会给出提示。

注意

- 建议先在「全局 URL 重写」页面使用“预览”确认规则无误，再批量应用到相册，避免误改。
- 如果重写结果为空（空字符串），该条会被跳过。

![](https://pics.molunerfinn.com/doc/20260112213624505.png)

### 图床区

#### GitHub图床

```
{
  "repo": "", // 仓库名，格式是username/reponame
  "token": "", // github token
  "path": "", // 自定义存储路径，比如img/
  "customUrl": "", // 自定义域名，注意要加http://或者https://
  "branch": "" // 分支名，默认是main
}
```

**1.**  首先你得有一个GitHub账号。注册GitHub就不用我多言。

**2.**  新建一个仓库

![](https://pics.molunerfinn.com/doc/create_new_repo.png)

记下你取的仓库名。

**3.**  生成一个token用于PicGo操作你的仓库：

访问：[https://github.com/settings/tokens](https://github.com/settings/tokens)

然后点击`Generate new token`。

![](https://pics.molunerfinn.com/doc/generate_new_token.png)

把repo的勾打上即可。然后翻到页面最底部，点击`Generate token`的绿色按钮生成token。

![](https://pics.molunerfinn.com/doc/20180508210435.png)

\*\*注意：\*\*这个token生成后只会显示一次！你要把这个token复制一下存到其他地方以备以后要用。

![](https://pics.molunerfinn.com/doc/copy_token.png)

**4.**  配置PicGo

\*\*注意：\*\*仓库名的格式是`用户名/仓库`​，比如我创建了一个叫做`person-picture-bed`​的仓库，在PicGo里我要设定的仓库名就是`RaycornM/person-picture-bed`​。一般我们选择`main`​分支即可。然后记得点击确定以生效，然后可以点击`设为默认图床`来确保上传的图床是GitHub。

> [!NOTE] ✏️ 附加：
> 储存路径可以按你仓库具体存放路径填写，比如说我专门创建了一个`img`​文件夹来存放图片，在设定存储路径这里就填一个文件夹的相对路径`img/`；
>
> GitHub的链接国内网络有概率无法打开，就可能造成看不到图片的情况，如果你有可以加速github链接的代理链接，可以在设定自定义域名这里添加代理链接，但是代理链接一定要接着github的raw链接，如`https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main`​，因为上传图片已经设置了存储路径，所以会在链接后面自动生成`/img/图片.jpg`，无需再在自定义域名里添加存储路径。

‍

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main//img/9f59664a-9dc6-4d20-aaba-2b5b65f989ff.png)

至此配置完毕，已经可以使用了。当你上传的时候，你会发现你的仓库里也会增加新的图片了：

![](https://pics.molunerfinn.com/doc/success.png)
