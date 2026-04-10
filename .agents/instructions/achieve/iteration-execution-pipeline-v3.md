---
description: 升级版 V3 管线：断点式迭代执行与防污染隔离。在解决人格污染的同时，严格将 README 定义的业务灵魂注入到每一个专家的唤醒约束中。
---

# 迭代执行制造管线 (V3 断点隔离版)

> [!WARNING]
> **管线纪律 (Pipeline Rules)**
> 1. 本管线**严禁在单回合内全自动执行**。
> 2. 每个 Step 执行完毕后，AI 必须强制挂起。人类需通过 @ 语境显式下令加载下一位专家。
> 3. AI 在加载新专家前，须将旧的决策树清理出思维上下文，严格遵照输入文件与核心约束进行作业。

## 执行阶段 (Execution Steps)

### Step 1: 业务总规锚定与死锁 
- 唤醒指令（示例）：`"请读取 .agents/instructions/chatP-ProductArch-expect.md 加载架构师角色。根据 roadmap 中确定的 drafts/v{X.Y}/BRD-draft.md，执行总规降噪与重写。"`
- **强制输入**：`drafts/v{X.Y}/BRD-draft.md`
- **核心任务与约束 (Core Task)**：从宏观确立规则与机制。**谨记：所有的版本级总规则不要藏在单页面的需求里，必须作为独立总纲存在。**
- **预期产出**：生成 `drafts/v{X.Y}/business-rules-v{X.Y}.md`。
- **♻️ 人类断点**：AI 生成完毕后必须中断，并提请人类发起 Gate 1 审查。

### 🛡️ Quality Gate 1: 总规合规性审查
- 唤醒指令（示例）：`"请读取 .agents/instructions/reviewer-liyue.md 加载李越分身，对刚生成的 business-rules 宪法进行 0-10 分打分审查。"`
- **强制输入**：`business-rules-v{X.Y}.md`
- **预期产出**：生成审查报告 `drafts/v{X.Y}/review/li-yue-gate1-review.md`。
- **♻️ 人类断点**：AI 生成报告后中断。人类决定是否返工或进入 Step 2。

### Step 2: 业务流程拆解 (Flow 三段式)
此阶段拆分为三个物理隔离的断点，解决流程空想与基准偏离问题：

#### Step 2a: 页面范围与 Flow 框架 (Chat P)
- 唤醒指令：`"请读取 foundation/Main_PageList.md。基于最新业务宪法，输出本期迭代的各页面 Flow 框架与页面增删清单。"`
- **强制输入**：`business-rules-v{X.Y}.md` + `foundation/Main_PageList.md`
- **核心任务与约束 (Core Task)**：定义核心流程主链、版本边界及页面编号锚点，**确保命名强制对齐 `Main_PageList.md`，绝对禁止自造编号。**
- **预期产出**：新建或更新 `drafts/v{X.Y}/flow/flow-framework.md` 和 `PageList.md`。
- **♻️ 人类断点**：生成框架后立即挂断。

#### Step 2b: 业务流节点编排 (Chat A)
- 唤醒指令：`"现在请忘记旧角色，读取 .agents/instructions/chatA-ProductMgr-expect.md 加载经理角色。根据刚才的 flow-framework 和 foundation/Main_PageList.md 的基准，编排具体的 Mermaid 逻辑分支代码。"`
- **强制输入**：`flow-framework.md` + `foundation/Main_PageList.md`
- **核心任务与约束 (Core Task)**：细化具体的跳转动作、分支逻辑及提示语。**每条独立流程必须单独输出一份 Mermaid `.mmd` 源码。**
- **预期产出**：输出 `drafts/v{X.Y}/flow/xxx-flow.mmd`。
- **♻️ 人类断点**：打出 Mermaid 源码后必须中断，提请 Gate 2 审查。

#### 🛡️ Quality Gate 2: 交互与适老化审查
- 唤醒指令：`"加载 .agents/instructions/reviewer-liyue.md，审查上述 mmd 流程图中是否存在违背银发群体体验的行为。"`
- **预期产出**：记录 `review/li-yue-gate2-review.md`。
- **♻️ 人类断点**：人类确认审查通过后，准备进入视觉渲染。

#### Step 2c: MMD 渲染执行 (Plugin)
- 操作指引：针对过审的 `.mmd` 源码，由终端执行或直接交由 `/Low-Fi-Flow-Map-Plugin` 插件，将其基于 `Main_PageList.md` 中的历史基准结构，渲染为可互动的物理化 HTML 文件。
- **预期产出**：`drafts/v{X.Y}/flow/xxx-flow.html`

### Step 3: 单页面功能描述 (PRD)
- 唤醒指令：`"恢复或保持 Chat A 角色，根据生成的过审 HTML 流程图，按照指令输出纯粹的高语义 PRD。"`
- **强制输入**：`xxx-flow.html` 和 `.agents/instructions/chatA-ProductMgr-expect.md`
- **核心任务与约束 (Core Task)**：进行详尽的功能需求与信息结构描述。**必须包含 `[现状规则回顾]` 模块，并严格遵守草案隔离原则读取历史版本作为基准。**
- **预期产出**：生成 `drafts/v{X.Y}/prd/{PageID}.md`。
- **♻️ 人类断点**：生成单页/多页 PRD 后中断。

### Step 4: 低保真线框图生成 (Wireframe)
- 唤醒指令：`"清理上下文，读取 .agents/instructions/chatD-wireframe-expect.md 切换为 Chat D 角色，基于 PRD 绘制原生 HTML 线框。"`
- **核心任务与约束 (Core Task)**：**坚守极简主义视觉宪法，仅用灰度与阴影层级构建适老化 HTML，坚决移除所有非核心业务噪音。**
- **预期产出**：`drafts/v{X.Y}/wireframe/{PageID}.html`。

### Step 5: 开发伴随批注生成 (Annotation)
- 唤醒指令：`"清理上下文，读取 .agents/instructions/chatG-Spec-expect.md 切换为 Chat G 角色，基于 PRD 与线框生成结构化校验边界。"`
- **核心任务与约束 (Core Task)**：剥离界面视觉结构，专注补充底层数据逻辑、接口边界、动效规则、极限值。**严格执行没变化就不输出的“无变化协议”。**
- **预期产出**：`drafts/v{X.Y}/annotation/{PageID}.md`。

### Step 6: 组装原型全景引擎 (Reader Bundling)
- 操作指引：由人类在终端或委托 AI 管家执行以下打包命令。
- **执行命令**：`python .agents/skills/lecai-bundler/scripts/bundle.py drafts/v{X.Y}`
- **预期产出**：生成 `dist/` 开发交付单体离线包。
