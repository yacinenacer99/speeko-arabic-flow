import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Briefcase,
  Sprout,
  Mic,
  Eye,
  EyeOff,
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
import { getAuthErrorMessageAr } from "@/lib/authErrors";
import {
  upsertUserProfile,
  PENDING_ONBOARDING_KEY,
} from "@/lib/userProfile";
import { useAuth } from "@/contexts/AuthContext";

const steps = ["name", "interests", "goal", "level", "signup"] as const;

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
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [authSubmitLoading, setAuthSubmitLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    (currentStep === "level" && !!level) ||
    (currentStep === "signup" &&
      signupEmail.trim().includes("@") &&
      signupPassword.length >= 6);

  const persistPendingForOAuth = () => {
    localStorage.setItem(
      PENDING_ONBOARDING_KEY,
      JSON.stringify({
        name: name.trim(),
        interests,
        goal,
        level,
        language: "ar",
      }),
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 16,
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    background: "hsla(0, 0%, 100%, 0.6)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "hsl(var(--foreground))",
    outline: "none",
    direction: "rtl",
    height: 48,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Cairo, sans-serif",
  };

  const handleNext = () => {
    if (step >= 4) return;
    if (!canNext) return;
    setStep((s) => s + 1);
  };

  const handleCompleteSignup = async (e?: FormEvent) => {
    e?.preventDefault();
    if (step !== 4 || !canNext) return;
    setSignupError(null);
    setAuthSubmitLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
    });
    setAuthSubmitLoading(false);
    if (signUpError) {
      setSignupError(getAuthErrorMessageAr(signUpError, "signup"));
      return;
    }
    const uid = data.user?.id;
    if (!uid) {
      setSignupError("حدث خطأ، حاول مرة أخرى");
      return;
    }
    localStorage.removeItem(PENDING_ONBOARDING_KEY);
    const { error: upError } = await upsertUserProfile(supabase, {
      id: uid,
      name: name.trim(),
      interests,
      goal,
      level: level!,
      language: "ar",
    });
    if (upError) {
      setSignupError("تعذر حفظ بياناتك، راجع الاتصال أو الإعدادات");
      return;
    }
    localStorage.setItem("user_name", name.trim());
    navigate("/home");
  };

  const handleGoogleSignup = async () => {
    if (step !== 4) return;
    setSignupError(null);
    setGoogleLoading(true);
    persistPendingForOAuth();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (oauthError) {
      setGoogleLoading(false);
      setSignupError(getAuthErrorMessageAr(oauthError, "signup"));
    }
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

  const authBusy = authSubmitLoading || googleLoading;

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

        {currentStep === "signup" && (
          <div className="w-full flex flex-col">
            <h1 className="font-cairo font-bold text-center onboarding-heading" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 8 }}>
              أنشئ حسابك
            </h1>
            <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "#9090A8", marginBottom: 20 }}>
              خطوة أخيرة — احفظ تقدّمك
            </p>

            {signupError && (
              <p className="font-cairo font-light" style={errorStyle} role="alert">
                {signupError}
              </p>
            )}

            <button
              type="button"
              disabled={authBusy}
              onClick={handleGoogleSignup}
              className="font-cairo font-bold w-full flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 999,
                padding: 14,
                fontSize: 15,
                color: "hsl(var(--foreground))",
                cursor: authBusy ? "not-allowed" : "pointer",
                height: 48,
                opacity: authBusy ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              {googleLoading ? "جاري التحميل..." : "تابع مع Google"}
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1" style={{ height: 1, background: "hsl(var(--border))" }} />
              <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>أو</span>
              <div className="flex-1" style={{ height: 1, background: "hsl(var(--border))" }} />
            </div>

            <form id="onboarding-signup-form" className="flex flex-col gap-3" onSubmit={handleCompleteSignup}>
              <input
                style={inputStyle}
                placeholder="البريد الإلكتروني"
                type="email"
                autoComplete="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                disabled={authBusy}
                required
              />
              <div className="relative">
                <input
                  style={inputStyle}
                  placeholder="كلمة المرور"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={authBusy}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: 14, background: "none", border: "none", cursor: "pointer", minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {showPw ? <EyeOff size={18} color="hsl(var(--muted-foreground))" /> : <Eye size={18} color="hsl(var(--muted-foreground))" />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="w-full pb-8 relative z-10" style={{ maxWidth: 400, paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
        {step < 4 ? (
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
            type="submit"
            form="onboarding-signup-form"
            disabled={!canNext || authBusy}
            className="font-cairo font-bold text-white w-full"
            style={{
              background: canNext && !authBusy ? "hsl(var(--primary))" : "#C4C4D0",
              border: "none",
              borderRadius: 999,
              padding: "16px 0",
              fontSize: 15,
              height: 50,
              cursor: canNext && !authBusy ? "pointer" : "not-allowed",
              opacity: canNext && !authBusy ? 1 : 0.4,
              transition: "background 0.2s ease, opacity 0.2s ease",
            }}
          >
            {authSubmitLoading ? "جاري التحميل..." : "أنشئ الحساب"}
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
