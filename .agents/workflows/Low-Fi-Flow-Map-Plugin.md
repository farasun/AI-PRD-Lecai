---
description: Low-Fi-Flow-Map-Plugin
---

### 🛠️ 专项任务：低保真全景流程图生成 (Low-Fi Flow Map Plugin)

**[执行背景]**
本任务为当前 [SYSTEM Role] 框架下的子任务。请充当“工程美学渲染引擎”，解析下方 `[USER_INPUT]` 区域的 Mermaid 代码，将其转换为一张 **Miro/FigJam 风格** 的 HTML/Tailwind 全景线框图。

**[核心标准 (Execution Standards)]**

1.  **画布与环境 (The Engineering Canvas)**：
    * **基调**：纯净工程风。使用 `bg-gray-50` (浅灰) + 细微点阵/网格背景。
    * **布局**：创建一个超大画布 (e.g., `3000px * 1600px` 或更大)，采用 `position: absolute` 手动计算节点坐标。
    * **间距**：节点间保持宽松呼吸感（水平间距 > 400px），杜绝拥挤。
    * **坐标安全域 (Coordinate Safety Bound) [防裁剪规则]**：**绝对禁止为元素的 `top` 或 `left` 设置负值（严禁 `<div style="top: -50px">`）**！由于外层画布拥有 `overflow-scroll` 属性，处于负坐标系的任何元素会被永久裁剪，无法滚动查看。特别是对于带有负向上偏移标签 (`-top-10`) 的节点，其容器的 `top` 必须**至少大于等于 150px**，`left` **至少大于等于 100px**，以确保所有内容完全可见。

2.  **连线逻辑 (The Logic Links)**：
    * **风格**：深灰色 (`#94a3b8`, Slate-400) 的贝塞尔曲线。
    * **形态**：使用 SVG `<path>` 绘制 `C` 曲线（从左侧节点右缘 -> 右侧节点左缘）。线宽 `2px`，末端带简约箭头。
    * **禁止**：禁止使用直线或折线，禁止使用高亮色（如黄/红）。

3.  **节点渲染：Chat D 视觉宪法 (Visual Constitution)**：
    * **容器外观**：纯白手机壳 (`bg-white`) + 1px 极细边框 (`border-gray-200`) + 柔和阴影 (`shadow-xl`)。
    * **缩放策略**：整体应用 `transform scale-[0.65]`，既保留线框细节，又适应全景视野。
    * **内部 UI 规范 (严格执行)**：
        * **去色去图**：全站黑白灰，严禁使用彩色图片或渐变。
        * **图标系统**：必须使用 **RemixIcon** (Line 风格)。
        * **原子组件**：
            * 按钮：`border border-gray-900` (黑框白底) 或 `bg-gray-900 text-white` (实心黑)。
            * 字重：标题 `font-bold`，正文必须为 `font-normal` (严禁全局粗体)。
            * 线条：所有分割线必须为 `border-gray-100` 或 `gray-200` 的 1px 细线。

4.  **标签系统 (Node Labeling)**：
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
<div class="flow-canvas relative bg-gray-50 w-[3000px] h-[1500px] overflow-scroll font-sans text-gray-900">
    
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
            <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
            </marker>
        </defs>
        <path d="M 300 400 C 400 400, 450 400, 550 400" stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#arrow-gray)" />
    </svg>

    <div class="absolute" style="left: 50px; top: 150px;">
        <!-- 注意此处的 id="A" 为锚点定位示例 (真实产出应为如 id="CC-5" 的格式) -->
        <div id="A" class="absolute -top-10 left-0 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-sm z-10">A · 登录页</div>
        <div class="w-[375px] h-[812px] bg-white border border-gray-200 rounded-[40px] shadow-2xl overflow-hidden transform scale-[0.65] origin-top-left flex flex-col">
            <div class="h-16 flex items-center px-6 border-b border-gray-100">
                <i class="ri-close-line text-2xl text-gray-900"></i>
            </div>
            <div class="p-8 flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
                <p class="text-gray-500 mb-10">请使用手机号登录</p>
                <div class="h-14 border border-gray-900 rounded-xl flex items-center px-4 mb-4">
                    <span class="text-gray-900">+86</span>
                </div>
                <div class="h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-medium">
                    获取验证码
                </div>
            </div>
        </div>
    </div>

    <div class="absolute" style="left: 550px; top: 150px;">
        <div class="absolute -top-10 left-0 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-sm">B · 验证页</div>
        <div class="w-[375px] h-[812px] bg-white border-2 border-dashed border-gray-300 rounded-[40px] flex flex-col items-center justify-center transform scale-[0.65] origin-top-left">
            <i class="ri-shield-keyhole-line text-6xl text-gray-300 mb-4"></i>
            <span class="text-xl font-bold text-gray-400">手机号验证</span>
        </div>
    </div>

</div>
[END_CODE_BLOCK]

---

**[USER_INPUT: 待处理数据]**
[START_CODE_BLOCK]

::::::此处贴入Mermaid流程图代码::::::

[END_CODE_BLOCK]

---

**[任务结束复位]**
代码生成结束后，请提示用户：“低保真全景图 (Miro Style) 已生成，请保存为 .html 查看”。随后立即自动恢复 [SYSTEM Role] 的沟通模式。