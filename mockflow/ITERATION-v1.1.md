# MockFlow 迭代需求 v1.1 —— 字段配置深度与联动增强

> **交付对象**：Coding Agent（Claude Code）  
> **基线**：MockFlow v1.0（已实现）+《MockFlow 增量需求·缺口分析报告 v1.0》  
> **本期主题**：补齐"用户走完教程只会拖、不会配"的核心缺口（缺口 D），打通字段配置与字段联动的最小闭环  
> **架构红线（务必遵守）**：① 引导脚本 = 纯 JSON 数据驱动，新增步骤是改数据不是写死逻辑；② 无任何真实后端/数据库，沿用 v1.0 的前端 seed 数据与会话态；③ 严守"演示态"边界，不做过度实现；④ 不破坏 v1.0 既有流程（防回归）。

---

## 0. 本期目标（一句话）

让用户在第 1 章不仅能**拖字段**，还能被手把手引导着**改选项、设必填、配一条"病假→显示病历附件"的显隐联动**，从而真正建立"低代码如何配置字段与联动"的概念。

---

## 1. 范围（In / Out）

**本期做（In）：**

- 选项字段（下拉/单选/多选）支持在属性面板**增删改选项**（P0）
- 引导剧本第 1 章**补充配置步骤**：编辑选项、设置必填、配置显隐联动（P0/P1）
- **显隐条件**最小闭环：在**使用端真实生效**的单场景（病假→显示病历附件）（P1）
- 组件库**第一批字段补充** + 把"已定义类型但未入面板"的字段补进面板（P1）
- **计算公式**演示态配置面板（P1）
- 第二批字段、数据关联演示态配置（P2，本期可只搭框架）

**本期不做（Out）：**

- ❌ 真实的公式计算引擎（计算公式仅演示态，结果为占位/预置值）
- ❌ 真实后端、持久化、账号体系、协作
- ❌ 全量字段联动（仅交付 §3.3 定义的显隐条件 + 一个场景跑通）
- ❌ 流程条件分支与字段值的**真实**绑定（列入下期）

---

## 2. 数据契约 / Schema 变更

### 2.1 字段类型定义统一形态

```jsonc
{
  "type": "formula",
  "label": "计算公式",
  "group": "auto",
  "icon": "...",
  "mode": "demo",
  "defaultConfig": {},
  "configurable": ["title", "hint", "required"]
}
```

### 2.2 选项字段配置结构

```jsonc
{
  "options": [
    { "id": "opt_1", "label": "事假" },
    { "id": "opt_2", "label": "病假" },
    { "id": "opt_3", "label": "年假" }
  ]
}
```

### 2.3 ★ 显隐条件 Schema

```jsonc
{
  "visibilityRules": [
    {
      "id": "rule_1",
      "target": "field_病历附件",
      "action": "show",
      "logic": "all",
      "conditions": [
        { "field": "field_请假类型", "operator": "eq", "value": "opt_病假" }
      ]
    }
  ]
}
```

求值语义：
- `action: "show"` → 默认隐藏，条件命中时显示
- `action: "hide"` → 默认显示，条件命中时隐藏
- 无规则关联的字段 → 始终显示

### 2.4 计算公式演示态 Schema

```jsonc
{
  "formula": {
    "expression": "请假起止.天数",
    "referencedFields": ["field_请假起止"],
    "displayResult": "（提交后自动计算）"
  }
}
```

### 2.5 引导引擎事件信号（新增）

| 信号 event | 触发时机 | 负载 |
|-----------|---------|------|
| `option_added` | 选项新增 | `{ field, label }` |
| `field_config_changed` | 字段配置项变更 | `{ field, key, value }` |
| `field_renamed` | 字段标题改名 | `{ field, title }` |
| `visibility_rule_created` | 显隐规则保存 | `{ target, action, conditions }` |

---

## 3. 迭代任务

### 🟥 P0

#### T1 · 选项字段可增删改
- 对下拉单选/下拉多选/单选/多选，属性面板提供选项增/删/改名
- 变更实时同步画布与使用端
- 派发 `option_added` 等信号

#### T2 · 剧本补"编辑选项 + 设置必填"步骤
- 依赖 T1
- 在"拖完4个字段"之后插入两步 gated 引导

### 🟧 P1

#### T3 · 显隐条件最小闭环
- 属性面板规则编辑入口
- 表单状态模型扩展 `visibilityRules`
- 使用端真实求值生效

#### T4 · 剧本补"配置显隐联动"步骤
- 依赖 T3

#### T5 · 组件库第一批补充
新增至面板：计算公式(demo)、流水号(demo)、级联选择、签名(demo)、手机号
补进面板（已定义未显示）：定位、分组标题

#### T6 · 计算公式演示态配置面板
- 依赖 T5
- 表达式构建 UI，不求值

### 🟨 P2
- T7 第二批字段（富文本、邮箱、系统字段）
- T8 数据关联演示态
- T9 流程条件分支预留接口（下期实现）

---

## 4. 第 1 章增量步骤（插入"拖完4字段"之后）

```jsonc
[
  {
    "id": "ch1-cfg1",
    "type": "gated",
    "narration": "光有『事假/病假/年假』还不够。点一下画布里的『请假类型』字段，在右侧选项区点 ➕，加一个『调休假』。",
    "target": "field-select-on-canvas",
    "complete_when": { "event": "option_added", "labelContains": "调休假" },
    "on_wrong": "shake_and_hint"
  },
  {
    "id": "ch1-cfg2",
    "type": "gated",
    "narration": "选中『请假起止』字段，打开右侧的『必填』开关——以后不填就交不了。",
    "target": "field-daterange-on-canvas",
    "complete_when": { "event": "field_config_changed", "key": "required", "value": true },
    "on_wrong": "shake_and_hint"
  },
  {
    "id": "ch1-cfg3",
    "type": "gated",
    "narration": "再从左侧拖一个『附件』字段进来，把它改名为『病历附件』。",
    "target": "field-attachment",
    "complete_when": { "event": "field_renamed", "title": "病历附件" },
    "on_wrong": "shake_and_hint"
  },
  {
    "id": "ch1-cfg4",
    "type": "gated",
    "narration": "现在做点聪明的：让『病历附件』只在请病假时才出现。打开『显隐规则』，设置『当 请假类型 = 病假 时，显示 病历附件』。",
    "target": "open-visibility-rule",
    "complete_when": {
      "event": "visibility_rule_created",
      "action": "show",
      "when": { "operator": "eq", "value": "病假" }
    },
    "on_wrong": "shake_and_hint"
  },
  {
    "id": "ch1-cfg5",
    "type": "reveal",
    "narration": "搞定！这就是『字段联动』——表单会根据填的内容自己变。第 3 章用一遍时，你选『病假』就能看到病历附件自动冒出来。"
  }
]
```

---

## 5. 验收清单

**新功能：**
- [ ] T1 选项可增删改，实时同步
- [ ] T2 教程引导"加调休假""设必填"可过关
- [ ] T3 使用端"病假→显示病历附件"真实生效
- [ ] T4 教程能引导建出显隐规则
- [ ] T5 第一批字段全部可拖入
- [ ] T6 计算公式面板可拼表达式

**回归：**
- [ ] 原有4步拖字段流程不受影响
- [ ] 第2/3/4章原有流程正常
- [ ] 全程断网可跑通

---

*MockFlow 迭代需求 v1.1 · 2026-05-31*
