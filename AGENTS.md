# 个人电子手账 - 需求拆解文档

## 产品概述

- **产品类型**: 个人电子手账应用（大集合式记录工具）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 希望以手账本形式系统化记录人生各维度内容的个人用户（无登录、链接即用）
- **核心价值**: 以可爱治愈的手账本风格，集中管理回忆录、时间胶囊、成长史、欲望清单、心情日记、第一次收藏、生日礼物、生活图鉴、旅行记录等 9 大人生维度，数据本地持久化，任何人拿到链接即可使用全部功能
- **界面语言**: 中文
- **主题偏好**: 浅色（可爱治愈手账本风格）
- **导航模式**: 路径导航
- **导航布局**: Topbar（个人工具类、消费者前台属性，顶部导航 + 首页卡片入口）

---

## 页面结构总览

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 首页总览 | `HomePage.tsx` | `/` | 一级 | 导航 |
| 回忆录与畅想 | `MemoirsPage.tsx` | `/memoirs` | 一级 | 导航 / 首页模块入口 |
| 时间胶囊 | `TimeCapsulePage.tsx` | `/time-capsule` | 一级 | 导航 / 首页模块入口 |
| 成长史 | `GrowthPage.tsx` | `/growth` | 一级 | 导航 / 首页模块入口 |
| 欲望清单 | `DesirePage.tsx` | `/desire` | 一级 | 导航 / 首页模块入口 |
| 心情日记 | `MoodPage.tsx` | `/mood` | 一级 | 导航 / 首页模块入口 |
| 第一次收藏馆 | `FirstsPage.tsx` | `/firsts` | 一级 | 导航 / 首页模块入口 |
| 生日礼物收藏 | `BirthdayPage.tsx` | `/birthday` | 一级 | 导航 / 首页模块入口 |
| 生活图鉴 | `LifeAlbumPage.tsx` | `/life-album` | 一级 | 导航 / 首页模块入口 |
| 旅行记录 | `TravelPage.tsx` | `/travel` | 一级 | 导航 / 首页模块入口 |

> **说明**：9 个模块均为独立任务流（各管一类独立数据），各自成一级页；首页做模块入口聚合 + 最近记录总览。无二级详情页，详情/编辑/删除均以弹窗（Dialog / Drawer）形式在列表页内完成，减少路由层级、保持手账本翻页感。

---

## 页面布局建议

- **布局模式**: 顶部导航 + 卡片流式布局（手账本贴纸/便签感）—— 整体走"手账本翻开"视觉，主内容区用柔和米色/奶油色底 + 圆角卡片 + 胶带/贴纸装饰元素
- **视觉重心**: 内容记录本身（卡片 + 图片 + 文字）—— 9 个模块都是内容型，重阅读与记录，不重复杂操作
- **结果承载区**: 各模块页均为"列表/网格 + 新增按钮 + 编辑/删除弹窗"模式；初始态为空状态插画 + "写下你的第一篇 XX"引导按钮
- **首页布局**: Hero 标题区 + 9 宫格模块入口卡片区 + "最近记录"时间线区（展示各模块最新 3-5 条）

---

## 导航配置

- **导航布局**: Topbar（顶部固定，手账本风格，可爱圆润字体）
- **导航项**（仅一级页面，9 个模块过多时在 Topbar 折叠为"更多"或横向滚动）:

| 导航文字 | 路由 | 图标(可选) |
|---------|------|-----------|
| 首页 | `/` | Home |
| 回忆录 | `/memoirs` | Book |
| 时间胶囊 | `/time-capsule` | Mail |
| 成长史 | `/growth` | TreePine |
| 欲望清单 | `/desire` | Heart |
| 心情日记 | `/mood` | CloudSun |
| 第一次 | `/firsts` | Sparkles |
| 生日礼物 | `/birthday` | Gift |
| 生活图鉴 | `/life-album` | Home |
| 旅行 | `/travel` | Map |

