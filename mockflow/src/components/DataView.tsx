import React, { useState } from 'react';
import { useStore } from '../store';
import type { DataRecord } from '../types';

const STATUS_MAP = {
  pending: { label: '审批中', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
};

function RecordDetail({ record, onClose }: { record: DataRecord; onClose: () => void }) {
  const status = STATUS_MAP[record.status];
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-bounce-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">申请详情</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
        </div>
        <div className="space-y-3">
          {[
            { label: '申请人', value: record.applicant },
            { label: '请假起止', value: record.dateRange },
            { label: '请假类型', value: record.leaveType },
            { label: '天数', value: `${record.days} 天` },
            { label: '请假事由', value: record.reason },
            { label: '提交时间', value: record.submittedAt },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-sm text-gray-400 w-20 flex-shrink-0">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

export function DataView() {
  const { records } = useStore();
  const [filter, setFilter] = useState<'all' | DataRecord['status']>('all');
  const [search, setSearch] = useState('');
  const [detailRecord, setDetailRecord] = useState<DataRecord | null>(null);

  const filtered = records.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.applicant.includes(search) && !r.leaveType.includes(search)) return false;
    return true;
  });

  const counts = {
    all: records.length,
    pending: records.filter((r) => r.status === 'pending').length,
    approved: records.filter((r) => r.status === 'approved').length,
    rejected: records.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0 px-5 py-3 bg-white border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {([['all', '全部'], ['pending', '审批中'], ['approved', '已通过'], ['rejected', '已拒绝']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
              <span className={`ml-1 ${filter === key ? 'text-blue-200' : 'text-gray-400'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
        <input
          className="ml-auto px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 w-36"
          placeholder="搜索姓名或类型…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
            <tr>
              {['申请人', '请假起止', '类型', '天数', '事由', '状态', '提交时间'].map((col) => (
                <th key={col} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((record) => {
              const status = STATUS_MAP[record.status];
              return (
                <tr
                  key={record.id}
                  className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                  onClick={() => setDetailRecord(record)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
                        {record.applicant.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{record.applicant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{record.dateRange}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{record.leaveType}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{record.days}天</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{record.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{record.submittedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">暂无记录</p>
          </div>
        )}
      </div>

      {detailRecord && <RecordDetail record={detailRecord} onClose={() => setDetailRecord(null)} />}
    </div>
  );
}
