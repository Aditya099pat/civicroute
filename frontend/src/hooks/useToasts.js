import { useCallback, useRef, useState } from 'react';

/**
 * Lightweight stackable toast state.
 * notify(message, type) pushes a toast; each auto-dismisses after `duration`.
 */
export function useToasts(duration = 4500) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'info') => {
      if (!message) return;
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss, duration]
  );

  return { toasts, notify, dismiss };
}
