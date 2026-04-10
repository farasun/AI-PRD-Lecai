---
description: 执行从专家审阅到原型集成的 7 步标准设计管线，确保交付物的一致性与合规性。
---

## Steps

### 1. 迭代总规与质量门禁 (Foundation & Quality Gate)
- **强制输入**：`drafts/v{X.Y}/BRD-draft.md`（作为单期迭代源头输入）
- **操作流程**：
  1. **初稿起草**：唤醒产品架构师 `Chat P`（指令：`.agents/instructions/chatP-ProductArch-expect.md`），基于输入的 BRD 撰写版本级的总迭代 PRD 初稿。
  2. **质量门禁**：唤醒银发专家 `Li Yue`（指令：`.agents/instructions/elder-expert-liyue.md`），对草拟的总规进行业务合规与适老化体验查问，并结构化输出独立的评审报告文件。
  3. **挂起确认**：生成查问报告后**强制断点停止**，提示等待人类介入处理。
  4. **终稿与装载**：人类完成定调后，再次由 `Chat P` 构建修正后的总纲完稿，紧接着梳理出 `PageList.md`，执行预构建命令：`python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y} --init`。
- **预期产出**：
  - 迭代宏观架构基准：`drafts/v{X.Y}/master-PRD-v{X.Y}.md`
  - 业务合规质量报告：`drafts/v{X.Y}/review/li-yue-review-v{X.Y}.md`
  - 页面控制域与引擎：`drafts/v{X.Y}/PageList.md` 及构建生成的 `reader.html`

### 2. 业务流程拆解 (Flow)
- **角色**：产品架构师 `Chat P`（指令文件：`.agents/instructions/chatP-ProductArch-expect.md`）
- **操作**：将业务规则映射为带有节点价值的用户旅程，按 2a/2b/2c 分步执行。
- **具体指令**：
  - **Step 2a (框架)**：定义核心流程线及其起点、终点和核心价值。
  - **Step 2b (节点编排)**：结合页面编号，定义每条流程的精确跳转动作（必须单流程独立输出一份 `.mmd` 代码）。
  - **Step 2c (视觉渲染)**：调用工作流 `/Low-Fi-Flow-Map-Plugin`，将 `.mmd` 草图代码渲染为极简 HTML 全景线框图。
- **预期结果**：生成 `drafts/v{X.Y}/flow/xxx-flow.html` 及其源码 `.mmd`。

### 3. 页面级功能描述 (PRD)
- **角色**：产品重构专家 `Chat A`（指令文件：`.agents/instructions/chatA-ProductMgr-expect.md`）
- **操作**：针对单页面执行详尽功能定义。
- **具体指令**：编写页面 PRD，必须包含 `[现状规则回顾]`。
- **预期结果**：生成 `drafts/v{X.Y}/prd/{PageID}.md`。

### 4. 低保真线框图生成 (Wireframe)
- **角色**：线框工程师 `Chat D`（指令文件：`.agents/instructions/chatD-WireframeDesigner-expect.md`）
- **操作**：将 PRD 翻译为 BWG（黑白灰）线框图。
- **具体指令**：执行 Step 4。**严禁生成 Step 5 标注面板**。
- **预期结果**：生成 `drafts/v{X.Y}/wireframe/{PageID}.html`。

### 5. 开发伴随批注生成 (Annotation)
- **角色**：原型批注专家 `Chat G`（指令文件：`.agents/instructions/chatG-PrototypeReviewer-expect.md`）
- **操作**：剥离视觉，提取底层逻辑与接口边界。
- **具体指令**：输出结构化 Markdown 说明。
- **预期结果**：生成 `drafts/v{X.Y}/annotation/{PageID}.md`。

### 6. 组装原型预览引擎 (Reader Bundling)
// turbo
- **操作**：调用 `lecai-bundler` 技能，通过 `bundle.py` 执行自动化打包。
- **具体指令**：`python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y}`
- **预期结果**：在 `dist/` 目录下生成单文件原型包（如 `Antilecai-drafts-v1.3.1.html`）。
