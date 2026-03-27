---
description: Low-Fi-Flow-Map-Plugin
---

### 🛠️ 专项任务：低保真全景流程图生成 (Low-Fi Flow Map Plugin)

**[执行背景]**
请充当“工程美学渲染引擎”，解析下方 `[USER_INPUT]` 区域的 Mermaid 代码，将其转换为一张 **Miro/FigJam 风格** 的 HTML/Tailwind 全景线框图。

**[核心标准 (Execution Standards)]**

1.  **画布与环境 (The Engineering Canvas)**：
    * **基调**：纯净工程风。`<body>` 背景使用 `bg-gray-200`（中灰，代表"墙"）；画布 `<div>` 本体背景使用 **点阵网格**（白色或浅灰底，径向点阵覆盖），以形成"硬纸板放在灰墙上"的视觉分层感。点阵 CSS 写法：`background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 20px 20px;`。
    * **布局**：创建一个超大画布 (e.g., `3000px * 1600px` 或更大)，采用 `position: absolute` 手动计算节点坐标。
    * **间距**：节点间保持宽松呼吸感（水平间距 > 400px），杜绝拥挤。
    * **坐标安全域 (Coordinate Safety Bound) [防裁剪规则]**：**绝对禁止为元素的 `top` 或 `left` 设置负值（严禁 `<div style="top: -50px">`）**！由于外层画布拥有 `overflow-scroll` 属性，处于负坐标系的任何元素会被永久裁剪，无法滚动查看。特别是对于带有负向上偏移标签 (`-top-10`) 的节点，其容器的 `top` 必须**至少大于等于 150px**，`left` **至少大于等于 100px**，以确保所有内容完全可见。

2.  **连线逻辑 (The Logic Links)**：
    * **风格**：深灰色 (`#94a3b8`, Slate-400) 的贝塞尔曲线。
    * **形态**：使用 SVG `<path>` 绘制 `C` 曲线（从左侧节点右缘 -> 右侧节点左缘）。线宽 `2px`，末端带简约箭头。
    * **连线标签 [标准实现]**：在 SVG 内使用 `<rect>` + `<text>` 的组合，将文字标签直接绘制在 SVG 层内，而非 HTML `<div>`。`<rect>` 使用 `fill="#f8fafc"` 白底色块以遮盖穿越的连线，`<text>` 使用 `fill="#64748b"`、`font-size="14"`、`font-weight="500"`，两者中心坐标精确对齐。
    * **禁止**：禁止使用直线或折线，禁止使用高亮色（如黄/红），禁止使用 HTML `<div>` 替代 SVG 内联标签。

3.  **节点渲染：Chat D 视觉宪法与 Logic Flow-B (Inheritance)**：
    * **物理继承 (Inheritance)**：如果是对 `Main_PageList.md` 中现有页面的改造，**严禁凭空推测内部 UI**。渲染引擎必须先读取该页面的 `现状基准 (UI Path)` HTML，提取其核心布局（如：头部导航高度、页面分块、底部按钮位置）。
    * **缩微渲染**：在继承的基准结构基础上，按当前迭代需求注入增量修改，最后应用 `transform scale-[0.65]` 进行缩微展示。
    * **容器外观**：纯白手机壳 (`bg-white`) + 1px 极细边框 (`border-gray-200`) + 柔和阴影 (`shadow-xl`)。
    * **原子组件 (去色去图)**：
        * 图标：必须使用 **RemixIcon** (Line 风格)。
        * 线条：所有分割线必须为 `border-gray-100` 或 `gray-200` 的 1px 细线。
        * 字重：标题 `font-bold`，正文必须为 `font-normal`。

4.  **悬浮标题板 (Floating Title Panel) [固化规则]**：
    * **必须添加**：每个独立流程图 HTML 文件的左上角，**必须**放置一块固定定位的悬浮标题板，用于标明当前流程的编号与名称。
    * **定位**：`position: fixed; top: 24px; left: 24px; z-index: 50;`（使用 `fixed` 而非 `absolute`，确保在画布滚动时标题始终可见）。
    * **样式**：深色毛玻璃背景（`background: rgba(17,24,39,0.85); backdrop-filter: blur(8px)`）+ `border-radius: 12px` + `padding: 12px 20px`，白色主标题（`font-size: 16px; font-weight: 700; color: #fff`）+ 浅灰副标题（`font-size: 12px; color: #9ca3af`）。
    * **内容格式**：主标题为 `[流程名称]`，副标题为 `v[版本号] · Low-Fi Flow Map · [日期]`。
    * *正确示例*：主标题 `积分流程A · 每日签到得积分` / 副标题 `v1.1 · Low-Fi Flow Map · 2026-03-04`

