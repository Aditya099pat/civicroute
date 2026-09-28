import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ELIGIBILITY_QUESTIONS, evaluateEligibility } from '../data/eligibilityRules';

/**
 * Short questionnaire that tailors the active pipeline. Results are advisory
 * annotations only — the underlying pipeline is never mutated.
 */
export default function EligibilityWizard({ isOpen, pipeline, onClose, onApply }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (isOpen) setAnswers({});
  }, [isOpen, pipeline?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).length;
  const total = ELIGIBILITY_QUESTIONS.length;

  const apply = () => {
    const result = evaluateEligibility(pipeline, answers);
    onApply(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Personalize your pathway"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-card">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Personalize your pathway</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">A few quick questions tailor which clearances apply.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {ELIGIBILITY_QUESTIONS.map((q) => (
            <div key={q.id}>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">{q.label}</label>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const active = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        active
                          ? 'bg-brand-600 border-brand-600 text-white shadow-card'
                          : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-brand-400 dark:hover:border-brand-600'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{answeredCount}/{total} answered · advisory only</span>
          <button
            onClick={apply}
            disabled={answeredCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-card disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Tailor my roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
