import { useEffect, useState } from 'react';
import { verifyUrls } from '../utils/api';

/**
 * Live-verifies the official URLs of the given nodes against the backend.
 * Returns a map of url -> result plus an overall state so components can show
 * honest badges (verifying / verified / unreachable / not-available).
 */
export function useVerification(nodes = []) {
  const [results, setResults] = useState({});
  const [state, setState] = useState('idle'); // idle | verifying | done | unavailable

  const urls = [...new Set(nodes.map((n) => n.officialUrl || n.url).filter(Boolean))];
  const urlKey = urls.join('|');

  useEffect(() => {
    let cancelled = false;
    if (!urls.length) {
      setResults({});
      setState('idle');
      return;
    }
    setState('verifying');
    verifyUrls(urls).then((res) => {
      if (cancelled) return;
      if (res === null) {
        setState('unavailable');
        setResults({});
      } else {
        setResults(res);
        setState('done');
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const statusFor = (url) => {
    if (state === 'verifying') return { label: 'Verifying…', tone: 'pending' };
    if (state === 'unavailable') return { label: 'Not verified', tone: 'unknown' };
    const r = results[url];
    if (!r) return { label: 'Not verified', tone: 'unknown' };
    if (r.verified) return { label: 'Reachable · HTTPS', tone: 'ok', detail: r };
    if (r.isGovDomain === false) return { label: 'Non-gov domain', tone: 'warn', detail: r };
    return { label: 'Unreachable', tone: 'warn', detail: r };
  };

  return { results, state, statusFor };
}
