import React from 'react';
import { useStore } from '../store';
import { leaveApprovalScenario } from '../data/scenario-leave';

export function LearningMap() {
  const { completedScenarios, dispatch } = useStore();

  const scenarios = [leaveApprovalScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <div>
            <div className="font-bold text-gray-900 text-lg leading-none">MockFlow</div>
            <div className="text-xs text-gray-400">低代码体验沙盘</div>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'workbench' })}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          跳过引导，自由探索 →
        </button>
      </header>

      {/* Hero */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            🎓 交互式低代码教程
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            30 分钟，<span className="text-blue-600">从零搭一个应用</span>
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            跟着引导一步步操作，亲身体验低代码是怎么工作的。
            <br />
            不需要任何技术背景，拖拖拽拽就能完成。
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-4">
          {scenarios.map((scenario) => {
            const isCompleted = completedScenarios.includes(scenario.id);
            return (
              <div
                key={scenario.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{scenario.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-gray-900">{scenario.title}</h2>
                        {isCompleted && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            ✓ 已完成
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{scenario.description}</p>

                      {/* Chapters preview */}
                      <div className="flex gap-2 flex-wrap mb-5">
                        {scenario.chapters.map((ch, i) => (
                          <div
                            key={ch.id}
                            className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5"
                          >
                            <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="text-xs text-gray-600">{ch.title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            dispatch({ type: 'START_TUTORIAL', scenarioId: scenario.id, mode: 'guided' })
                          }
                          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          {isCompleted ? '🔄 再学一遍' : '▶ 开始学习'}
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: 'SET_VIEW', view: 'workspace' });
                          }}
                          className="text-sm text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          自由探索
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar if partially complete */}
              </div>
            );
          })}
        </div>

        {/* Coming soon */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-2xl">🔒</span>
            <div>
              <div className="font-medium text-gray-500">更多剧本即将解锁</div>
              <div className="text-sm">设备报修管理 · 社区活动报名 · 客户服务工单</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
