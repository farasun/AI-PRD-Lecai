---
name: lecai-manual
description: 专门用于将 Lecai APP 的操作录屏视频、字幕和流程节点，自动生成面向老年用户的 Word 产品手册。触发场景：当用户提到“生成手册”、“录屏转 Word”、“老年人版产品指南”，并提供了 MP4 视频、字幕（Get笔记导出）以及基于 Main_PageList 的流程节点（.md）时使用。
---

# Lecai Manual — 产品手册自动化制作 Skill

本 Skill 旨在通过“视频处理 + AI 视觉分析 + 模板化排版”三步走，将原始视频快速转化为高质量的 Word 产品手册。

## 一、 输入三件套标准 (SOP Baseline)

触发前请检查并请求用户提供以下文件：
1.  **视频** (`.mp4`)：操作录音或纯录屏。
2.  **字幕** (`.txt` 或 `.srt`)：建议使用 Get笔记导出的格式。
3.  **流程节点** (`.md`)：基于 `foundation/Main_PageList.md` 列举本次手册包含的页面编号及核心动作点。

## 二、 交互式工作流 (Interactive Workflow)

请严格按以下步骤引导用户：

### 阶段 1：视频预处理 & 截帧
1.  调用 `scripts/parse_srt.py` 解析字幕至 `manual/subtitles.json`。
2.  调用 `scripts/extract_frames.py` 从视频中提取帧图片存入 `manual/frames/`。
3.  **视觉校对 (Internal)**：阅读提取的截图，分析画面中出现的 UI 元素。

### 阶段 2：流程匹配与内容生成 (互动环节)
1.  **节点对照**：将用户的“流程节点 MD”与提取到的“截图和原字幕”进行匹配。
2.  **大白话翻译**：参照 `foundation/friendly_names.md`，将页面编号翻译为易懂名称，并生成 1-2 句极其简洁的操作描述（侧重动作，而非背景）。
3.  **请求确认**：向用户展示一个预览表格/列表：
    *   页面编号 | 建议名称 | 匹配截图文件 | 建议说明文案
    *   *问：以上的匹配关系和文案是否符合“老年大学团长”的要求？是否有误配？*

### 阶段 3：Word 模板化渲染
1.  根据用户订正后的内容，生成/更新 `manual/test01_manual_draft.md`。
2.  调用 `scripts/parse_manual_md.py` 处理 MD 为结构化 JSON。
3.  调用 `node scripts/md2word_manual.js` 并应用 `manual/templates/001-老年大学团长.json` 模板。
4.  **最终交付**：告知用户输出文件路径，并提醒查看 [`Lecai_Manual_SOP.md`](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/manual/Lecai_Manual_SOP.md)。

## 三、 设计原则 (Design Principles)

*   **字大如斗**：正文必须维持 15pt 以上，标题 18-28pt。
*   **黑白分明**：全黑文字，避免花哨。
*   **不留编号**：手册中不得出现 CC-1, AC-2 等内部编号。
*   **动作导向**：说明文案只需写“点击按钮”、“勾选协议”，不要写“为了保证安全我们需要...”。

## 四、 核心工具参考

*   [scripts/parse_srt.py](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/scripts/parse_srt.py)
*   [scripts/extract_frames.py](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/scripts/extract_frames.py)
*   [scripts/md2word_manual.js](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/scripts/md2word_manual.js)
*   [scripts/parse_manual_md.py](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/scripts/parse_manual_md.py)
