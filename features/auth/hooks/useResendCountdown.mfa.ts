import { useCallback, useEffect, useState } from "react";

const RESEND_COUNTDOWN = 60;
const STORAGE_KEY = "mfa-otp-resend-end";

const getInitialSeconds = () => {
  if (typeof window === "undefined") return 0;
  const endTime = Number(window.localStorage.getItem(STORAGE_KEY));
  if (!endTime) return 0;
  const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
  if (remaining === 0) window.localStorage.removeItem(STORAGE_KEY);
  return remaining;
};

export const useResendCountdown = () => {
  const [seconds, setSeconds] = useState(getInitialSeconds);

  const start = useCallback(() => {
    const endTime = Date.now() + RESEND_COUNTDOWN * 1000;
    window.localStorage.setItem(STORAGE_KEY, String(endTime));
    setSeconds(RESEND_COUNTDOWN);
  }, []);

  const isCounting = seconds > 0;

  useEffect(() => {
    if (!isCounting) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [isCounting]);

  return { seconds, start };
};
