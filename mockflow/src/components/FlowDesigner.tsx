import React, { useState } from 'react';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import type { FlowNode, NodeType } from '../types';
import { SEED_MEMBERS } from '../data/seed';

const NODE_COLORS: Record<NodeType, string> = {
  initiator: 'bg-green-100 border-green-300 text-green-800',
  approval: 'bg-blue-100 border-blue-300 text-blue-800',
  cc: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  condition: 'bg-purple-100 border-purple-300 text-purple-800',
  auto: 'bg-orange-100 border-orange-300 text-orange-800',
  end: 'bg-gray-100 border-gray-300 text-gray-700',
};

const NODE_ICONS: Record<NodeType, string> = {
  initiator: '🙋',
  approval: '✅',
  cc: '📢',
  condition: '🔀',
  auto: '⚡',
  end: '🏁',
};

function AddNodeMenu({ onAdd, onClose }: { onAdd: (type: NodeType) => void; onClose: () => void }) {
  const options: { type: NodeType; label: string; desc: string }[] = [
    { type: 'approval', label: '审批节点', desc: '需要审批人处理' },
    { type: 'cc', label: '抄送节点', desc: '通知相关人员' },
    { type: 'condition', label: '条件分支', desc: '按条件走不同路径' },
    { type: 'auto', label: '自动节点', desc: '自动执行操作' },
  ];
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 w-52 animate-slide-up">
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => { onAdd(opt.type); onClose(); }}
          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <div className="text-sm font-medium text-gray-700">{NODE_ICONS[opt.type]} {opt.label}</div>
          <div className="text-xs text-gray-400">{opt.desc}</div>
        </button>
      ))}
    </div>
  );
}

