---
title: '永进 MV66A 无刀库CNC操作记录'
description: '记录使用CNC过程中的一些学习和需要注意的内容'
pubDate: 'Oct 26 2026'
tags: [AutoCAD, Solidworks, UG, CNC, 教程]
heroImage: 'https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026175153320.png'
---

### 一、 设置原点

模式转到***<u>手动指令</u>*** → ***<u>offset sitting</u>*** 按钮 → ***<u>setting</u>***

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026125701363.png)

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026130041972.png)

找到 ***<u>参数写入</u>*** 默认为***<u>0</u>***，修改为***<u>1</u>***

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/57392ef79a40cbf51ad79a37e5f59fe1.jpg)

模式保持手动指令，找到system按钮

选择system按钮并搜索代码1815，此时跳转页面应该会如下图显示1815底下还有xyz的值

APC、APZ应该为1，OPT应该为0，此时为已经设置好原点的状态

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026140442543.png)

如果原点有问题，如电池没电造成原点丢失，或者想加工程序发现某个轴超行程，需要修改原点

则将APZ的值改为0，只需要修改x轴的点则只需要修改x的APZ值为0，其余不需要动，只需要修改y轴的点同理。APC值保持为1，APZ值为0，关闭机器重启，重启完成后此时可以操作手轮移动加工平台，此时允许平台移动至当前原点以外的位置直至到达机器最大限位撞机，如撞机则需要往内移动一部分再设定原点，加工工件时才没有撞机风险；如APC值为0则只能在当前设定的原点的限位内移动。

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026141619093.png)

将xyz轴移动至想要设定为原点的位置之后将APZ值修改回1，关机重启，进入系统后原点设置完成

> [!TIP]
> 不要忘记把 ***<u>参数写入</u>*** 修改回0

‍

### 二、启动主轴

工件分中需要用分中棒来找坐标，需要启动主轴旋转，一般没有程序主轴无法启动，需要自己手动输入一段程序来启动主轴

格式为“S需要的转速 M3 ；”

> [!TIP]
> CNC加工中的基本操作四是控制主轴。使用M3，M4和M5命令以g代码进行控制。
>
> M03将启动主轴顺时针旋转。
>
> M04将启动主轴逆时针旋转。
>
> 这两个命令以S字分别确定的速度打开主轴。用于设置主轴打开时的转速。无论方向如何，M05都会停止主轴。

要启动主轴旋转，跟设置原点一样，需要将模式设置为***<u>手动指令</u>***

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026125701363.png)

此时点击***<u>PROG</u>***按钮会默认进入MDI界面，没有进入也可以手动选择MDI所对应的屏幕下方按钮进入界面。

如图界面中显示：

O0000

%

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026153658035.png)

不需要移动光标，直接在下方键盘按格式输入，也无需空格。

如想要主轴转速1000转，则在键盘输入：

```gcode
S1000M3；
```

该机器法兰克系统的 **<u>“；”</u>**  键为EOB

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026154331911.png)

输入完成后点击 ***<u>INSERT</u>*** 按钮输入，确认环境安全后按绿色启动按钮主轴就会正常启动了。

‍

### 三、分中与对刀

将工件正确摆放在加工工台上并夹上分中棒启动主轴后，在启动程序前需要对工件进行分中以及对加工刀具到工件的位置校准。

跟前面同样，切换 ***<u>手动指令</u>*** 然后按下 ***<u>POS</u>*** 按钮，选择相对位置

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/f71d2fec6c3098a57569f07186cb459b.jpg)

进入相对位置界面后，选择  ***<u>(操作)</u>***  按钮，屏幕底部的选项栏会出现新的选择

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/2019ca7d24a978b746360741eac734ae.jpg)

将坐标摇到你认为的中心，在键盘分别输入x、y、z进行 ***<u>归零</u>*** 操作

具体为：

```gcode
键盘输入X → 选择起源按钮；
键盘输入Y → 选择起源按钮；
键盘输入Z → 选择起源按钮；
```

归零完成后开始进行 ***<u>分中</u>*** 操作。

按下 ***<u>offset sitting</u>*** 按钮，进入设定页面，选择 **<u>*坐标系*</u>** 

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/3fe03658ca011a71e645cb8a1fbe0a0d.jpg)

通过键盘的上下左右键将黄色光标移动到下方01(G54)的X内

