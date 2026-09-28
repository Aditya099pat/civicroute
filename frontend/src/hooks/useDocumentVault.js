import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Aggregate every required document across a pipeline's nodes into one
 * deduplicated checklist, mapping each document to the steps that need it,
 * with per-pipeline check-state persisted in localStorage.
 */
export function useDocumentVault(pipeline) {
  // Key on id + a slug of the title so distinct dynamic AI routes that happen to
  // share an id (e.g. 'CIV-LIVE') don't share check-state.
  const slug = (pipeline?.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const storageKey = pipeline?.id ? `civicroute_vault_${pipeline.id}_${slug}` : null;

  const docs = useMemo(() => {
    const map = new Map(); // normalized -> { label, steps: [{index, code, title}] }
    (pipeline?.nodes || []).forEach((node, index) => {
      const list = node.documentsRequired || node.docs || [];
      list.forEach((raw) => {
        const label = String(raw).trim();
        if (!label) return;
        const key = label.toLowerCase();
        if (!map.has(key)) map.set(key, { key, label, steps: [] });
        map.get(key).steps.push({ index: index + 1, code: node.code, title: node.title });
      });
    });
    return [...map.values()];
  }, [pipeline]);

  const [checked, setChecked] = useState({});

  // Load persisted check-state when the pipeline changes.
  useEffect(() => {
    if (!storageKey) { setChecked({}); return; }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setChecked(Object.fromEntries(saved.map((k) => [k, true])));
    } catch {
      setChecked({});
    }
  }, [storageKey]);

  const toggle = useCallback(
    (key) => {
      setChecked((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(Object.keys(next).filter((k) => next[k])));
          } catch { /* ignore quota/private-mode errors */ }
        }
        return next;
      });
    },
    [storageKey]
  );

  const readyCount = docs.filter((d) => checked[d.key]).length;

  return { docs, checked, toggle, readyCount, total: docs.length };
}
