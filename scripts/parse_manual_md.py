#!/usr/bin/env python3
"""
Phase 5a — 手册 MD 解析器
将手册 Markdown 解析为结构化 JSON，供 Word 生成器使用。

用法:
    python3 scripts/parse_manual_md.py manual/test01_manual_draft.md -o /tmp/manual_structured.json
"""

import argparse
import json
import re
import sys
from pathlib import Path


def parse_friendly_names(friendly_names_path: str) -> dict:
    """解析 friendly_names.md，返回 {页面编号: 大白话名称} 映射"""
    mapping = {}
    if not Path(friendly_names_path).exists():
        return mapping

    content = Path(friendly_names_path).read_text(encoding="utf-8")
    # 匹配表格行: | AC-1 | 登录弹窗 | 登录提示 |
    for match in re.finditer(r'\|\s*([A-Z]{2,3}-[\d-]+(?:（[^）]+）)?)\s*\|\s*[^|]+\|\s*([^|]+)\|', content):
        page_id = match.group(1).strip()
        friendly_name = match.group(2).strip()
        mapping[page_id] = friendly_name

    return mapping


def parse_manual_md(md_path: str, friendly_names: dict = None) -> dict:
    """解析手册 MD 为结构化 JSON"""
    content = Path(md_path).read_text(encoding="utf-8")
    lines = content.split("\n")

    result = {
        "title": "",
        "subtitle": "",
        "chapters": []
    }

    current_chapter = None
    current_step = None
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # 文档标题 (# 乐才 APP ...)
        if line.startswith("# ") and not line.startswith("## "):
            result["title"] = line[2:].strip()
            i += 1
            continue

        # 引用块 (> 适用版本 / 更新日期)
        if line.startswith(">"):
            text = line[1:].strip()
            if "适用版本" in text or "更新日期" in text:
                result["subtitle"] = (result["subtitle"] + "\n" + text).strip()
            i += 1
            continue

        # 章节标题 (## 第一章：...)
        if line.startswith("## "):
            if current_step and current_chapter:
                current_chapter["steps"].append(current_step)
                current_step = None
            if current_chapter:
                result["chapters"].append(current_chapter)

            current_chapter = {
                "title": line[3:].strip(),
                "steps": []
            }
            i += 1
            continue

        # 步骤标题 (### 1. CC-1 · 未登录状态首页)
        if line.startswith("### "):
            if current_step and current_chapter:
                current_chapter["steps"].append(current_step)

            raw_title = line[4:].strip()

            # 解析标题: "1. CC-1 · 未登录状态首页" 或 "1. iOS桌面"
            page_id = ""
            page_name = raw_title
            friendly_name = raw_title

            # 去掉序号前缀 "1. " "2. "
            num_match = re.match(r'^\d+\.\s*', raw_title)
            if num_match:
                page_name = raw_title[num_match.end():]

            # 尝试提取页面编号 "CC-1 · 名称" 或 "AC-2 · 名称"
            id_match = re.match(r'^([A-Z]{2,3}-[\d-]+(?:（[^）]+）)?)\s*[·•]\s*(.*)', page_name)
            if id_match:
                page_id = id_match.group(1).strip()
                page_name = id_match.group(2).strip()

            # 查找友好名称
            if friendly_names and page_id and page_id in friendly_names:
                friendly_name = friendly_names[page_id]
            else:
                friendly_name = page_name

            current_step = {
                "raw_title": raw_title,
                "page_id": page_id,
                "page_name": page_name,
                "friendly_name": friendly_name,
                "image": "",
                "description": ""
            }
            i += 1
            continue

        # 图片 (![alt](./frames/frame_001.jpg))
        img_match = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', line)
        if img_match and current_step:
            current_step["image"] = img_match.group(2)
            i += 1
            continue

        # 正文描述（非空行、非分隔线、非标题）
        if line and line != "---" and not line.startswith("#") and not line.startswith(">") and not line.startswith(".") and current_step:
            desc = current_step["description"]
            current_step["description"] = (desc + "\n" + line).strip() if desc else line

        i += 1

    # 收尾
    if current_step and current_chapter:
        current_chapter["steps"].append(current_step)
    if current_chapter:
        result["chapters"].append(current_chapter)

    return result


def main():
    parser = argparse.ArgumentParser(description="Phase 5a — 解析手册 MD 为结构化 JSON")
    parser.add_argument("input_file", help="手册 MD 文件路径")
    parser.add_argument("-o", "--output", default="/tmp/manual_structured.json",
                        help="输出 JSON 文件路径")
    parser.add_argument("--friendly-names", default=None,
                        help="友好名称映射表路径（friendly_names.md）")
    args = parser.parse_args()

    # 加载友好名称
    friendly_names = {}
    if args.friendly_names:
        friendly_names = parse_friendly_names(args.friendly_names)
        print(f"📋 加载友好名称映射: {len(friendly_names)} 条")

    # 解析 MD
    result = parse_manual_md(args.input_file, friendly_names)

    # 输出
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(result, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✅ 解析完成: {args.input_file}")
    print(f"   📖 标题: {result['title']}")
    print(f"   📚 章节数: {len(result['chapters'])}")
    total_steps = sum(len(ch['steps']) for ch in result['chapters'])
    print(f"   📝 步骤数: {total_steps}")
    print(f"   💾 输出: {args.output}")


if __name__ == "__main__":
    main()