回到POS的界面，分中方式分为两面分中和单边分中：

#### 1、两面分中

1. X轴

   将分中棒分别移动到工件左右两边进行碰数，记录下左右两边对应坐标，计算得出两个坐标的中间值，然后将主轴的X坐标摇到计算得出的中间坐标，回到 ***<u>offset sitting</u>*** 的坐标系设置，选择  ***<u>(操作)</u>***  按钮，光标移动到G54的X位置上的时候点击 ***<u>测量</u>*** 按钮，X轴分中完成

   ```gcode
   1.模式旋钮 → 手轮
   2.主轴装寻边器
   3.MDI 输入 S500 M03 → 循环启动（寻边器转起来）
   4.手轮摇到工件左侧面，寻边器慢慢靠上去
   5.寻边器同心旋转 → 突然跳动的瞬间 → 立即停住
   6.按 POS 键查看机械坐标，记住 X 值（例：X左 = -350.000）
   7.抬 Z 轴，移到工件右侧面
   8.寻边器靠上右侧面，记住 X 值（例：X右 = -250.000）
   9.计算 X中心 = (X左 + X右) ÷ 2 = (-350 + -250) ÷ 2 = -300.000
   10.手轮摇到 X = -300.000
   ```

   ![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/ebeab99e16a096064602bdd2e52057b9.jpg)
2. Y轴

   将分中棒分别移动到工件前后两边进行碰数，记录下前后两边对应Y轴坐标，计算得出两个坐标的中间值，然后将主轴的Y坐标摇到计算得出的中间坐标，回到 ***<u>offset sitting</u>*** 的坐标系设置，选择  ***<u>(操作)</u>***  按钮，光标移动到G54的Y位置上的时候点击 ***<u>测量</u>*** 按钮，Y轴分中完成

#### 2、单边分中

1. X轴单边

   将分中棒移动到工件左边或者右边单独进行碰数，记录单边X轴坐标，选择后续加工刀具，根据刀具大小向工件内侧移动对应刀具半径的距离，使刀具中心对准测量的工件单边，然后回到 ***<u>offset sitting</u>*** 的坐标系设置，选择  ***<u>(操作)</u>***  按钮，光标移动到G54的X位置上的时候点击 ***<u>测量</u>*** 按钮，X轴单边测量完成，Y轴按照两面分中方法完成分中测量

   ```gcode
   场景：图纸原点在工件左下角，只需找左边和下边。
   1.手轮摇到工件左侧面，寻边器靠上
   2.反应瞬间停住
   3.进入座標系页面，光标到 G54 的 X 行
   4.输入 X0 → (操作) → MEASUR
   5.若寻边器半径 2mm，补偿：输入 X-2. → 按 +INPUT
   6.同样方法处理 Y 轴（下边）
   ```

   ![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/CNC%E5%8D%95%E8%BE%B9%E5%88%86%E4%B8%AD%E5%AF%B9%E5%88%80_X%E8%BD%B4%E6%AD%A3%E8%A7%86%E5%9B%BE.gif)
2. Y轴单边

   将分中棒移动到工件前侧或者后侧单独进行碰数，记录单边Y轴坐标，选择后续加工刀具，根据刀具大小向工件内侧移动对应刀具半径的距离，使刀具中心对准测量的工件单边，然后回到 ***<u>offset sitting</u>*** 的坐标系设置，选择  ***<u>(操作)</u>***  按钮，光标移动到G54的X位置上的时候点击 ***<u>测量</u>*** 按钮，Y轴单边测量完成，X轴按照两面分中方法完成分中测量

   ![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/cnc-single-edge-zero-y-10mm-slow.gif)

#### 3、对刀

***<u>offset sitting</u>*** 的坐标系设置已经设置了00(EXT)的Z轴默认-10mm的距离，相当于对刀时只需要将需要用到的刀具移动到工件正上方10mm的位置，就能完成对刀设置：

进入POS界面，将刀具移动到工件正上方10mm处，记录Z轴坐标，然后回到 ***<u>offset sitting</u>*** 的坐标系设置，选择  ***<u>(操作)</u>***  按钮，光标移动到G54的Z位置上，填入记录的Z轴绝对坐标，或是点击 ***<u>测量</u>*** 按钮，对刀完成

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/ee238e35ec840df4b6c41c097c296ecb.jpg)

