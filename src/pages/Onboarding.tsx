import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Briefcase, Sprout, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";

const steps = ["language", "goal", "level"] as const;

const goalItems = [
  { id: "work", Icon: Briefcase, title: "العمل والاجتماعات", sub: "تقديم عروض واجتماعات" },
  { id: "interview", Icon: Target, title: "المقابلات الوظيفية", sub: "جهز نفسك للمقابلة" },
  { id: "content", Icon: Mic, title: "المحتوى والتسجيل", sub: "بودكاست ويوتيوب" },
  { id: "personal", Icon: Sprout, title: "تطوير شخصي", sub: "ثقة وتواصل أفضل" },
];

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
    background: selected ? "rgba(108,99,255,0.04)" : "hsla(0, 0%, 100%, 0.45)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `2px solid ${selected ? "hsl(var(--primary))" : "hsla(0, 0%, 100%, 0.6)"}`,
    borderRadius: 20,
    padding: 24,
    cursor: "pointer",
    transition: "border-color 0.2s ease, background 0.2s ease",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  });

  return (
    <div
      className="flex flex-col items-center relative"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "hsl(var(--background))",
        direction: "rtl",
        padding: "0 24px",
      }}
    >
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 300, height: 300, top: "20%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 250, height: 250, bottom: "10%", left: "-5%" }} />

      {/* Progress dots */}
      <div className="flex gap-2 mt-20 mb-8 relative z-10">
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i <= step ? "hsl(var(--primary))" : "hsl(var(--border))",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col items-center relative z-10" style={{ maxWidth: 400 }}>
        {currentStep === "language" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "hsl(var(--foreground))", marginBottom: 24 }}>
              وش لغتك؟
            </h1>
            <div className="flex flex-col gap-3 w-full">
              <div style={cardStyle(language === "ar")} onClick={() => setLanguage("ar")}>
                <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>العربية الفصحى</p>
                <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Modern Standard Arabic</p>
              </div>
              <div style={cardStyle(language === "en")} onClick={() => setLanguage("en")}>
                <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>English</p>
                <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>English speaking training</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === "goal" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "hsl(var(--foreground))", marginBottom: 24 }}>
              وش هدفك؟
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {goalItems.map((item) => (
                <div key={item.id} style={cardStyle(goal === item.id)} onClick={() => setGoal(item.id)}>
                  <item.Icon size={24} color="hsl(var(--primary))" />
                  <p className="font-cairo font-bold" style={{ fontSize: 15, color: "hsl(var(--foreground))", marginTop: 8 }}>{item.title}</p>
                  <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "level" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "hsl(var(--foreground))", marginBottom: 24 }}>
              كيف تحكي على نفسك؟
            </h1>
            <div className="flex flex-col gap-3">
              {[
                { id: "beginner", title: "مبتدئ", sub: "أتردد كثير وما أعرف وش أقول" },
                { id: "intermediate", title: "متوسط", sub: "أتكلم بس أحس كلامي مو منظم" },
                { id: "advanced", title: "متقدم", sub: "أتكلم بثقة بس أبي أتحسن" },
              ].map((item) => (
                <div key={item.id} style={cardStyle(level === item.id)} onClick={() => setLevel(item.id)}>
                  <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>{item.title}</p>
                  <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="w-full pb-8 relative z-10" style={{ maxWidth: 400 }}>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="font-cairo font-bold text-white w-full"
          style={{
            background: canNext ? "hsl(var(--primary))" : "#C4C4D0",
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
