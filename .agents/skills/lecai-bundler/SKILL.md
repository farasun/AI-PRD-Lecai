---
name: lecai-bundler
description: Lecai 原型阅读器单文件打包工具。将指定版本（如 drafts/v1.3.1）的线框图、功能规格、流程图打包为单个可分享的 HTML 文件。当用户提到以下场景时激活：打包原型阅读器、生成可分享的原型文件、单文件打包、bundle Antilecai、把原型分享给同事、生成 dist 版本。即使用户只说"打包 v2.0"也应触发。
---

# Lecai 原型阅读器打包

将 Lecai 项目中指定版本的线框图、规格文档、流程图打包为单个 HTML 文件，可直接分享给同事双击打开（需联网）。

## 打包流程

### 1. 确认版本目录

向用户确认打包的版本路径（如 `drafts/v1.3.1` 或 `releases/v1.0`）。

### 2. 检查文件就绪

确认目标目录下存在以下子目录：
- `wireframe/` — 线框图 `.html`
- `annotation/` — 功能规格 `.md`
- `flow/` — 流程图 `.html`
- `PageList.md` — 页面清单

如有缺失，提示用户先生成对应内容。

### 3. 检查 reader.html 模板

确认目标路径下存在 `reader.html`（作为打包的基础模板）。

### 4. 执行打包

```powershell
node scripts/bundle.js <版本路径>
```
*例如: `node scripts/bundle.js drafts/v1.3.1`*

输出将生成在 `dist/` 目录下：
`d:\AntiGravity\AI-PRD-Lecai\dist\Lecai-<版本路径替换后的名称>.html`

### 5. 验证

打开生成的文件，确认：
- 联网提示弹层正常显示
- 侧边栏加载页面/流程图列表
- 线框图、规格、流程图均可正常切换查看

## 技术要点

- 打包产物依赖在线 CDN（Tailwind / Remix Icon），需联网查看。
- `bundle.js` 会扫描对应版本的子目录并将其内联。
- 注入的数据存储在 `__WIRE_DATA__`、`__SPEC_DATA__` 等全局变量中。

## 修改注意事项

如需修改 `scripts/bundle.js`，请确保：
1. **使用 `var`** 定义注入数据变量。
2. **安全转义**：所有 HTML 内容必须经过 `safeStringify` 处理。
3. **注入位置**：弹层注入在最后一个 `</body>` 之前。
