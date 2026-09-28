import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, AlertTriangle } from 'lucide-react';
import { askAboutStep } from '../utils/api';

const SUGGESTIONS = [
  'What documents do I actually need?',
  'How long does this realistically take?',
  'What if I am a partnership firm?',
];

/**
 * Grounded AI chat about a single clearance step. Answers are clearly labelled
 * AI-generated and always advise verifying on the official portal.
 */
export default function StepAssistant({ node, pipeline }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Reset the conversation when the inspected node changes.
    setMessages([]);
    setInput('');
  }, [node?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    const { answer, offline } = await askAboutStep({
      question,
      pipeline: { task: pipeline?.title || pipeline?.task, jurisdiction: pipeline?.jurisdiction },
      node,
      history,
    });
    setMessages((prev) => [...prev, { role: 'assistant', content: answer, offline }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI disclaimer */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 text-[11px] text-brand-800 dark:text-brand-300 mb-3">
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>AI-generated guidance for <strong>{node?.title}</strong>. Always confirm the exact current rules on the official portal.</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-[180px]">
        {messages.length === 0 && !loading && (
          <div className="space-y-2">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Try asking:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-brand-400 dark:hover:border-brand-600 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : m.offline
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 rounded-bl-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
              }`}
            >
              {m.role === 'assistant' && m.offline && <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />}
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this clearance…"
          className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
