import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AppAction, FormField, FlowNode } from '../types';
import { SEED_RECORDS, DEFAULT_FLOW_NODES, LEAVE_TYPES } from '../data/seed';
import { leaveApprovalScenario } from '../data/scenario-leave';

const initialState: AppState = {
  currentView: 'learning-map',
  currentTab: 'form',
  appName: '请假管理系统',

  formFields: [],
  selectedFieldId: null,

  flowNodes: [...DEFAULT_FLOW_NODES],
  selectedNodeId: null,

  records: [...SEED_RECORDS],

  reports: [],
  activeReport: null,
  dashboard: [],

  isPublished: false,
  usageRole: 'employee',
  formValues: {},
  submissions: [],

  tutorialActive: false,
  tutorialMode: 'guided',
  currentScenarioId: null,
  currentChapterIndex: 0,
  currentStepIndex: 0,
  completedChapters: [],
  completedScenarios: [],
  shakeTarget: null,
  stepSuccess: false,
  branchChoice: null,
  chapterPanelOpen: false,
};

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeDefaultField(type: FormField['type']): FormField {
  const labels: Partial<Record<FormField['type'], string>> = {
    member: '申请人',
    daterange: '请假起止',
    select: '请假类型',
    textarea: '请假事由',
    text: '单行文本',
    number: '数字',
    date: '日期',
    radio: '单选',
    checkbox: '多选',
    multiselect: '下拉多选',
    amount: '金额',
  };
  const field: FormField = {
    id: `field-${makeId()}`,
    type,
    label: labels[type] ?? type,
    required: type === 'member',
  };
  if (type === 'select' || type === 'radio' || type === 'multiselect') {
    field.options = LEAVE_TYPES.map((t) => ({ value: t, label: t }));
  }
  return field;
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.view };
    case 'SET_TAB':
      return { ...state, currentTab: action.tab };
    case 'SET_APP_NAME':
      return { ...state, appName: action.name };

    case 'ADD_FIELD':
      return { ...state, formFields: [...state.formFields, action.field] };
    case 'REMOVE_FIELD':
      return {
        ...state,
        formFields: state.formFields.filter((f) => f.id !== action.id),
        selectedFieldId: state.selectedFieldId === action.id ? null : state.selectedFieldId,
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        formFields: state.formFields.map((f) =>
          f.id === action.id ? { ...f, ...action.updates } : f
        ),
      };
    case 'REORDER_FIELDS': {
      const fields = [...state.formFields];
      const [moved] = fields.splice(action.fromIndex, 1);
      fields.splice(action.toIndex, 0, moved);
      return { ...state, formFields: fields };
    }
    case 'SELECT_FIELD':
      return { ...state, selectedFieldId: action.id };

    case 'ADD_FLOW_NODE': {
      const nodes = [...state.flowNodes];
      const idx = nodes.findIndex((n) => n.id === action.afterId);
      nodes.splice(idx + 1, 0, action.node);
      return { ...state, flowNodes: nodes };
    }
    case 'UPDATE_FLOW_NODE':
      return {
        ...state,
        flowNodes: state.flowNodes.map((n) =>
          n.id === action.id ? { ...n, ...action.updates } : n
        ),
      };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.id };

    case 'ADD_RECORD':
      return { ...state, records: [...state.records, action.record] };
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map((r) =>
          r.id === action.id ? { ...r, ...action.updates } : r
        ),
        submissions: state.submissions.map((r) =>
          r.id === action.id ? { ...r, ...action.updates } : r
        ),
      };

    case 'SET_PUBLISHED':
      return { ...state, isPublished: action.value };
    case 'SET_USAGE_ROLE':
      return { ...state, usageRole: action.role };
    case 'SET_FORM_VALUE':
      return { ...state, formValues: { ...state.formValues, [action.key]: action.value } };
    case 'SUBMIT_FORM': {
      const now = new Date();
      const record = {
        id: `sub-${makeId()}`,
        applicant: state.formValues.member || '我',
        dateRange: state.formValues.daterange || '2024-02-01 至 2024-02-02',
        leaveType: state.formValues.select || '事假',
        reason: state.formValues.textarea || '个人事务',
        status: 'pending' as const,
        submittedAt: now.toLocaleString('zh-CN'),
        days: 1,
      };
      return {
        ...state,
        submissions: [...state.submissions, record],
        records: [...state.records, record],
        formValues: {},
      };
    }
    case 'APPROVE_SUBMISSION':
      return {
        ...state,
        submissions: state.submissions.map((r) =>
          r.id === action.id ? { ...r, status: 'approved' } : r
        ),
        records: state.records.map((r) =>
          r.id === action.id ? { ...r, status: 'approved' } : r
        ),
      };

    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.report] };
    case 'SET_ACTIVE_REPORT':
      return { ...state, activeReport: action.report };
    case 'ADD_TO_DASHBOARD':
      return { ...state, dashboard: [...state.dashboard, action.item] };

    // Tutorial engine
    case 'START_TUTORIAL': {
      const scenario = leaveApprovalScenario;
      if (!scenario) return state;
      const firstStep = scenario.chapters[0]?.steps[0];
      const firstTab = (firstStep?.navigateTo as AppState['currentTab']) || 'form';
      return {
        ...initialState,
        records: [...SEED_RECORDS],
        tutorialActive: true,
        tutorialMode: action.mode,
        currentScenarioId: action.scenarioId,
        currentChapterIndex: 0,
        currentStepIndex: 0,
        completedChapters: state.completedChapters,
        completedScenarios: state.completedScenarios,
        currentView: 'workspace',
        currentTab: firstTab,
      };
    }
    case 'NEXT_STEP': {
      const scenario = leaveApprovalScenario;
      const chapter = scenario?.chapters[state.currentChapterIndex];
      if (!chapter) return state;

      const nextStepIndex = state.currentStepIndex + 1;
      if (nextStepIndex < chapter.steps.length) {
        const nextStep = chapter.steps[nextStepIndex];
        const nextTab = nextStep?.navigateTo
          ? (nextStep.navigateTo as AppState['currentTab'])
          : state.currentTab;
        return {
          ...state,
          currentStepIndex: nextStepIndex,
          stepSuccess: false,
          shakeTarget: null,
          branchChoice: null,
          currentTab: nextTab,
        };
      }
      // Chapter complete
      const nextChapterIndex = state.currentChapterIndex + 1;
      const completedChapters = [...state.completedChapters, chapter.id];
      if (nextChapterIndex < (scenario?.chapters.length ?? 0)) {
        const nextChapter = scenario.chapters[nextChapterIndex];
        const firstStep = nextChapter.steps[0];
        const nextTab = firstStep?.navigateTo
          ? (firstStep.navigateTo as AppState['currentTab'])
          : state.currentTab;
        return {
          ...state,
          currentChapterIndex: nextChapterIndex,
          currentStepIndex: 0,
          completedChapters,
          stepSuccess: false,
          shakeTarget: null,
          branchChoice: null,
          currentTab: nextTab,
        };
      }
      // Scenario complete
      return {
        ...state,
        completedChapters,
        completedScenarios: [...state.completedScenarios, state.currentScenarioId ?? ''],
        tutorialActive: false,
        tutorialMode: 'free',
        stepSuccess: false,
        shakeTarget: null,
      };
    }
    case 'PREV_STEP': {
      if (state.currentStepIndex > 0) {
        return { ...state, currentStepIndex: state.currentStepIndex - 1, stepSuccess: false };
      }
      if (state.currentChapterIndex > 0) {
        const scenario = leaveApprovalScenario;
        const prevChapter = scenario?.chapters[state.currentChapterIndex - 1];
        return {
          ...state,
          currentChapterIndex: state.currentChapterIndex - 1,
          currentStepIndex: (prevChapter?.steps.length ?? 1) - 1,
          stepSuccess: false,
        };
      }
      return state;
    }
    case 'JUMP_TO_CHAPTER': {
      const scenario = leaveApprovalScenario;
      const chapter = scenario?.chapters[action.chapterIndex];
      if (!chapter) return state;
      const firstStep = chapter.steps[0];
      return {
        ...state,
        currentChapterIndex: action.chapterIndex,
        currentStepIndex: 0,
        stepSuccess: false,
        shakeTarget: null,
        chapterPanelOpen: false,
        currentTab: (firstStep?.navigateTo as AppState['currentTab']) || state.currentTab,
      };
    }
    case 'CHOOSE_BRANCH': {
      const scenario = leaveApprovalScenario;
      const chapter = scenario?.chapters[state.currentChapterIndex];
      if (!chapter) return state;
      const currentStep = chapter.steps[state.currentStepIndex];
      if (currentStep?.type !== 'branch') return state;

      // If user chose "yes" for condition branch, add condition branch nodes
      if (action.branchId === 'yes') {
        const conditionNode: FlowNode = {
          id: `node-condition-${makeId()}`,
          type: 'condition',
          label: '条件分支',
          conditionField: 'days',
          conditionValue: '3',
        };
        const directorNode: FlowNode = {
          id: `node-director-${makeId()}`,
          type: 'approval',
          label: '总监审批',
          approvers: ['总监'],
        };
        const approvalNode = state.flowNodes.find((n) => n.type === 'approval');
        const approvalIdx = state.flowNodes.findIndex((n) => n.type === 'approval');
        const newNodes = [...state.flowNodes];
        if (approvalIdx >= 0) {
          newNodes.splice(approvalIdx + 1, 0, conditionNode, directorNode);
        }
        const nextStepIndex = state.currentStepIndex + 1;
        const nextStep = chapter.steps[nextStepIndex];
        return {
          ...state,
          flowNodes: newNodes,
          branchChoice: action.branchId,
          currentStepIndex: nextStepIndex,
          currentTab: (nextStep?.navigateTo as AppState['currentTab']) || state.currentTab,
        };
      }

      // Skip branch
      const nextStepIndex = state.currentStepIndex + 1;
      const nextStep = chapter.steps[nextStepIndex];
      return {
        ...state,
        branchChoice: action.branchId,
        currentStepIndex: nextStepIndex,
        currentTab: (nextStep?.navigateTo as AppState['currentTab']) || state.currentTab,
      };
    }
    case 'SHAKE_TARGET':
      return { ...state, shakeTarget: action.target };
    case 'SET_STEP_SUCCESS':
      return { ...state, stepSuccess: action.value };
    case 'EXIT_TUTORIAL':
      return { ...state, tutorialActive: false, tutorialMode: 'free' };
    case 'TOGGLE_CHAPTER_PANEL':
      return { ...state, chapterPanelOpen: !state.chapterPanelOpen };
    default:
      return state;
  }
}

