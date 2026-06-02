import React, { useState } from 'react';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import type { VisibilityCondition } from '../types';
import { FILL_PRESETS, APPROVAL_ASSIST } from '../data/ai-scripts';

const DEFAULT_FIELDS = [
  { id: 'member', type: 'member' as const, label: '申请人', required: true, options: undefined as undefined },
  { id: 'daterange', type: 'daterange' as const, label: '请假起止', required: true, options: undefined as undefined },
  { id: 'select', type: 'select' as const, label: '请假类型', required: true, options: [
    { value: '事假', label: '事假' },
    { value: '病假', label: '病假' },
    { value: '年假', label: '年假' },
  ] },
  { id: 'textarea', type: 'textarea' as const, label: '请假事由', required: false, options: undefined as undefined },
];

function AiFillModal({ onClose }: { onClose: () => void }) {
  const { formFields, dispatch } = useStore();
  const [step, setStep] = useState<'pick' | 'recognizing' | 'done'>('pick');
  const [selectedSource, setSelectedSource] = useState<string>('');

  const sources = [
    { key: 'leave_doc', icon: '📄', label: '请假条.jpg', desc: '上传文档自动识别' },
    { key: 'leave_voice', icon: '🎙️', label: '我下周一到周三请病假去医院', desc: '语音 / 口语输入' },
  ];

  async function handleSelect(key: string) {
    setSelectedSource(key);
    setStep('recognizing');
    await new Promise((r) => setTimeout(r, 1800));

    const preset = FILL_PRESETS[key];
    if (!preset) { setStep('done'); return; }

    // Auto-fill by field type
    const fieldsToFill = formFields.length > 0 ? formFields : [
      { id: 'member', type: 'member' as const },
      { id: 'daterange', type: 'daterange' as const },
      { id: 'select', type: 'select' as const },
      { id: 'textarea', type: 'textarea' as const },
    ];

    for (const f of fieldsToFill) {
      await new Promise((r) => setTimeout(r, 280));
      if (f.type === 'member' && preset.member) {
        dispatch({ type: 'SET_FORM_VALUE', key: f.id, value: preset.member });
      } else if (f.type === 'select' && preset.select) {
        dispatch({ type: 'SET_FORM_VALUE', key: f.id, value: preset.select });
      } else if (f.type === 'daterange') {
        if (preset.daterange_start) dispatch({ type: 'SET_FORM_VALUE', key: `${f.id}_start`, value: preset.daterange_start });
        if (preset.daterange_end) dispatch({ type: 'SET_FORM_VALUE', key: `${f.id}_end`, value: preset.daterange_end });
      } else if (f.type === 'textarea' && preset.textarea) {
        dispatch({ type: 'SET_FORM_VALUE', key: f.id, value: preset.textarea });
      }
    }

    setStep('done');
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">M</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">AI 智能填单</div>
              <div className="text-xs text-gray-400">小M 帮你自动识别并填写</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {step === 'pick' && (
          <>
            <p className="text-sm text-gray-500 mb-4">选择信息来源，小M 将自动抽取关键信息并填入表单：</p>
            <div className="space-y-3">
              {sources.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSelect(s.key)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-start gap-3"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{s.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'recognizing' && (
          <div className="py-6 text-center">
            <div className="text-3xl mb-3 animate-spin inline-block">⚙️</div>
            <div className="font-medium text-gray-800 mb-1">小M 识别中…</div>
            <div className="text-sm text-gray-400">正在从{selectedSource === 'leave_voice' ? '语音' : '文档'}中抽取请假信息</div>
          </div>
        )}

        {step === 'done' && (
          <div className="py-4 text-center">
            <div className="text-3xl mb-3">✅</div>
            <div className="font-semibold text-gray-900 mb-1">已自动填写完毕</div>
            <p className="text-sm text-gray-500 mb-4">请核对信息，如有不对可直接修改。</p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              好的，继续提交 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeView() {
  const { formFields, formValues, submissions, visibilityRules, dispatch } = useStore();
  const { isTarget: isSubmitTarget, isShaking: isSubmitShaking } = useTutorialTarget('usage-submit-btn');
  const [showAiFill, setShowAiFill] = useState(false);

  const fields = formFields.length > 0 ? formFields : DEFAULT_FIELDS;

  function evaluateCondition(c: VisibilityCondition): boolean {
    const val = formValues[c.field] ?? '';
    if (c.operator === 'eq') return val === c.value;
    if (c.operator === 'neq') return val !== c.value;
    if (c.operator === 'contains') return val.includes(c.value);
    return false;
  }

  function isVisible(fieldId: string): boolean {
    const rules = visibilityRules.filter((r) => r.target === fieldId);
    if (rules.length === 0) return true;
    for (const rule of rules) {
      const met = rule.logic === 'all'
        ? rule.conditions.every(evaluateCondition)
        : rule.conditions.some(evaluateCondition);
      return rule.action === 'show' ? met : !met;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_FORM' });
  }

  const lastSubmission = submissions[submissions.length - 1];

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      {showAiFill && <AiFillModal onClose={() => setShowAiFill(false)} />}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">请假申请</h2>
            <p className="text-blue-200 text-xs mt-0.5">填写完整后点击提交</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAiFill(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-all"
          >
            <span>🤖</span>
            AI 智能填单
          </button>
        </div>

        {lastSubmission && (
          <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-green-500 text-lg">✅</span>
            <div>
              <div className="text-sm font-medium text-green-800">申请已提交！</div>
              <div className="text-xs text-green-600">审批单号：{lastSubmission.id} · 等待直属主管审批</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.filter((field) => isVisible(field.id)).map((field) => (
            <div key={field.id}>
              {'type' in field && field.type === 'divider' ? (
                <hr className="border-gray-200" />
              ) : 'type' in field && field.type === 'section-title' ? (
                <div className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">{field.label}</div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'member' && (
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: formValues[field.id] || '我' })}>
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">我</div>
                      <span className="text-sm text-gray-700">{formValues[field.id] || '我（当前用户）'}</span>
                    </div>
                  )}
                  {field.type === 'daterange' && (
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={formValues[`${field.id}_start`] ?? '2024-02-01'}
                        onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: `${field.id}_start`, value: e.target.value })}
                      />
                      <span className="text-gray-400 py-2.5">至</span>
                      <input
                        type="date"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={formValues[`${field.id}_end`] ?? '2024-02-02'}
                        onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: `${field.id}_end`, value: e.target.value })}
                      />
                    </div>
                  )}
                  {field.type === 'select' && (
                    <select
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      value={formValues[field.id] ?? ''}
                      onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: e.target.value })}
                    >
                      <option value="">请选择</option>
                      {(field.options ?? []).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 h-20 resize-none"
                      placeholder="请输入请假事由..."
                      value={formValues[field.id] ?? ''}
                      onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: e.target.value })}
                    />
                  )}
                  {field.type === 'text' && (
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder={('placeholder' in field ? field.placeholder : '') || '请输入'}
                      value={formValues[field.id] ?? ''}
                      onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: e.target.value })}
                    />
                  )}
                  {field.type === 'attachment' && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-blue-300 hover:text-blue-400 transition-colors"
                      onClick={() => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: '（已上传）' })}>
                      {formValues[field.id] ? (
                        <span className="text-green-600">✓ {formValues[field.id]}</span>
                      ) : (
                        <span>📎 点击上传附件</span>
                      )}
                    </div>
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="0"
                      value={formValues[field.id] ?? ''}
                      onChange={(e) => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: e.target.value })}
                    />
                  )}
                  {field.type === 'radio' && (
                    <div className="flex flex-wrap gap-3">
                      {(field.options ?? []).map((o) => (
                        <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={o.value}
                            checked={formValues[field.id] === o.value}
                            onChange={() => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: o.value })}
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === 'checkbox' && (
                    <div className="flex flex-wrap gap-3">
                      {(field.options ?? []).map((o) => (
                        <label key={o.value} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" readOnly />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === 'rating' && (
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_FORM_VALUE', key: field.id, value: String(i) })}
                          className={`text-2xl transition-colors ${
                            Number(formValues[field.id] ?? 0) >= i ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            type="submit"
            data-tutorial="usage-submit-btn"
            className={`w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all mt-2
              ${isSubmitTarget ? 'spotlight-pulse' : ''}
              ${isSubmitShaking ? 'animate-shake' : ''}
            `}
          >
            提交申请
          </button>
        </form>
      </div>
    </div>
  );
}

function ApprovalAssistCard({ sub }: { sub: { applicant: string; leaveType: string; dateRange: string } }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700">
          <span>🤖</span> AI 辅助审批
        </div>
        <button onClick={() => setOpen(false)} className="text-indigo-300 hover:text-indigo-500 text-xs">✕</button>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex gap-2">
          <span className="text-gray-400 flex-shrink-0">摘要：</span>
          <span className="text-gray-700">{sub.applicant}申请{sub.leaveType} 3 天（{sub.dateRange.replace(' 至 ', '–')}），已附证明材料。</span>
        </div>
        <div className="flex gap-2">
          <span className="text-orange-400 flex-shrink-0">风险：</span>
          <span className="text-gray-700">{APPROVAL_ASSIST.risk}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-green-500 flex-shrink-0">建议：</span>
          <span className="text-gray-700 font-medium">{APPROVAL_ASSIST.suggestion}</span>
        </div>
      </div>
    </div>
  );
}

function ManagerView() {
  const { submissions, dispatch } = useStore();
  const pendingItems = submissions.filter((s) => s.status === 'pending');
  const processedItems = submissions.filter((s) => s.status !== 'pending');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">待处理审批</h2>
        <p className="text-sm text-gray-500 mt-0.5">你有 {pendingItems.length} 条待审批申请</p>
      </div>

      {pendingItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-gray-500">暂无待审批申请</p>
          <p className="text-xs text-gray-400 mt-1">切换到「员工」身份提交一条申请</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingItems.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <ApprovalAssistCard sub={sub} />
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                    {sub.applicant.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{sub.applicant}</div>
                    <div className="text-xs text-gray-400">{sub.submittedAt}</div>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">待审批</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div><span className="text-gray-400">假期类型：</span><span className="text-gray-700">{sub.leaveType}</span></div>
                <div><span className="text-gray-400">请假时间：</span><span className="text-gray-700">{sub.dateRange}</span></div>
                <div className="col-span-2"><span className="text-gray-400">原因：</span><span className="text-gray-700">{sub.reason}</span></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: 'APPROVE_SUBMISSION', id: sub.id })}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  ✓ 通过
                </button>
                <button
                  onClick={() => dispatch({ type: 'UPDATE_RECORD', id: sub.id, updates: { status: 'rejected' } })}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  ✕ 拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {processedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">已处理</h3>
          <div className="space-y-2">
            {processedItems.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">{sub.applicant.charAt(0)}</div>
                  <span className="text-sm text-gray-700">{sub.applicant} · {sub.leaveType}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${sub.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {sub.status === 'approved' ? '已通过' : '已拒绝'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function UsageEnd() {
  const { usageRole, isPublished, dispatch } = useStore();
  const { isTarget: isSwitchTarget, isShaking: isSwitchShaking } = useTutorialTarget('switch-role-btn');

  if (!isPublished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">应用尚未发布</h3>
        <p className="text-sm text-gray-500 mb-4">请先点击右上角「发布」按钮发布应用</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Role switcher */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
        <div className="text-xs text-gray-500 font-medium">当前身份：</div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => dispatch({ type: 'SET_USAGE_ROLE', role: 'employee' })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              usageRole === 'employee' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👤 员工（提交申请）
          </button>
          <button
            data-tutorial="switch-role-btn"
            onClick={() => dispatch({ type: 'SET_USAGE_ROLE', role: 'manager' })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${usageRole === 'manager' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              ${isSwitchTarget ? 'spotlight-pulse' : ''}
              ${isSwitchShaking ? 'animate-shake' : ''}
            `}
          >
            👔 主管（审批申请）
          </button>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            已发布上线
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {usageRole === 'employee' ? <EmployeeView /> : <ManagerView />}
      </div>
    </div>
  );
}
