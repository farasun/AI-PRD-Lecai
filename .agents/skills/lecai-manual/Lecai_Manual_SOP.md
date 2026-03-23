# Lecai 产品手册自动化制作 SOP (v1.0)

本文档旨在指导如何使用 Lecai Manual 自动化工具，将 APP 录屏视频转化为面向老年大学用户的 Word 手册。

---

## 一、 准备工作

在开始之前，请确保你拥有以下“三件套”输入物：

1.  **视频文件 (`.mp4`)**：
    *   建议：录屏时操作稍慢，每个关键页面停留 1-2 秒。
2.  **字幕文本 (`.txt` 或 `.srt`)**：
    *   获取方式：使用 **Get笔记 APP** 上传视频，导出“字幕脚本”或“按空行分段的文本”。
3.  **流程节点文档 (`.md`)**：
    *   内容：基于 `foundation/Main_PageList.md` 列出本次手册需要包含的页面编号及关键步骤。
    *   示例：查看 `manual/input/test01-flow.md`。

---

## 二、 制作流程

### 第一步：视频处理与解析 (Phase 1)
Agent 会根据字幕时间戳自动从视频中提取关键帧图片。

*   **运行命令** (由 Agent 执行):
    ```bash
    # 解析字幕
    python3 scripts/parse_srt.py [字幕路径] -o manual/subtitles.json
    # 提取截图
    python3 scripts/extract_frames.py manual/subtitles.json [视频路径] -o manual/frames/
    ```

### 第二步：内容匹配与人工确认 (核心环节)
AI 会基于视觉分析，将截图与你的流程节点进行匹配，并自动翻译为“老年大学版”大白话。

*   **确认要点**：
    *   截图是否对应正确的页面？
    *   步骤描述是否简洁（1-2句）？
    *   是否使用了 `friendly_names.md` 中的大白话名称？

### 第三步：生成 Word 文档 (Phase 2)
确认匹配逻辑无误后，Agent 将一键生成最终的排版文件。

*   **运行命令** (由 Agent 执行):
    ```bash
    # MD 组装与转换
    python3 scripts/parse_manual_md.py [手册草稿.md] --friendly-names foundation/friendly_names.md -o /tmp/manual_structured.json
    node scripts/md2word_manual.js /tmp/manual_structured.json manual/templates/001-老年大学团长.json -o manual/乐才APP功能指引手册.docx --frames-dir manual/frames
    ```

---

## 三、 排版规范 (001-老年大学团长模板)

本工作流默认应用以下针对老年用户的设计规范：
*   **字号**：正文 15pt，标题 18-28pt（偏大）。
*   **布局**：单列简洁布局，全黑文字。
*   **截图**：高度限制在 12cm 以内，防止撑破页面。
*   **命名**：隐藏页面编号（如 CC-1），仅显示易懂的页面名称。

---

## 四、 常见问题 (FAQ)

*   **Q: 截图太模糊怎么办？**
    *   A: 确保原始录屏分辨率不低于 1080p，且在关键动作处有停顿。
*   **Q: 页面名称不好听？**
    *   A: 请修改 `foundation/friendly_names.md` 中的对应条目，重新运行脚本即可。
*   **Q: 字幕没有时间戳？**
    *   A: 脚本支持纯文本模式，但建议使用带时间戳的 SRT 以获得更精准的配图。
