# Lecai 手册制作中心 (Manual Center)

本目录集成了 Lecai APP 产品手册的自动化制作工作流、Skill 插件以及相关资产。

## 📂 资产地图 (Asset Map)

*   **[.agents/skills/lecai-manual/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual/)**: 核心 Skill 插件源码库，包含自动化脚本与排版模板。
*   **[.agents/skills/lecai-manual.skill](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual.skill)**: 打包好的 Agent 插件产出物，用于跨环境安装。
*   **[manual_case/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/manual/manual_case/)**: 产品手册任务案例库。
    *   `test01/`: 第一个案例（iOS下载与登录）。
*   **[templates/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/manual/templates/)**: Word 渲染模板库（如 001-老年大学团长模板）。
*   **[achieve/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/manual/achieve/)**: 历史测试记录与存档。
*   **[SOP.md](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/manual/SOP.md)**: 面向人类的标准化操作指南。

---

## 🚀 核心工作流 (Workflow)

我们采用 **“视频录制 -> AI 视觉解析 -> 自动化排版”** 的高效方式制作手册：

1.  **准备**：获取操作录屏（MP4）、Get笔记导出的字幕、以及基于 PageList 的流程节点。
2.  **触发**：向支持本 Skill 的 Agent 提供上述“三件套”。
3.  **互动**：Agent 自动截帧并进行视觉匹配，向你展示“大白话”名称与截图的对应关系。
4.  **导出**：确认通过后，Agent 调用 `docx-js` 渲染出符合老年用户视觉习惯（大字、简洁）的 Word 文档。

---

## 🛠 技术底座
*   **Python**: 字幕解析与视频截帧。
*   **Node.js (docx-js)**: 专业的 Word 文档渲染。
*   **Large Font System**: 针对老年用户的 15pt+ 专项字号设计。
