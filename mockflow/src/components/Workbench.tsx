import React, { useState } from 'react';
import { useStore } from '../store';

const TEMPLATES = [
  { id: 'leave', icon: '🏖️', title: '请假管理', desc: '员工请假申请与审批', color: 'bg-blue-50 border-blue-200' },
  { id: 'repair', icon: '🔧', title: '设备报修', desc: '设备故障报修与跟踪', color: 'bg-orange-50 border-orange-200' },
  { id: 'event', icon: '🎪', title: '活动报名', desc: '社区活动组织与报名', color: 'bg-purple-50 border-purple-200' },
  { id: 'ticket', icon: '🎫', title: '服务工单', desc: '客服工单流转处理', color: 'bg-green-50 border-green-200' },
];

function NewAppModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('leave');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-bounce-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">新建应用</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">应用名称</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="例如：部门采购管理"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">选择模板（可选）</label>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  selectedTemplate === t.id
                    ? 'border-blue-400 bg-blue-50'
                    : `${t.color} hover:border-blue-300`
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-800">{t.title}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button
            onClick={() => onCreate(name || '新应用')}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            创建应用
          </button>
        </div>
      </div>
    </div>
  );
}

export function Workbench() {
  const { dispatch } = useStore();
  const [showNewApp, setShowNewApp] = useState(false);

  const APPS = [
    {
      id: 'leave-app',
      icon: '🏖️',
      name: '请假管理系统',
      desc: '请假申请 · 审批流程 · 数据报表',
      members: 8,
      forms: 1,
      color: 'bg-blue-500',
    },
    {
      id: 'admin-app',
      icon: '📋',
      name: '行政管理',
      desc: '行政申请 · 物资管理 · 会议室预约',
      members: 24,
      forms: 5,
      color: 'bg-purple-500',
    },
  ];

  function handleCreateApp(name: string) {
    dispatch({ type: 'SET_APP_NAME', name });
    dispatch({ type: 'SET_VIEW', view: 'workspace' });
    setShowNewApp(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'learning-map' })}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <div>
            <div className="font-bold text-gray-900">MockFlow</div>
            <div className="text-xs text-gray-400">工作台</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
            我
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">我的应用</h1>
            <p className="text-sm text-gray-500 mt-0.5">管理你创建的所有低代码应用</p>
          </div>
          <button
            onClick={() => setShowNewApp(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + 新建应用
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                dispatch({ type: 'SET_APP_NAME', name: app.name });
                dispatch({ type: 'SET_VIEW', view: 'workspace' });
              }}
              className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 group"
            >
              <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {app.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{app.name}</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">{app.desc}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>👥 {app.members} 人</span>
                <span>📝 {app.forms} 张表单</span>
              </div>
            </button>
          ))}

          {/* New app card */}
          <button
            onClick={() => setShowNewApp(true)}
            className="text-left bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-50 transition-colors">
              +
            </div>
            <h3 className="font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">新建应用</h3>
            <p className="text-xs text-gray-400 mt-1">从模板或空白开始</p>
          </button>
        </div>
      </main>

      {showNewApp && <NewAppModal onClose={() => setShowNewApp(false)} onCreate={handleCreateApp} />}
    </div>
  );
}
