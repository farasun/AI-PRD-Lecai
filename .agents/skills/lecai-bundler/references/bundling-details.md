# 打包流程详细参考

## 前置条件

- Node.js 已安装
- 项目根目录: `d:\AntiGravity\Antilecai`

## 目录结构

```
Antilecai/
├── index.html              ← 阅读器主文件（支持双模式）
├── doc/PageList.md          ← 页面清单
├── wireframe/{版本}/        ← 线框图 (.html)
├── Spec/{版本}/             ← 功能规格 (.md)
├── flow/{版本}/             ← 流程图 (.html)
├── scripts/bundle.js        ← 打包脚本
└── dist/                    ← 输出目录
```

## 打包命令

```bash
node d:\AntiGravity\Antilecai\scripts\bundle.js <版本号>
# 示例: node d:\AntiGravity\Antilecai\scripts\bundle.js v1.0
# 输出: dist/Antilecai-v1.0.html
```

## 打包机制（联网版）

`bundle.js` 的工作原理：
1. 扫描 `wireframe/<版本>/`、`Spec/<版本>/`、`flow/<版本>/` 下的文件
2. 读取 `doc/PageList.md`
3. 将所有内容通过 `JSON.stringify` 内嵌进 `index.html`（用 `var` 定义全局变量）
4. 保留 CDN 引用（Tailwind CSS / Remix Icon / marked.js），不内联
5. 在 `</body>` 前注入联网提示弹层
6. 输出到 `dist/Antilecai-<版本>.html`

### 关键技术细节

- **`safeStringify()`**: 转义 JSON 中的 `</script` 防止破坏 HTML
- **`lastIndexOf('</body>')`**: 避免匹配 JSON 数据中的 `</body>` 标签
- **`var` 而非 `const`**: 数据注入在独立 `<script>` 块中，需用 `var` 才能挂载到 `window`
- **双模式检测**: `index.html` 通过 `typeof __BUNDLE_MODE__` 判断是开发模式还是打包模式

## 新版本迭代

创建新版本时：
1. 建立新子目录: `wireframe/v2.0/`、`Spec/v2.0/`、`flow/v2.0/`
2. 修改 `index.html` 中 `C` 对象的路径指向新版本
3. 运行: `node scripts/bundle.js v2.0`

## 验证方法

1. 双击打开 `dist/Antilecai-<版本>.html`
2. 应看到联网提示弹层 → 点击确认 → 正常阅读
3. 检查：侧边栏加载、线框图显示、规格面板、流程图切换
