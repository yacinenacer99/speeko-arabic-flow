import { useEffect, useRef, useState } from "react";

const DURATION_MS = 15000;
const HOLD_AT_PCT = 88;
const FINISH_ANIMATION_MS = 500;
const COMPLETE_DELAY_MS = 300;

interface AnalysisLoadingProps {
  processingDone: boolean;
  visible: boolean;
  onComplete?: () => void;
}

function getAffirmationForProgress(pct: number): string {
  if (pct <= 15) return "جارٍ رفع التسجيل...";
  if (pct <= 40) return "نحلل صوتك وكلماتك...";
  if (pct <= 65) return "نكتشف كلمات الحشو والممنوعة...";
  if (pct <= 85) return "نحسب معدل تدفق الكلام...";
  return "مدربك يكتب ملاحظاته...";
}

function getStageLabel(pct: number): string {
  if (pct <= 15) return "جارٍ رفع التسجيل";
  if (pct <= 40) return "تحليل الصوت";
  if (pct <= 65) return "اكتشاف كلمات الحشو";
  if (pct <= 85) return "حساب معدل التدفق";
  return "ملاحظات المدرب";
}

const AnalysisLoading = ({ processingDone, visible, onComplete }: AnalysisLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [affirmation, setAffirmation] = useState("جارٍ رفع التسجيل...");
  const [affirmationOpacity, setAffirmationOpacity] = useState(1);
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const processingDoneRef = useRef(processingDone);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    processingDoneRef.current = processingDone;
  }, [processingDone]);

  useEffect(() => {
    if (!visible) return;
    completedRef.current = false;
    progressRef.current = 0;
    setProgress(0);
    setAffirmation("جارٍ رفع التسجيل...");
    setAffirmationOpacity(1);
    console.log("[MLASOON] AnalysisLoading reset for new session");
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      hasStartedRef.current = false;
    }
  }, [visible]);

  useEffect(() => {
    let rafId = 0;
    let finalizeTimeout: number | undefined;
    let animationStart: number | null = null;

    const finishAndComplete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setProgress(100);
      progressRef.current = 100;
      finalizeTimeout = window.setTimeout(() => onComplete?.(), COMPLETE_DELAY_MS);
    };

    const animateToHundred = (from: number) => {
      const finishStart = performance.now();
      const step = (now: number) => {
        const elapsed = now - finishStart;
        const ratio = Math.min(elapsed / FINISH_ANIMATION_MS, 1);
        const value = from + (100 - from) * ratio;
        progressRef.current = value;
        setProgress(value);
        if (ratio < 1) {
          rafId = requestAnimationFrame(step);
          return;
        }
        finishAndComplete();
      };
      rafId = requestAnimationFrame(step);
    };

    const tick = (now: number) => {
      if (!hasStartedRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (animationStart === null) {
        animationStart = now;
      }
      if (completedRef.current) return;
      const elapsed = now - animationStart;
      const linearProgress = Math.min((elapsed / DURATION_MS) * 100, 100);

      if (!processingDoneRef.current && linearProgress >= HOLD_AT_PCT) {
        progressRef.current = HOLD_AT_PCT;
        setProgress(HOLD_AT_PCT);
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (processingDoneRef.current && linearProgress >= 100) {
        finishAndComplete();
        return;
      }

      progressRef.current = linearProgress;
      setProgress(linearProgress);

      if (processingDoneRef.current && progressRef.current >= HOLD_AT_PCT) {
        animateToHundred(progressRef.current);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (finalizeTimeout) window.clearTimeout(finalizeTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const nextAffirmation = getAffirmationForProgress(Math.floor(progress));
    if (nextAffirmation === affirmation) return;
    setAffirmationOpacity(0);
    const timeoutId = window.setTimeout(() => {
      setAffirmation(nextAffirmation);
      setAffirmationOpacity(1);
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [progress, affirmation]);

  if (visible) hasStartedRef.current = true;
  if (!hasStartedRef.current) return null;
  if (!visible && !processingDone && !completedRef.current) return null;

  const displayPct = Math.floor(progress);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        minHeight: "100dvh",
        backgroundColor: "#0F0F14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#6C63FF",
          filter: "blur(80px)",
          opacity: 0.1,
        }}
      />
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#FF9DC4",
          filter: "blur(80px)",
          opacity: 0.1,
        }}
      />

      <div
        className="font-cairo font-bold loading-percent"
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #FF9DC4, #C4A8FF, #6C63FF, #A8C4FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {displayPct}%
      </div>

      <p
        className="font-cairo font-light"
        style={{
          marginTop: 12,
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          maxWidth: "min(240px, 80vw)",
        }}
      >
        {getStageLabel(displayPct)}
      </p>

      <p
        className="font-cairo font-light"
        style={{
          marginTop: 20,
          fontSize: 15,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: "min(260px, 80vw)",
          opacity: affirmationOpacity,
          transition: "opacity 0.4s ease",
        }}
      >
        {affirmation}
      </p>

      <style>{`
        @media (max-width: 768px) {
          .loading-percent { font-size: 48px !important; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisLoading;
