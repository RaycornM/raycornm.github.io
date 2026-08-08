---
title: '配置与开始WordPress'
description: 'wordpress部署配置'
pubDate: 'Mar 07 2025'
tags: [WordPress, 建站, 教程]
heroImage: 'https://gh-proxy.com/https://github.com/RaycornM/person-picture-bed/blob/main/img/image-1024x493.png'
---

### 配置管理员

由于是通过腾讯云服务器模板直接安装的WordPress，服务器本身已经提供了管理员登录的链接，可以直接进入到管理员的登录页面。

初次登录WordPress管理员需要在实例中执行以下命令获取管理员密码

```
cat ~lighthouse/credentials.txt
```

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-1024x493.png)

密码输入后会进行确认管理员邮箱，通过模板直接安装的WordPress的管理员邮箱默认为[admin@wordpress.com](mailto:admin@wordpress.com)，需要点击更新更换为你本人或公司网站管理员的邮箱。

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-1-1024x493.png)

点击更新会自动跳转到 **“设置”»“常规”** 页面，下拉找到”管理员邮箱地址“

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/20251014143419423.png)

修改完成下拉到页面底端保存，但是在验证新电子邮件之前，它不会更改管理员电子邮件地址。

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/20251014143452203.png)

验证邮件地址后，WordPress 将开始向新地址发送管理相关邮件。

以上是正常情况，由于服务器默认安装好的WordPress管理默认邮箱为[admin@wordpress.com](mailto:admin@wordpress.com)，接收不到验证电子邮箱的邮件，则需要通过插件来跳过验证直接修改管理邮箱。

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image.png)

左侧菜单栏选择安装新的插件，搜索：

```
Change Admin Email
```

安装并启用插件，之后回到 **“设置”»“常规”** 页面。转到“管理员邮箱地址”选项并输入要使用的新电子邮件地址，单击“保存更改”按钮来存储更改。

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-1.png)

该插件将立即更改管理地址而不进行验证。它还可以发送一封测试电子邮件到新的管理员电子邮件地址。

接下来，如果还想更改管理员用户帐户的电子邮件地址，如果想更改的邮箱是QQ邮箱或者别的国内邮箱，有可能有接收不到验证邮件的情况。

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-2.png)

如果实在接收不到验证邮件，有数据库权限的管理员可以通过数据库直接修改邮箱。

这里由宝塔面板演示：

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-3.png)

登录宝塔面板，选择“**数据库” **​ ****»****​ ** phpMyAdmin**，通过面板访问

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-4.png)

数据库密码同样在实例中执行以下命令获取：

```
cat ~lighthouse/credentials.txt
```

输入数据库用户名和密码

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-5.png)

进入到phpMyAdmin主页，找到wordpress的库

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-6.png)

找到wp\_users表，修改user\_email并点击执行，回到wordpress管理员页面，转到**“用户”  **»**  ”个人资料“ **，可以看到**”邮箱 （必填）“**这一栏已经修改成新的邮件地址了。

---

### 开始使用WordPress

#### 一、编辑器界面

##### 1\. 顶部工具栏

-  **「三横杠」菜单**：列表显示、大纲、快速访问最近使用的块、样式预设、键盘快捷键
-  **「三点」菜单**：隐藏功能（如拼写检查、字数统计、代码编辑器）
- **加号按钮**：添加区块、区块样板、媒体
- **键盘快捷键**：`Ctrl/Cmd + B` 加粗，`Ctrl/Cmd + K` 插入链接，`Ctrl/Cmd + Shift + [/]` 调整标题层级

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-7.png)

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-8.png)

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-9.png)

##### 2\. 左侧块库

-  **「最近使用」标签**：快速调用常用块（如图片、段落、标题）
-  **「设计工具」标签**：访问分隔线、按钮、折叠面板等高级元素
-  **「嵌入」标签**：支持 YouTube、Twitter、Google Maps 等 20 + 平台嵌入

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-10.png)

##### 3\. 右侧设置面板

-  **「块属性」** ：调整对齐方式、宽度（全宽 / 宽幅 / 默认）
-  **「样式」** ：设置字体大小、颜色、背景色、边框
-  **「高级」** ：添加 CSS 类、自定义 ID、设置动画效果

