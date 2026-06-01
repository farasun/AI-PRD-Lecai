import type { FormField, FlowNode } from '../types';

export interface AiScriptMatch {
  keywords: string[];
  thinking_ms: number;
  stream_text: string;
  actions?: AiScriptAction[];
  followup?: string;
}

export interface AiScriptAction {
  type: 'create_fields' | 'create_workflow' | 'open_formula_panel' | 'generate_chart' | 'autofill_form' | 'show_approval_assist';
  preset: string;
  expression_preset?: string;
}

export interface AiScript {
  scenario: string;
  context: string;
  prompt_suggestions: string[];
  matches: AiScriptMatch[];
  incremental?: AiScriptMatch[];
  fallback: string;
}

// ── Scene 1 · AI Build ────────────────────────────────────────────────────────

export const AI_BUILD_SCRIPT: AiScript = {
  scenario: 'ai_build',
  context: 'form_designer',
  prompt_suggestions: ['帮我搭一个设备报修管理应用', '搭一个请假审批应用'],
  matches: [
    {
      keywords: ['报修', '设备', '维修'],
      thinking_ms: 1600,
      stream_text: '好的！我来帮你搭「设备报修管理」应用。\n\n将创建：\n• 报修表单（申请人 / 设备名称 / 故障描述 / 紧急程度 / 照片）\n• 三级审批流程（部门主管 → IT 主管）\n\n正在生成……',
      actions: [
        { type: 'create_fields', preset: 'device_repair_fields' },
        { type: 'create_workflow', preset: 'device_repair_flow' },
      ],
      followup: '已生成！可直接在画布上微调，或继续告诉我要改什么。',
    },
    {
      keywords: ['请假', '休假', '假期', '审批'],
      thinking_ms: 1400,
      stream_text: '好的！我来帮你搭「请假审批」应用。\n\n将创建：\n• 请假表单（申请人 / 请假起止 / 请假类型 / 请假事由）\n• 两级审批流程（直属主管 → HR）\n\n正在生成……',
      actions: [
        { type: 'create_fields', preset: 'leave_approval_fields' },
        { type: 'create_workflow', preset: 'leave_approval_flow' },
      ],
      followup: '已生成！你可以直接微调，或让我帮你添加更多字段。',
    },
    {
      keywords: ['采购', '订单', '物资'],
      thinking_ms: 1500,
      stream_text: '好的！我来帮你搭「采购申请」应用。\n\n将创建：\n• 采购表单（申请人 / 物品名称 / 采购数量 / 预算金额 / 用途说明）\n• 财务审批流程\n\n正在生成……',
      actions: [
        { type: 'create_fields', preset: 'purchase_fields' },
        { type: 'create_workflow', preset: 'purchase_flow' },
      ],
      followup: '采购申请应用已生成，可继续微调。',
    },
  ],
  incremental: [
    {
      keywords: ['紧急程度', '优先级', '紧急'],
      thinking_ms: 800,
      stream_text: '好的，已为你添加「紧急程度」字段（高 / 中 / 低）。',
      actions: [{ type: 'create_fields', preset: 'field_urgency' }],
    },
    {
      keywords: ['公式', '时长', '计算', '天数'],
      thinking_ms: 900,
      stream_text: '好的，已为你打开公式配置面板，并填入「处理时长」计算表达式，你可以直接确认。',
      actions: [{ type: 'open_formula_panel', preset: 'formula_duration', expression_preset: 'process_duration' }],
    },
    {
      keywords: ['附件', '图片', '照片', '上传'],
      thinking_ms: 700,
      stream_text: '好的，已为你添加图片/附件字段。',
      actions: [{ type: 'create_fields', preset: 'field_attachment' }],
    },
  ],
  fallback: '这个演示版预置了几个搭建场景，试试上面的快捷按钮，比如「帮我搭一个设备报修管理应用」～',
};

// ── Scene 2 · AI Insight ─────────────────────────────────────────────────────

