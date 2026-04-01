import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type Phase = "idle" | "recording" | "done";

const HeroSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const size = isMobile ? 200 : 240;

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPhase("done");
  }, []);

  const startRecording = useCallback(() => {
    setPhase("recording");
    setElapsed(0);
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
    if (elapsed >= 60 && phase === "recording") {
      stopRecording();
    }
  }, [elapsed, phase, stopRecording]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCircleClick = () => {
    if (phase === "idle") {
      startRecording();
    } else if (phase === "recording") {
      stopRecording();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden -mt-8 md:-mt-10">
      {/* Decorative violet blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 text-center max-w-[680px] mx-auto">
        <h2 className="text-4xl md:text-[56px] md:leading-[1.55] font-bold font-cairo text-foreground mt-0 mb-[33px]">
          سكوتك يضيع عليك فرص.
        </h2>
        <p className="text-lg md:text-xl font-light font-cairo text-muted-foreground mb-16">
          تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
        </p>

        {/* Post-recording: "كيف كان؟" */}
        {phase === "done" && (
          <p
            className="font-cairo font-light text-[18px] mb-8 animate-fade-in"
            style={{ color: "#9090A8" }}
          >
            كيف كان؟
          </p>
        )}

        {/* Circle button */}
        <div
          className={phase === "recording" ? "" : "hero-float"}
          style={{ display: "inline-block" }}
        >
          <div className="hero-stroke-wrapper">
            <div
              className="hero-circle"
              style={{
                width: size,
                height: size,
                animation: phase === "recording"
                  ? "glowPulse 1.5s ease-in-out infinite"
                  : phase === "done"
                    ? "none"
                    : undefined,
              }}
              onClick={handleCircleClick}
            >
              <div className="hero-text-overlay">
                {phase === "idle" && (
                  <>
                    <span
                      style={{
                        fontFamily: "Cairo, sans-serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "white",
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      ابدأ التحدي
                    </span>
                    <span
                      style={{
                        fontFamily: "Cairo, sans-serif",
                        fontWeight: 300,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      تكلم الآن
                    </span>
                  </>
                )}
                {phase === "recording" && (
                  <span
                    style={{
                      fontFamily: "Cairo, sans-serif",
                      fontWeight: 700,
                      fontSize: 24,
                      color: "white",
                      textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {formatTime(elapsed)}
                  </span>
                )}
                {phase === "done" && (
                  <span
                    style={{
                      fontFamily: "Cairo, sans-serif",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "white",
                      textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timer below circle during recording */}
        {phase === "recording" && (
          <p className="mt-4 font-cairo font-light text-[14px] text-muted-foreground animate-fade-in">
            اضغط مرة ثانية للإيقاف
          </p>
        )}

        {/* Post-recording CTA button */}
        {phase === "done" && (
          <div className="mt-10 animate-fade-in">
            <button
              onClick={() => navigate("/onboarding")}
              className="font-cairo font-bold text-[16px] text-white transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "#0F0F14",
                padding: "16px 32px",
                borderRadius: 999,
                boxShadow: "0 0 24px rgba(108,99,255,0.3)",
              }}
            >
              علمني كيف أسولف
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
