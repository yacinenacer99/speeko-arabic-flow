import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type State = "landing" | "sport" | "topic" | "recording" | "results";

const TOPICS = [
  { topic: "تكلم عن أهمية الوقت", forbidden: ["مهم", "وقت", "يعني", "دائماً", "كثير"] },
  { topic: "وش رأيك في التقنية؟", forbidden: ["تقنية", "هاتف", "يعني", "إنترنت", "تطبيق"] },
  { topic: "تكلم عن شخص أثّر فيك", forbidden: ["ناس", "شخص", "يعني", "أثّر", "حياة"] },
  { topic: "وش يجعل الإنسان ناجح؟", forbidden: ["نجاح", "ناجح", "يعني", "إنسان", "هدف"] },
  { topic: "تكلم عن شيء تحب تسويه", forbidden: ["أحب", "دائماً", "يعني", "شيء", "وقت"] },
  { topic: "وش رأيك في القراءة؟", forbidden: ["كتاب", "قراءة", "يعني", "معلومة", "تعلم"] },
  { topic: "تكلم عن مكان تحب تروحه", forbidden: ["مكان", "روح", "يعني", "جميل", "أحب"] },
];

const formatTime = (t: number) =>
  `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const WAVE_BARS = [
  { min: 8, max: 24, dur: 0.4 },
  { min: 12, max: 32, dur: 0.6 },
  { min: 6, max: 28, dur: 0.5 },
  { min: 16, max: 36, dur: 0.45 },
  { min: 8, max: 22, dur: 0.55 },
  { min: 10, max: 30, dur: 0.5 },
  { min: 6, max: 18, dur: 0.65 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<State>("landing");
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recording indicators
  const [flashKey, setFlashKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [struckWords, setStruckWords] = useState<string[]>([]);
  const [showSilence, setShowSilence] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const recordingStartRef = useRef(0);

  const currentTopic = useMemo(
    () => TOPICS[Math.floor(Math.random() * TOPICS.length)],
    []
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Sport → topic auto-transition
  useEffect(() => {
    if (state === "sport") {
      const id = setTimeout(() => setState("topic"), 700);
      return () => clearTimeout(id);
    }
  }, [state]);

  // Recording timer
  useEffect(() => {
    if (state === "recording") {
      setTimeLeft(60);
      setStruckWords([]);
      recordingStartRef.current = Date.now();
      lastActivityRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return clearTimer;
    }
  }, [state, clearTimer]);

  // Timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && state === "recording") {
      clearTimer();
      setState("results");
    }
  }, [timeLeft, state, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // Simulated filler word flash (every 8-12s)
  useEffect(() => {
    if (state !== "recording") return;
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000;
      return setTimeout(() => {
        setShowFlash(true);
        setFlashKey((k) => k + 1);
        lastActivityRef.current = Date.now();
        setTimeout(() => setShowFlash(false), 400);
        idRef = schedule();
      }, delay);
    };
    let idRef = schedule();
    return () => clearTimeout(idRef);
  }, [state]);

  // Simulated forbidden word strike (random every 10-18s)
  useEffect(() => {
    if (state !== "recording") return;
    const available = () =>
      currentTopic.forbidden.filter((w) => !struckWords.includes(w));
    const schedule = () => {
      const delay = 10000 + Math.random() * 8000;
      return setTimeout(() => {
        const pool = available();
        if (pool.length > 0) {
          const word = pool[Math.floor(Math.random() * pool.length)];
          setStruckWords((prev) => [...prev, word]);
          lastActivityRef.current = Date.now();
        }
        idRef = schedule();
      }, delay);
    };
    let idRef = schedule();
    return () => clearTimeout(idRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentTopic.forbidden]);

  // Silence indicator
  useEffect(() => {
    if (state !== "recording") {
      setShowSilence(false);
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - recordingStartRef.current;
      const sinceActivity = Date.now() - lastActivityRef.current;
      if (elapsed > 5000 && sinceActivity > 3000) {
        setShowSilence(true);
        setTimeout(() => setShowSilence(false), 2000);
        lastActivityRef.current = Date.now();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const isLanding = state === "landing";
  const isDark = state !== "landing";
  // Use same layout phase for sport AND topic — circle is already in final position
  const isUpper = state === "sport" || state === "topic" || state === "recording";
  const showTopic = state === "topic" || state === "recording";
  const isResults = state === "results";
  const isRecording = state === "recording";

  const timerColor =
    timeLeft > 30
      ? "#FFFFFF"
      : timeLeft > 10
        ? "#F59E0B"
        : "#FF4444";

  const handleCircleClick = () => {
    if (state === "landing") setState("sport");
    else if (state === "topic") setState("recording");
    else if (state === "recording") {
      clearTimer();
      setState("results");
    }
  };

  return (
    <section
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        height: "100vh",
        justifyContent: isLanding ? "center" : "flex-start",
        paddingTop: isLanding ? 0 : 100,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 0,
        backgroundColor: isDark ? "#0F0F14" : "hsl(var(--background))",
        transition: `padding-top 0.7s ${EASE}, justify-content 0s, background-color 0.7s ease`,
        direction: "rtl",
      }}
    >
      {/* Edge flash overlay */}
      <div
        key={flashKey}
        className="recording-flash"
        style={{
          position: "fixed",
          inset: 0,
          border: "6px solid #FF4444",
          borderRadius: 0,
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0,
          animation: showFlash ? "edgeFlash 0.4s ease forwards" : "none",
        }}
      />

      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.15), transparent 70%)",
          filter: "blur(80px)",
          opacity: isDark ? 0.5 : 1,
          transition: "opacity 0.7s ease",
        }}
      />

      {/* Main content area */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ width: "100%", maxWidth: 400 }}
      >
        {/* Hero text */}
        <div
          style={{
            opacity: isLanding ? 1 : 0,
            maxHeight: isLanding ? 200 : 0,
            overflow: "hidden",
            transition: `opacity 0.5s ease, max-height 0.7s ${EASE}`,
            pointerEvents: isLanding ? "auto" : "none",
          }}
        >
          <h2
            className="font-bold font-cairo text-foreground text-center whitespace-pre-line"
            style={{ fontSize: 36, lineHeight: 1.2, marginBottom: 12, padding: "0 24px" }}
          >
            كم فرصة ضاعت{"\n"}بسبب سكوتك؟
          </h2>
          <p
            className="font-light font-cairo text-muted-foreground text-center"
            style={{ fontSize: 15, marginBottom: 44, padding: "0 24px" }}
          >
            تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
          </p>
        </div>

        {/* Circle */}
        <div
          className={isLanding ? "hero-float" : ""}
          style={{
            display: "inline-block",
            marginTop: isSmall ? -20 : 0,
            marginBottom: isSmall ? 16 : 0,
            opacity: isResults ? 0 : 1,
            transform: isResults ? "scale(0.8)" : "scale(1)",
            transition: `margin-top 0.7s ${EASE}, margin-bottom 0.7s ${EASE}, opacity 0.5s ease, transform 0.5s ease`,
            pointerEvents: isResults ? "none" : "auto",
          }}
        >
          <div
            className="hero-stroke-wrapper"
            style={{
              padding: isSmall ? 4 : 5,
              transition: `padding 0.7s ${EASE}`,
            }}
          >
            <div
              className="hero-circle"
              style={{
                width: isSmall ? 160 : 260,
                height: isSmall ? 160 : 260,
                cursor: "pointer",
                transition: `width 0.7s ${EASE}, height 0.7s ${EASE}`,
                animationDuration: isRecording ? "2s" : "3s",
              }}
              onClick={handleCircleClick}
            >
              <div className="hero-text-overlay">
                {/* Landing text */}
                <span
                  className="font-cairo font-bold text-[20px] text-white"
                  style={{
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    opacity: isLanding ? 1 : 0,
                    position: isLanding ? "relative" : "absolute",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  ابدأ التحدي
                </span>
                <span
                  className="font-cairo font-light text-[13px]"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    opacity: isLanding ? 1 : 0,
                    position: isLanding ? "relative" : "absolute",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  تكلم الآن
                </span>

                {/* Timer text */}
                <span
                  className="font-cairo font-bold text-[32px]"
                  style={{
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    opacity: isDark && !isResults ? 1 : 0,
                    position: isDark && !isResults ? "relative" : "absolute",
                    transition: "opacity 0.3s ease 0.3s, color 0.5s ease",
                    color: isRecording ? timerColor : "#FFFFFF",
                    animation:
                      isRecording && timeLeft <= 10
                        ? "timerPulse 0.8s ease-in-out infinite"
                        : "none",
                  }}
                >
                  {isRecording ? formatTime(timeLeft) : "1:00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waveform bars */}
        <div
          className="flex items-center justify-center"
          style={{
            gap: 4,
            height: 40,
            marginTop: isRecording ? 16 : 0,
            opacity: isRecording ? 1 : 0,
            transition: "opacity 0.4s ease, margin-top 0.4s ease",
            pointerEvents: "none",
          }}
        >
          {WAVE_BARS.map((bar, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                width: 3,
                borderRadius: 999,
                backgroundColor: "#6C63FF",
                height: isRecording ? undefined : 4,
                opacity: isRecording ? 1 : 0.3,
                animation: isRecording
                  ? `waveBar ${bar.dur}s ease-in-out infinite alternate`
                  : "none",
                ["--bar-min" as string]: `${bar.min}px`,
                ["--bar-max" as string]: `${bar.max}px`,
              }}
            />
          ))}
        </div>

        {/* Silence indicator */}
        <p
          className="font-cairo font-light text-center"
          style={{
            fontSize: 13,
            color: "#9090A8",
            opacity: showSilence && isRecording ? 1 : 0,
            transition: "opacity 0.4s ease",
            marginTop: 8,
            pointerEvents: "none",
          }}
        >
          استمر...
        </p>

        {/* Topic info */}
        <div
          style={{
            opacity: showTopic ? 1 : 0,
            transform: showTopic ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            maxWidth: 320,
            pointerEvents: showTopic ? "auto" : "none",
            maxHeight: showTopic ? 400 : 0,
            overflow: "hidden",
          }}
        >
          <p className="font-cairo text-center" style={{ fontWeight: 300, fontSize: 12, color: "#9090A8", marginBottom: 6 }}>
            تكلم عن:
          </p>
          <p className="font-cairo font-bold text-white text-center" style={{ fontSize: 22, marginBottom: 20 }}>
            {currentTopic.topic}
          </p>
          <p className="font-cairo text-center" style={{ fontWeight: 300, fontSize: 12, color: "#9090A8", marginBottom: 10 }}>
            ماتقدر تقول:
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 8 }}>
            {currentTopic.forbidden.map((word) => {
              const isStruck = struckWords.includes(word);
              return (
                <span
                  key={word}
                  className="font-cairo font-bold text-[13px]"
                  style={{
                    background: isStruck
                      ? "rgba(255,68,68,0.25)"
                      : "rgba(255,68,68,0.08)",
                    border: `1px solid ${isStruck ? "#FF4444" : "rgba(255,107,107,0.35)"}`,
                    borderRadius: 999,
                    padding: "5px 14px",
                    color: "#FF6B6B",
                    textDecoration: isStruck ? "line-through" : "none",
                    transform: isStruck ? "scale(1)" : undefined,
                    animation: isStruck
                      ? "none"
                      : undefined,
                    transition: "background 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {isStruck ? `✕ ${word}` : word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Recording hint */}
        <p
          className="font-cairo font-light text-center mt-4"
          style={{
            fontSize: 12,
            color: "#FF6B6B",
            opacity: isRecording ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        >
          اضغط للإيقاف
        </p>

        {/* RESULTS content */}
        <div
          className="flex flex-col items-center text-center"
          style={{
            opacity: isResults ? 1 : 0,
            transform: isResults ? "translateY(0)" : "translateY(16px)",
            pointerEvents: isResults ? "auto" : "none",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            position: isResults ? "relative" : "absolute",
            padding: "0 24px",
            width: "100%",
            maxWidth: 400,
          }}
        >
          <p className="font-cairo font-light text-[18px]" style={{ color: "#9090A8", marginBottom: 20 }}>
            كيف كان؟
          </p>
          <div className="flex flex-col w-full" style={{ gap: 10, maxWidth: 320, margin: "0 auto" }}>
            {[
              { label: "كلمات الحشو", value: "يعني × 3", icon: "🔴" },
              { label: "سرعة الكلام", value: "متوسط", icon: "🎙️" },
              { label: "الكلمات الممنوعة", value: `استخدمت ${struckWords.length}`, icon: "🚫" },
            ].map((card) => (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-2xl"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A3E",
                  padding: "20px 24px",
                  direction: "rtl",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{card.icon}</span>
                  <span className="font-cairo font-light text-[14px]" style={{ color: "#9090A8" }}>
                    {card.label}
                  </span>
                </div>
                <span className="font-cairo font-bold text-[14px] text-white">
                  {card.value}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/onboarding")}
            className="font-cairo font-bold text-[16px]"
            style={{
              background: "white",
              color: "#0F0F14",
              borderRadius: 999,
              padding: "18px 0",
              marginTop: 24,
              width: "calc(100% - 48px)",
              maxWidth: 320,
            }}
          >
            علمني كيف أسولف
          </button>
          <p className="font-cairo font-light text-[11px]" style={{ color: "#9090A8", marginTop: 8 }}>
            مجاناً — لا تحتاج حساب
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
