/**
 * Antilecai 原型阅读器 — 单文件打包脚本（联网版）
 * 
 * 用法: node scripts/bundle.js releases/v1.0 或 node scripts/bundle.js drafts/v1.1
 * 输出: dist/Antilecai-releases-v1.0.html
 * 
 * 说明: 打包产物保留 CDN 引用（Tailwind / Remix Icon / marked.js），
 *       需要联网才能正常显示。线框图、规格、流程图等内容数据会内联。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VERSION_PATH = process.argv[2];

if (!VERSION_PATH) {
    console.error('❌ 请指定版本号，例如: node scripts/bundle.js releases/v1.0');
    process.exit(1);
}

// ========================================
// 1. 扫描文件
// ========================================
function scanDir(dir, ext) {
    const result = {};
    const fullDir = path.join(ROOT, VERSION_PATH, dir);
    if (!fs.existsSync(fullDir)) {
        console.warn(`⚠️  目录不存在: ${fullDir}`);
        return result;
    }
    fs.readdirSync(fullDir).forEach(file => {
        if (file.endsWith(ext)) {
            const key = file.replace(ext, '');
            result[key] = fs.readFileSync(path.join(fullDir, file), 'utf-8');
        }
    });
    return result;
}

// ========================================
// 2. 安全 JSON 序列化（防止 </script> 破坏 HTML）
// ========================================
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/gi, '<\\/script');
}

// ========================================
// 3. 主流程
// ========================================
function main() {
    console.log(`📦 打包版本: ${VERSION_PATH}`);
    console.log('');

    // 3.1 扫描源文件
    console.log('🔍 扫描文件...');
    const wireData = scanDir('wireframe', '.html');
    const specData = scanDir('annotation', '.md');
    const flowData = scanDir('flow', '.html');

    // 读取 PageList
    const plPath = path.join(ROOT, VERSION_PATH, 'PageList.md');
    const plData = fs.existsSync(plPath) ? fs.readFileSync(plPath, 'utf-8') : '';

    console.log(`   线框图: ${Object.keys(wireData).length} 个`);
    console.log(`   功能规格: ${Object.keys(specData).length} 个`);
    console.log(`   流程图: ${Object.keys(flowData).length} 个`);

    if (Object.keys(wireData).length === 0 && Object.keys(flowData).length === 0) {
        console.error('❌ 没有找到任何文件，请检查版本目录是否存在');
        process.exit(1);
    }

    // 3.2 读取 index.html 模板
    console.log('');
    console.log('🛠️  组装单文件...');
    let html = fs.readFileSync(path.join(ROOT, VERSION_PATH, 'reader.html'), 'utf-8');

    // 3.3 注入 Bundle 标志 + 数据（CDN 引用原样保留，只嵌入内容数据）
    const dataScript = `
<script>
// === BUNDLE MODE (联网版) ===
var __BUNDLE_MODE__ = true;
var __BUNDLE_VERSION__ = ${JSON.stringify(VERSION_PATH)};
var __WIRE_DATA__ = ${safeStringify(wireData)};
var __SPEC_DATA__ = ${safeStringify(specData)};
var __FLOW_DATA__ = ${safeStringify(flowData)};
var __PL_DATA__ = ${safeStringify(plData)};
</script>`;

    // 在主 <script> 之前注入数据
    html = html.replace(/(<script>[\s\S]*?CONFIG & STATE)/, dataScript + '\n$1');

    // 3.4 注入联网提示弹层
    const overlay = `
<!-- 联网提示弹层 -->
<div id="netOverlay" style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.7);backdrop-filter:blur(6px)">
  <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:32px 36px;max-width:420px;text-align:center;color:#e2e8f0;font-family:system-ui,sans-serif;box-shadow:0 25px 50px rgba(0,0,0,.4)">
    <div style="font-size:36px;margin-bottom:12px">🌐</div>
    <h2 style="margin:0 0 8px;font-size:18px;color:#f8fafc">需要联网查看</h2>
    <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;line-height:1.6">此文件是 <strong style="color:#e2e8f0">Antilecai ${VERSION_PATH}</strong> 原型阅读器的打包快照。</p>
    <p style="margin:0 0 20px;font-size:13px;color:#94a3b8;line-height:1.6">页面样式依赖在线 CDN 加载，请确保设备已连接网络后继续。</p>
    <button onclick="document.getElementById('netOverlay').remove()" style="background:#4f46e5;color:#fff;border:none;padding:10px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500;transition:background .2s" onmouseover="this.style.background='#4338ca'" onmouseout="this.style.background='#4f46e5'">我已联网，继续查看</button>
  </div>
</div>`;

    // 在最后一个 </body> 前插入弹层（避免匹配 JSON 数据中的 </body>）
    const lastBodyIdx = html.lastIndexOf('</body>');
    if (lastBodyIdx !== -1) {
        html = html.substring(0, lastBodyIdx) + overlay + '\n' + html.substring(lastBodyIdx);
    }

    // 3.5 输出
    const distDir = path.join(ROOT, 'dist');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

    const outFile = path.join(distDir, `Antilecai-${VERSION_PATH.replace('/', '-')}.html`);
    fs.writeFileSync(outFile, html, 'utf-8');

    const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(0);
    console.log('');
    console.log(`✅ 打包完成!`);
    console.log(`   输出: ${outFile}`);
    console.log(`   大小: ${sizeKB} KB`);
    console.log('');
    console.log('📨 收件人需联网打开此文件，CDN 样式会自动加载。');
}

main();
