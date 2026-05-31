import type { DataRecord, FormField, FlowNode } from '../types';

export const SEED_RECORDS: DataRecord[] = [
  {
    id: 'r1',
    applicant: '张伟',
    dateRange: '2024-01-15 至 2024-01-16',
    leaveType: '事假',
    reason: '家中有事需要处理',
    status: 'approved',
    submittedAt: '2024-01-14 10:30',
    days: 2,
  },
  {
    id: 'r2',
    applicant: '李娜',
    dateRange: '2024-01-18 至 2024-01-19',
    leaveType: '病假',
    reason: '发烧感冒，需要休息',
    status: 'approved',
    submittedAt: '2024-01-17 09:15',
    days: 2,
  },
  {
    id: 'r3',
    applicant: '王芳',
    dateRange: '2024-01-22 至 2024-01-24',
    leaveType: '年假',
    reason: '春节前安排家庭旅行',
    status: 'pending',
    submittedAt: '2024-01-20 14:22',
    days: 3,
  },
  {
    id: 'r4',
    applicant: '陈强',
    dateRange: '2024-01-25 至 2024-01-25',
    leaveType: '事假',
    reason: '孩子学校开家长会',
    status: 'approved',
    submittedAt: '2024-01-24 16:05',
    days: 1,
  },
  {
    id: 'r5',
    applicant: '刘敏',
    dateRange: '2024-01-29 至 2024-01-31',
    leaveType: '年假',
    reason: '春节假期延长休息',
    status: 'rejected',
    submittedAt: '2024-01-28 11:40',
    days: 3,
  },
];

export const SEED_MEMBERS = ['张伟（直属主管）', '李娜', '王芳', '陈强', '刘敏', '赵磊', '孙丽'];

export const LEAVE_TYPES = ['事假', '病假', '年假'];

export const DEFAULT_FORM_FIELDS: FormField[] = [];

export const DEFAULT_FLOW_NODES: FlowNode[] = [
  {
    id: 'node-initiator',
    type: 'initiator',
    label: '发起人',
    approvers: [],
  },
  {
    id: 'node-end',
    type: 'end',
    label: '结束',
  },
];
