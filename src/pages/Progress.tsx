import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProGateModal from "@/components/ProGateModal";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type ProgressRow = {
  stage: number | null;
  xp: number | null;
  streak: number | null;
  last_session_date: string | null;
};

type RecentSessionRow = {
  id: string;
  topic: string | null;
  flow_score: number | null;
  filler_count: number | null;
  created_at: string | null;
};

function formatRelativeSessionDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startToday.getTime() - startThat.getTime()) / 86400000);
  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays === 2) return "قبل يومين";
  return d.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
}

function shortWeekdayLabel(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ar-SA", { weekday: "short" });
}

const Progress = () => {
  const { session } = useAuth();
  const [proModal, setProModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressRow | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSessionRow[]>([]);
  const [totalSessionCount, setTotalSessionCount] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const [{ data: progress }, { data: sessions }, { count }, { data: sub }] = await Promise.all([
          supabase
            .from("progress")
            .select("stage, xp, streak, last_session_date")
            .eq("user_id", session.user.id)
            .maybeSingle(),
          supabase
            .from("sessions")
            .select("id, topic, flow_score, filler_count, created_at")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("sessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session.user.id),
          supabase
            .from("subscriptions")
            .select("plan")
            .eq("user_id", session.user.id)
            .maybeSingle(),
        ]);

        if (cancelled) return;
        if (progress) setProgressData(progress as ProgressRow);
        if (sessions) setRecentSessions(sessions as RecentSessionRow[]);
        setTotalSessionCount(count ?? 0);
        setUserPlan((sub as { plan: string } | null)?.plan === "pro" ? "pro" : "free");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON] progress load error:", message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const chartSessions = [...recentSessions].slice(0, 7).reverse();
  const chartValues = chartSessions.map((s) => (typeof s.flow_score === "number" ? s.flow_score : 0));
  const maxVal = Math.max(...chartValues, 1);

  const avgFlow =
    recentSessions.length > 0
      ? Math.round(
          recentSessions.reduce((acc, s) => acc + (typeof s.flow_score === "number" ? s.flow_score : 0), 0) /
            recentSessions.length,
        )
      : null;

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <BackButton variant="light" />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "20%", left: "-5%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>
          تقدمي
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center glass-card-light" style={{ padding: 48, borderRadius: 16 }}>
            <Loader2 size={32} color="hsl(var(--primary))" className="animate-spin" />
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 12 }}>
              جارٍ التحميل
            </p>
          </div>
        ) : (
          <>
            {/* Chart card */}
            <div className="glass-card-light progress-chart" style={{ padding: 16, marginBottom: 16 }}>
              <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))" }}>
                نقاط التدفق
              </p>
              <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 16 }}>
                آخر {chartSessions.length > 0 ? chartSessions.length : 7} جلسات
              </p>
              {chartSessions.length === 0 ? (
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", textAlign: "center", padding: "48px 16px" }}>
                  لم تُكمل أي جلسة بعد — ابدأ أول تحدي من الصفحة الرئيسية
                </p>
              ) : (
                <div className="flex items-end justify-between" style={{ height: 200, gap: 8 }}>
                  {chartSessions.map((s) => {
                    const val = typeof s.flow_score === "number" ? s.flow_score : 0;
                    return (
                      <div key={s.id} className="flex flex-col items-center flex-1 gap-1">
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 32,
                            height: `${(val / maxVal) * 100}%`,
                            minHeight: val > 0 ? 8 : 0,
                            background: "linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-soft)))",
                            borderRadius: 6,
                            transition: "height 0.3s ease",
                          }}
                        />
                        <span className="font-cairo font-light" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>
                          {shortWeekdayLabel(s.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-3" style={{ marginBottom: 24 }}>
              {[
                { value: avgFlow !== null ? String(avgFlow) : "—", label: "متوسط النقاط" },
                {
                  value: progressData?.streak !== null && progressData?.streak !== undefined ? String(progressData.streak) : "—",
                  label: "السترك",
                },
                { value: String(totalSessionCount), label: "إجمالي الجلسات" },
              ].map((row) => (
                <div key={row.label} className="flex-1 flex flex-col items-center glass-card-light" style={{ padding: 14 }}>
                  <span className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--primary-soft))" }}>
                    {row.value}
                  </span>
                  <span className="font-cairo font-light" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Session history */}
            <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 12 }}>
              جلساتي
            </h2>
            {recentSessions.length === 0 ? (
              <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>
                لم تُكمل أي جلسة بعد — ابدأ أول تحدي من الصفحة الرئيسية
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between glass-card-light" style={{ padding: 14 }}>
                    <div>
                      <p className="font-cairo font-bold" style={{ fontSize: 14, color: "hsl(var(--foreground))" }}>
                        {s.topic ?? "—"}
                      </p>
                      <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                        {formatRelativeSessionDate(s.created_at)}
                      </p>
                    </div>
                    <span
                      className="font-cairo font-bold flex items-center justify-center"
                      style={{
                        fontSize: 14,
                        color: "hsl(var(--primary))",
                        background: "rgba(108,99,255,0.1)",
                        borderRadius: 999,
                        padding: "4px 12px",
                        minWidth: 36,
                        minHeight: 36,
                      }}
                    >
                      {typeof s.flow_score === "number" ? s.flow_score : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Weak points (pro) */}
            <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginTop: 32, marginBottom: 12 }}>
              نقاط ضعفك
            </h2>
            <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
              <div className="glass-card-light" style={{ filter: userPlan === "free" ? "blur(5px)" : "none", padding: 16 }}>
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
                  كلمات الحشو الأكثر استخداماً
                </p>
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
                  متوسط فترات السكوت
                </p>
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
                  الكلمات الممنوعة المتكررة
                </p>
              </div>
              {userPlan === "free" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Lock size={20} color="hsl(var(--primary-soft))" />
                  <button
                    type="button"
                    onClick={() => setProModal(true)}
                    className="font-cairo font-bold text-white"
                    style={{
                      background: "hsl(var(--primary))",
                      border: "none",
                      borderRadius: 999,
                      padding: "10px 24px",
                      fontSize: 13,
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(108,99,255,0.4)",
                      minHeight: 44,
                    }}
                  >
                    افتح التحليل الكامل
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .progress-chart { height: 280px; padding: 24px !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Progress;