‍

### 四、导入加工程序

导入加工程序前确认CNC当前传输模式，文章默认用内存卡进行传输程序 *<u>（有需要调整模式方法会放在导入程序的方法后）</u>*

模式选择 ***<u>纸带执行</u>***

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026170508918.png)

然后点击PROG按钮，进入程序界面

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/dce09f8ffe4c03c332347ffe325bd257.jpg)

点击屏幕右下角加号对应按钮，直到DNC-CD按钮出现并选择，进入到插入的内存卡内部

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026171345846.png)

在下方键盘输入需要导入的程序的编号，如需要A2-2.NC程序则输入2，然后点击屏幕右下角加号对应按钮，直到DNC-ST按钮出现并选择，就能将需要的程序输入进系统内

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/20261026171609495.png)

确认清零分中对刀操作完成后，就可以按绿色启动按钮进行加工，或者是进行空走刀的实验程序

##### 调整程序传输模式

模式转到***<u>手动指令</u>*** → ***<u>offset sitting</u>*** 按钮 → ***<u>setting</u>***

找到 ***<u>I/O频道</u>*** ，将值修改为**4**（内存卡传输）

> [!TIP]
> 电脑传输模式值为0，内存卡传输为4

![](https://gh-proxy.org/https://raw.githubusercontent.com/RaycornM/person-picture-bed/main/img/ca8615597408c43224e93da2b489a432.jpg)

‍

### 五、空走刀（试运行）流程

> **目的**：在不切削的情况下，验证程序轨迹正确、各轴运转正常。  
> **核心原则**：从零风险逐步过渡到全轴运动，三级验证逐级推进。

#### 5.1 准备工作

##### 5.1.1 清理工作台

- 卸掉主轴上的刀具
- 移走工作台上所有工件、夹具、扳手、杂物
- 确认无任何物体会阻挡行程

##### 5.1.2 加载程序

1. 模式旋钮 → **程式编辑**（EDIT）
2. 按 **PROG** 键
3. 输入程序号（如 ​`O0120`​）→ 按  **↓** （光标下翻键）
4. 按 **RESET** 让光标回到程序头部

##### 5.1.3 修改 G54 的 Z 值（防撞，极其重要）

当前机器 G54 的 Z =  **-173.509**，直接空跑会导致 Z 轴冲向工作台。

1. 按 **OFFSET SETTING** 键
2. 进入 **座標系** 页面
3. 光标移到 G54 (01) 的 **Z** 行
4. 输入 ​`0.`​ → 按 **INPUT**
5. 确认 Z 值变为 0.000

> 注意：修改的是 G54 的 Z，**不是** EXT(00) 的 Z。EXT 是全局偏置，会影响 G54~G59 所有坐标。

#### 5.2 第一级验证：机械锁定 + 图形模拟（零风险）

**轴不移动，只在屏幕上看轨迹。**

1. 模式旋钮 → **记忆执行**（MEM）
2. 按 **机械锁定** 键 → 灯亮
3. 按 **GRAPH** 键进入图形显示页面
4. 按绿色循环启动按钮
5. 观察屏幕刀路轨迹是否正确

验证通过后 → 再按 **机械锁定**（灯灭）解除。

> 局限：此方法只能检查程序语法和坐标变化，无法发现实际行程超限。结束后需要重新回零。

#### 5.3 第二级验证：单段空跑

**机床实际移动，但每次只跑一行，随时可控。**

1. 模式旋钮 → **记忆执行**
2. 按 **单节执行** 键 → 灯亮
3. 按 **试件** 键（DRN 空运行）→ 灯亮
4. **快速倍率旋钮拧到 25%**
5. 手放在急停按钮上
6. 按绿色循环启动 → 跑一行 → 自动停止
7. 确认轴移动方向和距离无误
8. 按循环启动 → 跑下一行
9. 重复直到程序跑完或确认前几段无问题

#### 5.4 第三级验证：连续空跑

**全速连续跑完整个程序。**

1. 关闭单节执行（再按一次，灯灭）
2. 试件键保持灯亮
3. 快速倍率旋钮调至 **50%**
4. 按绿色循环启动
5. 全程盯住各轴移动，手不离急停

空跑完成后 → 关闭试件键（灯灭），退出空运行模式。

---
