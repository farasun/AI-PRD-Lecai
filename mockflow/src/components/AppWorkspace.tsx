import React, { useState } from 'react';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import { FormDesigner } from './FormDesigner';
import { FlowDesigner } from './FlowDesigner';
import { DataView } from './DataView';
import { Reports } from './Reports';
import { UsageEnd } from './UsageEnd';

type Tab = 'form' | 'flow' | 'data' | 'reports' | 'usage';

const TABS: { id: Tab; label: string; icon: string; tutorialId?: string }[] = [
  { id: 'form', label: '表单设计', icon: '📝', tutorialId: 'tab-form' },
  { id: 'flow', label: '流程设计', icon: '🔄', tutorialId: 'tab-flow' },
  { id: 'data', label: '数据管理', icon: '🗄️', tutorialId: 'tab-data' },
  { id: 'reports', label: '报表 & 仪表盘', icon: '📊', tutorialId: 'tab-reports' },
  { id: 'usage', label: '使用端', icon: '🚀', tutorialId: 'tab-usage' },
];

function PublishButton() {
  const { isPublished, tutorialActive, dispatch } = useStore();
  const { isTarget, isShaking } = useTutorialTarget('publish-button');
  const [showSuccess, setShowSuccess] = useState(false);

  function handlePublish() {
    if (!isPublished) {
      dispatch({ type: 'SET_PUBLISHED', value: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }

  return (
    <div className="relative">
      {showSuccess && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-green-100 p-3 w-56 z-10 animate-slide-up">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-semibold text-gray-900">应用已上线！</span>
          </div>
          <p className="text-xs text-gray-500">切换到「使用端」，体验你搭建的系统</p>
        </div>
      )}
      <button
        data-tutorial="publish-button"
        onClick={handlePublish}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
          ${isPublished
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}
          ${isTarget ? 'spotlight-pulse' : ''}
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        {isPublished ? '✓ 已发布' : '发布'}
      </button>
    </div>
  );
}

export function AppWorkspace() {
  const { currentTab, appName, tutorialActive, dispatch } = useStore();

  function handleTabClick(tab: Tab) {
    dispatch({ type: 'SET_TAB', tab });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center px-5 py-3 border-b border-gray-100 bg-white z-10">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'workbench' })}
          className="text-gray-400 hover:text-gray-600 transition-colors mr-3 text-lg"
        >
          ←
        </button>
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-base mr-2">🏖️</div>
        <div>
          <div className="font-semibold text-gray-900 text-sm leading-none">{appName}</div>
          <div className="text-xs text-gray-400">应用工作区</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {tutorialActive && (
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              引导进行中
            </div>
          )}
          <PublishButton />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex items-center px-5 border-b border-gray-100 bg-white overflow-x-auto scrollbar-thin">
        {TABS.map((tab) => {
          const { isTarget } = useTutorialTarget(tab.tutorialId ?? tab.id);
          return (
            <button
              key={tab.id}
              data-tutorial={tab.tutorialId}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                ${currentTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'}
                ${isTarget ? 'spotlight-pulse rounded-t-lg' : ''}
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {currentTab === 'form' && <FormDesigner />}
        {currentTab === 'flow' && <FlowDesigner />}
        {currentTab === 'data' && <DataView />}
        {currentTab === 'reports' && <Reports />}
        {currentTab === 'usage' && <UsageEnd />}
      </div>
    </div>
  );
}
