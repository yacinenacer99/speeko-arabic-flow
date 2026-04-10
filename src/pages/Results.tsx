import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  Clock,
  MessageSquare,
  Gauge,
  AlertCircle,
  PauseCircle,
  XCircle,
  Zap,
  Target,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useSessionContext } from "@/contexts/SessionContext";
import type { AnalysisResult, SessionResult } from "@/types/session";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const safeNum = (n: unknown, fallback = 0): number =>
  (typeof n === "number" && Number.isFinite(n)) ? n : fallback;

function getScoreDescription(score: number): string {
  if (score >= 90) return "أداء استثنائي — أنت متحدث محترف";
  if (score >= 75) return "جلسة ممتازة — في طريقك للتقدم";
  if (score >= 60) return "أداء جيد — استمر بالتدريب";
  if (score >= 40) return "بداية جيدة — ركز على التدفق";
  return "لا بأس — كل متحدث بدأ من هنا";
}

function getMetricColor(metricName: string, value: number): string {
  if (metricName === "fillerCount") {
    if (value === 0) return "#5DBE8A";
    if (value <= 3) return "#F59E0B";
    return "#FF6B6B";
  }
  if (metricName === "longestPause") {
    return value <= 3 ? "#5DBE8A" : "#F59E0B";
  }
  if (metricName === "forbiddenUsed") {
    return value === 0 ? "#5DBE8A" : "#FF6B6B";
  }
  if (metricName === "pace") {
    return value >= 110 && value <= 150 ? "#5DBE8A" : "#F59E0B";
  }
  if (metricName === "flowScore") {
    if (value >= 75) return "#5DBE8A";
    if (value >= 40) return "#F59E0B";
    return "#FF6B6B";
  }
  return "#1A1A2E";
}

const COACHING_ITEMS = [
  {
    title: "وش سويت صح",
    body: "هذا المحتوى متاح لمشتركي برو — افتح التحليل الكامل لمعرفة التفاصيل",
    Icon: CheckCircle,
    bg: "rgba(93,190,138,0.1)",
  },
  {
    title: "وين تعثرت",
    body: "هذا المحتوى متاح لمشتركي برو — افتح التحليل الكامل لمعرفة التفاصيل",
    Icon: Zap,
    bg: "rgba(245,158,11,0.1)",
  },
  {
    title: "وش تركز عليه الجلسة الجاية",
    body: "هذا المحتوى متاح لمشتركي برو — افتح التحليل الكامل لمعرفة التفاصيل",
    Icon: Target,
    bg: "rgba(255,107,107,0.1)",
  },
] as const;

const METRIC_INFO: Record<string, string> = {
  المدة: "مدة حديثك الفعلي مقارنة بوقت الجلسة الكامل",
  الكلمات: "عدد الكلمات اللي قلتها خلال الجلسة",
  السرعة: "معدل كلماتك في الدقيقة — المثالي بين 110 و 150",
  الحشو: "الكلمات اللي تعبئ الفراغ بدون معنى مثل يعني وبصراحة",
  "أطول توقف": "أطول فترة سكوت خلال حديثك — فوق 3 ثواني يأثر على انسيابيتك",
  الممنوعة: "عدد الكلمات الممنوعة اللي استخدمتها في هذا التحدي",
};

type CoachingDisplayItem = {
  title: string;
  body: string;
  Icon: LucideIcon;
  bg: string;
};

function buildProCoaching(analysis: AnalysisResult): CoachingDisplayItem[] {
  const flow = analysis.flowScore;
  const filler = analysis.fillerCount;
  const pause = analysis.longestPause;
  const forbidden = Array.isArray(analysis.forbiddenUsed) ? analysis.forbiddenUsed.length : 0;

  const strengths: string[] = [];
  if (flow >= 70) strengths.push("نقاط التدفق قوية وثابتة.");
  if (filler <= 2) strengths.push("استخدام قليل لكلمات الحشو.");
  if (pause <= 3) strengths.push("انسيابية جيدة مع غياب توقفات طويلة.");
  if (forbidden === 0) strengths.push("احترام قواعد الكلمات الممنوعة في الموضوع.");
  if (strengths.length === 0) {
    strengths.push("أكملت الجلسة بثبات — الاستمرار يبني الثقة.");
  }

  const struggles: string[] = [];
  if (filler > 4) struggles.push("كلمات الحشو تحتاج تقليلاً تدريجياً.");
  if (pause > 3) struggles.push("فترات الصمت الطويلة تؤثر على الإيقاع.");
  if (forbidden > 0) struggles.push("راجع استخدام الكلمات الممنوعة في السؤال.");
  if (flow < 55) struggles.push("التركيز على طلاقة الأفكار يعزز النتيجة.");
  if (struggles.length === 0) {
    struggles.push("لا تعثّر واضح — راقب التفاصيل في الجلسة القادمة.");
  }

  let nextFocus = "ركّز على تقسيم الفكرة إلى جمل قصيرة واضحة.";
  if (filler > 3) nextFocus = "تدرب على التوقف بدل الحشو بين الجمل.";
  else if (pause > 3) nextFocus = "اختصر الثواني بين الأفكار بربط عبارات بسيطة.";
  else if (forbidden > 0) nextFocus = "خطط لبدائل قبل التحدي لتجنب الكلمات الممنوعة.";

  return [
    { title: "وش سويت صح", body: strengths.join(" "), Icon: CheckCircle, bg: "rgba(93,190,138,0.1)" },
    { title: "وين تعثرت", body: struggles.join(" "), Icon: Zap, bg: "rgba(245,158,11,0.1)" },
    { title: "وش تركز عليه الجلسة الجاية", body: nextFocus, Icon: Target, bg: "rgba(255,107,107,0.1)" },
  ];
}