export const AI_INSIGHT_SCRIPT: AiScript = {
  scenario: 'ai_insight',
  context: 'report',
  prompt_suggestions: ['哪个部门请假最多？', '帮我出一个请假类型饼图', '本月趋势怎样？'],
  matches: [
    {
      keywords: ['哪个部门', '部门', '最多'],
      thinking_ms: 1000,
      stream_text: '根据现有数据分析：\n\n请假最多的是**技术部**（28 次），占总请假数的 37%。\n\n已为你高亮生成「部门分布」柱状图，可拖入仪表盘查看。',
      actions: [{ type: 'generate_chart', preset: 'dept_leave_bar' }],
    },
    {
      keywords: ['类型', '饼图', '分布', '占比'],
      thinking_ms: 1100,
      stream_text: '好的，已为你生成「请假类型」饼图。\n\n从数据来看：\n• 事假占 45%\n• 病假占 31%\n• 年假占 24%\n\n可拖入仪表盘保存。',
      actions: [{ type: 'generate_chart', preset: 'type_pie' }],
    },
    {
      keywords: ['趋势', '本月', '月度', '走势'],
      thinking_ms: 1200,
      stream_text: '本月数据分析：\n\n• 请假总数较上月 ↑23%，集中在月底\n• 技术部病假占比异常偏高（41%），建议关注\n• 建议月底前增加排班缓冲\n\n已生成月度趋势折线图供参考。',
      actions: [{ type: 'generate_chart', preset: 'monthly_line' }],
    },
    {
      keywords: ['异常', '预警', '风险'],
      thinking_ms: 900,
      stream_text: '⚠️ 发现以下数据异常：\n\n1. 技术部病假占比 41%，高于正常水平（20%）\n2. 月末（25-31日）请假集中度高达 62%\n3. 王芳本月请假 4 次，为最高频员工\n\n建议：与技术部主管沟通，了解团队健康状况。',
      actions: [],
    },
  ],
  incremental: [],
  fallback: '演示版预置了以下问题：部门分布、类型占比、月度趋势。试试「哪个部门请假最多？」',
};

// ── Scene 3 · AI Smart Fill ───────────────────────────────────────────────────

export const AI_FILL_SCRIPT: AiScript = {
  scenario: 'ai_fill',
  context: 'user_form',
  prompt_suggestions: ['AI 智能填单', '扫描文档自动填写', '语音输入请假信息'],
  matches: [],
  fallback: '点击「AI 智能填单」按钮，选择文档或语音输入方式体验自动填表。',
};

// ── Preset Data Packages ──────────────────────────────────────────────────────

function makeId() {
  return `ai-${Math.random().toString(36).slice(2, 9)}`;
}

export const PRESET_FIELDS: Record<string, FormField[]> = {
  device_repair_fields: [
    { id: makeId(), type: 'member', label: '报修人', required: true, aiGenerated: true },
    { id: makeId(), type: 'text', label: '报修设备名称', required: true, placeholder: '如：3F-打印机-003', aiGenerated: true },
    { id: makeId(), type: 'textarea', label: '故障描述', required: true, placeholder: '请详细描述故障现象...', aiGenerated: true },
    { id: makeId(), type: 'select', label: '紧急程度', required: true, options: [
      { value: 'high', label: '🔴 高（影响生产）' },
      { value: 'mid', label: '🟡 中（影响办公）' },
      { value: 'low', label: '🟢 低（不紧急）' },
    ], aiGenerated: true },
    { id: makeId(), type: 'image', label: '故障照片', required: false, aiGenerated: true },
    { id: makeId(), type: 'date', label: '期望修复日期', required: false, aiGenerated: true },
  ],
  leave_approval_fields: [
    { id: makeId(), type: 'member', label: '申请人', required: true, aiGenerated: true },
    { id: makeId(), type: 'daterange', label: '请假起止', required: true, aiGenerated: true },
    { id: makeId(), type: 'select', label: '请假类型', required: true, options: [
      { value: 'personal', label: '事假' },
      { value: 'sick', label: '病假' },
      { value: 'annual', label: '年假' },
      { value: 'comp', label: '调休假' },
    ], aiGenerated: true },
    { id: makeId(), type: 'textarea', label: '请假事由', required: false, placeholder: '请填写请假原因...', aiGenerated: true },
  ],
  purchase_fields: [
    { id: makeId(), type: 'member', label: '申请人', required: true, aiGenerated: true },
    { id: makeId(), type: 'text', label: '物品名称', required: true, placeholder: '采购物品名称', aiGenerated: true },
    { id: makeId(), type: 'number', label: '采购数量', required: true, aiGenerated: true },
    { id: makeId(), type: 'amount', label: '预算金额（元）', required: true, aiGenerated: true },
    { id: makeId(), type: 'textarea', label: '采购用途说明', required: false, aiGenerated: true },
    { id: makeId(), type: 'attachment', label: '报价单附件', required: false, aiGenerated: true },
  ],
  field_urgency: [
    { id: makeId(), type: 'select', label: '紧急程度', required: false, options: [
      { value: 'high', label: '🔴 高（影响生产）' },
      { value: 'mid', label: '🟡 中（影响办公）' },
      { value: 'low', label: '🟢 低（不紧急）' },
    ], aiGenerated: true },
  ],
  field_attachment: [
    { id: makeId(), type: 'attachment', label: '相关附件', required: false, aiGenerated: true },
  ],
};

