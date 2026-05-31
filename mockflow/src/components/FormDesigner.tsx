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
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import type { FormField, FieldType } from '../types';

const FIELD_GROUPS: { group: string; fields: { type: FieldType; label: string; icon: string }[] }[] = [
  {
    group: '基础字段',
    fields: [
      { type: 'text', label: '单行文本', icon: '✏️' },
      { type: 'textarea', label: '多行文本', icon: '📝' },
      { type: 'number', label: '数字', icon: '🔢' },
      { type: 'amount', label: '金额', icon: '💰' },
    ],
  },
  {
    group: '选择字段',
    fields: [
      { type: 'radio', label: '单选', icon: '⭕' },
      { type: 'checkbox', label: '多选', icon: '☑️' },
      { type: 'select', label: '下拉单选', icon: '▾' },
      { type: 'multiselect', label: '下拉多选', icon: '▾▾' },
    ],
  },
  {
    group: '日期时间',
    fields: [
      { type: 'date', label: '日期', icon: '📅' },
      { type: 'daterange', label: '日期区间', icon: '📆' },
      { type: 'time', label: '时间', icon: '⏰' },
    ],
  },
  {
    group: '高级字段',
    fields: [
      { type: 'member', label: '成员', icon: '👤' },
      { type: 'department', label: '部门', icon: '🏢' },
      { type: 'attachment', label: '附件', icon: '📎' },
      { type: 'image', label: '图片', icon: '🖼️' },
      { type: 'rating', label: '评分', icon: '⭐' },
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
    ],
  },
];

const TUTORIAL_TARGETS: Partial<Record<FieldType, string>> = {
  member: 'field-member',
  daterange: 'field-daterange',
  select: 'field-select',
  textarea: 'field-textarea',
};

function PaletteItem({ type, label, icon }: { type: FieldType; label: string; icon: string }) {
  const tutorialId = TUTORIAL_TARGETS[type] ?? type;
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
  if (field.type === 'divider') {
    return <hr className="border-gray-200" />;
  }
  if (field.type === 'description') {
    return (
      <div className="text-sm text-gray-500 italic bg-yellow-50 p-2 rounded">
        {field.label || '说明文字'}
      </div>
    );
  }
  const fieldTypes = {
    text: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder={field.placeholder || '请输入'} readOnly />,
    textarea: <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 h-16 resize-none" placeholder={field.placeholder || '请输入'} readOnly />,
    number: <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="0" readOnly />,
    amount: <div className="flex"><span className="border border-r-0 border-gray-200 rounded-l-lg px-3 py-2 text-sm bg-gray-100 text-gray-500">¥</span><input className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2 text-sm bg-gray-50" placeholder="0.00" readOnly /></div>,
    select: <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" disabled><option>{field.options?.[0]?.label ?? '请选择'}</option></select>,
    multiselect: <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" disabled multiple><option>{field.options?.[0]?.label ?? '请选择'}</option></select>,
    radio: <div className="flex flex-wrap gap-3">{(field.options || [{value:'选项1',label:'选项1'}]).map(o => <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600"><input type="radio" readOnly />{o.label}</label>)}</div>,
    checkbox: <div className="flex flex-wrap gap-3">{(field.options || [{value:'选项1',label:'选项1'}]).map(o => <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600"><input type="checkbox" readOnly />{o.label}</label>)}</div>,
    date: <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="选择日期" readOnly />,
    daterange: <div className="flex gap-2"><input className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" placeholder="开始日期" readOnly /><span className="text-gray-400 py-2">至</span><input className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50" placeholder="结束日期" readOnly /></div>,
    time: <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="选择时间" readOnly />,
    member: <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"><span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">👤</span><span className="text-sm text-gray-400">选择成员</span></div>,
    department: <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"><span className="text-sm text-gray-400">选择部门</span></div>,
    attachment: <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-sm text-gray-400">📎 点击上传附件</div>,
    image: <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-sm text-gray-400">🖼️ 点击上传图片</div>,
    location: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="点击获取定位" readOnly />,
    rating: <div className="flex gap-1">{[1,2,3,4,5].map(i => <span key={i} className="text-gray-300 text-xl">★</span>)}</div>,
    'data-link': <div className="border border-blue-200 rounded-lg p-3 text-xs text-blue-500 bg-blue-50">🔗 关联其他表单数据（演示态）</div>,
    subtable: <div className="border border-purple-200 rounded-lg p-3 text-xs text-purple-500 bg-purple-50">📋 子表单（演示态）</div>,
    serial: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" value="NO-202401001（自动生成）" readOnly />,
    formula: <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" value="= 公式计算结果" readOnly />,
    'section-title': <div className="text-sm font-semibold text-gray-700">{field.label}</div>,
  };
  return (fieldTypes[field.type as keyof typeof fieldTypes] || null);
}

function SortableField({ field, isSelected, onSelect, onDelete }: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border-2 p-4 cursor-pointer transition-all
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        ${isSelected ? 'border-blue-400 bg-blue-50/50' : 'border-transparent bg-white hover:border-gray-300 hover:shadow-sm'}
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

function FieldConfigPanel({ field, onChange }: { field: FormField; onChange: (updates: Partial<FormField>) => void }) {
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
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">提示文字</label>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={field.placeholder ?? ''}
          placeholder="输入框占位提示"
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      </div>
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
      {field.options && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">选项</label>
          <div className="mt-1 space-y-1">
            {field.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-600">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FormDesigner() {
  const { formFields, selectedFieldId, dispatch, addFieldByType } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedField = formFields.find((f) => f.id === selectedFieldId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Dropped from palette
    if ((active.data.current as any)?.fromPalette) {
      const fieldType = (active.data.current as any)?.type as FieldType;
      if (over.id === 'form-canvas' || formFields.some((f) => f.id === over.id)) {
        addFieldByType(fieldType);
      }
      return;
    }

    // Reorder existing fields
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
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
        <div className="w-60 border-l border-gray-100 bg-gray-50 overflow-y-auto scrollbar-thin flex-shrink-0">
          {selectedField ? (
            <div>
              <div className="px-4 py-3 border-b border-gray-100 bg-white">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">属性配置</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5">{selectedField.label}</div>
              </div>
              <FieldConfigPanel
                field={selectedField}
                onChange={(updates) => dispatch({ type: 'UPDATE_FIELD', id: selectedField.id, updates })}
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
