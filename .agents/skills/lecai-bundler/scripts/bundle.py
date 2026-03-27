import os
import sys
import json
import re
from pathlib import Path

def scan_dir(root_path, version_path, subdir, ext):
    """扫描目录并返回文件名与内容的映射"""
    result = {}
    full_dir = Path(root_path) / version_path / subdir
    if not full_dir.exists():
        print(f"⚠️  目录不存在: {full_dir}")
        return result
    
    for item in full_dir.glob(f"*{ext}"):
        key = item.stem
        result[key] = item.read_text(encoding="utf-8")
    return result

def safe_stringify(data):
    """安全 JSON 序列化，防止 </script> 破坏 HTML"""
    return json.dumps(data, ensure_ascii=False).replace("</script", "<\\/script")

def main():
    if len(sys.argv) < 2:
        print("❌ 请指定版本号，例如: python bundle.py drafts/v1.3.1")
        print("💡 可选参数: --init (初始化版本目录，生成本地 reader.html)")
        sys.exit(1)

    version_path_str = sys.argv[1]
    is_init = "--init" in sys.argv
    
    script_path = Path(__file__).resolve()
    # 脚本在 .agents/skills/lecai-bundler/scripts/bundle.py
    skill_root = script_path.parents[1]
    root_path = script_path.parents[4] 
    
    # 路径合法性检查
    ver_dir = root_path / version_path_str
    if not ver_dir.exists():
        ver_dir.mkdir(parents=True, exist_ok=True)
        print(f"📁 已创建新版本目录: {version_path_str}")

    # --- 初始化模式 ---
    if is_init:
        print(f"✨ 正在初始化版本: {version_path_str}")
        template_src = skill_root / "assets" / "reader.html"
        template_dst = ver_dir / "reader.html"
        
        if not template_src.exists():
            print(f"❌ Skill 模板文件丢失: {template_src}")
            sys.exit(1)
            
        import shutil
        shutil.copy2(template_src, template_dst)
        print(f"✅ 已生成本地预览引擎: {template_dst}")
        print(f"💡 现在您可以在设计过程中随时打开此文件预览效果。")
        return

    # --- 打包模式 ---
    print(f"📦 打包版本: {version_path_str}")
    
    # 1. 扫描文件
    print("🔍 扫描文件...")
    wire_data = scan_dir(root_path, version_path_str, "wireframe", ".html")
    spec_data = scan_dir(root_path, version_path_str, "annotation", ".md")
    flow_data = scan_dir(root_path, version_path_str, "flow", ".html")
    
    pl_path = root_path / version_path_str / "PageList.md"
    pl_data = pl_path.read_text(encoding="utf-8") if pl_path.exists() else ""
    
    print(f"   线框图: {len(wire_data)} 个")
    print(f"   功能规格: {len(spec_data)} 个")
    print(f"   流程图: {len(flow_data)} 个")
    
    if not wire_data and not flow_data:
        print("❌ 没有找到任何内容文件，请检查版本目录路径是否正确")
        sys.exit(1)
        
    # 2. 读取模板 (带降级逻辑)
    reader_path = root_path / version_path_str / "reader.html"
    if not reader_path.exists():
        print(f"💡 目录内未发现 reader.html，将使用 Skill 默认模板...")
        reader_path = skill_root / "assets" / "reader.html"
        if not reader_path.exists():
            print(f"❌ 默认模板也丢失了: {reader_path}")
            sys.exit(1)
    
    html = reader_path.read_text(encoding="utf-8")
    
    # 3. 注入数据
    data_script = f"""
<script>
// === BUNDLE MODE (联网版) ===
var __BUNDLE_MODE__ = true;
var __BUNDLE_VERSION__ = {json.dumps(version_path_str)};
var __WIRE_DATA__ = {safe_stringify(wire_data)};
var __SPEC_DATA__ = {safe_stringify(spec_data)};
var __FLOW_DATA__ = {safe_stringify(flow_data)};
var __PL_DATA__ = {safe_stringify(pl_data)};
</script>"""

    # 尝试注入到第一个 <script> 之前，或者 CONFIG & STATE 之前
    if "CONFIG & STATE" in html:
        # 使用 lambda 避免 re.sub 对 data_script 中反斜杠的转义解释
        html = re.sub(r'(<script>[\s\S]*?CONFIG & STATE)', lambda m: data_script + '\n' + m.group(1), html)
    elif "<script>" in html:
        html = html.replace("<script>", data_script + "\n<script>", 1)
    else:
        # 兜底：注入到 </head> 之前
        html = html.replace("</head>", data_script + "\n</head>")
    
    # 4. 注入提示弹层
    overlay = """
<!-- 联网提示弹层 -->
<div id="netOverlay" style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.7);backdrop-filter:blur(6px)">
  <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:32px 36px;max-width:420px;text-align:center;color:#e2e8f0;font-family:system-ui,sans-serif;box-shadow:0 25px 50px rgba(0,0,0,.4)">
    <div style="font-size:36px;margin-bottom:12px">🌐</div>
    <h2 style="margin:0 0 8px;font-size:18px;color:#f8fafc">需要联网查看</h2>
    <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;line-height:1.6">此文件是 <strong style="color:#e2e8f0">Antilecai {VERSION_PATH}</strong> 原型阅读器的打包快照。</p>
    <p style="margin:0 0 20px;font-size:13px;color:#94a3b8;line-height:1.6">页面样式依赖在线 CDN 加载，请确保设备已连接网络后继续。</p>
    <button onclick="document.getElementById('netOverlay').remove()" style="background:#4f46e5;color:#fff;border:none;padding:10px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500;transition:background .2s" onmouseover="this.style.background='#4338ca'" onmouseout="this.style.background='#4f46e5'">我已联网，继续查看</button>
  </div>
</div>""".replace("{VERSION_PATH}", version_path_str)

    last_body_idx = html.rfind('</body>')
    if last_body_idx != -1:
        html = html[:last_body_idx] + overlay + '\n' + html[last_body_idx:]
        
    # 5. 输出
    dist_dir = root_path / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)
    
    safe_name = version_path_str.replace('/', '-').replace('\\', '-')
    out_file_name = f"Antilecai-{safe_name}.html"
    out_path = dist_dir / out_file_name
    
    out_path.write_text(html, encoding="utf-8")
    
    size_kb = len(html.encode("utf-8")) // 1024
    print(f"\n✅ 打包完成!")
    print(f"   输出: {out_path}")
    print(f"   大小: {size_kb} KB")
    print("\n📨 收件人需联网打开此文件，CDN 样式会自动加载。")

if __name__ == "__main__":
    main()