> **注意**：10 个导航项在移动端可能拥挤，设计时需考虑下拉菜单或横向滚动处理。

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 回忆录与畅想记录 | local-persist | localStorage key=`__app_diary_memoirs`，JSON 数组，含人生阶段字段 | 初始 2 条 source='mock' 示例记录 |
| 时间胶囊记录 | local-persist | localStorage key=`__app_diary_timeCapsule`，含写信时间、开启时间、内容、是否已回答字段 | 初始 2 条 source='mock' 示例（1 封已到可开 + 1 封未到密封） |
| 成长史记录 | local-persist | localStorage key=`__app_diary_growth`，含节点时间、标题、内容字段 | 初始 2 条 source='mock' 示例 |
| 欲望清单记录 | local-persist | localStorage key=`__app_diary_desire`，含分类（过去/现在/未来）、内容、是否实现字段 | 初始 3 条 source='mock' 示例（每类 1 条） |
| 心情日记记录 | local-persist | localStorage key=`__app_diary_mood`，含日期、心情标签、内容字段 | 初始 2 条 source='mock' 示例 |
| 第一次收藏记录 | local-persist | localStorage key=`__app_diary_firsts`，含标题、时间、感受、图片数组字段 | 初始 1 条 source='mock' 示例 |
| 生日礼物记录 | local-persist | localStorage key=`__app_diary_birthday` | 初始 1 条 source='mock' 示例 |
| 生活图鉴记录 | local-persist | localStorage key=`__app_diary_lifeAlbum`，含分类（菜谱/房间/书桌）、文字、图片数组字段 | 初始 3 条 source='mock' 示例（每类 1 条） |
| 旅行记录 | local-persist | localStorage key=`__app_diary_travel`，含地点、时间、故事、图片数组字段 | 初始 1 条 source='mock' 示例 |
| 图片上传与存储 | real-file + local-persist | 用户选择本地图片（`<input type="file">` + FileReader 转 dataURL），随对应记录一起存入 localStorage | 无（mock 记录使用占位图 URL） |

> **说明**：所有 9 个模块的核心数据均为 `local-persist`（用户明确要求"本地保存、刷新后仍保留"），mock 仅作为首次访问的示例引导数据，每条 mock 记录带 `source: 'mock'` 字段以便区分。图片采用 dataURL 方式与文本记录一并序列化进 localStorage。

---

## 功能列表

### 首页总览 (`/`)

- **页面目标**: 提供手账本整体概览，快速进入各模块 + 查看最近记录
- **功能点**:
  - **模块入口展示**: 9 个可爱手账风格卡片，每张卡片带图标 + 模块名 + 该模块记录总数，点击跳转对应模块页
  - **最近记录时间线**: 按时间倒序展示所有模块最新记录（取最近 5 条），含模块来源标签、标题摘要、时间，点击跳转对应模块
  - **顶部欢迎语**: 根据当前时间显示问候语 + 用户昵称（可在首访时一次性设置，存 localStorage）

### 回忆录与畅想 (`/memoirs`)

- **页面目标**: 按人生阶段记录和浏览回忆与未来畅想
- **功能点**:
  - **阶段切换 Tabs**: 童年 / 青年 / 中年 / 老年（含"畅想"子分类），点击切换对应阶段的记录列表
  - **新增回忆/畅想**: 点击浮动按钮 → 弹窗表单（标题、日期、阶段选择、内容、上传图片），提交后写入 localStorage
  - **编辑/删除记录**: 每张回忆卡片右上角操作菜单 → 编辑（弹窗复用新增表单）/ 删除（二次确认 toast 反馈）
  - **图文卡片流**: 以手账便签卡片形式展示记录，支持图片预览放大

### 时间胶囊 (`/time-capsule`)

- **页面目标**: 给未来的自己写信/提问题，以及打开过去留给现在的信
- **功能点**:
  - **双入口切换 Tab**: "写给未来" / "打开过去的信"，两个独立视图
  - **写给未来（写信）**: 表单含内容、选择开启时间（预设 1年/3年/5年/10年/自定义日期），提交后生成一条"密封中"记录
  - **打开过去的信（列表）**: 按状态分两组——"已解锁"（可查看内容、可回复/回答）和"密封中"（显示信封封面 + 倒计时/解锁日期，不可查看内容）
  - **回信/回答**: 已解锁的胶囊可添加回复内容，形成"过去的我 ↔ 现在的我"对话，存入原记录

### 成长史 (`/growth`)

