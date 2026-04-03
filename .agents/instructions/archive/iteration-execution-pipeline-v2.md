---
description: 升级版 7 步执行管线。内嵌“业务总规死锁”与“双节点李越审核门控”，将 BRD 草案高合规地转化为物理原件流水线。
---

# 迭代执行自动化管线 (V2)

> [!WARNING]
> **执行前提 (Prerequisite)**：在启动此管线前，`drafts/v{X.Y}/` 目录下必须**已经存在**一份来自 Roadmap 拆分期的极简 `BRD-draft.md`。

## 核心 Steps

### 1a. 业务总规锚定与死锁 (Business Rule Locking)
- **角色**：产品架构师 `Chat P`
- **操作**：读取前序阶段生成的 `BRD-draft.md` 和可能存在的专家总体批注，执行降噪与重写。
- **具体指令**：请扮演 Chat P，严格只聚焦 `drafts/v{X.Y}/BRD-draft.md` 划定的即时范围，剔除所有无关描述，输出一份斩钉截铁的**本迭代专属业务宪法**。
- **预期结果**：强制生成 `drafts/v{X.Y}/business-rules-v{X.Y}.md`。**此后所有步骤有义务视此文件为唯一真理源 (SSOT)**。

### 🛡️ Quality Gate 1：总规合规性审查 
- **角色**：审查员分身 `reviewer-liyue`
- **操作**：拦截自动流水线，由李越分身带着 0-10 分的戒尺独立审查刚出炉的 `business-rules-v{X.Y}.md`。
- **具体指令**：调用 `.agents/instructions/reviewer-liyue.md` 对宪法进行打分。
  - **若判定结果包含 `[AUTO-PASS]`**：静默存档意见至 `review/li-yue-gate1-review.md`，流转至 Step 1b 自动继续。
  - **若判定结果包含 `[BLOCKED]`**：高亮停止 AI 操作任务，切断后续流水线。向人类发起拦截通报。

### 1b. 页面范围清单圈定 (Scope & PageList)
- **操作**：由 `Chat P` 读取 `foundation/Main_PageList.md` 基座，生成本期专属页面清单表。
- **具体命令**：执行 `python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y} --init` 初始化预览架子。
- **预期产出**：更新 `drafts/v{X.Y}/PageList.md`。

### 2. 业务流程拆解 (Flow)
- **角色**：产品重构专家 `Chat A`
- **操作**：定义骨架并在 SSOT 框架下编排详细跳转动作。
- **预期产出**：生成 `drafts/v{X.Y}/flow/xxx-flow.html` 并提供核心流转逻辑的 Mermaid 源码。

### 🛡️ Quality Gate 2：交互流程适老化审查 
- **角色**：审查员分身 `reviewer-liyue`
- **操作**：执行交互动作体验的最终“质检”。
- **具体指令**：调用 `.agents/instructions/reviewer-liyue.md`，专挑 Mermaid 流程里的毛病进行 0-10 打分。
  - **若包含 `[AUTO-PASS]`**：存档备份至 `review/li-yue-gate2-review.md`，恭喜机器流水线跨越最后一道安全门，顺畅冲向下游制造区。
  - **若判定为 `[BLOCKED]`**：全线亮红灯停止。

### 3. 单页面级功能描述 (PRD)
- **操作**：`Chat A` 基于过审的 Flow 单独拉取各页信息，落笔细节 PRD。
- **预期产出**：生成 `drafts/v{X.Y}/prd/{PageID}.md`。

### 4. 低保真线框图生成 (Wireframe)
- **操作**：`Chat D` 直接按图索骥绘制。
- **预期产出**：生成 `drafts/v{X.Y}/wireframe/{PageID}.html`。

### 5. 开发伴随批注生成 (Annotation)
- **操作**：`Chat G` 输出结构化验证变量与动效限制。
- **预期产出**：生成 `drafts/v{X.Y}/annotation/{PageID}.md`。

### 6. 组装原型全景引擎 (Reader Bundling)
// turbo-all
- **操作**：脱离人工干预约用 `lecai-bundler` 完成组装。
- **具体指令**：`python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y}`
- **产出**：输出 `dist/` 单体离线包，宣告开发期流水线圆满落幕。
