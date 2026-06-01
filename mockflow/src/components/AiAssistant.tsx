import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import {
  getContextScript,
  findMatch,
  PRESET_FIELDS,
  PRESET_FLOWS,
  PRESET_CHARTS,
} from '../data/ai-scripts';
import type { AiMessage } from '../types';
import type { FlowNode } from '../types';

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function streamText(text: string, onChunk: (partial: string) => void): Promise<void> {
  let partial = '';
  for (const ch of text) {
    partial += ch;
    onChunk(partial);
    await sleep(18 + Math.random() * 22);
  }
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-2xl rounded-tl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: AiMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
          M
        </div>
      )}
      <div
        className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        } ${msg.isStreaming ? 'animate-pulse' : ''}`}
      >
        {msg.text}
        {msg.isStreaming && <span className="inline-block w-0.5 h-4 bg-gray-500 ml-0.5 animate-pulse align-text-bottom" />}
      </div>
    </div>
  );
}

function InsightCards() {
  return (
    <div className="space-y-2 mb-3">
      <div className="text-xs font-medium text-gray-500 mb-1.5">✨ 数据洞察（自动分析）</div>
      {[
        { icon: '📈', type: '趋势', text: '本月请假总数较上月 ↑23%，集中在月底。' },
        { icon: '⚠️', type: '异常', text: '技术部病假占比 41%，高于正常水平。' },
        { icon: '💡', type: '建议', text: '月底前增加排班缓冲，提前做好交接。' },
      ].map((c, i) => (
        <div key={i} className={`rounded-xl p-2.5 text-xs flex gap-2 items-start ${
          c.type === '异常' ? 'bg-orange-50 text-orange-800' :
          c.type === '建议' ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'
        }`}>
          <span className="text-base flex-shrink-0">{c.icon}</span>
          <span>{c.text}</span>
        </div>
      ))}
    </div>
  );
}

const CONTEXT_LABEL: Record<string, string> = {
  form: '表单/流程设计器',
  flow: '表单/流程设计器',
  data: '数据管理',
  reports: '报表 & 仪表盘',
  usage: '使用端',
};

export function AiAssistant() {
  const { currentTab, aiPanelOpen, formFields, flowNodes, dispatch } = useStore();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const contextScript = getContextScript(currentTab);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (aiPanelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Greet with context-aware welcome if no messages
      if (messages.length === 0) {
        const welcomeText = currentTab === 'reports'
          ? '你好！我是小M 🤖\n\n我已对当前报表数据做了初步分析，发现一些有趣的洞察。点击上方快捷指令，或直接问我问题！'
          : currentTab === 'usage'
          ? '你好！我是小M 🤖\n\n填表太麻烦？试试「AI 智能填单」——上传文档或说一句话，我帮你自动填好表单。'
          : '你好！我是小M 🤖\n\n我可以帮你用一句话搭建整个应用——表单 + 流程一次生成。点击快捷按钮试试！';
        const welcome: AiMessage = { id: makeId(), role: 'assistant', text: welcomeText, timestamp: Date.now() };
        setMessages([welcome]);
      }
    }
  }, [aiPanelOpen, currentTab]);

  const executeAction = useCallback(async (action: { type: string; preset: string; expression_preset?: string }) => {
    if (action.type === 'create_fields') {
      const fields = PRESET_FIELDS[action.preset];
      if (!fields) return;
      for (const f of fields) {
        const newField = { ...f, id: `ai-f-${makeId()}`, aiGenerated: true };
        dispatch({ type: 'ADD_FIELD', field: newField });
        await sleep(320);
      }
      dispatch({ type: 'SET_AI_FILL_HIGHLIGHTS', fieldIds: [] });
    } else if (action.type === 'create_workflow') {
      const nodes = PRESET_FLOWS[action.preset];
      if (!nodes) return;
      const initiatorId = flowNodes.find((n: FlowNode) => n.type === 'initiator')?.id ?? flowNodes[0]?.id ?? '';
      let afterId = initiatorId;
      for (const nodeTemplate of nodes) {
        const newNode: FlowNode = { ...nodeTemplate, id: `ai-n-${makeId()}` };
        dispatch({ type: 'ADD_FLOW_NODE', node: newNode, afterId });
        afterId = newNode.id;
        await sleep(350);
      }
      // Switch to flow tab to show result
      dispatch({ type: 'SET_TAB', tab: 'flow' });
      await sleep(600);
      dispatch({ type: 'SET_TAB', tab: 'form' });
    } else if (action.type === 'generate_chart') {
      const preset = PRESET_CHARTS[action.preset];
      if (!preset) return;
      await sleep(400);
      dispatch({
        type: 'ADD_REPORT',
        report: {
          id: `ai-r-${makeId()}`,
          title: preset.title,
          chartType: preset.chartType,
          dimension: preset.dimension,
          metric: 'count',
        },
      });
    }
  }, [dispatch, flowNodes]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setInputText('');

    const userMsg: AiMessage = { id: makeId(), role: 'user', text: text.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    setThinking(true);
    const match = findMatch(text, contextScript);
    await sleep(match.thinking_ms);
    setThinking(false);

    // Start streaming assistant reply
    const assistantId = makeId();
    const assistantMsg: AiMessage = { id: assistantId, role: 'assistant', text: '', isStreaming: true, timestamp: Date.now() };
    setMessages((prev) => [...prev, assistantMsg]);

    await streamText(match.stream_text, (partial) => {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, text: partial } : m));
    });

    setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m));

    // Execute AI canvas actions
    if (match.actions && match.actions.length > 0) {
      for (const action of match.actions) {
        await executeAction(action);
      }
      // Follow-up message after actions
      if (match.followup) {
        const followupId = makeId();
        const followupMsg: AiMessage = { id: followupId, role: 'assistant', text: '', isStreaming: true, timestamp: Date.now() };
        setMessages((prev) => [...prev, followupMsg]);
        await streamText(match.followup, (partial) => {
          setMessages((prev) => prev.map((m) => m.id === followupId ? { ...m, text: partial } : m));
        });
        setMessages((prev) => prev.map((m) => m.id === followupId ? { ...m, isStreaming: false } : m));
      }
    }

    setBusy(false);
  }, [busy, contextScript, executeAction]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  if (!aiPanelOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-[29] md:hidden bg-black/20"
        onClick={() => dispatch({ type: 'SET_AI_PANEL', open: false })}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">M</div>
            <div>
              <div className="text-white font-semibold text-sm">小M 助手</div>
              <div className="text-blue-200 text-xs">
                {CONTEXT_LABEL[currentTab] ?? '应用工作区'} · AI 赋能
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_AI_PANEL', open: false })}
            className="text-white/70 hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Context-aware insight cards for reports tab */}
        {currentTab === 'reports' && (
          <div className="px-3 pt-3 flex-shrink-0">
            <InsightCards />
          </div>
        )}

        {/* Prompt suggestions */}
        <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="text-xs text-gray-400 mb-1.5">快捷指令</div>
          <div className="flex flex-wrap gap-1.5">
            {contextScript.prompt_suggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={busy}
                className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {thinking && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">M</div>
              <ThinkingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3 flex-shrink-0">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={busy}
              placeholder={busy ? '小M 正在处理…' : '告诉小M 你想做什么…'}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={busy || !inputText.trim()}
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              ↑
            </button>
          </div>
          <div className="text-center text-xs text-gray-300 mt-1.5">
            小M 的回复均为仿真演示
          </div>
        </div>
      </div>

      {/* Bounce keyframes injected inline */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
