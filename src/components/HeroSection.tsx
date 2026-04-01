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

const HeroSection = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<State>("landing");
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    if (state === "sport") {
      const id = setTimeout(() => setState("topic"), 700);
      return () => clearTimeout(id);
    }
  }, [state]);

  useEffect(() => {
    if (state === "recording") {
      setTimeLeft(60);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return clearTimer;
    }
  }, [state, clearTimer]);

  useEffect(() => {
    if (timeLeft === 0 && state === "recording") {
      clearTimer();
      setState("results");
    }
  }, [timeLeft, state, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const isLanding = state === "landing";
  const isDark = state !== "landing";
  const showCircle = state !== "results";
  const showTopic = state === "topic" || state === "recording";
  const circleSize = isLanding ? 260 : 160;

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
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: "100vh",
        paddingTop: 70,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 0,
        backgroundColor: isDark ? "#0F0F14" : "hsl(var(--background))",
        transition: "background-color 0.7s ease",
        direction: "rtl",
      }}
    >
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

      {/* LANDING content */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          opacity: isLanding ? 1 : 0,
          pointerEvents: isLanding ? "auto" : "none",
          transition: "opacity 0.5s ease",
          position: isLanding ? "relative" : "absolute",
        }}
      >
        <h2
          className="font-bold font-cairo text-foreground"
          style={{
            fontSize: 36,
            lineHeight: 1.5,
            marginBottom: 12,
            padding: "0 24px",
          }}
        >
          سكوتك يضيع عليك فرص.
        </h2>
        <p
          className="font-light font-cairo text-muted-foreground"
          style={{
            fontSize: 15,
            marginBottom: 44,
            padding: "0 24px",
          }}
        >
          تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
        </p>
        <div className={isLanding ? "hero-float" : ""} style={{ display: "inline-block" }}>
          <div className="hero-stroke-wrapper">
            <div
              className="hero-circle"
              style={{
                width: 260,
                height: 260,
                cursor: "pointer",
              }}
              onClick={handleCircleClick}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold text-[20px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ التحدي
                </span>
                <span className="font-cairo font-light text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  تكلم الآن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPORT / TOPIC / RECORDING content */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          opacity: (state === "sport" || state === "topic" || state === "recording") ? 1 : 0,
          pointerEvents: (state === "sport" || state === "topic" || state === "recording") ? "auto" : "none",
          transition: "opacity 0.5s ease",
          position: (state === "sport" || state === "topic" || state === "recording") ? "relative" : "absolute",
        }}
      >
        {/* Circle */}
        <div style={{ marginBottom: 28 }}>
          <div className="hero-stroke-wrapper">
            <div
              className="hero-circle"
              style={{
                width: 160,
                height: 160,
                cursor: "pointer",
                animationDuration: state === "recording" ? "2s" : "3s",
              }}
              onClick={handleCircleClick}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold text-[32px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  {state === "recording" ? formatTime(timeLeft) : "1:00"}
                </span>
                {state === "sport" && (
                  <span className="font-cairo font-light text-[13px] text-muted-foreground">
                    جاهز؟
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Topic info */}
        <div
          style={{
            opacity: showTopic ? 1 : 0,
            transform: showTopic ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            maxWidth: 320,
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
            {currentTopic.forbidden.map((word) => (
              <span
                key={word}
                className="font-cairo font-bold text-[13px]"
                style={{
                  background: "rgba(255,68,68,0.08)",
                  border: "1px solid rgba(255,107,107,0.35)",
                  borderRadius: 999,
                  padding: "5px 14px",
                  color: "#FF6B6B",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Recording hint */}
        {state === "recording" && (
          <p className="font-cairo font-light text-center mt-4" style={{ fontSize: 12, color: "#FF6B6B" }}>
            اضغط للإيقاف
          </p>
        )}
      </div>

      {/* RESULTS content */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          opacity: state === "results" ? 1 : 0,
          transform: state === "results" ? "translateY(0)" : "translateY(16px)",
          pointerEvents: state === "results" ? "auto" : "none",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          position: state === "results" ? "relative" : "absolute",
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
            { label: "الكلمات الممنوعة", value: "استخدمت 1", icon: "🚫" },
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
    </section>
  );
};

export default HeroSection;
