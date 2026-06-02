import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useDroppable,
  useDraggable,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import type { FormField, FieldType, VisibilityRule, AppAction, DataLinkConfig } from '../types';

const FIELD_GROUPS: { group: string; fields: { type: FieldType; label: string; icon: string }[] }[] = [
  {
    group: '基础字段',
    fields: [
      { type: 'text', label: '单行文本', icon: '✏️' },
      { type: 'textarea', label: '多行文本', icon: '📝' },
      { type: 'number', label: '数字', icon: '🔢' },
      { type: 'amount', label: '金额', icon: '💰' },
      { type: 'phone', label: '手机号', icon: '📱' },
      { type: 'email', label: '邮箱', icon: '📧' },
      { type: 'richtext', label: '富文本', icon: '📄' },
    ],
  },
  {
    group: '选择字段',
    fields: [
      { type: 'radio', label: '单选', icon: '⭕' },
      { type: 'checkbox', label: '多选', icon: '☑️' },
      { type: 'select', label: '下拉单选', icon: '▾' },
      { type: 'multiselect', label: '下拉多选', icon: '▾▾' },
      { type: 'cascade', label: '级联选择', icon: '🌲' },
    ],
  },
  {
    group: '日期时间',
    fields: [
      { type: 'date', label: '日期', icon: '📅' },
      { type: 'daterange', label: '日期区间', icon: '📆' },
      { type: 'time', label: '时间', icon: '⏰' },
      { type: 'datetime', label: '日期时间', icon: '🕐' },
    ],
  },
  {
    group: '高级字段',
    fields: [
      { type: 'member', label: '成员', icon: '👤' },
      { type: 'department', label: '部门', icon: '🏢' },
      { type: 'attachment', label: '附件', icon: '📎' },
      { type: 'image', label: '图片', icon: '🖼️' },
      { type: 'location', label: '定位', icon: '📍' },
      { type: 'rating', label: '评分', icon: '⭐' },
      { type: 'signature', label: '签名', icon: '✍️' },
    ],
  },
  {
    group: '自动计算',
    fields: [
      { type: 'serial', label: '流水号', icon: '🔖' },
      { type: 'formula', label: '计算公式', icon: '🧮' },
    ],
  },
  {
    group: '关系字段',
    fields: [
      { type: 'data-link', label: '数据关联', icon: '🔗' },
      { type: 'subtable', label: '子表单', icon: '📋' },
    ],
  },
  {
    group: '辅助元素',
    fields: [
      { type: 'description', label: '说明文字', icon: '💬' },
      { type: 'divider', label: '分割线', icon: '➖' },
      { type: 'section-title', label: '分组标题', icon: '📌' },
    ],
  },
];

const PALETTE_TARGETS: Partial<Record<FieldType, string>> = {
  member: 'field-member',
  daterange: 'field-daterange',
  select: 'field-select',
  textarea: 'field-textarea',
  attachment: 'field-attachment',
};

const CANVAS_TARGETS: Partial<Record<FieldType, string>> = {
  select: 'field-select-on-canvas',
  daterange: 'field-daterange-on-canvas',
};

