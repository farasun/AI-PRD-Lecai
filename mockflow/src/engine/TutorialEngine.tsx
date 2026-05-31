import React, { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';
import { leaveApprovalScenario } from '../data/scenario-leave';
import type { TutorialStep } from '../types';

function parseNarration(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

function InfoCard({ step, onNext }: { step: TutorialStep; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-bounce-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🧩</div>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">MockFlow 引导</span>
        </div>
        {step.title && (
          <h2 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h2>
        )}
        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
          {parseNarration(step.narration)}
        </p>
        <button
          onClick={onNext}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {step.next ?? '下一步 →'}
        </button>
      </div>
    </div>
  );
}

function RevealCard({ step, onNext }: { step: TutorialStep; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-bounce-in text-center">
        <div className="text-5xl mb-4">{step.isComplete ? '🏆' : '✨'}</div>
        {step.title && (
          <h2 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h2>
        )}
        <p className="text-gray-600 leading-relaxed text-sm text-left whitespace-pre-line">
          {parseNarration(step.narration)}
        </p>
        <button
          onClick={onNext}
          className={`mt-6 w-full py-3 rounded-xl font-medium transition-colors ${
            step.isComplete
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {step.next ?? '继续 →'}
        </button>
      </div>
    </div>
  );
}

function BranchCard({ step, onChoose }: { step: TutorialStep; onChoose: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-bounce-in">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl mb-4">🔀</div>
        {step.title && <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{parseNarration(step.narration)}</p>
        <div className="space-y-3">
          {step.branches?.map((branch) => (
            <button
              key={branch.id}
              onClick={() => onChoose(branch.id)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="font-medium text-gray-800">{branch.label}</div>
              {branch.description && (
                <div className="text-xs text-gray-500 mt-1">{branch.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TooltipBubble({
  step,
  targetEl,
  onNext,
  onHelp,
  onHint,
}: {
  step: TutorialStep;
  targetEl: Element | null;
  onNext: () => void;
  onHelp: () => void;
  onHint: () => void;
}) {
  const rect = targetEl?.getBoundingClientRect();
  const tooltipRef = useRef<HTMLDivElement>(null);

  let top = (rect?.bottom ?? 0) + 12;
  let left = (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
  const arrowUp = true;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 pointer-events-none" />
      {/* Spotlight ring */}
      {rect && (
        <div
          className="fixed z-41 pointer-events-none"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.4), 0 0 0 3px rgba(59,130,246,0.8)',
          }}
        />
      )}
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 animate-slide-up"
        style={{
          top: Math.min(top, window.innerHeight - 200),
          left: Math.max(12, Math.min(left - 160, window.innerWidth - 340)),
          width: 320,
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-4 border border-blue-100">
          {arrowUp && (
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45"
              style={{ top: -8 }}
            />
          )}
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {parseNarration(step.narration)}
          </p>
          <div className="flex gap-2">
            {step.type === 'spotlight' || step.type === 'tooltip' ? (
              <button
                onClick={onNext}
                className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {step.next ?? '好的 →'}
              </button>
            ) : (
              <>
                <button
                  onClick={onHint}
                  className="px-3 py-2 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  💡 提示
                </button>
                <button
                  onClick={onHelp}
                  className="px-3 py-2 text-xs text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  🤖 帮我做
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ProgressBar({
  chapterIndex,
  stepIndex,
  totalChapters,
  totalSteps,
  onTogglePanel,
  onExit,
}: {
  chapterIndex: number;
  stepIndex: number;
  totalChapters: number;
  totalSteps: number;
  onTogglePanel: () => void;
  onExit: () => void;
}) {
  const scenario = leaveApprovalScenario;
  const chapter = scenario.chapters[chapterIndex];
  const progress = ((chapterIndex * 100 + (stepIndex / Math.max(totalSteps - 1, 1)) * 100) / totalChapters).toFixed(0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-3 shadow-lg">
      <button
        onClick={onTogglePanel}
        className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
      >
        📋 {chapter?.title}
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">步骤 {stepIndex + 1}/{totalSteps}</span>
      </button>
      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{progress}%</span>
      <button
        onClick={onExit}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        退出
      </button>
    </div>
  );
}

function ChapterPanel({
  currentChapterIndex,
  onJump,
  onClose,
}: {
  currentChapterIndex: number;
  onJump: (i: number) => void;
  onClose: () => void;
}) {
  const scenario = leaveApprovalScenario;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">章节目录</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-2">
          {scenario.chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => onJump(i)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                i === currentChapterIndex
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${i === currentChapterIndex ? 'text-blue-700' : 'text-gray-700'}`}>
                  第 {i + 1} 章 · {ch.title}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{ch.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TutorialEngine() {
  const {
    tutorialActive,
    currentScenarioId,
    currentChapterIndex,
    currentStepIndex,
    shakeTarget,
    chapterPanelOpen,
    dispatch,
    helpMeDo,
  } = useStore();

  const store = useStore();

  const scenario = leaveApprovalScenario;
  const chapter = scenario?.chapters[currentChapterIndex];
  const step = chapter?.steps[currentStepIndex];

  // Watch state changes for gated step completion
  useEffect(() => {
    if (!tutorialActive || !step || step.type !== 'gated') return;
    if (!step.completeWhen?.stateCheck) return;
    const check = step.completeWhen.stateCheck;
    if (check(store)) {
      dispatch({ type: 'SET_STEP_SUCCESS', value: true });
      const timer = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [
    store.formFields,
    store.flowNodes,
    store.isPublished,
    store.submissions,
    store.reports,
    store.dashboard,
    store.visibilityRules,
    tutorialActive,
    currentStepIndex,
    currentChapterIndex,
  ]);

  // Shake animation cleanup
  useEffect(() => {
    if (!shakeTarget) return;
    const timer = setTimeout(() => dispatch({ type: 'SHAKE_TARGET', target: null }), 600);
    return () => clearTimeout(timer);
  }, [shakeTarget]);

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [dispatch]);
  const handleHelp = useCallback(() => helpMeDo(), [helpMeDo]);
  const handleHint = useCallback(() => {
    if (step?.target) dispatch({ type: 'SHAKE_TARGET', target: step.target });
  }, [step, dispatch]);
  const handleChooseBranch = useCallback(
    (id: string) => dispatch({ type: 'CHOOSE_BRANCH', branchId: id }),
    [dispatch]
  );

  if (!tutorialActive || !step || !scenario) return null;

  const targetEl = step.target
    ? document.querySelector(`[data-tutorial="${step.target}"]`)
    : null;

  const totalSteps = chapter?.steps.length ?? 1;

  return (
    <>
      {step.type === 'info-card' && <InfoCard step={step} onNext={handleNext} />}
      {step.type === 'reveal' && <RevealCard step={step} onNext={handleNext} />}
      {step.type === 'branch' && <BranchCard step={step} onChoose={handleChooseBranch} />}
      {(step.type === 'spotlight' || step.type === 'tooltip' || step.type === 'gated') && (
        <TooltipBubble
          step={step}
          targetEl={targetEl}
          onNext={handleNext}
          onHelp={handleHelp}
          onHint={handleHint}
        />
      )}

      {chapterPanelOpen && (
        <ChapterPanel
          currentChapterIndex={currentChapterIndex}
          onJump={(i) => dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex: i })}
          onClose={() => dispatch({ type: 'TOGGLE_CHAPTER_PANEL' })}
        />
      )}

      <ProgressBar
        chapterIndex={currentChapterIndex}
        stepIndex={currentStepIndex}
        totalChapters={scenario.chapters.length}
        totalSteps={totalSteps}
        onTogglePanel={() => dispatch({ type: 'TOGGLE_CHAPTER_PANEL' })}
        onExit={() => dispatch({ type: 'EXIT_TUTORIAL' })}
      />
    </>
  );
}

// Hook for components to know if an element is the tutorial target
export function useTutorialTarget(targetId: string) {
  const { tutorialActive, currentScenarioId, currentChapterIndex, currentStepIndex, shakeTarget } =
    useStore();
  const scenario = leaveApprovalScenario;
  const step = scenario?.chapters[currentChapterIndex]?.steps[currentStepIndex];
  const isTarget = tutorialActive && step?.target === targetId;
  const isShaking = shakeTarget === targetId;
  return { isTarget, isShaking };
}