export const PRESET_FLOWS: Record<string, Omit<FlowNode, 'id'>[]> = {
  device_repair_flow: [
    { type: 'approval', label: '部门主管审批', approvers: ['直属主管'] },
    { type: 'approval', label: 'IT 主管审批', approvers: ['IT 主管'] },
  ],
  leave_approval_flow: [
    { type: 'approval', label: '直属主管审批', approvers: ['直属主管'] },
    { type: 'approval', label: 'HR 审批', approvers: ['HR'] },
  ],
  purchase_flow: [
    { type: 'approval', label: '部门主管审批', approvers: ['直属主管'] },
    { type: 'approval', label: '财务审批', approvers: ['财务'] },
  ],
};

export const PRESET_CHARTS: Record<string, { title: string; chartType: 'pie' | 'bar' | 'line' | 'table'; dimension: string }> = {
  dept_leave_bar: { title: '请假人数（按部门）', chartType: 'bar', dimension: 'applicant' },
  type_pie: { title: '请假类型分布', chartType: 'pie', dimension: 'leaveType' },
  monthly_line: { title: '月度请假趋势', chartType: 'line', dimension: 'leaveType' },
};

export interface FillPreset {
  member?: string;
  select?: string;
  daterange_start?: string;
  daterange_end?: string;
  textarea?: string;
}

export const FILL_PRESETS: Record<string, FillPreset> = {
  leave_doc: {
    member: '张三',
    select: '病假',
    daterange_start: '2026-06-09',
    daterange_end: '2026-06-11',
    textarea: '感冒发烧，需要就医休养',
  },
  leave_voice: {
    select: '病假',
    daterange_start: '2026-06-08',
    daterange_end: '2026-06-10',
    textarea: '就医（语音识别）',
  },
};

export const AI_INSIGHT_CARDS = [
  { type: 'trend', icon: '📈', text: '本月请假总数较上月上升 23%，集中在月底（25–31 日）。' },
  { type: 'anomaly', icon: '⚠️', text: '技术部病假占比异常偏高（41%），建议关注团队健康状况。' },
  { type: 'suggestion', icon: '💡', text: '建议月底前增加排班缓冲，提前做好工作交接安排。' },
];

export const APPROVAL_ASSIST = {
  summary: '张三申请病假 3 天（下周一至周三），事由：就医，已附病历。',
  risk: '本月该员工已请假 2 次（累计 5 天），接近月度上限。',
  suggestion: '建议通过。假期合理，已附证明材料。',
};

export function getContextScript(tab: string): AiScript {
  if (tab === 'form' || tab === 'flow') return AI_BUILD_SCRIPT;
  if (tab === 'reports') return AI_INSIGHT_SCRIPT;
  if (tab === 'usage') return AI_FILL_SCRIPT;
  return AI_BUILD_SCRIPT;
}

export function findMatch(input: string, script: AiScript): AiScriptMatch {
  const lower = input.toLowerCase();
  for (const m of script.matches) {
    if (m.keywords.some((kw) => lower.includes(kw.toLowerCase()))) return m;
  }
  if (script.incremental) {
    for (const m of script.incremental) {
      if (m.keywords.some((kw) => lower.includes(kw.toLowerCase()))) return m;
    }
  }
  return { keywords: [], thinking_ms: 500, stream_text: script.fallback, actions: [] };
}