function PaletteItem({ type, label, icon }: { type: FieldType; label: string; icon: string }) {
  const tutorialId = PALETTE_TARGETS[type] ?? type;
  const { isTarget, isShaking } = useTutorialTarget(tutorialId);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, label, icon, fromPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-tutorial={tutorialId}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing select-none transition-all
        ${isDragging ? 'opacity-40' : 'hover:bg-blue-50 hover:text-blue-700'}
        ${isTarget ? 'bg-blue-50 ring-2 ring-blue-400 spotlight-pulse' : 'bg-gray-50'}
        ${isShaking ? 'animate-shake' : ''}
      `}
    >
      <span className="text-base">{icon}</span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  if (field.type === 'divider') return <hr className="border-gray-200" />;
  if (field.type === 'section-title') return <div className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">{field.label}</div>;
  if (field.type === 'description') {
    return <div className="text-sm text-gray-500 italic bg-yellow-50 p-2 rounded">{field.label || '说明文字'}</div>;
  }

  const opts = field.options ?? [{ value: '选项1', label: '选项1' }];

  const map: Partial<Record<FieldType, React.ReactNode>> = {
    text: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder={field.placeholder || '请输入'} readOnly />,
    textarea: <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 h-16 resize-none" placeholder={field.placeholder || '请输入'} readOnly />,
    number: <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="0" readOnly />,
    amount: <div className="flex"><span className="border border-r-0 border-gray-200 rounded-l-lg px-3 py-2 text-sm bg-gray-100 text-gray-500">¥</span><input className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2 text-sm bg-gray-50" placeholder="0.00" readOnly /></div>,
    phone: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="请输入手机号" readOnly />,
    email: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="请输入邮箱" readOnly />,
    richtext: <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 h-16 text-gray-400 flex items-start">富文本编辑器（演示态）</div>,
    select: <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" disabled><option>{opts[0]?.label ?? '请选择'}</option></select>,
    multiselect: <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" disabled multiple><option>{opts[0]?.label ?? '请选择'}</option></select>,
    radio: <div className="flex flex-wrap gap-3">{opts.map(o => <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600"><input type="radio" readOnly />{o.label}</label>)}</div>,
    checkbox: <div className="flex flex-wrap gap-3">{opts.map(o => <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600"><input type="checkbox" readOnly />{o.label}</label>)}</div>,
    cascade: <div className="flex gap-1"><select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" disabled><option>省</option></select><select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" disabled><option>市</option></select><select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" disabled><option>区</option></select></div>,
    date: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="选择日期" readOnly />,
    daterange: <div className="flex gap-2"><input className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" placeholder="开始日期" readOnly /><span className="text-gray-400 py-2">至</span><input className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" placeholder="结束日期" readOnly /></div>,
    time: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="选择时间" readOnly />,
    datetime: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="选择日期时间" readOnly />,
    member: <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"><span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">👤</span><span className="text-sm text-gray-400">选择成员</span></div>,
    department: <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"><span className="text-sm text-gray-400">选择部门</span></div>,
    attachment: <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-sm text-gray-400">📎 点击上传附件</div>,
    image: <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-sm text-gray-400">🖼️ 点击上传图片</div>,
    location: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="📍 点击获取定位" readOnly />,
    rating: <div className="flex gap-1">{[1,2,3,4,5].map(i => <span key={i} className="text-gray-300 text-xl">★</span>)}</div>,
    signature: <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-sm text-gray-400">✍️ 点击签名（演示态）</div>,
    'data-link': <div className="border border-blue-200 rounded-lg p-3 text-xs text-blue-500 bg-blue-50">🔗 关联其他表单数据（演示态）</div>,
    subtable: <div className="border border-purple-200 rounded-lg p-3 text-xs text-purple-500 bg-purple-50">📋 子表单（演示态）</div>,
    serial: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" value="NO-202401001（自动生成）" readOnly />,
    formula: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" value={field.formulaConfig?.displayResult ?? '= 公式计算结果'} readOnly />,
  };

  return <>{map[field.type as keyof typeof map] ?? null}</>;
}

function SortableField({ field, isSelected, onSelect, onDelete }: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const canvasTarget = CANVAS_TARGETS[field.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-tutorial={canvasTarget}
      className={`group relative rounded-xl border-2 p-4 cursor-pointer transition-all
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        ${isSelected ? 'border-blue-400 bg-blue-50/50' : 'border-transparent bg-white hover:border-gray-300 hover:shadow-sm'}
        ${field.aiGenerated ? 'animate-ai-appear border-indigo-300 bg-indigo-50/40' : ''}
      `}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing p-1"
      >
        ⠿
      </div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-sm"
        >
          ✕
        </button>
      </div>
      <FieldPreview field={field} />
    </div>
  );
}

function DroppableCanvas({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'form-canvas' });
  return (
    <div
      ref={setNodeRef}
      data-tutorial="form-designer-area"
      className={`min-h-full rounded-xl transition-all ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
    >
      {isEmpty ? (
        <div className={`flex flex-col items-center justify-center h-64 text-center transition-all ${isOver ? 'opacity-70' : ''}`}>
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-gray-400 text-sm font-medium">把左侧字段拖到这里</p>
          <p className="text-gray-300 text-xs mt-1">开始搭建你的表单</p>
        </div>
      ) : (
        <div className="space-y-1">{children}</div>
      )}
    </div>
  );
}

