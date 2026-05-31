export type FieldType =
  | 'text' | 'textarea' | 'number' | 'amount'
  | 'radio' | 'checkbox' | 'select' | 'multiselect'
  | 'date' | 'daterange' | 'time'
  | 'member' | 'department' | 'attachment' | 'image' | 'location' | 'rating'
  | 'data-link' | 'subtable'
  | 'serial' | 'formula'
  | 'description' | 'divider' | 'section-title';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  hint?: string;
}

export type NodeType = 'initiator' | 'approval' | 'cc' | 'condition' | 'auto' | 'end';

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  approvers?: string[];
  conditionField?: string;
  conditionValue?: string;
  children?: FlowNode[];
}

export interface DataRecord {
  id: string;
  applicant: string;
  dateRange: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  days: number;
}

export interface Report {
  id: string;
  title: string;
  chartType: 'pie' | 'bar' | 'line' | 'table';
  dimension: string;
  metric: string;
}

export interface DashboardItem {
  id: string;
  reportId: string;
  position: number;
}

export type StepType = 'info-card' | 'spotlight' | 'tooltip' | 'gated' | 'sandbox' | 'branch' | 'reveal';
export type LearningMode = 'guided' | 'demo' | 'free';

export interface StepBranch {
  id: string;
  label: string;
  description?: string;
}

export interface TutorialStep {
  id: string;
  type: StepType;
  title?: string;
  narration: string;
  target?: string;
  next?: string;
  completeWhen?: {
    event: 'click' | 'drop' | 'input' | 'state';
    stateCheck?: (state: AppState) => boolean;
  };
  hint?: string;
  helpAction?: string;
  branches?: StepBranch[];
  isComplete?: boolean;
  navigateTo?: string;
}

export interface TutorialChapter {
  id: string;
  title: string;
  subtitle: string;
  steps: TutorialStep[];
}

export interface TutorialScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: TutorialChapter[];
}

export interface AppState {
  // Navigation
  currentView: 'learning-map' | 'workbench' | 'workspace';
  currentTab: 'form' | 'flow' | 'data' | 'reports' | 'dashboard' | 'usage';
  appName: string;

  // Form designer
  formFields: FormField[];
  selectedFieldId: string | null;

  // Flow designer
  flowNodes: FlowNode[];
  selectedNodeId: string | null;

  // Data records
  records: DataRecord[];

  // Reports & Dashboard
  reports: Report[];
  activeReport: Report | null;
  dashboard: DashboardItem[];

  // Usage end
  isPublished: boolean;
  usageRole: 'employee' | 'manager';
  formValues: Record<string, string>;
  submissions: DataRecord[];

  // Tutorial engine state
  tutorialActive: boolean;
  tutorialMode: LearningMode;
  currentScenarioId: string | null;
  currentChapterIndex: number;
  currentStepIndex: number;
  completedChapters: string[];
  completedScenarios: string[];
  shakeTarget: string | null;
  stepSuccess: boolean;
  branchChoice: string | null;
  chapterPanelOpen: boolean;
}

export type AppAction =
  | { type: 'SET_VIEW'; view: AppState['currentView'] }
  | { type: 'SET_TAB'; tab: AppState['currentTab'] }
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'UPDATE_FIELD'; id: string; updates: Partial<FormField> }
  | { type: 'REORDER_FIELDS'; fromIndex: number; toIndex: number }
  | { type: 'SELECT_FIELD'; id: string | null }
  | { type: 'ADD_FLOW_NODE'; node: FlowNode; afterId: string }
  | { type: 'UPDATE_FLOW_NODE'; id: string; updates: Partial<FlowNode> }
  | { type: 'SELECT_NODE'; id: string | null }
  | { type: 'ADD_RECORD'; record: DataRecord }
  | { type: 'UPDATE_RECORD'; id: string; updates: Partial<DataRecord> }
  | { type: 'SET_PUBLISHED'; value: boolean }
  | { type: 'SET_USAGE_ROLE'; role: AppState['usageRole'] }
  | { type: 'SET_FORM_VALUE'; key: string; value: string }
  | { type: 'SUBMIT_FORM' }
  | { type: 'APPROVE_SUBMISSION'; id: string }
  | { type: 'ADD_REPORT'; report: Report }
  | { type: 'SET_ACTIVE_REPORT'; report: Report | null }
  | { type: 'ADD_TO_DASHBOARD'; item: DashboardItem }
  | { type: 'START_TUTORIAL'; scenarioId: string; mode: LearningMode }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'JUMP_TO_CHAPTER'; chapterIndex: number }
  | { type: 'CHOOSE_BRANCH'; branchId: string }
  | { type: 'SHAKE_TARGET'; target: string | null }
  | { type: 'SET_STEP_SUCCESS'; value: boolean }
  | { type: 'COMPLETE_CHAPTER' }
  | { type: 'COMPLETE_SCENARIO' }
  | { type: 'EXIT_TUTORIAL' }
  | { type: 'TOGGLE_CHAPTER_PANEL' }
  | { type: 'SET_APP_NAME'; name: string };
