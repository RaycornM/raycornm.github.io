---
title: 'AutoCAD疑难杂症与设置'
description: '记录使用CAD遇到的问题和一些基础设置'
pubDate: 'Nov 17 2025'
heroImage: 'https://damassets.autodesk.net/content/dam/autodesk/www/products/autocad/fy26/features/images/key-features-of-autocad-2026-thumb-1920x1080.jpg'
---

> 记录使用CAD遇到的问题和一些基础设置

- 更新时间2025.11.17

## 一、CAD保存、另存为时，不出现对话框，出现路径

![image](assets/image-20251117165659-8ygu85p.png)

输入命令“[FILEDIA](https://zhida.zhihu.com/search?content_id=173772473&content_type=Article&match_order=1&q=FILEDIA&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NjM1NDI0NDEsInEiOiJGSUxFRElBIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6MTczNzcyNDczLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.wCiH2zicxAWFaBPbwS_SLSOgweqRX4n32u-6ub5Zxw8&zhida_source=entity) ”将其值改为“1”

## 二、修复**AutoCAD图纸损坏**

1. **使用RECOVER命令**：在AutoCAD中输入RECOVER命令，选择要恢复的文件，系统会自动进行修复。

    ![image](assets/image-20251117165920-09hw4k6.png)
2. **使用修复工具**：在“文件”菜单下找到“修复”选项，尝试修复已损坏的文件。
3. **采用RECOVERALL命令进行修复**：RECOVERALL与RECOVER类似，只不过它还将对所有嵌套的外部参照进行连同查找和修复，修复后的结果将显示在"图形修复日志"窗口中。
4. **插入块的方式**：如果文件无法恢复，可以尝试将损坏的文件作为块插入到新的图纸中。点击插入"块"，找到"其他图形中的块"，弹出如图所示对话框，找到需要修复文件，打开后看能否插入进来，如果可以，将图形插入后保存一下就可以了。

    ![image](assets/image-20251117170205-mz7lov0.png)
5. [](https://gofarlic.com/techArticleDetail?noticeId=340034)​**从备份中恢复**：如果有备份文件，可以直接从备份中恢复图纸。

## 三、按住**鼠标中键弹出菜单而不是平移**

调下系统变量mbuttonpan即可

初始值： 1

0 支持菜单 (.mnu) 文件定义的动作

1 当按住并拖动按钮或滑轮时，支持平移操作

## 四、**图形里的圆不圆了**

1.点击左上角菜单栏视图选项，点击重生成或者全部重生成。

2.输入命令：RE

## 五、**如何减少文件大小**

1.在图形完稿后,执行清理(PURGE)命令，清理掉多余的数据，如无用的块、没有实体的图层,未用的线型、字体、尺寸样式等，可以有效减少文件大小。一般彻底清理需要PURGE二到三次。

2.使用用WBLOCK命令：把需要传送的图形用WBLOCK命令以块的方式产生新的图形文件，把新生成的图形文件作为传送或存档用。

输入命令: wblock

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117171302104.png)

定义的名字: （直接回车）

给一个基点:（任选一点）

选择物体: （选择完毕后回车）

这样就在你指定的文件夹中生成了一个新的图形文件。

## 六、**如何将自动保存的图形复原**

AutoCAD将自动保存的图形存放到AUTO.SV\$或AUTO?.SV\$文件中，找到该文件将其改名为图形文件即可在AutoCAD中打开。

一般该文件存放在WINDOWS的临时目录，如C:\\\\WINDOWS\\\\TEMP。

补充：

默认状态下\*.sv\$文件的存放位置：win9x：一般该文件存放在WINDOWS的临时目录，如C:\\\\WINDOWS\\\\TEMP；winnt/2000/xp：

开始菜单-\>运行，输入%temp%，(有可能%tmp%也行)，确定

## 七、**特殊符号的输入**

“Ф”控制码％％C

“±”控制码％％P

“°”控制码％％D

或者：

1.T文字命令，拖出一个文本框

2.在对话框中右键——符号——会出现一些选项

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117172303847.png)

## 八、**将右键设置为确定和重复命令**

点击菜单栏选择选项

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117172858499.png)

选项——用户系统配置——绘图区域中使用快捷菜单

可以直接取消勾选此选项，可以对右键的动作进行自定义，进入自定义右键对话框后，可以勾选所有和重复上一个命令相关的选项。

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117173400527.png)

## 九、高版本CAD设置经典模式（如2007版本界面）

![image](assets/image-20251117173947-hemxxwq.png)

1.运行CAD软件后，找到工具栏旁边的【倒三角】，并点击它，然后点击【显示菜单栏】。

![image](assets/image-20251117173646-n9ozv7l.png)

2.在菜单栏中，找到【工具】选项卡。

![image](assets/image-20251117173701-resc63m.png)

3.点击【工具】选项卡后，在弹出的窗口里依次点击【选项板】和【功能区】。

![image](assets/image-20251117173717-k8zrnyj.png)

4.在菜单栏里，点击【工具】选项卡。

![](https://pic3.zhimg.com/v2-cce085cf45cc98879ac5fc950ab7dc78_r.jpg)

5.点击【工具栏】【AutoCAD】，然后把【图层】、【标准】、【样式】、【修改】、【特性】、【绘图】、【绘图次序】都勾选上。

![](https://picx.zhimg.com/v2-86cb28a554927266191a4855cd3f1217_r.jpg)

6、点击【齿轮】图标，以打开【设置】选项，然后点击【将当前工作空间另存为】，把刚才创建的工作空间保存好，方便以后可以直接调用。

![image](assets/image-20251117173828-jolhhwx.png)

![image](assets/image-20251117173817-krt11z5.png)

## 十、对象捕捉设置

点击右下角一大一小正方形图标右侧倒三角，内容全部勾选

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117174420585.png)

## 十一、设置背景颜色

点击菜单栏选择选项

选项——显示——窗口元素——颜色按钮

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117174747238.png)

![image](assets/image-20251117174710-or2nrj3.png)

## 十二、十字光标大小调整

选项——显示——十字光标大小

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main//img/20251117175451354.png)

十三、拾取框和捕捉标记设置

1.捕捉标记：选项——绘图——自动捕捉标记大小

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117183630716.png)

2.拾取框：选项——选择集——拾取框和夹点尺寸

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117183757594.png)

## 十四、设置默认保存为cad2007

选项——打开和保存——文件保存

另存为设置成AutoCAD 2007/LT2007 图形

并勾选自动保存

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117183256083.png)

## 十五、捕捉设置

1.菜单栏找到工具——绘图设置——捕捉和栅格

启用栅格和启用捕捉全部取消勾选

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117184510336.png)

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117184616332.png)

2.CAD右下角找到模型旁边两个图标：

![](https://gh-proxy.org/https://github.com/RaycornM/person-picture-bed/blob/main/img/20251117184713428.png)

开启捕捉和栅格的状态是蓝色的，点击关闭，全部关闭会变成如上图所示。
