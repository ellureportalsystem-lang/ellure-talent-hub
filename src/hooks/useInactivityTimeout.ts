import { useCallback, useEffect, useRef, useState } from "react";

const INACTIVITY_MS = 90 * 60 * 1000;
const WARNING_MS = 5 * 60 * 1000;

export function useInactivityTimeout(onExpire: () => void, enabled: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_MS / 1000);
  const lastActivity = useRef(Date.now());
  const warningStarted = useRef<number | null>(null);

  const reset = useCallback(() => {
    lastActivity.current = Date.now();
    warningStarted.current = null;
    setShowWarning(false);
    setSecondsLeft(WARNING_MS / 1000);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"] as const;
    const onActivity = () => {
      if (!showWarning) lastActivity.current = Date.now();
    };
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const interval = setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (!showWarning && idle >= INACTIVITY_MS) {
        setShowWarning(true);
        warningStarted.current = Date.now();
        setSecondsLeft(WARNING_MS / 1000);
      }
      if (showWarning && warningStarted.current) {
        const elapsed = Date.now() - warningStarted.current;
        const left = Math.max(0, Math.ceil((WARNING_MS - elapsed) / 1000));
        setSecondsLeft(left);
        if (left <= 0) onExpire();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [enabled, showWarning, onExpire]);

  return { showWarning, secondsLeft, stayLoggedIn: reset };
}