- **页面目标**: 记录成长历程中的重要节点，形成可视化时间线
- **功能点**:
  - **成长时间线展示**: 垂直时间轴，节点含日期、标题、简述，按时间正序排列
  - **新增成长节点**: 弹窗表单（日期、标题、详细描述、节点标签如"认知突破/环境变化/技能获得"）
  - **编辑/删除节点**: 时间轴节点支持行内操作菜单，编辑更新、删除二次确认
  - **自我总结区**: 页面顶部一段可编辑的"我是一个什么样的人"总结文字，点击编辑保存

### 欲望清单 (`/desire`)

- **页面目标**: 分类管理过去、现在、未来想要的东西
- **功能点**:
  - **三栏分类展示**: "以前想要的" / "现在想要的" / "未来想要的"（移动端下拉切换），支持拖拽或手动调整分类
  - **新增欲望条目**: 弹窗表单（内容、分类、想要程度/优先级、是否已实现、备注）
  - **标记已实现**: 条目上点击"已实现"按钮，条目加删除线 + 移至"已实现"分组，toast 祝贺
  - **编辑/删除条目**: 标准 CRUD 操作

### 心情日记 (`/mood`)

- **页面目标**: 每天记录情绪和感受
- **功能点**:
  - **日历视图 + 列表视图切换**: 日历上标记每日心情颜色，点击某日查看/编辑当天日记
  - **写日记**: 日期选择 + 心情标签选择（预设 emoji 如开心/平静/难过/焦虑/兴奋等）+ 文字内容 + 可选图片
  - **心情统计概览**: 页面顶部显示本月心情分布（简单百分比文字或环形图）
  - **编辑/删除日记**: 列表或日历中点击进入编辑弹窗

### 第一次收藏馆 (`/firsts`)

- **页面目标**: 收藏人生中珍贵的"第一次"体验
- **功能点**:
  - **瀑布流/网格卡片展示**: 每张卡片大图 + 标题 + 时间 + 简短感受，手账拍立得风格
  - **新增第一次记录**: 弹窗表单（标题如"第一次坐飞机"、日期、感受文字、上传图片（支持多张））
  - **详情查看**: 点击卡片 → 弹窗大图 + 完整文字描述
  - **编辑/删除**: 详情弹窗内操作

### 生日礼物收藏 (`/birthday`)

- **页面目标**: 按年份收藏每年收到和送给自己的生日礼物
- **功能点**:
  - **按年分组展示**: 时间线/分组列表，每年一个分组，含年龄 + 收到的礼物 + 送给自己的礼物
  - **新增礼物**: 弹窗表单（年份、礼物名称、谁送的/自购、照片、描述/纪念意义）
  - **照片墙模式**: 切换网格照片墙视图，纯图片浏览生日礼物
  - **编辑/删除**: 标准 CRUD

### 生活图鉴 (`/life-album`)

- **页面目标**: 记录菜谱、房间、书桌三类生活内容
- **功能点**:
  - **三分类切换**: 菜谱 / 我的房间 / 我的书桌，三个 Tab
  - **菜谱记录**: 菜名、食材、步骤文字、成品照片，卡片式展示
  - **房间/书桌记录**: 照片为主 + 文字描述/改造记录，大图网格 + 文字补充
  - **新增/编辑/删除**: 每个分类独立 CRUD，表单按分类微调字段

### 旅行记录 (`/travel`)

- **页面目标**: 记录去过的地方，含照片、时间、故事
- **功能点**:
  - **旅行卡片列表**: 每张卡片含主图 + 地点 + 日期 + 故事摘要 + 照片数量角标
  - **新增旅行记录**: 弹窗/侧抽屉表单（地点、起止日期、故事/攻略、上传多张照片）
  - **详情查看**: 点击卡片进入全屏图集 + 完整故事文字（侧滑浏览图片）
  - **编辑/删除**: 详情页操作

---

## 数据共享配置

