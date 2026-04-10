import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  MessageSquare,
  Gauge,
  AlertCircle,
  PauseCircle,
  XCircle,
  Zap,
  Target,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useSessionContext } from "@/contexts/SessionContext";
import type { SessionResult } from "@/types/session";
import { useAuth } from "@/contexts/AuthContext";

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


const METRIC_INFO: Record<string, string> = {
  المدة: "مدة حديثك الفعلي مقارنة بوقت الجلسة الكامل",
  الكلمات: "عدد الكلمات اللي قلتها خلال الجلسة",
  السرعة: "معدل كلماتك في الدقيقة — المثالي بين 110 و 150",
  الحشو: "الكلمات اللي تعبئ الفراغ بدون معنى مثل يعني وبصراحة",
  "أطول توقف": "أطول فترة سكوت خلال حديثك — فوق 3 ثواني يأثر على انسيابيتك",
  الممنوعة: "عدد الكلمات الممنوعة اللي استخدمتها في هذا التحدي",
};


const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = useMemo(() => searchParams.get("session"), [searchParams]);
  const { isLoggedIn } = useAuth();
  const { latestSession, loadSessionById } = useSessionContext();

  const [session, setSession] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

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
    const handler = (e: MouseEvent) => {
      if (!openTooltip) return;
      const target = e.target as HTMLElement;
      if (!target.closest("[data-tooltip-trigger]")) setOpenTooltip(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openTooltip]);

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

          <p className="font-cairo" style={{ fontSize: 12, fontWeight: 300, color: "#9090A8", marginBottom: 6 }}>
            معدل تدفق الكلام
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

        <div
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
            borderRadius: 20,
            padding: 20,
            marginTop: 12,
            marginBottom: 16,
          }}
        >
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
              النص الكامل
            </span>
            <ChevronDown
              size={18}
              color="#9090A8"
              style={{ transform: showTranscript ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
            />
          </button>

          {showTranscript && (
            <div style={{ marginTop: 16 }}>
              <p className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E", marginBottom: 12 }}>
                {session.topic}
              </p>
              <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", lineHeight: 1.8 }}>
                {session.transcript || "لا يوجد نص متاح"}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "28px 0 12px" }}>
          <span className="font-cairo" style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>
            ملاحظات المدرب
          </span>
        </div>

        {session.coachingNotes ? (
          <div>
            {/* Score badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span
                className="font-cairo font-bold"
                style={{
                  background: "rgba(108,99,255,0.12)",
                  color: "#6C63FF",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  border: "1px solid rgba(108,99,255,0.25)",
                }}
              >
                الصلة بالسؤال {session.coachingNotes.relevancyScore}٪
              </span>
              <span
                className="font-cairo font-bold"
                style={{
                  background: "rgba(93,190,138,0.12)",
                  color: "#5DBE8A",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  border: "1px solid rgba(93,190,138,0.25)",
                }}
              >
                جودة الإجابة {session.coachingNotes.answerQualityScore}٪
              </span>
            </div>

            {/* Overall feedback */}
            <div className="glass-card-light" style={{ borderRadius: 16, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(108,99,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={16} color="#6C63FF" />
                </div>
                <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
                  تقييم المدرب
                </span>
              </div>
              <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", margin: 0, lineHeight: 1.7 }}>
                {session.coachingNotes.coachingFeedback}
              </p>
            </div>

            {/* Strengths */}
            {session.coachingNotes.strengths.length > 0 && (
              <div className="glass-card-light" style={{ borderRadius: 16, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(93,190,138,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle size={16} color="#5DBE8A" />
                  </div>
                  <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
                    وش سويت صح
                  </span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {session.coachingNotes.strengths.map((s, i) => (
                    <li key={i} className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", paddingRight: 12, borderRight: "2px solid #5DBE8A" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {session.coachingNotes.improvements.length > 0 && (
              <div className="glass-card-light" style={{ borderRadius: 16, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={16} color="#F59E0B" />
                  </div>
                  <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
                    وش تحسّن الجلسة الجاية
                  </span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {session.coachingNotes.improvements.map((s, i) => (
                    <li key={i} className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", paddingRight: 12, borderRight: "2px solid #F59E0B" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card-light" style={{ borderRadius: 16, padding: 20 }}>
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", margin: 0, textAlign: "center" }}>
              تحليل المدرب غير متاح لهذه الجلسة
            </p>
          </div>
        )}

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