const OPTION_FIELD_TYPES: FieldType[] = ['select', 'multiselect', 'radio', 'checkbox'];

function OptionsEditor({ field, dispatch }: { field: FormField; dispatch: (a: AppAction) => void }) {
  const [newLabel, setNewLabel] = useState('');
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  function startEdit(value: string, label: string) {
    setEditingValue(value);
    setEditingLabel(label);
  }

  function commitEdit() {
    if (editingValue && editingLabel.trim()) {
      dispatch({ type: 'RENAME_OPTION', fieldId: field.id, value: editingValue, newLabel: editingLabel.trim() });
    }
    setEditingValue(null);
    setEditingLabel('');
  }

  function addOption() {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_OPTION', fieldId: field.id, label: trimmed });
    setNewLabel('');
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">选项</label>
      <div className="mt-1 space-y-1">
        {(field.options ?? []).map((opt) => (
          <div key={opt.value} className="flex items-center gap-1.5 group/opt">
            <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
            {editingValue === opt.value ? (
              <input
                autoFocus
                className="flex-1 text-xs border border-blue-300 rounded px-1.5 py-0.5 focus:outline-none"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingValue(null); }}
              />
            ) : (
              <span
                className="flex-1 text-xs text-gray-600 cursor-text hover:text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded"
                onClick={() => startEdit(opt.value, opt.label)}
                title="点击编辑"
              >
                {opt.label}
              </span>
            )}
            <button
              onClick={() => dispatch({ type: 'REMOVE_OPTION', fieldId: field.id, value: opt.value })}
              className="opacity-0 group-hover/opt:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1 transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <input
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
          placeholder="新选项名称"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addOption(); }}
        />
        <button
          onClick={addOption}
          disabled={!newLabel.trim()}
          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          + 添加
        </button>
      </div>
    </div>
  );
}

