# Lecai 手册制作标准化操作指南 (SOP)

> 本指南面向希望通过自动化工具快速产出产品手册的用户。

---

## 🛠 核心工具：Lecai Manual Skill

本工作流由项目专有的 **Lecai Manual Skill** 驱动。
*   **作用**：封装了视频截帧、AI 视觉匹配、大白话文案翻译及 Word 自动化排版的完整逻辑。
*   **源码位置**：[`.agents/skills/lecai-manual/`](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual/)
*   **安装包**：[`.agents/skills/lecai-manual.skill`](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual.skill)

---

## 一、 输入物准备 (Mandatory Inputs)

你需要准备以下三类文件，并告知 Agent 你的任务目标。

1.  **视频文件 (`.mp4`)**
    *   **建议**：录屏时，在每个关键页面多停留 1-2 秒，方便 AI 精准截帧。
2.  **转录文本 (`.txt`/`.srt`)**
    *   **工具**：推荐使用 **Get笔记 APP** 上传视频并获得导出脚本。
    *   **要求**：如果包含时间戳，配图会更精准。
3.  **流程需求 (`.md`)**
    *   **内容**：告知 AI 本次手册需要覆盖哪些页面（基于 `Main_PageList.md`）。
    *   **范例**：`manual/manual_case/test01/input/test01-flow.md`

---

## 二、 自动化步骤 (Execution)

### 步骤 1：激活模式
将上述文件上传给 Agent，并发送指令：“**请使用 lecai-manual skill，开始制作产品手册**”。

### 步骤 2：内容预审 (关键)
Agent 会自动处理视频。处理完成后，它会向你请示：
*   **检查列表**：AI 匹配的截图是否是你要的那个页面？
*   **文案检查**：AI 生成的“大白话”描述是否足够直白？是否删除了技术术语？
*   **确认**：回复“OK”或详细的修改意见。

### 步骤 3：一键渲染
在你的确认下，Agent 会利用 **001-老年大学团长模板** 进行排版：
*   **产出路径**：默认生成在 `manual/manual_case/test01/` 目录下。
*   **格式**：标准 `.docx` 文档。

---

## 三、 排版规范与调优

如果你需要修改手册的视觉风格，请咨询 Agent 修改以下配置文件：
*   **页面名称**：修改 `foundation/friendly_names.md` 可全局更新大白话译名。
*   **字号/图片大小**：修改 `manual/templates/001-老年大学团长.json`（目前默认 15pt 字号，12cm 截图限高）。

---

## 四、 常见问题排除

1.  **图片显示不出来？**
    *   确认 `.js` 的运行环境中已安装 `docx` 依赖（Agent 会自动处理）。
2.  **截图匹配完全牛头不对马嘴？**
    *   请检查流程节点 MD 中的页面 ID（如 AC-1）是否在视频中确实出现了。
3.  **生成的 Word 太乱？**
    *   Agent 支持自动缩放。如果还是太乱，建议减少单个页面的描述文字。
