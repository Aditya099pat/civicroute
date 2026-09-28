/**
 * Encode/decode a compact shareable pathway state in the URL query string.
 * Seed routes share a stable key; dynamic AI routes share the query so the
 * recipient re-resolves it. No server-side storage is needed.
 */
export function buildShareUrl({ key, query, completed = [], ward } = {}) {
  const params = new URLSearchParams();
  if (key) params.set('p', key);
  else if (query) params.set('q', query);
  if (completed.length) params.set('done', completed.join(','));
  if (ward) params.set('ward', ward);
  const base = `${window.location.origin}${window.location.pathname}`;
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function parseShareState() {
  try {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('p');
    const query = params.get('q');
    if (!key && !query) return null;
    return {
      key: key || null,
      query: query || null,
      completed: (params.get('done') || '').split(',').map((s) => s.trim()).filter(Boolean),
      ward: params.get('ward') || null,
    };
  } catch {
    return null;
  }
}
