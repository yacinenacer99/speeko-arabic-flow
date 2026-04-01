import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeroButton from "./HeroButton";

type Phase = "idle" | "recording" | "done";

const HeroSection = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPhase("done");
  }, []);

  const startRecording = useCallback(() => {
    setElapsed(0);
    setPhase("recording");
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 59) {
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  }, []);

  // Auto-stop at 60s
  useEffect(() => {
    if (elapsed >= 60) stopRecording();
  }, [elapsed, stopRecording]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCircleClick = () => {
    if (phase === "idle") startRecording();
    else if (phase === "recording") stopRecording();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        {/* Post-recording text */}
        {phase === "done" && (
          <p
            className="mb-8 font-light font-cairo text-muted-foreground animate-fade-in"
            style={{ fontSize: 18 }}
          >
            كيف كان؟
          </p>
        )}

        {/* Circle button */}
        <HeroButton
          onClick={handleCircleClick}
          recording={phase === "recording"}
        />

        {/* Timer */}
        {phase === "recording" && (
          <span
            className="mt-6 font-light font-cairo text-muted-foreground"
            style={{ fontSize: 14 }}
          >
            {formatTime(elapsed)}
          </span>
        )}

        {/* Post-recording CTA */}
        {phase === "done" && (
          <button
            onClick={() => navigate("/onboarding")}
            className="mt-8 font-bold font-cairo text-primary-foreground animate-fade-in"
            style={{
              background: "#0F0F14",
              fontSize: 16,
              padding: "16px 32px",
              borderRadius: 999,
              boxShadow: "0 0 24px rgba(108,99,255,0.3)",
              border: "none",
              cursor: "pointer",
            }}
          >
            علمني كيف أسولف
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