| 存储键名 | 数据说明 | 使用页面 |
|---------|---------|---------|
| `__app_diary_memoirs` | 回忆录记录列表，`IMemoirRecord[]` | 首页、回忆录页 |
| `__app_diary_timeCapsule` | 时间胶囊记录列表，`ITimeCapsuleRecord[]` | 首页、时间胶囊页 |
| `__app_diary_growth` | 成长史节点列表，`IGrowthRecord[]` | 首页、成长史页 |
| `__app_diary_desire` | 欲望清单项列表，`IDesireRecord[]` | 首页、欲望清单页 |
| `__app_diary_mood` | 心情日记列表，`IMoodRecord[]` | 首页、心情日记页 |
| `__app_diary_firsts` | 第一次收藏列表，`IFirstRecord[]` | 首页、第一次收藏页 |
| `__app_diary_birthday` | 生日礼物列表，`IBirthdayRecord[]` | 首页、生日礼物页 |
| `__app_diary_lifeAlbum` | 生活图鉴列表，`ILifeAlbumRecord[]` | 首页、生活图鉴页 |
| `__app_diary_travel` | 旅行记录列表，`ITravelRecord[]` | 首页、旅行记录页 |
| `__app_diary_userProfile` | 用户基础设置（昵称等），`IUserProfile` | 首页 |

```ts
// 通用图片项
interface IDiaryImage {
  id: string;
  dataUrl: string; // base64 dataURL，随记录一起存 localStorage
  name?: string;
}

// 回忆录
interface IMemoirRecord {
  id: string;
  title: string;
  stage: 'childhood' | 'youth' | 'middle' | 'oldage';
  type: 'memory' | 'imagination'; // 回忆 / 畅想
  date: string; // YYYY-MM-DD
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 时间胶囊
interface ITimeCapsuleRecord {
  id: string;
  type: 'letter' | 'question';
  content: string;
  createdAt: number; // 写信/提问时间
  unlockAt: number; // 解锁时间戳
  isUnlocked: boolean; // 是否已到解锁时间
  reply?: string; // 现在的我的回信/回答
  repliedAt?: number;
  source?: 'mock';
}

// 成长史
interface IGrowthRecord {
  id: string;
  title: string;
  date: string;
  description: string;
  tag?: string; // 认知突破 / 环境变化 / 技能获得 等
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 欲望清单
interface IDesireRecord {
  id: string;
  content: string;
  category: 'past' | 'present' | 'future';
  priority?: number; // 1-5
  achieved: boolean;
  achievedAt?: string;
  note?: string;
  createdAt: number;
  source?: 'mock';
}

// 心情日记
interface IMoodRecord {
  id: string;
  date: string; // YYYY-MM-DD（唯一）
  mood: 'happy' | 'calm' | 'sad' | 'anxious' | 'excited' | 'angry' | 'tired';
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 第一次收藏
interface IFirstRecord {
  id: string;
  title: string;
  date: string;
  feeling: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 生日礼物
interface IBirthdayRecord {
  id: string;
  year: number;
  age: number;
  giftName: string;
  giver: string; // "自己"或送礼人
  photo?: IDiaryImage;
  description?: string;
  createdAt: number;
  source?: 'mock';
}

// 生活图鉴
interface ILifeAlbumRecord {
  id: string;
  category: 'recipe' | 'room' | 'desk';
  title: string;
  content: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 旅行记录
interface ITravelRecord {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  story: string;
  images: IDiaryImage[];
  createdAt: number;
  updatedAt: number;
  source?: 'mock';
}

// 用户基础信息
interface IUserProfile {
  nickname: string;
  avatarDataUrl?: string;
}
```

---

## 视觉与交互风格约束（从需求提取）

- **整体风格**: 可爱治愈手账本风格，奶油/米白底色，圆角 + 胶带/贴纸/便签等装饰元素
- **标题字体**: 站酷快乐体（ZCOOL KuaiLe），通过 Google Fonts 或 `@font-face` 引入，标题/Hero/导航使用
- **主色调**: 柔和马卡龙色系（粉、蓝、黄、绿低饱和度），不同模块可用不同主题色区分
- **无登录**: 全站无注册/登录入口，打开链接即用，首访可设昵称（本地保存）
- **数据持久化**: 所有 9 个模块数据均写入 localStorage，刷新/关闭后重开保留

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Free Direction —— 无参考材料，基于"电子手账"的产品语义与用户情绪自主设计
- **核心情绪 / 应用类型**: 温暖治愈的个人成长记忆容器，用户在此记录人生阶段、封存时间胶囊、收藏珍贵瞬间
- **独特记忆点**: 每个模块入口都是一张贴在米黄色手账本内页上的、带手写便签和胶带边角的可爱卡片；时间胶囊用带蜡封效果的信封图标呈现密封态

## 2. Art Direction

