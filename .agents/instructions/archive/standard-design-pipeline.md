---
description: 执行从专家审阅到原型集成的 7 步标准设计管线，确保交付物的一致性与合规性。
---

## Steps

### 0. 专家前置审阅 (Review)
- **操作**：调用银发经济专家 `elder-expert-liyue.md` 审阅迭代计划。
- **具体指令**：请根据 `.agents/instructions/elder-expert-liyue.md` 审核 `drafts/v{X.Y}/` 的迭代规划，重点关注激励合理性与适老化风险。
- **预期结果**：生成 `drafts/v{X.Y}/review/li-yue-review.md`。

### 1. 迭代宏观规划 (Foundation & Scope)
- **角色**：产品架构师 `Chat P`
- **操作**：根据审阅结论输出版本级总规与页面清单，并初始化本地预览环境。
- **具体指令**：参考 `chatP-ProductArch-expect.md` 输出 `PageList.md`，随后执行 `python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y} --init`。
- **预期结果**：生成 `drafts/v{X.Y}/PageList.md` 及本地 `drafts/v{X.Y}/reader.html`。

### 2. 业务流程拆解 (Flow)
- **角色**：Chat P (框架) + Chat A (逻辑)
- **操作**：定义流程骨架并编排详细跳转逻辑，按 Logic Flow-B 执行继承。
- **具体指令**：基于 `chatP-ProductArch-expect.md` 定义 `flow-framework.md`，随后编排具体流程并生成 Mermaid 源码。
- **预期结果**：基于 `chatP-ProductArch-expect.md` ，生成 `drafts/v{X.Y}/flow/xxx-flow.html` 及对应的 `.mmd` 文件。

### 3. 页面级功能描述 (PRD)
- **角色**：产品重构专家 `Chat A`
- **操作**：针对单页面执行详尽功能定义。
- **具体指令**：根据 `.agents/instructions/chatA-ProductMgr-expect.md` 编写页面 PRD，必须包含 `[现状规则回顾]`。
- **预期结果**：生成 `drafts/v{X.Y}/prd/{PageID}.md`。

### 4. 低保真线框图生成 (Wireframe)
- **角色**：线框工程师 `Chat D`
- **操作**：将 PRD 翻译为 BWG（黑白灰）线框图。
- **具体指令**：根据 `.agents/instructions/chatD-wireframe-expect.md` 执行 Step 4。**严禁生成 Step 5 标注面板**。
- **预期结果**：生成 `drafts/v{X.Y}/wireframe/{PageID}.html`。

### 5. 开发伴随批注生成 (Annotation)
- **角色**：原型批注专家 `Chat G`
- **操作**：剥离视觉，提取底层逻辑与接口边界。
- **具体指令**：参考 `.agents/instructions/chatG-Spec-expect.md` 输出结构化 Markdown 说明。
- **预期结果**：生成 `drafts/v{X.Y}/annotation/{PageID}.md`。

### 6. 组装原型预览引擎 (Reader Bundling)
// turbo
- **操作**：调用 `lecai-bundler` 技能，通过 `bundle.py` 执行自动化打包。
- **具体指令**：`python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y}`
- **预期结果**：在 `dist/` 目录下生成单文件原型包（如 `Antilecai-drafts-v1.3.1.html`）。
