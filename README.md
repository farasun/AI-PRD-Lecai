# Antilecai 原型阅读器 & PRD 资产库

> **乐才成果平台 (AI-PRD-Lecai)**：基于行政背书的银发社团社交与“真团购”服务平台。
> 本项目是一站式原型与规格管理工具，整合了**低保真线框图 + 结构化规格 (Spec) + 业务流程图**，支持全链路术语对齐与一键离线打包。

---

## 📁 目录结构

```
Antilecai/
├── index.html              ← 本地开发阅读器（支持 Markdown 渲染与原型嵌入）
├── README.md               ← 本文件
├── .agents/instructions/    ← 核心角色指令库（Chat A/D/G 宪法）
├── doc/
│   ├── PageList.md          ← 页面清单（命名唯一真理，Single Source of Truth）
│   └── lecai-club-overview  ← 业务概况与标准术语表
├── wireframe/               ← 线框原型（黑白灰、适老化、高对比度）
│   └── v1.0/                ← 当前活跃版本
├── Spec/                    ← 功能规格（极简叙事、无幻觉协议）
│   └── v1.0/
├── flow/                    ← 业务流程图（Low-Fi 风格）
├── scripts/
│   └── bundle.js            ← 单文件打包核心脚本
└── dist/                    ← 离线分发包（Antilecai-v1.0.html）
```

---

## ⚖️ 核心原则 (Core Principles)

### 1. 术语锚定原则 (Terminology Anchor)
项目所有参与者（ChatA, ChatD, ChatG）必须遵循：
- **页面命名**：强制对齐 `doc/PageList.md`，禁止自造编号。
- **业务词汇**：强制对齐 `doc/lecai-club-overview.md`。禁绝“阵地”、“引擎”等文学化表达，使用“社团”、“上传”等确定性产品语言。

### 2. 线框视觉宪法 (Visual Constitution)
- **极简黑白灰**：禁止使用任何品牌色，依靠灰度 (`bg-gray-200`) 与投影 (`shadow-2xl`) 区分层级。
- **适老化标准**：强制大间距、1px 细线、常规字重（不加粗），移除所有非核心视觉噪音。
- **画板感**：原型以白色画布悬浮在深灰色背景上，提供极佳的对比度。

### 3. 修订与“无变化”协议 (No-Change Protocol)
在执行增量修订时：
- 若模块标记为 `*(本次无变化)*`，ChatG 仅保留标题并输出一行“本次无变化”，杜绝幻觉补全。

---

## 🚀 开发者指南

### 本地预览 (Dev Mode)
```bash
# 启动本地服务
npx -y serve . -l 3000
# 访问阅读器
http://localhost:3000
```

### 生产打包 (Bundle)
将当前版本的所有资产（线框、规格、流程）压缩为单个 HTML，便于分发：
```bash
node scripts/bundle.js v1.0
# 输出路径: dist/Antilecai-v1.0.html
```

---

## 🛠️ 内容生成工作流 (Agent Roles)

| 角色 | 指令文件 | 核心职责 |
| :--- | :--- | :--- |
| **Chat A (产品专家)** | `chatA-ProductMgr-expect.md` | 定义功能骨架与交互逻辑，锚定业务术语。 |
| **Chat D (线框助手)** | `chatD-wireframe-expect.md` | 将 A 的描述转化为符合视觉宪法的 HTML 线框图。 |
| **Chat G (规格专家)** | `chatG-Spec-expect.md` | 生成标准化的 Spec 笔记，执行“无变化”过滤。 |

---

## 🔄 当前进度 (Status: v1.0)

- [x] **基础设施**：完成集成阅读器开发与一键打包脚本。
- [x] **视觉规范**：确立高对比度、适老化的低保真设计语言。
- [x] **CC-5 (活动详情)**：完成瀑布流重构与上传流程补录。
- [x] **CC-6 (作品详情)**：完成沉浸式阅读区与规格精简。
- [x] **CC-7 (提交表单)**：实现单视频/多图排他性发布逻辑，同步只读态与编辑态。
- [ ] **流程图更新**：待同步最新的上传/审核业务流。

---

> **Tip**: 修改 `.agents/instructions/` 下的指令文件时，务必在 Chat 窗口中执行同步更新，以维持 Agent 认知的实时性。
