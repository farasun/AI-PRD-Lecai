#!/usr/bin/env python3
"""
Phase 1 — SRT 字幕解析器
将 SRT 文件解析为结构化 JSON，供后续截帧和内容组装使用。

用法:
    python3 scripts/parse_srt.py manual/input/demo_01.srt -o manual/subtitles.json

也支持纯文本输入（按空行分段，无时间戳）:
    python3 scripts/parse_srt.py manual/input/demo_01.txt -o manual/subtitles.json
"""

import argparse
import json
import re
import sys
from pathlib import Path


def parse_srt_timestamp(ts: str) -> float:
    """将 SRT 时间戳 (HH:MM:SS,mmm) 转为秒数"""
    ts = ts.strip().replace(",", ".")
    parts = ts.split(":")
    h, m, s = int(parts[0]), int(parts[1]), float(parts[2])
    return h * 3600 + m * 60 + s


def format_timestamp(seconds: float) -> str:
    """将秒数格式化为 HH:MM:SS.mmm"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}"


def parse_srt(content: str) -> list[dict]:
    """解析 SRT 格式字幕"""
    entries = []
    # 按空行分割字幕块
    blocks = re.split(r"\n\s*\n", content.strip())

    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 2:
            continue

        # 第一行：序号
        try:
            index = int(lines[0].strip())
        except ValueError:
            continue

        # 第二行：时间戳
        ts_match = re.match(
            r"(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})",
            lines[1].strip()
        )
        if not ts_match:
            continue

        start_sec = parse_srt_timestamp(ts_match.group(1))
        end_sec = parse_srt_timestamp(ts_match.group(2))
        mid_sec = (start_sec + end_sec) / 2

        # 剩余行：文本内容
        text = " ".join(line.strip() for line in lines[2:] if line.strip())

        entries.append({
            "index": index,
            "start": format_timestamp(start_sec),
            "end": format_timestamp(end_sec),
            "start_sec": round(start_sec, 3),
            "end_sec": round(end_sec, 3),
            "mid_sec": round(mid_sec, 3),
            "text": text
        })

    return entries


def parse_custom_speaker(content: str) -> list[dict]:
    """解析带有'说话人X'和时间戳格式的文本"""
    entries = []
    lines = content.strip().split("\n")
    idx = 1
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if '说话人' in line:
            i += 1
            if i >= len(lines): break
            ts_line = lines[i].strip()
            
            parts = ts_line.split(':')
            start_sec = 0.0
            if len(parts) == 3:
                start_sec = int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
            elif len(parts) == 2:
                start_sec = int(parts[0]) * 60 + float(parts[1])
            
            i += 1
            text = []
            while i < len(lines) and '说话人' not in lines[i] and not re.match(r'^\d+$', lines[i].strip()) and lines[i].strip() != '.':
                if lines[i].strip():
                    text.append(lines[i].strip())
                i += 1
                
            entries.append({
                "index": idx,
                "start": format_timestamp(start_sec),
                "end": format_timestamp(start_sec + 2),
                "start_sec": round(start_sec, 3),
                "end_sec": round(start_sec + 2, 3),
                "mid_sec": round(start_sec + 1, 3),
                "text": " ".join(text)
            })
            idx += 1
        else:
            i += 1
    return entries

def parse_plaintext(content: str) -> list[dict]:
    """解析纯文本（按空行分段，无时间戳信息）"""
    entries = []
    paragraphs = re.split(r"\n\s*\n", content.strip())

    for i, para in enumerate(paragraphs, 1):
        text = " ".join(line.strip() for line in para.strip().split("\n") if line.strip())
        if text:
            entries.append({
                "index": i,
                "start": None,
                "end": None,
                "start_sec": None,
                "end_sec": None,
                "mid_sec": None,
                "text": text
            })

    return entries


def main():
    parser = argparse.ArgumentParser(
        description="Phase 1 — 解析字幕文件为结构化 JSON"
    )
    parser.add_argument("input_file", help="SRT 或 TXT 字幕文件路径")
    parser.add_argument("-o", "--output", default="subtitles.json",
                        help="输出 JSON 文件路径（默认: subtitles.json）")
    args = parser.parse_args()

    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"❌ 文件不存在: {input_path}", file=sys.stderr)
        sys.exit(1)

    content = input_path.read_text(encoding="utf-8")

    # 自动检测格式
    if input_path.suffix.lower() == ".srt" or re.search(r"\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->", content):
        print(f"📄 检测到 SRT 格式: {input_path.name}")
        entries = parse_srt(content)
    elif '说话人' in content:
        print(f"📄 检测到'说话人'自定义格式: {input_path.name}")
        entries = parse_custom_speaker(content)
    else:
        print(f"📄 检测到纯文本格式: {input_path.name}")
        entries = parse_plaintext(content)

    # 输出
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✅ 解析完成: {len(entries)} 条字幕 → {output_path}")

    # 预览前 3 条
    for entry in entries[:3]:
        ts = f"[{entry['start']} → {entry['end']}]" if entry['start'] else "[无时间戳]"
        print(f"   {entry['index']}. {ts} {entry['text'][:50]}...")


if __name__ == "__main__":
    main()