const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = useMemo(() => searchParams.get("session"), [searchParams]);
  const { isLoggedIn, session: authSession } = useAuth();
  const { latestSession, loadSessionById } = useSessionContext();

  const [session, setSession] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (sessionIdFromUrl) {
        setLoading(true);
        setLoadError(false);
        const loaded = await loadSessionById(sessionIdFromUrl);
        if (cancelled) return;
        if (!loaded) {
          setLoadError(true);
          setLoading(false);
          return;
        }
        setSession(loaded);
        setLoading(false);
        return;
      }

      if (latestSession) {
        setSession(latestSession);
        setLoading(false);
        setLoadError(false);
        return;
      }

      setLoading(false);
      navigate("/home", { replace: true });
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionIdFromUrl, latestSession, loadSessionById, navigate]);

  useEffect(() => {
    if (!session || sessionIdFromUrl) return;
    let timer: number | undefined;
    if (session.stageAdvancement?.advanced === true) {
      timer = window.setTimeout(() => {
        navigate("/level-up", {
          state: {
            newStage: session.stageAdvancement.newStage,
            newStageName: session.stageAdvancement.newStageName,
          },
        });
      }, 2000);
    } else if (session.streakLost === true) {
      timer = window.setTimeout(() => {
        navigate("/streak-lost", {
          state: { prevStreak: session.previousStreak },
        });
      }, 2000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [session, sessionIdFromUrl, navigate]);

  useEffect(() => {
    if (!authSession?.user?.id) {
      setUserPlan("free");
      return;
    }
    void supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", authSession.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.log("[MLASOON] subscriptions load error:", error.message);
          setUserPlan("free");
          return;
        }
        if (data?.plan === "pro") setUserPlan("pro");
        else setUserPlan("free");
      });
  }, [authSession?.user?.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!openTooltip) return;
      const target = e.target as HTMLElement;
      if (!target.closest("[data-tooltip-trigger]")) setOpenTooltip(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openTooltip]);

  const coachingItems: CoachingDisplayItem[] = useMemo(() => {
    if (userPlan === "pro" && session) {
      return buildProCoaching(session.analysis);
    }
    return COACHING_ITEMS.map((item) => ({
      title: item.title,
      body: item.body,
      Icon: item.Icon,
      bg: item.bg,
    }));
  }, [userPlan, session]);

  const formatDuration = (seconds: number): string => {
    const s = Math.max(0, Math.round(safeNum(seconds)));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, "0")}`;
  };

  const handleShare = async () => {
    const score = session ? safeNum(session.analysis.flowScore) : 0;
    const text = `حصلت على ${score}/100 في ملسون — دوّر قدرتك على الكلام 🎙`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // user dismissed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      console.log("[MLASOON] clipboard write failed");
    }
  };

  if (loadError) {
    return (
      <div className="relative" style={{ minHeight: "100dvh", backgroundColor: "#F5F4F0", direction: "rtl" }}>
        <Navbar />
        <div className="page-narrow" style={{ paddingTop: 80 }}>
          <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            لم نستطع تحميل النتيجة الأخيرة
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="font-cairo font-bold"
              style={{
                background: "hsl(var(--primary))",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 14,
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              رجوع للصفحة الرئيسية
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session || loading) {
    return (
      <div className="relative" style={{ minHeight: "100dvh", backgroundColor: "#F5F4F0", direction: "rtl" }}>
        <Navbar />
        <div className="page-narrow" style={{ paddingTop: 80 }}>
          <div className="animate-pulse glass-card-light" style={{ padding: 24, marginBottom: 16, minHeight: 160 }} />
          <div className="animate-pulse glass-card-light" style={{ padding: 24, minHeight: 220 }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session.analysis) {
    return (
      <div className="relative" style={{ minHeight: "100dvh", backgroundColor: "#F5F4F0", direction: "rtl" }}>
        <Navbar />
        <div className="page-narrow" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", textAlign: "center", marginBottom: 16 }}>
              لا توجد بيانات للجلسة
            </p>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="font-cairo font-bold"
              style={{
                background: "#6C63FF",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 14,
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const flowScore = safeNum(session.analysis.flowScore);
  const speakingDuration = safeNum(session.analysis.speakingDuration);
  const wordCount = safeNum(session.analysis.wordCount);
  const pace = safeNum(session.analysis.pace);
  const fillerCount = safeNum(session.analysis.fillerCount);
  const longestPause = safeNum(session.analysis.longestPause);
  const forbiddenUsedCount = Array.isArray(session.analysis.forbiddenUsed)
    ? session.analysis.forbiddenUsed.length
    : 0;

  const forbiddenLabel =
    forbiddenUsedCount === 0
      ? "لا كلمات ممنوعة"
      : forbiddenUsedCount === 1
      ? "كلمة ممنوعة واحدة"
      : `${forbiddenUsedCount} كلمات ممنوعة`;

  const metrics = [
    { icon: Clock, label: "المدة", value: `${formatDuration(speakingDuration)} / 1:00`, color: getMetricColor("duration", speakingDuration) },
    { icon: MessageSquare, label: "الكلمات", value: `${wordCount} كلمة`, color: getMetricColor("wordCount", wordCount) },
    { icon: Gauge, label: "السرعة", value: `${pace} ك/د`, color: getMetricColor("pace", pace) },
    { icon: AlertCircle, label: "الحشو", value: `${fillerCount}`, color: getMetricColor("fillerCount", fillerCount) },
    { icon: PauseCircle, label: "أطول توقف", value: `${safeNum(longestPause).toFixed(1)} ث`, color: getMetricColor("longestPause", longestPause) },
    { icon: XCircle, label: "الممنوعة", value: forbiddenLabel, color: getMetricColor("forbiddenUsed", forbiddenUsedCount) },
  ] as const;

  return (
    <div
      className="relative"
      style={{
        minHeight: "100dvh",
        background: "#F5F4F0",
        direction: "rtl",
        paddingBottom: 150,
      }}
    >
      <Navbar />
      <BackButton variant="light" />
      <div className="page-narrow" style={{ paddingTop: 80 }}>
        {session.stageAdvancement?.advanced === true && (
          <div
            style={{
              background: "rgba(108,99,255,0.1)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            <span className="font-cairo font-bold" style={{ fontSize: 16, color: "#6C63FF" }}>
              ترقيت! أنت الآن {session.stageAdvancement.newStageName ?? ""}
            </span>
          </div>
        )}

        <div style={{ textAlign: "center", paddingTop: 12 }}>
          <p className="font-cairo" style={{ fontSize: 13, fontWeight: 300, color: "#9090A8", marginBottom: 16 }}>
            {session.topic || "جلسة تدريبية"}
          </p>

          <div style={{ marginBottom: 8 }}>
            <span className="font-cairo" style={{ fontSize: 48, fontWeight: 700, color: getMetricColor("flowScore", flowScore), lineHeight: 1 }}>
              {flowScore}
            </span>
            <span className="font-cairo" style={{ fontSize: 18, fontWeight: 300, color: "#9090A8" }}>
              /100
            </span>
          </div>

          <p className="font-cairo" style={{ fontSize: 14, fontWeight: 300, color: "#9090A8", textAlign: "center", marginBottom: 24 }}>
            {getScoreDescription(flowScore)}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {metrics.map((m) => {
            const IconComp = m.icon;
            return (
              <div
                key={m.label}
                className="glass-card-light"
                style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, minHeight: 90 }}
              >
                <IconComp size={15} color="#9090A8" />

                <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
                  <span className="font-cairo" style={{ fontSize: 11, fontWeight: 300, color: "#9090A8" }}>
                    {m.label}
                  </span>
                  <div
                    data-tooltip-trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTooltip(openTooltip === m.label ? null : m.label);
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", minHeight: 44, minWidth: 44, justifyContent: "center" }}
                  >
                    <AlertCircle size={13} color="#9090A8" />
                  </div>

                  <div
                    className="glass-card-dark"
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 8px)",
                      right: 0,
                      padding: "10px 14px",
                      maxWidth: 200,
                      zIndex: 50,
                      opacity: openTooltip === m.label ? 1 : 0,
                      transform: openTooltip === m.label ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                      pointerEvents: openTooltip === m.label ? "auto" : "none",
                      borderRadius: 12,
                    }}
                  >
                    <p className="font-cairo" style={{ fontSize: 12, fontWeight: 300, color: "white", lineHeight: 1.5, margin: 0 }}>
                      {METRIC_INFO[m.label]}
                    </p>
                  </div>
                </div>

                <span className="font-cairo" style={{ fontSize: 20, fontWeight: 700, color: m.color }}>
                  {m.value}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: 20, marginTop: 20 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E", marginBottom: 12 }}>
            الكلمات الممنوعة التي قلتها
          </p>
          {session.analysis.forbiddenUsed.length === 0 ? (
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#5DBE8A", margin: 0 }}>
              ممتاز — لم تستخدم أي كلمة ممنوعة
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {session.analysis.forbiddenUsed.map((word) => (
                <span
                  key={word}
                  className="font-cairo font-bold"
                  style={{
                    background: "rgba(255,107,107,0.15)",
                    color: "#FF6B6B",
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 13,
                    border: "1px solid rgba(255,107,107,0.3)",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          )}

          <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "16px 0" }} />

          <p className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E", marginBottom: 12 }}>
            كلمات الحشو
          </p>
          {fillerCount === 0 ? (
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#5DBE8A", margin: 0 }}>
              رائع — لا كلمات حشو
            </p>
          ) : (
            <>
              <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", marginBottom: 10 }}>
                المجموع: {fillerCount}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {session.analysis.fillerWords.map((fw) => (
                  <span
                    key={fw.word}
                    className="font-cairo font-bold"
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "#F59E0B",
                      borderRadius: 999,
                      padding: "4px 12px",
                      fontSize: 13,
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  >
                    {fw.word} ({fw.count})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "28px 0 12px" }}>
          <span className="font-cairo" style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>
            ملاحظات المدرب
          </span>
        </div>

        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              filter: userPlan !== "pro" ? "blur(5px)" : "none",
              WebkitFilter: userPlan !== "pro" ? "blur(5px)" : "none",
              pointerEvents: userPlan !== "pro" ? "none" : "auto",
            }}
          >
            {coachingItems.map((item) => (
              <div key={item.title} className="glass-card-light" style={{ borderRadius: 16, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.Icon size={16} color="#1A1A2E" />
                  </div>
                  <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
                    {item.title}
                  </span>
                </div>
                <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {userPlan !== "pro" && (
            <div
              onClick={() => navigate("/subscribe")}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "rgba(245,244,240,0.3)",
                pointerEvents: "auto",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              <Lock size={28} color="#9090A8" />
              <span className="font-cairo font-bold" style={{ marginTop: 8, fontSize: 15, color: "#6C63FF" }}>
                افتح التحليل الكامل
              </span>
              <span className="font-cairo font-light" style={{ marginTop: 4, fontSize: 12, color: "#9090A8" }}>
                اشترك في برو
              </span>
            </div>
          )}
        </div>

        <div style={{ height: 100 }} />
        <Footer />
      </div>

      {/* Fixed bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, #F5F4F0 80%, transparent)",
          padding: "24px 16px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-cairo"
              style={{
                width: "100%",
                background: "#6C63FF",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 999,
                padding: "16px 32px",
                border: "none",
                cursor: "pointer",
                minHeight: 52,
              }}
            >
              سجل حسابك لحفظ نتيجتك
            </button>
          ) : session.streakCount === 1 ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/onboarding")}
                className="font-cairo"
                style={{
                  width: "100%",
                  background: "#6C63FF",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: "16px 32px",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 52,
                }}
              >
                ابدأ رحلة التعلم
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="font-cairo font-light"
                style={{ fontSize: 13, color: "#9090A8", background: "none", border: "none", cursor: "pointer", minHeight: 44 }}
              >
                تخطي
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/challenge")}
                className="font-cairo"
                style={{
                  width: "100%",
                  background: "#6C63FF",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: "16px 32px",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 52,
                }}
              >
                تدرب مرة ثانية
              </button>
              <button
                type="button"
                onClick={() => void handleShare()}
                className="font-cairo font-light"
                style={{ fontSize: 13, color: "#9090A8", background: "none", border: "none", cursor: "pointer", minHeight: 44 }}
              >
                {shareCopied ? "تم النسخ!" : "شارك نتيجتك"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;