- **方向名**: 手账便签风
- **Design Style**: Soft Blocks 柔色块 + Rounded 圆润几何 —— 模拟真实手账本的纸质温暖感和可爱贴纸氛围，让记录像贴便签一样轻松
- **DNA 参数**: 圆角大（`rounded-2xl`/`rounded-3xl`）/ 阴影轻（`shadow-sm`，卡片用柔和内阴影模拟纸张）/ 间距宽松（`gap-6`/`p-6`）/ 字体方向：卡通圆润标题 + 易读正文 / 装饰手法：胶带边角、点状分隔线、手写便签条、小贴纸图标
- **应用类型**: Content / Workflow 混合 —— 首页是信息流入口，详情页是沉浸式记录与阅读

## 3. Color System

**色彩关系**: 奶油米黄纸色背景 + 蜜桃粉主色 + 淡薄荷绿辅助 + 暖棕文字，整体模拟手账本内页的温暖纸质感
**配色设计理由**: 奶油米黄营造真实手账纸的温暖底色；蜜桃粉作为主色呼应"可爱治愈"的情绪诉求，用于主按钮、当前页和关键交互；淡薄荷绿作为辅助色用于 hover 和次级高亮，避免粉色过于甜腻；暖棕色系文字提升长文阅读舒适度
**主色推导**: 从"可爱治愈手账本"语义出发，选择低饱和蜜桃粉 —— 既有少女感和温暖感，又不会因高饱和造成视觉疲劳；辅助色薄荷绿与粉色形成柔和对比，模拟手账中的彩色便签
**使用比例**: 60% 中性米黄 / 30% 辅助粉绿（卡片底、标签、分隔）/ 10% 蜜桃粉 primary；primary 仅用于 CTA 按钮、胶囊密封图标和模块标题强调

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(42 60% 96%) | 奶油米黄纸色，页面整体背景 |
| card | `--card` | `bg-card` | hsl(45 55% 98%) | 更浅的米白卡片，模拟便签纸 |
| text | `--foreground` | `text-foreground` | hsl(28 35% 22%) | 暖棕深咖，正文与标题 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(30 20% 45%) | 浅棕灰色，辅助说明和元信息 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(6 78% 72%) | 蜜桃粉，主交互与品牌锚点 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(0 0% 100%) | 白色，主色上的文字 |
| accent | `--accent` | `bg-accent` | hsl(152 40% 88%) | 淡薄荷绿，hover/选中浅底 |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(155 30% 28%) | 深薄荷绿，辅助文字图标 |
| border | `--border` | `border-border` | hsl(35 30% 82%) | 浅米棕边框，模拟纸页缝线 |

**语义色提示**: 成功色 hsl(152 45% 55%) 三态：bg hsl(152 50% 92%) / border hsl(152 40% 75%) / text hsl(155 40% 28%)；警告色 hsl(40 85% 65%) 三态：bg hsl(45 90% 92%) / border hsl(40 80% 75%) / text hsl(30 50% 25%)；错误色 hsl(0 70% 65%) 三态：bg hsl(6 75% 93%) / border hsl(0 65% 80%) / text hsl(0 50% 30%)。所有语义色饱和度控制在 45-85% 区间，与 primary 蜜桃粉的柔化质感对齐，避免刺眼。

## 4. 字体与节奏

- **font-display**: ZCOOL KuaiLe（站酷快乐体） —— 用户明确指定，圆润卡通的手写感完美契合手账本标题气质
- **font-body**: Noto Sans SC —— 中文正文清晰易读，笔画柔和不生硬，与快乐体标题形成可爱+舒适的搭配
- **字号**: H1 text-5xl；H2 text-2xl ~ text-3xl；body text-base；muted text-sm；便签小字 text-xs
- **圆角**: 大 —— 卡片 `rounded-2xl`，按钮 `rounded-full`，模拟手账贴纸的圆润边缘

## 5. 全局布局契约