![](https://cdn.jsdelivr.net/gh/RaycornM/person-picture-bed@main/img/image-11.png)

#### 二、基础块的高级用法

##### 1\. 段落块

- **换行**：`Shift + 回车` 强制换行（不生成新段落）
- **水平线**：输入`---` 并回车，快速插入分隔线
- **代码块**：输入 \`\`\`\` 包裹代码，自动高亮显示

##### 2\. 图片块

- **懒加载**：开启「延迟加载」提升页面速度（在图片设置中勾选）
- **图片库**：插入多张图片后，点击「切换为图片库」生成九宫格布局
- **热点链接**：使用「图像映射」功能为图片不同区域添加链接（需安装插件）

##### 3\. 标题块

- **固定标题**：在「高级」设置中开启「粘性定位」，让标题随滚动固定
- **标题锚点**：自定义 ID 后，可通过`#标题ID`直接跳转（适合长文章目录）

#### 三、进阶布局技巧

##### 1\. 列布局

- **创建列**：选中多个块 →「转换为列」（支持 1-4 列）
- **调整列宽**：点击列之间的「调整宽度」按钮，或直接拖拽分隔线
- **响应式设置**：在右侧「设备预览」中调整手机 / 平板视图布局

##### 2\. 容器块

- **背景渐变**：在「样式」→「背景颜色」中选择渐变模式
- **阴影效果**：在「高级」→「额外 CSS 类」输入`has-shadow`
- **圆角边框**：添加自定义 CSS `border-radius: 15px;`

##### 3\. 折叠面板

- **多面板组合**：连续添加多个折叠面板，形成可展开的问答列表
- **默认展开**：在「高级」设置中勾选「初始状态为展开」
- **图标美化**：使用「插件→Simple Icons」添加箭头图标

#### 四、高级功能

##### 1\. 模板与模式

- **保存模板**：选中多个块 →「另存为模式」→ 下次直接调用
- **全局模板**：在「主题→模板」中创建可重复使用的页眉 / 页脚
- **官方模板库**：点击「+」→「模板库」搜索「联系表单」「产品展示」等模板

##### 2\. 动态内容

- **作者信息**：插入「作者姓名」「作者头像」块，自动调用 WordPress 用户数据
- **当前日期**：插入「当前日期」块，自动更新显示发布时间
- **分类标签**：使用「分类列表」块动态显示文章分类

##### 3\. 表单与互动

- **投票功能**：使用「投票」块创建单选 / 多选投票（需安装 Jetpack 插件）
- **PDF 嵌入**：插入「文件」块上传 PDF，支持在线预览和下载
- **评论区**：在文章末尾添加「评论」块，自动加载 WordPress 评论系统

#### 五、性能优化与安全

##### 1\. 图片优化

- **WebP 格式**：在「设置→媒体」中开启自动转换为 WebP 格式
- **压缩工具**：使用「Smush」插件批量压缩图片，减少加载时间
- **懒加载**：在「设置→媒体」中开启「延迟加载」功能

##### 2\. SEO 设置

- **元描述**：在 Yoast SEO 插件中填写文章摘要
- **焦点关键词**：设置后检查内容是否符合 SEO 建议
- **结构化数据**：开启 Yoast 的 Schema 标记，提升搜索展示效果

##### 3\. 安全防护

- **禁止代码执行**：在「设置→安全」中关闭「允许 HTML」选项
- **内容审核**：使用「修订历史」功能追踪文章修改记录
- **限制嵌入**：在「设置→嵌入」中禁用危险平台（如未知视频网站）

#### 六、实用插件

##### 1\. 增强编辑器功能

- **Elementor**：提供数百个预制模板和拖放式设计
- **Advanced Custom Fields**：创建自定义字段（如作者简介、产品参数）
- **Classic Editor**：保留旧版编辑器界面（适合习惯传统模式的用户）

##### 2\. 视觉效果优化

- **WPForms**：创建美观的联系表单和在线调查
- **Envira Gallery**：制作响应式图片库和相册
- **Animate It**：为块添加 CSS 动画效果（如淡入、滑动）

##### 3\. 工作流程提升

- **Autosave Plus**：提高自动保存频率（默认每 60 秒）
- **Duplicate Post**：快速复制文章 / 页面并修改
- **TablePress**：创建复杂表格和图表

---

### 如何利用WordPress的插件来扩展可视化编辑页面的功能？

#### 一、页面构建器类插件（拖拽式设计革命）

##### 1\. Elementor（免费 + Pro）

- **核心功能**：完全替代 Gutenberg 编辑器，提供可视化拖拽界面
- **特色功能**：

  - 预制模板库（覆盖电商、博客、作品集等 1000 + 模板）
  - 响应式断点设计（实时预览手机 / 平板 / PC 端效果）
  - 动态内容集成（自动调用文章标题、分类、作者信息）
- **实战案例**：用 Elementor 设计「产品详情页」时，可直接从左侧面板拖放「价格标签」「库存状态」「购买按钮」等模块

##### 2\. WP Bakery Page Builder（原 Visual Composer）

- **优势**：与 WordPress 原生编辑器兼容性强
- **必学技巧**：

  - 使用「行（Row）」和「列（Column）」搭建复杂网格布局
  - 通过「短代码」嵌入第三方插件内容（如 Slider Revolution）
  - 配合「模板管理器」快速复用设计模块

#### 二、增强块功能类插件

##### 1\. Kadence Blocks（免费 + Pro）

- **核心价值**：扩展 Gutenberg 原生块的设计能力
- **实用功能**：

  - 高级标题块（支持图标 + 动态边框）
  - 可折叠的手风琴块（适合常见问题解答）
  - 动态排版控制（首字下沉、文本高光）

##### 2\. GenerateBlocks（免费 + Pro）

- **技术亮点**：轻量级代码架构（不影响页面加载速度）
- **推荐用法**：

  - 创建可重复使用的「作者简介」模板块
  - 设计带悬停动画的「服务卡片」组合
  - 通过「容器块」实现复杂背景图案

#### 三、动态内容管理类插件

##### 1\. Advanced Custom Fields（ACF）

- **应用场景**：添加非结构化数据（如电影评分、食谱配料）
- **操作指南**：

  1. 在后台创建自定义字段组（如「书籍信息」包含 ISBN、出版社、作者）
  2. 在可视化编辑器中插入「ACF 字段」块
  3. 前端自动显示对应内容（支持条件逻辑）

##### 2\. Pods Framework（免费 + Pro）

- **进阶功能**：创建自定义文章类型（如「电影库」「产品目录」）
- **技术实现**：

  - 设计关联字段（如电影分类→导演→演员）
  - 通过「Pods 短代码」在页面展示数据

#### 四、表单与互动增强类

##### 1\. WPForms（免费 + Pro）

- **推荐表单类型**：

  - 联系表单（带文件上传）
  - 在线调查（支持逻辑跳转）
  - 订阅表单（集成 Mailchimp）
- **可视化设计技巧**：使用「字段容器」块组合多行输入框

##### 2\. Ninja Forms（免费 + Pro）

- **特色功能**：
  - 条件逻辑触发（如选择「其他」时显示额外字段）
  - 支付集成（PayPal、Stripe）
  - 数据可视化报表

#### 五、设计元素扩展类

##### 1\. Essential Addons for Elementor（免费 + Pro）

- **包含 100 + 自定义块**：
  - 动态计数器（显示网站访问量）
  - 社交媒体墙（自动抓取 Instagram 帖子）
  - 时间轴（按时间顺序展示项目历程）

##### 2\. Ultimate Addons for Gutenberg（免费 + Pro）

- **推荐组件**：
  - 带视差效果的背景视频
  - 可排序的投资组合网格
  - 带进度条的技能展示

#### 六、性能优化类插件

##### 1\. WP Rocket（付费）

- **对编辑器的优化**：
  - 延迟加载非关键资源
  - 自动合并 CSS/JS 文件
  - 浏览器缓存设置

##### 2\. Imagify（免费 + Pro）

- **图片处理流程**：
  1. 直接在媒体库压缩图片
  2. 自动生成 WebP 格式
  3. 批量优化历史图片

#### 七、常见插件组合方案

|使用场景|推荐插件组合|实现效果|
| ----------| --------------------------------------| --------------------------------|
|企业官网|Elementor + Essential Addons + WPForms|响应式设计 + 在线咨询 + 数据收集|
|个人博客|Kadence Blocks + ACF + WP Rocket|美观排版 + 自定义字段 + 快速加载|
|电商产品页|WP Bakery + WooCommerce + Imagify|复杂布局 + 商品展示 + 图片优化|
