import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Thin wrapper over the Web Speech API for one-shot dictation.
 * Gracefully reports `supported: false` where the API is unavailable (e.g. Firefox).
 */
export function useSpeechRecognition({ lang = 'en-IN', onResult } = {}) {
  const SpeechRecognition =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supported = !!SpeechRecognition;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript && onResult) onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      try { recognition.abort(); } catch { /* ignore */ }
    };
  }, [supported, lang, onResult, SpeechRecognition]);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch { /* already started */ }
  }, [listening]);

  const stop = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    setListening(false);
  }, []);

  return { supported, listening, start, stop };
}