- **Reference Layout Use**: 按需求结构推导，首页为模块入口总览 + 最近记录，各模块为列表+详情的记录型页面
- **Page / Section Order**: 首页（总览）→ 回忆录与畅想 / 时间胶囊 / 成长史 / 欲望清单 / 心情日记 / 第一次收藏 / 生日礼物 / 生活图鉴 / 旅行记录
- **Standard Content Zone**: `max-w-5xl` + `mx-auto` —— 内容型产品，保证阅读行长舒适，卡片布局有呼吸感
- **Shell / Frame Alignment**: 内容容器与顶部导航同宽对齐，侧边无固定 chrome；移动端导航底部 tab 化
- **Padding & Rhythm**: `px-4 md:px-6 lg:px-8 py-10 md:py-14`，卡片间距 `gap-4 md:gap-6`，保持 8px 倍数节奏
- **Full-bleed Zones**: 仅首页 Hero 欢迎区背景可全宽铺纸质感纹理，内部内容受 Standard Content Zone 约束
- **Local Narrowing**: 单篇记录详情、表单编辑页可在容器内收窄至 `max-w-2xl`，聚焦阅读与书写
- **Overflow Strategy**: 横向卡片列表（如首页模块入口、照片墙）使用 `overflow-x-auto`，保留手账翻页感
- **Flexibility Boundary**: 允许移动端调整卡片列数、内边距和图片尺寸；不允许改变主色、圆角系统、字体组合和纸质感背景

## 6. 视觉与动效

- **装饰**: 胶带边角（卡片右上角随机倾斜的半透明彩色胶带）、点状虚线分隔、角落小贴纸图标（星星/爱心/小花）
- **阴影/边界**: 轻 —— 卡片用 `shadow-sm` + 极淡内阴影模拟纸张厚度；按钮用软阴影增加按压感
- **动效**: 精致克制 —— hover 时卡片轻微上浮 + 阴影加深（像拿起便签）；时间胶囊开启时有信封翻转动效；页面切换用淡入平移；所有动效 200-300ms，ease-out

## 7. 组件原则

- 按钮、输入框、卡片、菜单必须有 Default / Hover / Active / Focus-visible / Disabled 状态
- Primary 按钮（新增记录、保存、封存胶囊）用蜜桃粉实色 + 圆角药丸形；Secondary 用描边米棕色；Ghost 按钮用薄荷绿 hover 底
- 时间胶囊密封态：蜡封图标 + 模糊文字 + "尚未到开启时间"手写便签；可开启态：信封半开 + 闪烁提示
- 空状态延续手账风格：空白便签纸 + 手写体引导语 + 小贴纸装饰，不使用默认空状态图标
- 图片上传区模拟拍立得相框效果：白边 + 底部留白写说明文字

## 8. Image Direction

- **Image Role**: 装饰氛围插图（模块空状态、首页欢迎区、时间胶囊信封）+ 用户上传内容的容器样式（拍立得相框）
- **Image Art Direction**: 温暖治愈的手绘水彩+拼贴风格，模拟手账本中的手绘小插画和贴纸；柔和自然光，纸质感底材，低饱和度粉绿米棕配色；构图轻松不对称，有胶带粘贴、折角、涂鸦线条等手账元素；情绪是温柔、怀旧、又充满期待
- **Image Prompt Keywords**: 水彩手绘风、手账贴纸质感、奶油米黄色调、蜜桃粉与薄荷绿点缀、拍立得照片边框、蜡封信封、可爱小插画、胶带粘贴效果、纸张纹理、温暖柔光、拼贴版式、治愈系
- **Image Avoidance**: 避免高饱和卡通动漫风、3D 渲染塑料感、商务人物素材、赛博朋克/科技感元素、尖锐几何图形、冷色调主图、通用图库式照片

## 9. Anti-patterns

- **Split personality**: 不同模块使用不同配色或圆角；全站统一米黄纸底 + 蜜桃粉主色 + 大圆角系统
- **Default SaaS drift**: 回到默认蓝色按钮、纯白背景和通用卡片；每个界面细节都要服务"手账本"的核心隐喻
- **Mono-hue tyranny**: 粉色铺满按钮、图标、边框、文字、背景；严格按 60-30-10 比例，primary 只做锚点
- **Invisible interaction**: 只做 hover 不做 focus-visible；键盘聚焦用薄荷绿描边 + 轻微外发光
- **Decoration overload**: 贴纸、胶带、涂鸦堆满页面导致信息淹没；装饰只出现在卡片边角、空状态和页面角落，内容区保持干净可读
- **Status color harsh**: 成功/警告/错误色用高饱和强对比，打破手账柔和氛围；语义色饱和度与 primary 对齐，保持柔化质感