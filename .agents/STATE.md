# 工作流状态基线 (Global Workflow State)

**当前所属路线图节点 (Current Roadmap Node)：** `game-for-club`
> *系统提示：参与前期规划（Workflow A）的各位在职 Agent，必须优先读取 `Current_Roadmap_Node` 确定战区坐标。至于何时把哪一块提取出去正式发车并确立迭代号（如 v1.4），由人类用户手动进行。*

## Workflow A: 路线图总规管线状态墙 (Roadmap Flow Tracker)

| 指挥阶段 | 负责人 | 当前进度状态 | 核心读入文档 | 输出落盘锚点 |
| :--- | :--- | :--- | :--- | :--- |
| Stage 1 (大纲意图发酵) | 产品规划协调员 | ✅ 已完成 | 发散的用户交流集 | `foundation/roadmap/{Node}/outline-draft.md` |
| Stage 2 (专家犀利质检) | @elder-expert-liyue | ✅ 已完成 | 上层的 `outline-draft.md` | `foundation/roadmap/{Node}/review/liyue-ideation-review.md` |
| Stage 3 (人类断点决策) | 👨‍💻 用户 | ✅ 已完成 | 上层的物理批注文件 | （通过聊天指令表决走势） |
| Stage 4 (全量沉淀矿石) | 产品规划协调员 | ✅ 已完成 | 批注结果 + 人类裁决 | `foundation/roadmap/{Node}/master-BRD.md` 及 各 iteration 切片版 |

---
**日常交接公约**：当您处于执行态时，请顺手将您的某个阶段改为 `✅ 已完成`，并把接棒者的阶段设为 `⏳ 进行中` 或发起通报，以防迷失工作流坐标。

## Workflow B: 迭代制造管线执行墙 (Iteration Execution Tracker)

> **当前迭代号 (Current Iteration):** `v{X.Y}`

| 标准生产工序 (Steps) | 执行专家 | 当前进度状态 | 强制读取/参考的输入 | 产出落盘锚点 |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1: 业务总规死锁** | `Chat P` | ✅ 已完成 | `.agents/instructions/chatP...expect.md`<br>+ `BRD-draft.md` | `business-rules-v{X.Y}.md` |
| **🛡️ Quality Gate 1** | `Li Yue`| ✅ 已完成 | `.agents/instructions/reviewer-liyue.md`<br>+ `business-rules.md` | `li-yue-gate1-review.md` |
| **Step 2a: Flow 框架** | `Chat P` | ✅ 已完成 | `foundation/Main_PageList.md` | `flow/flow-framework.md` |
| **Step 2b: Flow 节点** | `Chat A` | ✅ 已完成 | `.agents/instructions/chatA...expect.md`<br>+ `flow-framework.md`<br>+ `Main_PageList.md` | `flow/xxx-flow.mmd` |
| **🛡️ Quality Gate 2** | `Li Yue`| ⏸️ 待审查 | `.agents/instructions/reviewer-liyue.md`<br>+ `xxx-flow.mmd` | `li-yue-gate2-review.md` |
| **Step 2c: 视觉渲染** | `Plugin` | ⏳ 进行中 | `xxx-flow.mmd` | `flow/xxx-flow.html` |
| **Step 3: 页面描述 PRD** | `Chat A` | ⏳ 待执行 | `.agents/instructions/chatA...expect.md`<br>+ `xxx-flow.html` | `prd/{PageID}.md` |
| **Step 4: 线框图生成** | `Chat D` | ⏳ 待执行 | `.agents/instructions/chatD...expect.md`<br>+ `prd/{PageID}.md` | `wireframe/{PageID}.html`|
| **Step 5: 开发批注** | `Chat G` | ⏳ 待执行 | `.agents/instructions/chatG...expect.md`<br>+ `prd/` & `wireframe/` | `annotation/{PageID}.md`|
| **Step 6: 原型打包** | `打包器` | ⏳ 待执行 | `drafts/v{X.Y}/` | `dist/单体离线包.html` |