interface StoreState extends AppState {
  dispatch: (action: AppAction) => void;
  addFieldByType: (type: FormField['type']) => void;
  helpMeDo: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      dispatch: (action) => set((s) => reducer(s, action)),

      addFieldByType: (type) => {
        const field = makeDefaultField(type);
        set((s) => reducer(s, { type: 'ADD_FIELD', field }));
      },

      helpMeDo: () => {
        const s = get();
        const scenario = leaveApprovalScenario;
        const chapter = scenario?.chapters[s.currentChapterIndex];
        const step = chapter?.steps[s.currentStepIndex];
        if (!step?.helpAction) {
          set((s2) => reducer(s2, { type: 'NEXT_STEP' }));
          return;
        }
        switch (step.helpAction) {
          case 'add-member-field':
            set((s2) => reducer(s2, { type: 'ADD_FIELD', field: makeDefaultField('member') }));
            break;
          case 'add-daterange-field':
            set((s2) => reducer(s2, { type: 'ADD_FIELD', field: makeDefaultField('daterange') }));
            break;
          case 'add-select-field':
            set((s2) => reducer(s2, { type: 'ADD_FIELD', field: makeDefaultField('select') }));
            break;
          case 'add-textarea-field':
            set((s2) => reducer(s2, { type: 'ADD_FIELD', field: makeDefaultField('textarea') }));
            break;
          case 'add-approval-node': {
            const newNode: FlowNode = {
              id: `node-approval-${makeId()}`,
              type: 'approval',
              label: '审批节点',
              approvers: [],
            };
            const initiatorId = s.flowNodes.find((n) => n.type === 'initiator')?.id ?? '';
            set((s2) => reducer(s2, { type: 'ADD_FLOW_NODE', node: newNode, afterId: initiatorId }));
            break;
          }
          case 'set-approval-manager': {
            const approvalNode = s.flowNodes.find((n) => n.type === 'approval' && !n.approvers?.length);
            if (approvalNode) {
              set((s2) =>
                reducer(s2, {
                  type: 'UPDATE_FLOW_NODE',
                  id: approvalNode.id,
                  updates: { approvers: ['直属主管'] },
                })
              );
            }
            break;
          }
          case 'publish-app':
            set((s2) => reducer(s2, { type: 'SET_PUBLISHED', value: true }));
            break;
          case 'submit-form': {
            const values: Record<string, string> = {
              member: '我',
              daterange: '2024-02-01 至 2024-02-02',
              select: '年假',
              textarea: '春节期间休息',
            };
            set((s2) => ({
              ...s2,
              formValues: values,
              currentTab: 'usage',
            }));
            setTimeout(() => {
              set((s2) => reducer(s2, { type: 'SUBMIT_FORM' }));
            }, 300);
            break;
          }
          case 'approve-submission': {
            const lastSub = s.submissions[s.submissions.length - 1];
            if (lastSub) {
              set((s2) => reducer(s2, { type: 'SET_USAGE_ROLE', role: 'manager' }));
              setTimeout(() => {
                set((s2) => reducer(s2, { type: 'APPROVE_SUBMISSION', id: lastSub.id }));
              }, 300);
            }
            break;
          }
          case 'create-report':
            set((s2) =>
              reducer(s2, {
                type: 'ADD_REPORT',
                report: {
                  id: `report-${makeId()}`,
                  title: '请假类型分布',
                  chartType: 'pie',
                  dimension: 'leaveType',
                  metric: 'count',
                },
              })
            );
            break;
          case 'add-to-dashboard': {
            const report = get().reports[0];
            if (report) {
              set((s2) =>
                reducer(s2, {
                  type: 'ADD_TO_DASHBOARD',
                  item: { id: makeId(), reportId: report.id, position: 0 },
                })
              );
            }
            break;
          }
        }
        setTimeout(() => {
          set((s2) => reducer(s2, { type: 'NEXT_STEP' }));
        }, 600);
      },
    }),
    {
      name: 'mockflow-state',
      partialize: (s) => ({
        completedChapters: s.completedChapters,
        completedScenarios: s.completedScenarios,
      }),
    }
  )
);
