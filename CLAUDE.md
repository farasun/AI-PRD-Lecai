# CLAUDE.md — AI-PRD-Lecai 项目全局上下文

本文件供 Claude Code 及所有 AI Agent 在进入此项目时优先读取。

---

## 项目构成

本仓库包含两个主要部分：

### 1. PRD 资产库（主体）
乐才成果平台（银发社团 S2B2C）的低保真原型与规格文档体系。
- **工作流管线**：见 `README.md` §标准工作流管线
- **角色指令**：`.agents/instructions/`
- **迭代草稿**：`drafts/v{x.y}/`
- **发布版本**：`releases/`

### 2. MockFlow（临时实验目录 ⚠️）
**低代码体验沙盘** —— 这是一个临时存放在项目中的 React Web 应用。其主要用于方便 AI 助手（如 Claude Code）进行低代码相关的实验与开发验证，**不属于 PRD 的正式核心资产**。
- **定位**：实验性项目，随时可移出或归档，切勿与 PRD 主线产生任何强关联逻辑。
- **位置**：`mockflow/`  
- **启动**：`cd mockflow && npm run dev`（端口 5173）  
- **需求文档**：`mockflow/FRD.md`

---

## MockFlow 架构要点

1. **引导引擎**（`src/engine/TutorialEngine.tsx`）是核心，负责渲染覆盖层、步骤提示、强制操作拦截。
2. **剧本配置**（`src/data/scenario-leave.ts`）是纯数据，新增剧本只需修改数据文件，不改代码。
3. **Zustand Store**（`src/store/index.ts`）管理所有应用状态，含 `helpMeDo()` 自动完成逻辑。
4. **仿真边界**：无真实后端，所有数据存在内存，`localStorage` 仅持久化学习进度。

---

## 重要约束

- `achieve/` 目录已冻结，任何 Agent 不得读取其中文件（详见 README 顶部警告）。
- 页面编号/命名严格对齐 `foundation/Main_PageList.md`。
- MockFlow 应用禁止接入真实后端或生成可部署代码。
- MockFlow (`mockflow/`) 目录为临时实验性开发使用，与正式 PRD 原型体系完全隔离。

---

## 快速命令

```bash
# 启动 MockFlow 开发服务器
cd mockflow && npm run dev

# 构建 MockFlow 生产包
cd mockflow && npm run build

# 预览 PRD 原型（旧有体系）
npx serve . -l 3000
```
