# Antilecai 原型阅读器

> 一站式原型预览工具：线框图 + 功能规格 + 流程图，支持一键打包为单文件分享。

---

## 📁 目录结构

```
Antilecai/
├── index.html              ← 本地开发阅读器（需启动本地服务器）
├── README.md               ← 本文件
├── doc/
│   └── PageList.md          ← 页面清单（命名唯一真理）
├── wireframe/               ← 线框原型（按版本管理）
│   └── v1.0/
│       └── CC-5.html
├── Spec/                    ← 功能规格（按版本管理）
│   └── v1.0/
│       └── CC-5.md
├── flow/                    ← 流程图（按版本管理）
│   └── v1.0/
│       ├── old-upload.html
│       ├── update-upload-v0.5.html
│       └── update-upload-v1.0.html
├── scripts/
│   └── bundle.js            ← 打包脚本
└── dist/                    ← 打包输出（可分享的单文件）
    └── Antilecai-v1.0.html
```

---

## 🚀 本地预览

```bash
# 在项目根目录执行
npx -y serve . -l 3000

# 浏览器访问
http://localhost:3000
```

---

## 📦 打包分享

将指定版本的所有内容打包为**单个 HTML 文件**，可直接通过微信/钉钉/邮件发送给同事双击打开：

```bash
node scripts/bundle.js v1.0
# 输出 → dist/Antilecai-v1.0.html
```

### 注意事项

- **需要联网**：打包版保留 CDN 引用（Tailwind CSS / Remix Icon / marked.js），打开时需联网加载样式
- 打开文件时会弹出联网提示，确认后即可正常浏览
- 线框图、规格文档、流程图等**内容数据**已完全内嵌，无需额外文件

---

## 🔄 版本迭代

创建新版本时，在 `wireframe/`、`Spec/`、`flow/` 下新建子目录：

```bash
mkdir wireframe/v2.0
mkdir Spec/v2.0
mkdir flow/v2.0
```

修改 `index.html` 中的路径配置指向新版本：
```javascript
const C = { wire: '/wireframe/v2.0/', spec: '/Spec/v2.0/', flow: '/flow/v2.0/', ... };
```

打包时指定对应版本号：
```bash
node scripts/bundle.js v2.0
```

---

## 🛠️ 内容生成工作流

### 1. 生成线框原型

使用 `/chatD-wireframe-expect` 工作流（Chat D - 低保真原型工程师）。

> 生成后将 HTML 文件放入 `wireframe/{版本号}/` 目录，文件名为 `{页面编号}.html`（如 `CC-5.html`）。

*（待核实：工作流的具体触发方式和参数）*

### 2. 生成功能规格

使用 `/chatG-Spec-expect` 工作流（原型批注专家）。

> 生成后将 MD 文件放入 `Spec/{版本号}/` 目录，文件名为 `{页面编号}.md`（如 `CC-5.md`）。

*（待核实：工作流的具体触发方式和参数）*

### 3. 生成流程图

使用 `/Low-Fi-Flow-Map-Plugin` 工作流。

> 生成后将 HTML 文件放入 `flow/{版本号}/` 目录。

---

## 📋 PageList 命名规范

`doc/PageList.md` 是页面编号和名称的**唯一真理来源**。

所有生成工作流中，节点/页面的命名必须严格遵循此文件中的 `页面编号 + 页面名称` 格式（如 `CC-5 · 社团活动详情`），禁止使用 A/B/C 或 A-1/A-2 等自创编号。
