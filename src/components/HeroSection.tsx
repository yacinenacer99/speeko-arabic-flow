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

  // Sport → Topic after 700ms
  useEffect(() => {
    if (state === "sport") {
      const id = setTimeout(() => setState("topic"), 700);
      return () => clearTimeout(id);
    }
  }, [state]);

  // Recording countdown
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

  // Auto-stop at 0
  useEffect(() => {
    if (timeLeft === 0 && state === "recording") {
      clearTimer();
      setState("results");
    }
  }, [timeLeft, state, clearTimer]);

  // Cleanup
  useEffect(() => () => clearTimer(), [clearTimer]);

  const isLanding = state === "landing";
  const isDark = state !== "landing";
  const showCircle = state !== "results";
  const showTopic = state === "topic" || state === "recording";
  const circleSize = isLanding ? 260 : 160;
  const circleDesktop = isLanding ? 280 : 160;

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
        minHeight: "100vh",
        padding: "24px 24px 0",
        backgroundColor: isDark ? "#0F0F14" : "hsl(var(--background))",
        transition: "background-color 0.7s ease",
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

      <div className="relative z-10 text-center w-full" style={{ maxWidth: 400, margin: "0 auto" }}>
        {/* Headline + subtitle */}
        <div
          style={{
            opacity: isLanding ? 1 : 0,
            pointerEvents: isLanding ? "auto" : "none",
            transition: "opacity 0.5s ease",
          }}
        >
          <h2
            className="font-bold font-cairo text-foreground"
            style={{
              fontSize: 38,
              lineHeight: 1.5,
              marginBottom: 12,
              padding: "0 16px",
            }}
          >
            سكوتك يضيع عليك فرص.
          </h2>
          <p
            className="font-light font-cairo text-muted-foreground"
            style={{
              fontSize: 15,
              marginBottom: 40,
              padding: "0 24px",
            }}
          >
            تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
          </p>
        </div>

        {/* Circle */}
        <div
          style={{
            opacity: showCircle ? 1 : 0,
            transform: showCircle ? "scale(1)" : "scale(0.8)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            marginTop: isDark ? 60 : 0,
            marginBottom: isDark ? 32 : 0,
          }}
        >
          <div className={isLanding ? "hero-float" : ""} style={{ display: "inline-block" }}>
            <div className="hero-stroke-wrapper">
              <div
                className="hero-circle"
                style={{
                  width: circleSize,
                  height: circleSize,
                  transition: "width 0.7s ease, height 0.7s ease",
                  animationDuration: state === "recording" ? "2s" : "3s",
                  cursor: "pointer",
                }}
                onClick={handleCircleClick}
              >
                <div className="hero-text-overlay">
                  {isLanding && (
                    <>
                      <span className="font-cairo font-bold text-[20px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                        ابدأ التحدي
                      </span>
                      <span className="font-cairo font-light text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                        تكلم الآن
                      </span>
                    </>
                  )}
                  {(state === "sport" || state === "topic" || state === "recording") && (
                    <>
                      <span className="font-cairo font-bold text-[32px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                        {state === "recording" ? formatTime(timeLeft) : "1:00"}
                      </span>
                      {state === "sport" && (
                        <span className="font-cairo font-light text-[13px] text-muted-foreground">
                          جاهز؟
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hint text below circle */}
          {state === "topic" && (
            <p className="font-cairo font-light text-center mt-3" style={{ fontSize: 12, color: "#9090A8" }}>
              اضغط على الدائرة للبدء
            </p>
          )}
          {state === "recording" && (
            <p className="font-cairo font-light text-center mt-3" style={{ fontSize: 12, color: "#FF6B6B" }}>
              اضغط للإيقاف
            </p>
          )}
        </div>

        {/* Topic section */}
        <div
          style={{
            opacity: showTopic ? 1 : 0,
            transform: showTopic ? "translateY(0)" : "translateY(12px)",
            pointerEvents: showTopic ? "auto" : "none",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          <p className="font-cairo text-center mb-2" style={{ fontWeight: 300, fontSize: 12, color: "#9090A8" }}>
            تكلم عن:
          </p>
          <p className="font-cairo font-bold text-white text-center" style={{ fontSize: 22, marginBottom: 20 }}>
            {currentTopic.topic}
          </p>
          <p className="font-cairo text-center mb-3" style={{ fontWeight: 300, fontSize: 12, color: "#9090A8" }}>
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

        {/* Results section */}
        <div
          style={{
            opacity: state === "results" ? 1 : 0,
            transform: state === "results" ? "translateY(0)" : "translateY(16px)",
            pointerEvents: state === "results" ? "auto" : "none",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="font-cairo font-light text-[18px] mb-4" style={{ color: "#9090A8" }}>
            كيف كان؟
          </p>
          <div className="flex flex-col gap-3 mt-6">
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
        </div>
      </div>

      {/* Fixed bottom — recording stop */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center"
        style={{
          opacity: state === "results" ? 1 : 0,
          pointerEvents: state === "results" ? "auto" : "none",
          transition: "opacity 0.5s ease",
          zIndex: 50,
          width: "calc(100% - 48px)",
          maxWidth: 340,
        }}
      >
        <button
          onClick={() => navigate("/onboarding")}
          className="font-cairo font-bold text-[16px] w-full"
          style={{
            background: "white",
            color: "#0F0F14",
            borderRadius: 999,
            padding: "18px 0",
          }}
        >
          علمني كيف أسولف
        </button>
        <p className="font-cairo font-light text-[11px] mt-3" style={{ color: "#9090A8" }}>
          مجاناً — لا تحتاج حساب
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
