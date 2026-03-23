#!/usr/bin/env python3
"""
Phase 2 — 视频关键帧截取器
根据字幕时间戳从视频中提取关键帧截图。

用法（基于字幕时间戳）:
    python3 scripts/extract_frames.py manual/subtitles.json manual/input/demo_01.mp4 -o manual/frames/

用法（均匀截帧，不依赖字幕）:
    python3 scripts/extract_frames.py --uniform --interval 3 manual/input/demo_01.mp4 -o manual/frames/
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def get_video_duration(video_path: str) -> float:
    """获取视频时长（秒）"""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", video_path],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def extract_frame_at(video_path: str, timestamp_sec: float, output_path: str) -> bool:
    """在指定时间点截取一帧"""
    # 将秒数转为 HH:MM:SS.mmm 格式
    h = int(timestamp_sec // 3600)
    m = int((timestamp_sec % 3600) // 60)
    s = timestamp_sec % 60
    ts_str = f"{h:02d}:{m:02d}:{s:06.3f}"

    result = subprocess.run(
        ["ffmpeg", "-ss", ts_str, "-i", video_path,
         "-frames:v", "1", "-q:v", "2", output_path, "-y"],
        capture_output=True, text=True
    )
    return result.returncode == 0


def extract_by_subtitles(subtitles_path: str, video_path: str, output_dir: str) -> list[dict]:
    """基于字幕时间戳截帧（在每条字幕的中间时刻截取）"""
    with open(subtitles_path, "r", encoding="utf-8") as f:
        subtitles = json.load(f)

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    extracted = []
    for entry in subtitles:
        if entry.get("mid_sec") is None:
            print(f"   ⚠️ 字幕 #{entry['index']} 无时间戳，跳过")
            continue

        frame_name = f"frame_{entry['index']:03d}.jpg"
        frame_path = output_dir / frame_name

        success = extract_frame_at(video_path, entry["mid_sec"], str(frame_path))
        if success:
            extracted.append({
                "index": entry["index"],
                "timestamp_sec": entry["mid_sec"],
                "frame_file": frame_name,
                "subtitle_text": entry["text"]
            })
            print(f"   ✅ #{entry['index']:03d} @ {entry['start']} — {frame_name}")
        else:
            print(f"   ❌ #{entry['index']:03d} @ {entry['start']} — 截帧失败")

    return extracted


def extract_uniform(video_path: str, output_dir: str, interval: float = 3.0) -> list[dict]:
    """均匀截帧"""
    duration = get_video_duration(video_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"📹 视频时长: {duration:.1f}s，截帧间隔: {interval}s")

    extracted = []
    idx = 1
    t = 0.0
    while t < duration:
        frame_name = f"frame_{idx:03d}.jpg"
        frame_path = output_dir / frame_name

        success = extract_frame_at(video_path, t, str(frame_path))
        if success:
            extracted.append({
                "index": idx,
                "timestamp_sec": round(t, 3),
                "frame_file": frame_name,
                "subtitle_text": None
            })
            print(f"   ✅ #{idx:03d} @ {t:.1f}s — {frame_name}")

        idx += 1
        t += interval

    return extracted


def main():
    parser = argparse.ArgumentParser(
        description="Phase 2 — 从视频中截取关键帧"
    )
    parser.add_argument("input", nargs="+",
                        help="字幕JSON路径 + 视频路径（或 --uniform 模式下仅需视频路径）")
    parser.add_argument("-o", "--output", default="frames/",
                        help="输出帧目录（默认: frames/）")
    parser.add_argument("--uniform", action="store_true",
                        help="均匀截帧模式（不依赖字幕时间戳）")
    parser.add_argument("--interval", type=float, default=3.0,
                        help="均匀截帧间隔（秒，默认: 3.0）")
    args = parser.parse_args()

    if args.uniform:
        video_path = args.input[0]
        print(f"🎬 均匀截帧模式: {video_path}")
        extracted = extract_uniform(video_path, args.output, args.interval)
    else:
        if len(args.input) < 2:
            print("❌ 非 --uniform 模式需要两个参数: subtitles.json video.mp4", file=sys.stderr)
            sys.exit(1)
        subtitles_path, video_path = args.input[0], args.input[1]
        print(f"🎬 字幕定位截帧: {video_path}")
        print(f"📄 字幕文件: {subtitles_path}")
        extracted = extract_by_subtitles(subtitles_path, video_path, args.output)

    # 保存截帧清单
    manifest_path = Path(args.output) / "frames_manifest.json"
    manifest_path.write_text(
        json.dumps(extracted, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"\n✅ 截帧完成: {len(extracted)} 帧 → {args.output}")
    print(f"📋 清单文件: {manifest_path}")


if __name__ == "__main__":
    main()
