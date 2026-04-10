import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getAuthErrorMessageAr } from "@/lib/authErrors";
import { upsertUserProfile, defaultSignupProfile } from "@/lib/userProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionContext } from "@/contexts/SessionContext";
import type { SessionResult } from "@/types/session";

type Mode = "login" | "signup";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromTrial = (location.state as { fromTrial?: boolean } | null)?.fromTrial === true;
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { setLatestSession } = useSessionContext();
  const [mode, setMode] = useState<Mode>(fromTrial ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

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

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (signInError) {
        setError(getAuthErrorMessageAr(signInError, "login"));
        return;
      }
      navigate("/home");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signUpError) {
      setError(getAuthErrorMessageAr(signUpError, "signup"));
      return;
    }
    if (!data.session) {
      setConfirmationSent(true);
      return;
    }
    const uid = data.user?.id;
    console.log("[MLASOON] signup success, uid:", uid);
    if (uid) {
      const { error: upError } = await upsertUserProfile(supabase, defaultSignupProfile(uid));
      if (upError) {
        setError("تعذر حفظ الملف الشخصي، راجع الاتصال");
        return;
      }
      console.log("[MLASOON] checking pending blob:", sessionStorage.getItem("mlasoon_pending_blob")?.slice(0, 50));
      const trialResult = await processPendingTrial(uid);
      if (trialResult) {
        setLatestSession(trialResult);
        console.log("[MLASOON] navigating to /results");
        navigate("/results");
        return;
      }
      console.log("[MLASOON] no pending trial, going to /home");
    }
    navigate("/home");
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    if (sessionStorage.getItem("mlasoon_pending_blob")) {
      sessionStorage.setItem("mlasoon_post_oauth_trial", "true");
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (oauthError) {
      setGoogleLoading(false);
      sessionStorage.removeItem("mlasoon_post_oauth_trial");
      setError(getAuthErrorMessageAr(oauthError, mode === "login" ? "login" : "signup"));
    }
  };

  const processPendingTrial = async (userId: string): Promise<SessionResult | false> => {
    const base64 = sessionStorage.getItem("mlasoon_pending_blob");
    const topicRaw = sessionStorage.getItem("mlasoon_pending_topic");
    console.log("[MLASOON] base64 exists:", !!base64, "topic exists:", !!topicRaw);
    if (!base64 || !topicRaw) return false;
    try {
      const topic = JSON.parse(topicRaw) as { question: string; forbiddenWords: string[] };
      const res = await fetch(base64);
      const blob = await res.blob();
      sessionStorage.removeItem("mlasoon_pending_blob");
      sessionStorage.removeItem("mlasoon_pending_topic");
      await new Promise(r => setTimeout(r, 1500));
      console.log("[MLASOON] delay done, calling processSession");
      const { processSession } = await import("@/lib/sessionProcessor");
      try {
        const result = await processSession(blob, topic.question, topic.forbiddenWords, userId, 1);
        console.log("[MLASOON] processSession result:", !!result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON] processPendingTrial error:", msg);
        return false;
      }
    } catch (err) {
      console.log("[MLASOON] Failed to process pending trial:", err);
      return false;
    }
  };

  const busy = loading || googleLoading;

  const title = mode === "login" ? "مرحباً بعودتك" : "حساب جديد";
  const subtitle = mode === "login" ? "سجل دخولك للمتابعة" : "أنشئ حسابك للبدء — يمكنك إكمال الملف لاحقاً";
  const submitLabel = mode === "login" ? "سجل دخول" : "أنشئ الحساب";

  return (
    <div
      className="flex flex-col items-center justify-center relative"
      style={{ minHeight: "100dvh", background: "hsl(var(--background))", direction: "rtl", padding: "0 var(--page-padding-mobile)" }}
    >
      <Navbar />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "20%", right: "-10%" }} />

      <div className="w-full relative z-10" style={{ maxWidth: 400 }}>
        <p className="font-cairo font-bold text-center" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 32 }}>
          ملسون
        </p>

        <div className="glass-card-light login-card" style={{ padding: "24px 20px" }}>
          <h1 className="font-cairo font-bold text-center" style={{ fontSize: 22, color: "hsl(var(--foreground))", marginBottom: 4 }}>
            {title}
          </h1>
          <p className="font-cairo font-light text-center" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>
            {subtitle}
          </p>

          {confirmationSent && (
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#5DBE8A", textAlign: "center", marginBottom: 12, fontFamily: "Cairo, sans-serif" }} role="status">
              تم إرسال رابط التأكيد إلى بريدك — تحقق من صندوق الوارد لتفعيل حسابك
            </p>
          )}

          {error && (
            <p className="font-cairo font-light" style={errorStyle} role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={handleGoogle}
            className="font-cairo font-bold w-full flex items-center justify-center gap-2 glass-card-light"
            style={{
              borderRadius: 999,
              padding: 14,
              fontSize: 15,
              color: "hsl(var(--foreground))",
              cursor: busy ? "not-allowed" : "pointer",
              height: 48,
              opacity: busy ? 0.7 : 1,
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

          <form className="flex flex-col gap-3" onSubmit={handleEmailSubmit}>
            <input
              style={inputStyle}
              placeholder="البريد الإلكتروني"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
            <div className="relative">
              <input
                style={inputStyle}
                placeholder="كلمة المرور"
                type={showPw ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute top-1/2 -translate-y-1/2" style={{ left: 14, background: "none", border: "none", cursor: "pointer", minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {showPw ? <EyeOff size={18} color="hsl(var(--muted-foreground))" /> : <Eye size={18} color="hsl(var(--muted-foreground))" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="font-cairo font-bold text-white w-full"
              style={{
                background: "hsl(var(--primary))",
                border: "none",
                borderRadius: 999,
                padding: "14px 0",
                fontSize: 15,
                cursor: busy ? "not-allowed" : "pointer",
                marginTop: 8,
                height: 50,
                opacity: busy ? 0.85 : 1,
              }}
            >
              {loading ? "جاري التحميل..." : submitLabel}
            </button>
          </form>

          <p className="font-cairo font-light text-center" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 20 }}>
            {mode === "login" ? (
              <>
                ما عندك حساب؟{" "}
                <button type="button" onClick={() => { setMode("signup"); setError(null); }} className="font-cairo font-bold" style={{ background: "none", border: "none", color: "hsl(var(--primary))", cursor: "pointer", fontSize: 13, minHeight: 44 }}>
                  حساب جديد
                </button>
              </>
            ) : (
              <>
                عندك حساب؟{" "}
                <button type="button" onClick={() => { setMode("login"); setError(null); }} className="font-cairo font-bold" style={{ background: "none", border: "none", color: "hsl(var(--primary))", cursor: "pointer", fontSize: 13, minHeight: 44 }}>
                  سجل دخول
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .login-card { padding: 32px 28px !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
