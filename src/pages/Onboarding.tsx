import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Briefcase,
  Sprout,
  Mic,
  Coffee,
  Laptop,
  TrendingUp,
  Globe,
  Radio,
  Zap,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { upsertUserProfile } from "@/lib/userProfile";
import { useAuth } from "@/contexts/AuthContext";

const steps = ["name", "interests", "goal", "level"] as const;

const goalItems = [
  { id: "interview", Icon: Target, title: "المقابلات الوظيفية", sub: "جهز نفسك للمقابلة" },
  { id: "work", Icon: Briefcase, title: "العمل والاجتماعات", sub: "تقديم عروض واجتماعات" },
  { id: "personal", Icon: Sprout, title: "تطوير شخصي", sub: "ثقة وتواصل أفضل" },
  { id: "content", Icon: Mic, title: "المحتوى والتسجيل", sub: "بودكاست ويوتيوب" },
];

const interestItems = [
  { id: "daily", Icon: Coffee, title: "الحياة اليومية", sub: "مواقف يومية وسوالف" },
  { id: "work", Icon: Briefcase, title: "العمل والمهنة", sub: "اجتماعات وعروض ومقابلات" },
  { id: "tech", Icon: Laptop, title: "التقنية", sub: "تطبيقات وذكاء اصطناعي" },
  { id: "growth", Icon: TrendingUp, title: "التطوير الشخصي", sub: "ثقة وتواصل وعادات" },
  { id: "culture", Icon: Globe, title: "الثقافة والمجتمع", sub: "آراء وأفكار ونقاشات" },
  { id: "media", Icon: Radio, title: "المحتوى والإعلام", sub: "بودكاست ويوتيوب وكتابة" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, session } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);


  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  const currentStep = steps[step];

  const canNext =
    (currentStep === "name" && name.trim().length >= 2) ||
    (currentStep === "interests" && interests.length >= 1) ||
    (currentStep === "goal" && !!goal) ||
    (currentStep === "level" && !!level);

  const handleNext = () => {
    if (step >= 3) return;
    if (!canNext) return;
    setStep((s) => s + 1);
  };

  const handleComplete = async () => {
    if (!canNext) return;
    if (!session?.user?.id) {
      navigate("/home");
      return;
    }
    await upsertUserProfile(supabase, {
      id: session.user.id,
      name: name.trim(),
      interests,
      goal,
      level: level!,
      language: "ar",
    });
    navigate("/home");
  };

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? "rgba(108,99,255,0.06)" : "rgba(255,255,255,0.5)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: selected ? "2px solid #6C63FF" : "1px solid rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: "20px 16px",
    cursor: "pointer",
    transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
    boxShadow: selected
      ? "0 0 0 3px rgba(108,99,255,0.1)"
      : "0 8px 32px rgba(0, 0, 0, 0.06)",
    minHeight: 44,
  });

  const interestCardStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? "rgba(108,99,255,0.06)" : "rgba(255,255,255,0.5)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: selected ? "2px solid #6C63FF" : "1px solid rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: "16px 12px",
    cursor: "pointer",
    textAlign: "center",
    transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
    boxShadow: selected
      ? "0 0 0 3px rgba(108,99,255,0.1)"
      : "0 8px 32px rgba(0, 0, 0, 0.06)",
    minHeight: 44,
  });

  return (
    <div
      className="flex flex-col items-center relative"
      style={{
        minHeight: "100dvh",
        overflow: "hidden",
        background: "hsl(var(--background))",
        direction: "rtl",
        padding: "0 var(--page-padding-mobile)",
      }}
    >
      <Navbar />

      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "20%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "10%", left: "-5%" }} />

      <div className="flex gap-2 relative z-10" style={{ marginTop: 80, marginBottom: 32 }}>
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

      <div className="flex-1 w-full flex flex-col items-center relative z-10 overflow-y-auto" style={{ maxWidth: 400 }}>
        {currentStep === "name" && (
          <div className="w-full flex flex-col items-center">
            <h1 className="font-cairo font-bold text-center onboarding-heading" style={{ fontSize: 24, color: "#1A1A2E" }}>
              وش نقول لك؟
            </h1>
            <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "#9090A8", marginTop: 8 }}>
              اسمك الأول يكفي
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك هنا"
              className="font-cairo font-light"
              style={{
                width: "100%",
                maxWidth: 320,
                marginTop: 24,
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: 16,
                color: "#1A1A2E",
                outline: "none",
                direction: "rtl",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6C63FF";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        )}

        {currentStep === "interests" && (
          <div className="w-full flex flex-col items-center">
            <h1 className="font-cairo font-bold text-center onboarding-heading" style={{ fontSize: 24, color: "#1A1A2E" }}>
              وش يهمك؟
            </h1>
            <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "#9090A8", marginTop: 8 }}>
              نختار لك تحديات على ذوقك
            </p>
            <div className="grid grid-cols-2 w-full" style={{ gap: 10, marginTop: 24, maxWidth: 340 }}>
              {interestItems.map((item) => {
                const selected = interests.includes(item.id);
                return (
                  <div
                    key={item.id}
                    style={interestCardStyle(selected)}
                    onClick={() => toggleInterest(item.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <item.Icon size={20} color={selected ? "#6C63FF" : "#9090A8"} />
                    </div>
                    <p className="font-cairo font-bold" style={{ fontSize: 13, color: "#1A1A2E", textAlign: "center" }}>
                      {item.title}
                    </p>
                    <p className="font-cairo font-light" style={{ fontSize: 10, color: "#9090A8", marginTop: 4, textAlign: "center" }}>
                      {item.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === "goal" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center onboarding-heading" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>
              وش هدفك؟
            </h1>
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
              {goalItems.map((item) => (
                <div key={item.id} style={cardStyle(goal === item.id)} onClick={() => setGoal(item.id)}>
                  <div className="flex justify-center" style={{ marginBottom: 8 }}>
                    <item.Icon size={16} color="#6C63FF" />
                  </div>
                  <p className="font-cairo font-bold text-center" style={{ fontSize: 14, color: "hsl(var(--foreground))" }}>{item.title}</p>
                  <p className="font-cairo font-light text-center" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "level" && (
          <div className="w-full">
            <h1 className="font-cairo font-bold text-center onboarding-heading" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>
              كيف تحكي على نفسك؟
            </h1>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {[
                { id: "beginner", Icon: Sprout, title: "مبتدئ", sub: "أتردد كثير وما أعرف وش أقول" },
                { id: "intermediate", Icon: Zap, title: "متوسط", sub: "أتكلم بس أحس كلامي مو منظم" },
                { id: "advanced", Icon: Star, title: "متقدم", sub: "أتكلم بثقة بس أبي أتحسن" },
              ].map((item) => (
                <div key={item.id} style={cardStyle(level === item.id)} onClick={() => setLevel(item.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <item.Icon size={20} color={level === item.id ? "#6C63FF" : "#9090A8"} />
                    <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>{item.title}</p>
                  </div>
                  <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="w-full pb-8 relative z-10" style={{ maxWidth: 400, paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext}
            className="font-cairo font-bold text-white w-full"
            style={{
              background: canNext ? "hsl(var(--primary))" : "#C4C4D0",
              border: "none",
              borderRadius: 999,
              padding: "16px 0",
              fontSize: 15,
              height: 50,
              cursor: canNext ? "pointer" : "not-allowed",
              opacity: canNext ? 1 : 0.4,
              pointerEvents: canNext ? "auto" : "none",
              transition: "background 0.2s ease, opacity 0.2s ease",
            }}
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleComplete()}
            disabled={!canNext}
            className="font-cairo font-bold text-white w-full"
            style={{
              background: canNext ? "hsl(var(--primary))" : "#C4C4D0",
              border: "none",
              borderRadius: 999,
              padding: "16px 0",
              fontSize: 15,
              height: 50,
              cursor: canNext ? "pointer" : "not-allowed",
              opacity: canNext ? 1 : 0.4,
              pointerEvents: canNext ? "auto" : "none",
              transition: "background 0.2s ease, opacity 0.2s ease",
            }}
          >
            ابدأ رحلة التعلم
          </button>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .onboarding-heading { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
