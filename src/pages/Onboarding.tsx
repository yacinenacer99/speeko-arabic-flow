import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const steps = ["language", "goal", "level"] as const;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const currentStep = steps[step];

  const canNext =
    (currentStep === "language" && language) ||
    (currentStep === "goal" && goal) ||
    (currentStep === "level" && level);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else navigate("/signup");
  };

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    background: "white",
    border: `2px solid ${selected ? "#6C63FF" : "#E8E6F0"}`,
    borderRadius: 20,
    padding: 24,
    cursor: "pointer",
    transition: "border-color 0.2s ease, background 0.2s ease",
    ...(selected ? { background: "rgba(108,99,255,0.04)" } : {}),
  });

  return (
    <div
      className="flex flex-col items-center"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#F5F4F0",
        direction: "rtl",
        padding: "0 24px",
      }}
    >
      <Navbar />

      {/* Progress dots */}
      <div className="flex gap-2 mt-20 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i <= step ? "#6C63FF" : "#E8E6F0",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col items-center" style={{ maxWidth: 400 }}>
        {currentStep === "language" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "#1A1A2E", marginBottom: 24 }}>
              وش لغتك؟
            </h1>
            <div className="flex flex-col gap-3 w-full">
              <div style={cardStyle(language === "ar")} onClick={() => setLanguage("ar")}>
                <span style={{ fontSize: 28 }}>🇸🇦</span>
                <p className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E", marginTop: 8 }}>العربية الفصحى</p>
                <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>Modern Standard Arabic</p>
              </div>
              <div style={cardStyle(language === "en")} onClick={() => setLanguage("en")}>
                <span style={{ fontSize: 28 }}>🇬🇧</span>
                <p className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E", marginTop: 8 }}>English</p>
                <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>English speaking training</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === "goal" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "#1A1A2E", marginBottom: 24 }}>
              وش هدفك؟
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "work", icon: "💼", title: "العمل والاجتماعات", sub: "تقديم عروض واجتماعات" },
                { id: "interview", icon: "🎯", title: "المقابلات الوظيفية", sub: "جهز نفسك للمقابلة" },
                { id: "content", icon: "🎙️", title: "المحتوى والتسجيل", sub: "بودكاست ويوتيوب" },
                { id: "personal", icon: "🌱", title: "تطوير شخصي", sub: "ثقة وتواصل أفضل" },
              ].map((item) => (
                <div key={item.id} style={cardStyle(goal === item.id)} onClick={() => setGoal(item.id)}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <p className="font-cairo font-bold" style={{ fontSize: 15, color: "#1A1A2E", marginTop: 8 }}>{item.title}</p>
                  <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "level" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "#1A1A2E", marginBottom: 24 }}>
              كيف تحكي على نفسك؟
            </h1>
            <div className="flex flex-col gap-3">
              {[
                { id: "beginner", title: "مبتدئ", sub: "أتردد كثير وما أعرف وش أقول" },
                { id: "intermediate", title: "متوسط", sub: "أتكلم بس أحس كلامي مو منظم" },
                { id: "advanced", title: "متقدم", sub: "أتكلم بثقة بس أبي أتحسن" },
              ].map((item) => (
                <div key={item.id} style={cardStyle(level === item.id)} onClick={() => setLevel(item.id)}>
                  <p className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E" }}>{item.title}</p>
                  <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", marginTop: 4 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="w-full pb-8" style={{ maxWidth: 400 }}>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="font-cairo font-bold text-white w-full"
          style={{
            background: canNext ? "#6C63FF" : "#C4C4D0",
            border: "none",
            borderRadius: 999,
            padding: "16px 0",
            fontSize: 16,
            cursor: canNext ? "pointer" : "not-allowed",
            transition: "background 0.2s ease",
          }}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