function VisibilityRuleEditor({
  field,
  formFields,
  visibilityRules,
  dispatch,
}: {
  field: FormField;
  formFields: FormField[];
  visibilityRules: VisibilityRule[];
  dispatch: (a: AppAction) => void;
}) {
  const existing = visibilityRules.find((r) => r.target === field.id);
  const [open, setOpen] = useState(false);
  const [condField, setCondField] = useState('');
  const [condOp, setCondOp] = useState<'eq' | 'neq' | 'contains'>('eq');
  const [condValue, setCondValue] = useState('');
  const [ruleAction, setRuleAction] = useState<'show' | 'hide'>('show');

  const optionSourceFields = formFields.filter(
    (f) => f.id !== field.id && OPTION_FIELD_TYPES.includes(f.type as FieldType)
  );
  const selectedSource = formFields.find((f) => f.id === condField);

  function openEditor() {
    if (existing) {
      const c = existing.conditions[0];
      setCondField(c?.field ?? '');
      setCondOp(c?.operator ?? 'eq');
      setCondValue(c?.value ?? '');
      setRuleAction(existing.action);
    } else {
      setCondField(optionSourceFields[0]?.id ?? '');
      setCondValue('');
      setRuleAction('show');
    }
    setOpen(true);
  }

  function saveRule() {
    if (!condField || !condValue) return;
    if (existing) dispatch({ type: 'REMOVE_VISIBILITY_RULE', id: existing.id });
    dispatch({
      type: 'ADD_VISIBILITY_RULE',
      rule: {
        id: `rule-${Math.random().toString(36).slice(2, 7)}`,
        target: field.id,
        action: ruleAction,
        logic: 'all',
        conditions: [{ field: condField, operator: condOp, value: condValue }],
      },
    });
    setOpen(false);
  }

  const opLabel = (op: string) => op === 'eq' ? '=' : op === 'neq' ? '≠' : '包含';

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">显隐规则</label>
        <button
          data-tutorial="open-visibility-rule"
          onClick={openEditor}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium px-1.5 py-0.5 rounded hover:bg-blue-50 transition-colors"
        >
          {existing ? '编辑' : '+ 添加'}
        </button>
      </div>

      {existing && !open && (
        <div className="mt-1 bg-blue-50 rounded-lg px-2.5 py-2 text-xs text-blue-700">
          <div className="flex items-center justify-between">
            <span>
              {existing.action === 'show' ? '显示' : '隐藏'} 当{' '}
              {formFields.find((f) => f.id === existing.conditions[0]?.field)?.label ?? '?'}{' '}
              {opLabel(existing.conditions[0]?.operator)}{' '}
              {formFields
                .find((f) => f.id === existing.conditions[0]?.field)
                ?.options?.find((o) => o.value === existing.conditions[0]?.value)?.label
                ?? existing.conditions[0]?.value}
            </span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_VISIBILITY_RULE', id: existing.id })}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="mt-2 bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 font-medium">当以下条件满足时</div>
          <div className="flex flex-col gap-1.5">
            <select
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
              value={condField}
              onChange={(e) => { setCondField(e.target.value); setCondValue(''); }}
            >
              <option value="">选择来源字段</option>
              {optionSourceFields.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <select
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
              value={condOp}
              onChange={(e) => setCondOp(e.target.value as 'eq' | 'neq' | 'contains')}
            >
              <option value="eq">等于</option>
              <option value="neq">不等于</option>
              <option value="contains">包含</option>
            </select>
            {selectedSource?.options ? (
              <select
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                value={condValue}
                onChange={(e) => setCondValue(e.target.value)}
              >
                <option value="">选择值</option>
                {selectedSource.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="输入值"
                value={condValue}
                onChange={(e) => setCondValue(e.target.value)}
              />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">则</span>
            <select
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
              value={ruleAction}
              onChange={(e) => setRuleAction(e.target.value as 'show' | 'hide')}
            >
              <option value="show">显示</option>
              <option value="hide">隐藏</option>
            </select>
            <span className="text-xs text-gray-500">此字段</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={saveRule}
              disabled={!condField || !condValue}
              className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              保存规则
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs px-3 py-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormulaConfigSection({
  field,
  formFields,
  onChange,
}: {
  field: FormField;
  formFields: FormField[];
  onChange: (updates: Partial<FormField>) => void;
}) {
  const [expr, setExpr] = useState(field.formulaConfig?.expression ?? '');
  const [displayResult, setDisplayResult] = useState(
    field.formulaConfig?.displayResult ?? '（提交后自动计算）'
  );

  function appendField(label: string) {
    setExpr((prev) => (prev ? `${prev} + ${label}` : label));
  }

  function save() {
    onChange({
      formulaConfig: {
        expression: expr,
        referencedFields: formFields
          .filter((f) => expr.includes(f.label))
          .map((f) => f.id),
        displayResult,
      },
    });
  }

  const availFields = formFields.filter(
    (f) => f.id !== field.id && !['formula', 'serial', 'divider', 'description', 'section-title'].includes(f.type)
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">表达式构建</label>
        <div className="mt-1 bg-gray-900 text-green-400 rounded-lg px-3 py-2 font-mono text-xs min-h-8">
          = {expr || <span className="text-gray-500">点击下方字段插入</span>}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {availFields.map((f) => (
            <button
              key={f.id}
              onClick={() => appendField(f.label)}
              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              {f.label}
            </button>
          ))}
          {['+', '-', '×', '÷'].map((op) => (
            <button
              key={op}
              onClick={() => setExpr((p) => `${p} ${op} `)}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 font-mono transition-colors"
            >
              {op}
            </button>
          ))}
          <button
            onClick={() => setExpr('')}
            className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
          >
            清空
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">展示占位文字</label>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={displayResult}
          onChange={(e) => setDisplayResult(e.target.value)}
        />
      </div>
      <button
        onClick={save}
        className="w-full text-xs bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        保存表达式
      </button>
      <p className="text-xs text-gray-400 text-center">演示态：仅配置展示，不参与计算</p>
    </div>
  );
}

const DEMO_TABLES: { id: string; label: string; fields: string[] }[] = [
  { id: 'employee', label: '员工信息表', fields: ['姓名', '工号', '部门', '职位', '入职日期'] },
  { id: 'department', label: '部门列表', fields: ['部门名称', '部门编号', '上级部门', '负责人'] },
  { id: 'project', label: '项目清单', fields: ['项目名称', '项目编号', '负责人', '状态', '截止日期'] },
  { id: 'customer', label: '客户档案', fields: ['客户名称', '客户编号', '联系人', '联系电话'] },
];

function DataLinkConfigSection({
  field,
  onChange,
}: {
  field: FormField;
  onChange: (updates: Partial<FormField>) => void;
}) {
  const config = field.dataLinkConfig;
  const [table, setTable] = useState(config?.linkedTable ?? '');
  const [displayField, setDisplayField] = useState(config?.displayField ?? '');
  const selectedTable = DEMO_TABLES.find((t) => t.id === table);

  function save() {
    if (!table) return;
    onChange({ dataLinkConfig: { linkedTable: table, displayField } as DataLinkConfig });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">关联表单</label>
        <select
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={table}
          onChange={(e) => { setTable(e.target.value); setDisplayField(''); }}
        >
          <option value="">选择关联表单</option>
          {DEMO_TABLES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>
      {selectedTable && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">显示字段</label>
          <select
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={displayField}
            onChange={(e) => setDisplayField(e.target.value)}
          >
            <option value="">选择显示字段</option>
            {selectedTable.fields.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      )}
      {config?.linkedTable && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
          已关联：{DEMO_TABLES.find((t) => t.id === config.linkedTable)?.label}
          {config.displayField ? ` · 显示「${config.displayField}」` : ''}
        </div>
      )}
      <button
        onClick={save}
        disabled={!table}
        className="w-full text-xs bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
      >
        保存关联配置
      </button>
      <p className="text-xs text-gray-400 text-center">演示态：仅配置展示，不真实查询数据</p>
    </div>
  );
}

function FieldConfigPanel({
  field,
  formFields,
  visibilityRules,
  onChange,
  dispatch,
}: {
  field: FormField;
  formFields: FormField[];
  visibilityRules: VisibilityRule[];
  onChange: (updates: Partial<FormField>) => void;
  dispatch: (a: AppAction) => void;
}) {
  const showOptions = OPTION_FIELD_TYPES.includes(field.type as FieldType);
  const showVisibility = !['divider', 'description', 'section-title'].includes(field.type);
  const showFormula = field.type === 'formula';
  const showDataLink = field.type === 'data-link';

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">字段标题</label>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
      {!['divider', 'description', 'section-title', 'formula', 'serial', 'signature'].includes(field.type) && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">提示文字</label>
          <input
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={field.placeholder ?? ''}
            placeholder="输入框占位提示"
            onChange={(e) => onChange({ placeholder: e.target.value })}
          />
        </div>
      )}
      {!['divider', 'description', 'section-title', 'serial'].includes(field.type) && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required-toggle"
            checked={field.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="required-toggle" className="text-sm text-gray-700">必填</label>
        </div>
      )}
      {showOptions && (
        <OptionsEditor field={field} dispatch={dispatch} />
      )}
      {showFormula && (
        <FormulaConfigSection field={field} formFields={formFields} onChange={onChange} />
      )}
      {showDataLink && (
        <DataLinkConfigSection field={field} onChange={onChange} />
      )}
      {showVisibility && (
        <VisibilityRuleEditor
          field={field}
          formFields={formFields}
          visibilityRules={visibilityRules}
          dispatch={dispatch}
        />
      )}
      {['serial', 'signature', 'cascade', 'data-link', 'subtable'].includes(field.type) && (
        <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          演示态字段，配置已展示但功能不真实执行
        </div>
      )}
    </div>
  );
}

export function FormDesigner() {
  const { formFields, selectedFieldId, visibilityRules, dispatch, addFieldByType } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedField = formFields.find((f) => f.id === selectedFieldId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    if ((active.data.current as any)?.fromPalette) {
      const fieldType = (active.data.current as any)?.type as FieldType;
      if (over.id === 'form-canvas' || formFields.some((f) => f.id === over.id)) {
        addFieldByType(fieldType);
      }
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = formFields.findIndex((f) => f.id === active.id);
      const newIndex = formFields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch({ type: 'REORDER_FIELDS', fromIndex: oldIndex, toIndex: newIndex });
      }
    }
  }

  const activePaletteData = activeId?.startsWith('palette-')
    ? (() => {
        for (const g of FIELD_GROUPS) {
          const found = g.fields.find((f) => `palette-${f.type}` === activeId);
          if (found) return found;
        }
        return null;
      })()
    : null;

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full overflow-hidden">
        {/* Left: Field Palette */}
        <div className="w-52 border-r border-gray-100 bg-gray-50 overflow-y-auto scrollbar-thin flex-shrink-0">
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">字段库</div>
            <div className="space-y-4">
              {FIELD_GROUPS.map((group) => (
                <div key={group.group}>
                  <div className="text-xs text-gray-400 font-medium px-1 mb-1">{group.group}</div>
                  <div className="space-y-0.5">
                    {group.fields.map((f) => (
                      <PaletteItem key={f.type} type={f.type} label={f.label} icon={f.icon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
          <div className="max-w-xl mx-auto p-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">请假申请表</h3>
                <p className="text-xs text-gray-400 mt-0.5">共 {formFields.length} 个字段</p>
              </div>
              <SortableContext items={formFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <DroppableCanvas isEmpty={formFields.length === 0}>
                  {formFields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      isSelected={field.id === selectedFieldId}
                      onSelect={() => dispatch({ type: 'SELECT_FIELD', id: field.id })}
                      onDelete={() => dispatch({ type: 'REMOVE_FIELD', id: field.id })}
                    />
                  ))}
                </DroppableCanvas>
              </SortableContext>
            </div>
          </div>
        </div>

        {/* Right: Config Panel */}
        <div className="w-64 border-l border-gray-100 bg-gray-50 overflow-y-auto scrollbar-thin flex-shrink-0">
          {selectedField ? (
            <div>
              <div className="px-4 py-3 border-b border-gray-100 bg-white">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">属性配置</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5">{selectedField.label}</div>
              </div>
              <FieldConfigPanel
                field={selectedField}
                formFields={formFields}
                visibilityRules={visibilityRules}
                onChange={(updates) => dispatch({ type: 'UPDATE_FIELD', id: selectedField.id, updates })}
                dispatch={dispatch}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="text-sm text-gray-400">点击画布中的字段<br />可以在这里配置属性</p>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activePaletteData && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-blue-200 text-sm font-medium text-blue-700">
            <span>{activePaletteData.icon}</span>
            <span>{activePaletteData.label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