5.  **标签系统 (Node Labeling)**：
    * 每个节点上方悬浮显示标签。
    * 样式：`bg-gray-900` (深黑背景)，`text-white`，`rounded-md`，`px-3 py-1`，无衬线字体。
    * 格式：`[PageList页面编号] · [页面名称]`。
        * *正确示例*：`CC-5 · 社团活动详情`、`CC-7 · 社团提交作品表单`
        * *错误示例 1*：`A · 活动主页`（严禁使用 A/B/C 等字母内部编号）
        * *错误示例 2*：`A-1 · 前置选择`、`A-2 · 原生相册`（**严禁使用任何 X-N 格式的自造辅助步骤编号**，因为这会与 PageList 中的真实页面编号（如 CC-5-1、CH-2-1）产生视觉混淆）
    * **非 PageList 中间步骤的处理 [兜底规则]**：对于流程中确实存在的系统层/OS 层节点（如原生相册、弹窗，它们不在 PageList 中），节点标签直接用**中文功能描述**即可，禁止添加任何字母或数字编号。
        * *正确示例*：`系统原生相册`、`类型选择弹层`
        * *错误示例*：`A-1 · 类型选择`、`A-2 · 系统原生相册`
    * **页面命名真理 [绝对规则]**：
        * **真理文件**：你必须主动读取 `doc/PageList.md`，以其中的页面编号和名称为**唯一真理**。
        * **静默覆盖**：当用户输入与 `doc/PageList.md` 不一致时，在产出物中静默替换为官方版本。
        * **偏差提醒**：如果发生替换，在对话回复中口头提示偏差。
        * **弹性兜底**：若找不到 `doc/PageList.md`，或页面不在字典中，则按用户输入定义。
    * **锚点暴露原则 (Anchor Exposure) [底层交互契约]**：
        * 对于属于 `PageList` 中的真实页面，其顶部标签容器 `<div>` **必须显式添加 `id="[页面编号]"` 属性**。
        * 这是外部原型阅读器识别并绑定侧滑抽屉预览功能的唯一挂载点。
        * *正确示例*：`<div id="CC-5" class="absolute -top-10 left-0 bg-gray-900...">CC-5 · 社团活动详情</div>`
        * *错误示例*：`<div class="absolute -top-10 left-0 bg-gray-900...">CC-5 · 社团活动详情</div>` (缺失 ID 将导致点击无反应)

**[输入示例参考]**
[START_CODE_BLOCK]
graph LR
A[登录页] --> B[手机号验证]
[END_CODE_BLOCK]

**[输出结构参考]**
[START_CODE_BLOCK]
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    /* 点阵画布背景 */
    .bg-dot-grid {
      background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
      background-size: 20px 20px;
    }
  </style>
</head>
<!-- body = 灰墙底色 -->
<body class="m-0 p-0 bg-gray-200 no-scrollbar">

  <!-- ① 悬浮标题板 [固化，fixed 定位] -->
  <div style="position:fixed;top:24px;left:24px;z-index:50;background:rgba(17,24,39,0.85);backdrop-filter:blur(8px);border-radius:12px;padding:12px 20px;">
    <div style="font-size:16px;font-weight:700;color:#fff;">积分流程X · 流程名称</div>
    <div style="font-size:12px;color:#9ca3af;margin-top:4px;">v1.1 · Low-Fi Flow Map · 2026-03-04</div>
  </div>

  <!-- ② 画布 = 点阵底纹 -->
  <div class="relative bg-dot-grid w-[3000px] h-[1600px] no-scrollbar font-sans text-gray-900">

    <!-- ③ SVG 连线层（含 rect+text 标签）-->
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
        </marker>
      </defs>
      <!-- 连线 -->
      <path d="M 344 414 C 470 414, 470 414, 598 414" stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#arrow-gray)" />
      <!-- 连线标签：rect 遮盖连线，text 居中对齐 -->
      <rect x="390" y="399" width="130" height="30" fill="#f8fafc" rx="4" />
      <text x="455" y="419" fill="#64748b" font-size="14" font-weight="500" text-anchor="middle">点击[操作名称]</text>
    </svg>

    <!-- ④ 节点容器（top ≥ 150px）-->
    <div class="absolute" style="left: 100px; top: 150px;">
      <!-- 节点标签（id 为锚点）-->
      <div id="CC-5" class="absolute -top-10 left-0 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-sm z-10">CC-5 · 社团活动详情</div>
      <!-- 手机壳 -->
      <div class="w-[375px] h-[812px] bg-white border border-gray-200 rounded-[40px] shadow-2xl overflow-hidden transform scale-[0.65] origin-top-left flex flex-col">
        <!-- 内部 UI 内容 -->
      </div>
    </div>

  </div>
</body>
</html>
[END_CODE_BLOCK]


