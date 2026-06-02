import React, { useEffect, useRef, useCallback, useState } from 'react';
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

function ExitConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full mx-4 p-6 animate-bounce-in text-center">
        <div className="text-3xl mb-3">🚪</div>
        <h3 className="font-bold text-gray-900 mb-2">确定退出引导？</h3>
        <p className="text-sm text-gray-500 mb-5">退出后进度不会丢失，随时可从「章节目录」继续。</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
            继续引导
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">
            退出
          </button>
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
  onExit,
}: {
  step: TutorialStep;
  targetEl: Element | null;
  onNext: () => void;
  onHelp: () => void;
  onHint: () => void;
  onExit: () => void;
}) {
  const [hideOverlay, setHideOverlay] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Recompute rect on target change and on resize/scroll
  const updateRect = useCallback(() => {
    if (targetEl) {
      setRect(targetEl.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [targetEl]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  // Scroll target into view if outside viewport
  useEffect(() => {
    if (!targetEl) return;
    const r = targetEl.getBoundingClientRect();
    const inView = r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth;
    if (!inView) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetEl]);

  // Compute tooltip position
  const padding = 8;
  const tooltipWidth = 320;
  let tooltipTop = (rect?.bottom ?? window.innerHeight / 2) + 12;
  let tooltipLeft = (rect?.left ?? window.innerWidth / 2) + (rect?.width ?? 0) / 2 - tooltipWidth / 2;
  let arrowBelow = false;

  // Flip above if not enough room below
  if (tooltipTop + 220 > window.innerHeight && rect) {
    tooltipTop = rect.top - 220 - 12;
    arrowBelow = true;
  }

  tooltipTop = Math.max(padding, Math.min(tooltipTop, window.innerHeight - 220));
  tooltipLeft = Math.max(padding, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - padding));

  return (
    <>
      {/* Spotlight-only overlay — single element, no double-darkening */}
      {rect && !hideOverlay && (
        <div
          className="fixed pointer-events-none"
          style={{
            zIndex: 9998,
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: 10,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
            outline: '2px solid #4F8AFF',
            outlineOffset: 2,
            transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
          }}
        />
      )}
      {!rect && !hideOverlay && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998, background: 'rgba(0,0,0,0.35)' }} />
      )}

      {/* Tooltip bubble */}
      <div
        className="fixed animate-slide-up"
        style={{ zIndex: 9999, top: tooltipTop, left: tooltipLeft, width: tooltipWidth }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-4 border border-blue-100 relative">
          {/* Arrow */}
          {!arrowBelow && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45" />
          )}
          {arrowBelow && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-blue-100 rotate-45" />
          )}

          {/* Close button */}
          <button
            onClick={onExit}
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 text-xs rounded"
            title="退出引导"
          >
            ✕
          </button>

          <p className="text-sm text-gray-700 leading-relaxed mb-3 pr-4">
            {parseNarration(step.narration)}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {(step.type === 'spotlight' || step.type === 'tooltip') ? (
              <>
                <button
                  onClick={onNext}
                  className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {step.next ?? '好的 →'}
                </button>
                <button
                  onClick={() => setHideOverlay((h) => !h)}
                  className="px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title={hideOverlay ? '恢复遮罩' : '隐藏遮罩'}
                >
                  {hideOverlay ? '🔳' : '🔲'}
                </button>
              </>
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
                <button
                  onClick={() => setHideOverlay((h) => !h)}
                  className="px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title={hideOverlay ? '恢复遮罩' : '隐藏遮罩'}
                >
                  {hideOverlay ? '🔳 恢复' : '🔲 隐藏'}
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
    <div className="fixed bottom-0 left-0 right-0 z-[9997] bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-3 shadow-lg">
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const scenario = leaveApprovalScenario;
  const chapter = scenario?.chapters[currentChapterIndex];
  const step = chapter?.steps[currentStepIndex];

  // ESC key → exit confirmation
  useEffect(() => {
    if (!tutorialActive) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowExitConfirm(true);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tutorialActive]);

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
  const handleExitRequest = useCallback(() => setShowExitConfirm(true), []);
  const handleExitConfirm = useCallback(() => {
    dispatch({ type: 'EXIT_TUTORIAL' });
    setShowExitConfirm(false);
  }, [dispatch]);
  const handleExitCancel = useCallback(() => setShowExitConfirm(false), []);

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
          onExit={handleExitRequest}
        />
      )}

      {chapterPanelOpen && (
        <ChapterPanel
          currentChapterIndex={currentChapterIndex}
          onJump={(i) => dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex: i })}
          onClose={() => dispatch({ type: 'TOGGLE_CHAPTER_PANEL' })}
        />
      )}

      {showExitConfirm && (
        <ExitConfirmDialog onConfirm={handleExitConfirm} onCancel={handleExitCancel} />
      )}

      <ProgressBar
        chapterIndex={currentChapterIndex}
        stepIndex={currentStepIndex}
        totalChapters={scenario.chapters.length}
        totalSteps={totalSteps}
        onTogglePanel={() => dispatch({ type: 'TOGGLE_CHAPTER_PANEL' })}
        onExit={handleExitRequest}
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