function AddButton({ afterId }: { afterId: string }) {
  const [open, setOpen] = useState(false);
  const { flowNodes, dispatch } = useStore();
  const { isTarget, isShaking } = useTutorialTarget('flow-add-btn');

  function handleAdd(type: NodeType) {
    const id = `node-${type}-${Math.random().toString(36).slice(2, 7)}`;
    const labels: Record<string, string> = { approval: '审批节点', cc: '抄送节点', condition: '条件分支', auto: '自动节点' };
    dispatch({
      type: 'ADD_FLOW_NODE',
      node: { id, type, label: labels[type] ?? type, approvers: [] },
      afterId,
    });
  }

  return (
    <div className="relative flex flex-col items-center py-1" data-tutorial="flow-add-btn">
      <div className="w-px h-6 bg-gray-200" />
      <button
        onClick={() => setOpen(!open)}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all
          ${open ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-blue-300 text-blue-500 hover:bg-blue-50'}
          ${isTarget ? 'spotlight-pulse ring-2 ring-blue-400' : ''}
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        +
      </button>
      <div className="w-px h-6 bg-gray-200" />
      {open && (
        <>
          <div className="fixed inset-0 z-5" onClick={() => setOpen(false)} />
          <AddNodeMenu onAdd={handleAdd} onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}

function NodeCard({
  node,
  isSelected,
  onClick,
}: {
  node: FlowNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const tutorialId = node.type === 'approval' ? 'flow-approval-node' : `node-${node.id}`;
  const { isTarget, isShaking } = useTutorialTarget(tutorialId);

  return (
    <div
      data-tutorial={tutorialId}
      onClick={onClick}
      className={`w-64 border-2 rounded-xl p-4 cursor-pointer transition-all
        ${NODE_COLORS[node.type]}
        ${isSelected ? 'shadow-md scale-105' : 'hover:shadow-sm hover:scale-102'}
        ${isTarget ? 'spotlight-pulse' : ''}
        ${isShaking ? 'animate-shake' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{NODE_ICONS[node.type]}</span>
        <span className="font-semibold text-sm">{node.label}</span>
      </div>
      {node.approvers && node.approvers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {node.approvers.map((a) => (
            <span key={a} className="text-xs bg-white/60 px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
        </div>
      )}
      {node.type === 'condition' && (
        <div className="mt-2 text-xs text-purple-600 bg-white/50 rounded-lg px-2 py-1">
          请假天数 &gt; 3天 → 总监审批
        </div>
      )}
    </div>
  );
}

const CONDITION_OPERATORS = [
  { value: 'eq', label: '等于 =' },
  { value: 'neq', label: '不等于 ≠' },
  { value: 'gt', label: '大于 >' },
  { value: 'gte', label: '大于等于 ≥' },
  { value: 'lt', label: '小于 <' },
  { value: 'lte', label: '小于等于 ≤' },
];

function ConditionNodePanel({ node, dispatch }: { node: FlowNode; dispatch: (a: any) => void }) {
  const { formFields } = useStore();
  const [condField, setCondField] = useState(node.conditionField ?? '');
  const [condOp, setCondOp] = useState('eq');
  const [condValue, setCondValue] = useState(node.conditionValue ?? '');
  const [saved, setSaved] = useState(false);

  const selectedField = formFields.find((f) => f.id === condField);

  function save() {
    if (!condField) return;
    dispatch({ type: 'UPDATE_FLOW_NODE', id: node.id, updates: { conditionField: condField, conditionValue: condValue } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">条件规则配置</div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">条件字段</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={condField}
          onChange={(e) => { setCondField(e.target.value); setCondValue(''); }}
        >
          <option value="">选择字段</option>
          {formFields.filter((f) => !['divider', 'description', 'section-title'].includes(f.type)).map((f) => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">运算符</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={condOp}
          onChange={(e) => setCondOp(e.target.value)}
        >
          {CONDITION_OPERATORS.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">比较值</label>
        {selectedField?.options ? (
          <select
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={condValue}
            onChange={(e) => setCondValue(e.target.value)}
          >
            <option value="">选择值</option>
            {selectedField.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder={selectedField?.type === 'number' ? '输入数字' : '输入值'}
            value={condValue}
            onChange={(e) => setCondValue(e.target.value)}
          />
        )}
      </div>

      {node.conditionField && (
        <div className="bg-purple-50 rounded-lg px-3 py-2 text-xs text-purple-700">
          当「{formFields.find((f) => f.id === node.conditionField)?.label ?? node.conditionField}」
          {' '}{node.conditionValue ? `= ${node.conditionValue}` : ''} 时走此分支
        </div>
      )}

      <button
        onClick={save}
        disabled={!condField}
        className={`w-full text-xs py-2 rounded-lg transition-colors disabled:opacity-40 ${
          saved ? 'bg-green-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {saved ? '✓ 已保存' : '保存条件'}
      </button>
      <p className="text-xs text-gray-400 text-center">演示态：条件配置不触发真实路由</p>
    </div>
  );
}

function NodeConfigPanel({ node, onClose }: { node: FlowNode; onClose: () => void }) {
  const { dispatch } = useStore();
  const approvers = node.approvers ?? [];

  const allMembers = ['直属主管', '部门经理', '总监', '人事专员', ...SEED_MEMBERS];

  return (
    <div className="absolute right-0 top-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 animate-slide-up">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{NODE_ICONS[node.type]} {node.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">节点配置</div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
      </div>

      {(node.type === 'approval' || node.type === 'cc') && (
        <div className="p-4 space-y-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {node.type === 'approval' ? '审批人' : '抄送人'}
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
            {allMembers.map((member) => (
              <label
                key={member}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={approvers.includes(member)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...approvers, member]
                      : approvers.filter((a) => a !== member);
                    dispatch({ type: 'UPDATE_FLOW_NODE', id: node.id, updates: { approvers: next } });
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
                  {member.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{member}</span>
              </label>
            ))}
          </div>
          {approvers.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-500 mb-2">已选</div>
              <div className="flex flex-wrap gap-1">
                {approvers.map((a) => (
                  <span key={a} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {node.type === 'initiator' && (
        <div className="p-4 text-sm text-gray-500">所有人均可发起申请</div>
      )}
      {node.type === 'end' && (
        <div className="p-4 text-sm text-gray-500">审批流程结束节点</div>
      )}
      {node.type === 'condition' && (
        <ConditionNodePanel node={node} dispatch={dispatch} />
      )}
      {node.type === 'auto' && (
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-2">自动操作（演示）</div>
          <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-700">
            审批通过后自动更新状态为「已批准」，并发送通知给申请人
          </div>
        </div>
      )}
    </div>
  );
}

export function FlowDesigner() {
  const { flowNodes, selectedNodeId, dispatch } = useStore();
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);

  const configNode = flowNodes.find((n) => n.id === configNodeId) ?? null;

  return (
    <div
      className="flex h-full overflow-hidden"
      data-tutorial="flow-designer-area"
      onClick={() => setConfigNodeId(null)}
    >
      {/* Flow canvas */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
        <div className="flex flex-col items-center py-12 px-4 min-h-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-lg">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">请假申请 · 审批流程</h3>
              <p className="text-xs text-gray-400 mt-0.5">共 {flowNodes.length} 个节点</p>
            </div>

            <div className="flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
              {flowNodes.map((node, i) => (
                <React.Fragment key={node.id}>
                  <NodeCard
                    node={node}
                    isSelected={configNodeId === node.id}
                    onClick={() => setConfigNodeId(configNodeId === node.id ? null : node.id)}
                  />
                  {/* Add button between nodes (not after last) */}
                  {i < flowNodes.length - 1 && (
                    <AddButton afterId={node.id} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            点击节点配置 · 点击「+」添加节点
          </div>
        </div>
      </div>

      {/* Config panel */}
      {configNode && (
        <div className="w-80 border-l border-gray-100 bg-white overflow-y-auto scrollbar-thin relative">
          <NodeConfigPanel node={configNode} onClose={() => setConfigNodeId(null)} />
        </div>
      )}
    </div>
  );
}
