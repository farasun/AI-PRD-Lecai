---
name: lecai-manual
description: 专门用于将 Lecai APP 的操作录屏视频、字幕和流程节点，自动生成面向老年用户的 Word 产品手册。触发场景：当用户提到“生成手册”、“录屏转 Word”、“老年人版产品指南”，或者只是说“想把录屏视频做成文档”并提供 MP4、Get笔记字幕及 Main_PageList 流程节点时使用。即便用户没提“老年人”，只要涉及 Lecai APP 操作指南制作，都应主动触发，因为本 Skill 封装了该项目特有的视觉逻辑。
---

# Lecai Manual — 产品手册自动化制作 Skill

本 Skill 旨在通过“视频处理 + AI 视觉分析 + 模板化排版”三步走，将原始视频快速转化为高质量的 Word 产品手册。

## 一、 输入标准与准入检查

在执行任何脚本前，你必须确保已经获得以下“三件套”输入物。如果缺失，请立即停止并向用户索要：
1.  **视频** (`.mp4`)：原始操作录屏。
2.  **字幕** (`.txt` 或 `.srt`)：来自 Get 笔记的转录脚本。
3.  **流程节点** (`.md`)：基于 `foundation/Main_PageList.md` 明确了本次要覆盖的页面 ID（如 CC-1, AC-9）。

> [!IMPORTANT]
> **设计初衷 (Why)**：老年人对内部页面 ID（如 CC-1）无感，他们需要的是“点击首页”这样的大白话。本 Skill 强制要求三件套，是为了让 AI 能在视觉线索和业务节点之间建立精准联系。

## 二、 交互式分步工作流 (Interactive Workflow)

作为 Agent，你应严格引导用户完成以下闭环。每一步完成后，告知用户进度。

### 阶段 1：视频预处理 & 截帧
1.  使用 `scripts/parse_srt.py` 解析字幕至 `subtitles.json`。
2.  使用 `scripts/extract_frames.py` 从视频中提取帧图片。
    *   **规范**：建议将截帧存放在项目外的临时目录（如 `/tmp/[任务名]_frames/`），并**明确告知用户该路径**，方便其手动浏览。
3.  **视觉校对 (Vision-First)**：
    *   **核心要求**：直接利用 Agent 自身的 Vision 能力读取 `frames/` 目录下的截图进行批量分析。
    *   **禁止操作**：严禁打开浏览器逐帧查看截图，这会严重降低处理效率。

### 阶段 2：流程匹配与 MD 草稿审计 (核心环节)
1.  **节点对照**：结合模型 Vision 分析结果，将“流程节点”与“截图/字幕”进行最佳匹配。
2.  **大白话翻译**：参照 `foundation/friendly_names.md` 映射页面名称。
3.  **生成审核 MD**：
    *   **执行**：在项目对应任务目录下直接生成或更新 `[任务名]_manual_draft.md`。
    *   **交互**：在对话中展示 MD 文件的链接，邀请用户直接在编辑器中预览配图和文案是否符合“老年大学团长”的要求。
    *   **话术**：“我已为您生成了手册草稿 MD，请您点击 [文件名] 查看。如有图片不准或文案需调整，您可直接修改或告知我为您精准替换。”

### 阶段 3：Word 模板化产出
1.  用户确认 MD 完备后，依次调用 `parse_manual_md.py` 和 `md2word_manual.js`。
2.  **强制模板**：必须应用 `templates/001-老年大学团长.json` 模板。

### 阶段 4：归档与空间清理
1.  **资产归档**：将 MD 中最终选用的截图（几张关键帧）从 `/tmp` 拷贝至项目内的 `frames/` 目录。
2.  **主动清理**：Word 生成并确认无误后，**必须主动询问**用户是否需要清理 `/tmp` 下产生的数百张临时截帧，防止磁盘空间被占满。

## 三、 设计原则 (Design Principles)

*   **字如其人**：正文 15pt，标题 18-28pt。字一定要够大。
*   **深藏功名**：手册最终产物中严禁出现 CC-1、AC-2 等页面编号，全部替换为友好名称。
*   **动作导向**：说明文案只需写“点击按钮”、“勾选协议”，不要写冗长的背景描述。

## 四、 核心资产地图

*   **脚本库**: [scripts/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual/scripts/)
*   **渲染模板**: [001-老年大学团长.json](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual/templates/001-老年大学团长.json)
*   **示例库**: [examples/](file:///Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/.agents/skills/lecai-manual/examples/)
