# Antilecai 原型阅读器 & PRD 资产库

> **乐才成果平台 (AI-PRD-Lecai)**：基于行政背书的银发社团社交与“真团购”服务平台。
> 本项目是一站式原型与规格管理工具，整合了**低保真线框图 + 结构化规格 (Spec) + 业务流程图**，支持全链路术语对齐与一键离线打包。

---

## 📁 目录结构

```
AI-PRD-Lecai/
├── README.md               ← 项目说明
├── .agents/                ← Agent 宪法 & 工作流
├── foundation/             ← 项目基座（总 PageList、术语表、路线图）
├── releases/               ← 已完成迭代（归档只读）
│   └── v1.0/               ← 社团核心逻辑（CC-5/6/7）
├── drafts/                 ← 设计中迭代（活跃工作区）
│   └── v1.1/               ← 积分系统 & 个人中心
├── scripts/                ← 全局打包工具
└── dist/                   ← 分发输出
```

---

## ⚖️ 核心原则 (Core Principles)

### 1. 术语锚定原则 (Terminology Anchor)
项目所有参与者必须遵循：
- **页面命名**：强制对齐 `foundation/Main_PageList.md`，禁止自造编号。
- **业务词汇**：强制对齐 `foundation/lecai-club-overview-v1.4.md`。禁绝“阵地”、“引擎”等文学化表达。

### 2. 线框视觉宪法 (Visual Constitution)
- **极简黑白灰**：禁止使用任何品牌色，依靠灰度 (`bg-gray-200`) 与投影 (`shadow-2xl`) 区分层级。
- **适老化标准**：强制大间距、1px 细线、常规字重，移除所有非核心业务噪音。

### 3. 修订与“无变化”协议 (No-Change Protocol)
- 在执行增量修订时，若模块无变动，ChatG 仅输出“本次无变化”，杜绝幻觉补全。

---

## 🎨 设计管线与模板标准 (Design Pipeline)

每个迭代文件夹（无论在 `releases/` 还是 `drafts/`）都必须遵循统一的结构与标准工作流：

```text
v{X.Y}/
├── reader.html          ← 必选 | 原型预览器（引擎入口）
├── PageList.md          ← 必选 | 本迭代专属页面清单
├── review/              ← 可选 | 评审意见、业务输入
├── prd/                 ← 必选 | Chat A 产出：页面级功能需求
├── flow/                ← 必选 | 业务流程图
├── wireframe/           ← 必选 | Chat D 产出：低保真线框图
└── annotation/          ← 必选 | Chat G 产出：原型批注说明书
```

> 🎯 **标准执行顺序**：  
> **Review（业务评审/可选） → Flow（逻辑流程） → PRD（产品雏形） → Wireframe（线框实现） → Annotation（开发批注）**

---

## 🚀 开发者指南

### 本地预览 (Dev Mode)
```bash
# 启动本地服务
npx -y serve . -l 3000
# 访问设计中的原型 (Drafts)
http://localhost:3000/drafts/v1.1/reader.html
# 访问已发布的版本 (Releases)
http://localhost:3000/releases/v1.0/reader.html
```

---

## 🛠️ 核心生成角色 (Core Agent Roles)

| 角色 | 指令文件 | 核心职责 |
| :--- | :--- | :--- |
| **Chat A (产品重构专家)** | `chatA-ProductMgr-expect.md` | **V2.3** | 专注于银龄经济，定义产品结构与逻辑，产出纯净、语义化需求描述。 |
| **Chat D (线框工程师)** | `chatD-wireframe-expect.md` | **V1.4** | 将需求转化为 HTML 线框图，具备智能图标推断。 |
| **Chat G (原型批注专家)** | `chatG-Spec-expect.md` | **V2.1** | 原型伴随说明书，Markdown 结构化文档。 |

---

## 🌟 专项专家与工程助手 (Specialized Experts & Tools)

| 角色/插件 | 路径 | 描述 |
| :--- | :--- | :--- |
| **Li Yue (银发经济专家)** | `li-yue-expert.md` | 50-70 岁群体产品架构师。负责 S2B2C 架构规划、荣誉与利益双引擎设计。 |
| **Git Coach (代码专家)** | `git-migration-coach.md` | 资深开发与版本管理。引导项目安全迁移至 GitHub。 |
| **Low-Fi Flow (全景流程)** | `Low-Fi-Flow-Map-Plugin.md` | 解析 Mermaid 代码，生成 Miro 风格的全景线框流程图。 |

---

## 🔄 进度图 (Project Status)

### v1.0：社团核心逻辑 (Completed)
- [x] **CC-5 (活动详情)**：瀑布流重构与上传补录。
- [x] **CC-6 (作品详情)**：沉浸式阅读区。
- [x] **CC-7 (提交作品)**：单视频/多图排他性发布逻辑。
- [x] **业务流同步**：上传/审核业务流程图更新。

### v1.1：积分系统与个人中心 (In Progress)
- [x] **架构规划**：`drafts/v1.1/prd/points-system-v1.1.md` 逻辑锚定。
- [x] **PT-1 (我的积分)**：原型与规格完成。
- [x] **PT-2 (每日签到)**：原型与规格完成。
- [x] **CC-3 (我的导航)**：原型与规格完成。
- [ ] **全景流程更新**：完成签到、积分兑换及 1.1 版上传流程映射。
- [ ] **Li Yue 评审**：针对积分激励文案的适老化评审。

---

> **Tip**: 修改 `.agents/` 下的指令或工作流文件时，务必在 Chat 窗口中执行同步更新，以维持 Agent 认知的实时性。
