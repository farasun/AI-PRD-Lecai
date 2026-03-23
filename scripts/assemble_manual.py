#!/usr/bin/env python3
"""
Phase 4 — 手册 Markdown 组装器
将 content_mapping.json 中的截图和说明文本组装为完整的手册 Markdown 文件。

用法:
    python3 scripts/assemble_manual.py manual/content_mapping.json -o manual/manual_draft.md
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path


def build_markdown(mapping: list[dict], frames_dir: str = "./frames") -> str:
    """根据内容映射组装手册 Markdown"""

    today = date.today().strftime("%Y-%m-%d")

    lines = [
        "# 乐才 APP 功能指引手册",
        "",
        f"> 适用版本：乐才社团版",
        f"> 更新日期：{today}",
        "",
        "---",
        "",
    ]

    current_chapter = None
    section_num = 0

    for item in mapping:
        chapter = item.get("chapter", "未分类")
        page_id = item.get("page_id", "")
        page_name = item.get("page_name", "")
        frame_file = item.get("frame_file", "")
        manual_text = item.get("manual_text", "")

        # 新章节
        if chapter != current_chapter:
            current_chapter = chapter
            section_num = 0
            lines.append(f"## {chapter}")
            lines.append("")

        section_num += 1

        # 小节标题
        title_parts = []
        if page_id:
            title_parts.append(page_id)
        if page_name:
            title_parts.append(page_name)
        section_title = " · ".join(title_parts) if title_parts else f"步骤 {section_num}"

        lines.append(f"### {section_num}. {section_title}")
        lines.append("")

        # 截图
        if frame_file:
            frame_path = f"{frames_dir}/{frame_file}"
            lines.append(f"![{page_name or section_title}]({frame_path})")
            lines.append("")

        # 说明文本
        if manual_text:
            lines.append(manual_text)
            lines.append("")

        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Phase 4 — 将截图和说明文本组装为手册 Markdown"
    )
    parser.add_argument("mapping_file", help="content_mapping.json 文件路径")
    parser.add_argument("-o", "--output", default="manual_draft.md",
                        help="输出 Markdown 文件路径（默认: manual_draft.md）")
    parser.add_argument("--frames-dir", default="./frames",
                        help="截图目录的相对路径（默认: ./frames）")
    args = parser.parse_args()

    mapping_path = Path(args.mapping_file)
    if not mapping_path.exists():
        print(f"❌ 文件不存在: {mapping_path}", file=sys.stderr)
        sys.exit(1)

    with open(mapping_path, "r", encoding="utf-8") as f:
        mapping = json.load(f)

    if not mapping:
        print("⚠️ content_mapping.json 为空，没有内容可组装", file=sys.stderr)
        sys.exit(1)

    print(f"📋 读取 {len(mapping)} 条内容映射")

    md_content = build_markdown(mapping, args.frames_dir)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(md_content, encoding="utf-8")

    print(f"✅ 手册 MD 生成完成: {output_path}")

    # 统计
    chapters = set(item.get("chapter", "") for item in mapping)
    frames_count = sum(1 for item in mapping if item.get("frame_file"))
    print(f"   📖 章节数: {len(chapters)}")
    print(f"   🖼️  截图数: {frames_count}")
    print(f"   📝 条目数: {len(mapping)}")


if __name__ == "__main__":
    main()
