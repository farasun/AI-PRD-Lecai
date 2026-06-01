import React, { useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useDraggable,
  DragEndEvent,
} from '@dnd-kit/core';
import { useStore } from '../store';
import { useTutorialTarget } from '../engine/TutorialEngine';
import type { Report } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function getChartData(records: any[], dimension: string) {
  const counts: Record<string, number> = {};
  records.forEach((r) => {
    const key = dimension === 'leaveType' ? r.leaveType
      : dimension === 'applicant' ? r.applicant
      : dimension === 'status' ? ({ pending: '审批中', approved: '已通过', rejected: '已拒绝' } as any)[r.status] ?? r.status
      : r.leaveType;
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function ChartPreview({ report, records }: { report: Report; records: any[] }) {
  const data = getChartData(records, report.dimension);

  if (report.chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (report.chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (report.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  // Table
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 text-xs text-gray-500">请假类型</th>
            <th className="text-right py-2 text-xs text-gray-500">数量</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name} className="border-b border-gray-50">
              <td className="py-2 text-gray-700">{row.name}</td>
              <td className="py-2 text-right font-medium text-gray-800">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DraggableReportCard({ report, records }: { report: Report; records: any[] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `report-${report.id}`,
    data: { reportId: report.id },
  });
  const { isTarget } = useTutorialTarget('report-card-draggable');

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-tutorial="report-card-draggable"
      className={`bg-white rounded-xl border-2 p-4 cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'opacity-40 shadow-2xl' : 'hover:shadow-md'}
        ${isTarget ? 'border-blue-400 spotlight-pulse' : 'border-gray-100'}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-800 text-sm">{report.title}</div>
        <span className="text-xs text-gray-400">⠿ 拖拽</span>
      </div>
      <ChartPreview report={report} records={records} />
    </div>
  );
}

function DroppableDashboard({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'dashboard-area' });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-48 rounded-xl border-2 border-dashed transition-all p-4
        ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}
      `}
    >
      {isEmpty ? (
        <div className={`flex flex-col items-center justify-center h-40 text-center transition-all ${isOver ? 'opacity-70' : ''}`}>
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-gray-400">把报表拖到这里</p>
          <p className="text-xs text-gray-300 mt-1">组成你的仪表盘</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">{children}</div>
      )}
    </div>
  );
}

export function Reports() {
  const { records, reports, dashboard, dispatch } = useStore();
  const [chartType, setChartType] = useState<Report['chartType']>('pie');
  const [dimension, setDimension] = useState('leaveType');
  const { isTarget: isGenerateTarget, isShaking: isGenerateShaking } = useTutorialTarget('report-generate-btn');

  const dimensions = [
    { value: 'leaveType', label: '请假类型' },
    { value: 'applicant', label: '申请人' },
    { value: 'status', label: '审批状态' },
  ];

  const chartTypes: { type: Report['chartType']; icon: string; label: string }[] = [
    { type: 'pie', icon: '🥧', label: '饼图' },
    { type: 'bar', icon: '📊', label: '柱状图' },
    { type: 'line', icon: '📈', label: '折线图' },
    { type: 'table', icon: '📋', label: '汇总表' },
  ];

  function handleGenerate() {
    dispatch({
      type: 'ADD_REPORT',
      report: {
        id: `report-${Math.random().toString(36).slice(2, 7)}`,
        title: `${dimensions.find((d) => d.value === dimension)?.label ?? dimension} · ${chartTypes.find((c) => c.type === chartType)?.label}`,
        chartType,
        dimension,
        metric: 'count',
      },
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over?.id === 'dashboard-area') {
      const reportId = (active.data.current as any)?.reportId;
      if (reportId && !dashboard.some((d) => d.reportId === reportId)) {
        dispatch({
          type: 'ADD_TO_DASHBOARD',
          item: { id: Math.random().toString(36).slice(2, 7), reportId, position: dashboard.length },
        });
      }
    }
  }

  const dashboardReports = dashboard.map((d) => reports.find((r) => r.id === d.reportId)).filter(Boolean) as Report[];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-full overflow-hidden">
        {/* Left: Report Builder */}
        <div className="flex-1 p-5 overflow-y-auto scrollbar-thin space-y-5">
          {/* Config */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="font-semibold text-gray-800 text-sm mb-4">📊 新建报表</div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 mb-2">图表类型</div>
              <div className="grid grid-cols-4 gap-2">
                {chartTypes.map((ct) => (
                  <button
                    key={ct.type}
                    data-tutorial={ct.type === 'pie' ? 'report-chart-type' : undefined}
                    onClick={() => setChartType(ct.type)}
                    className={`p-2.5 rounded-xl text-center transition-all border-2 ${
                      chartType === ct.type
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{ct.icon}</div>
                    <div className="text-xs font-medium">{ct.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 mb-2">统计维度</div>
              <div className="flex flex-wrap gap-2">
                {dimensions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDimension(d.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      dimension === d.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              data-tutorial="report-generate-btn"
              onClick={handleGenerate}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all
                ${isGenerateTarget ? 'spotlight-pulse' : ''}
                ${isGenerateShaking ? 'animate-shake' : ''}
                bg-blue-600 text-white hover:bg-blue-700
              `}
            >
              生成报表 →
            </button>
          </div>

          {/* Preview */}
          {reports.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">已建报表（可拖入仪表盘）</div>
              {reports.map((report) => (
                <DraggableReportCard key={report.id} report={report} records={records} />
              ))}
            </div>
          )}

          {reports.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm text-gray-400">选择图表类型和统计维度，点击「生成报表」</p>
            </div>
          )}
        </div>

        {/* Right: Dashboard drop zone */}
        <div className="w-80 border-l border-gray-100 p-4 overflow-y-auto scrollbar-thin bg-gray-50">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">仪表盘</div>
          <DroppableDashboard isEmpty={dashboardReports.length === 0}>
            {dashboardReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="font-medium text-gray-700 text-xs mb-2">{report.title}</div>
                <ChartPreview report={report} records={records} />
              </div>
            ))}
          </DroppableDashboard>
        </div>
      </div>
    </DndContext>
  );
}
