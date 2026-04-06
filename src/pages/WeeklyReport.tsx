import { useEffect, useState } from "react";
import { ArrowUp, Lock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProGateModal from "@/components/ProGateModal";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type SessionRow = {
  flow_score: number;
  filler_count: number;
  forbidden_used: number;
  duration: number;
  created_at: string;
};

type WeekStats = {
  sessionCount: number;
  avgFlowScore: number;
  avgFillers: number;
  avgDuration: number;
};

const WeeklyReport = () => {
  const { session } = useAuth();
  const [proModal, setProModal] = useState(false);
  const [stats, setStats] = useState<WeekStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await supabase
          .from("sessions")
          .select("flow_score, filler_count, forbidden_used, duration, created_at")
          .eq("user_id", session.user.id)
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: false });

        if (error) {
          console.log("[MLASOON] weekly report load error:", error.message);
          setLoading(false);
          return;
        }

        const rows = (data ?? []) as SessionRow[];
        const count = rows.length;

        if (count === 0) {
          setStats({ sessionCount: 0, avgFlowScore: 0, avgFillers: 0, avgDuration: 0 });
        } else {
          const avgFlow = Math.round(rows.reduce((s, r) => s + r.flow_score, 0) / count);
          const avgFill = rows.reduce((s, r) => s + r.filler_count, 0) / count;
          const avgDur = Math.round(rows.reduce((s, r) => s + r.duration, 0) / count);
          setStats({ sessionCount: count, avgFlowScore: avgFlow, avgFillers: avgFill, avgDuration: avgDur });
        }
        console.log("[MLASOON] weekly stats loaded, sessions:", count);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON] weekly report error:", message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.user?.id]);

  const hasData = stats !== null && stats.sessionCount > 0;

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <BackButton variant="light" />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-8%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 4 }}>تقريرك الأسبوعي</h1>
        <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>آخر ٧ أيام</p>

        {loading ? (
          <div className="flex justify-center" style={{ paddingTop: 48 }}>
            <Loader2 size={28} color="hsl(var(--primary))" className="animate-spin" />
          </div>
        ) : !hasData ? (
          <div className="glass-card-light" style={{ padding: 24, textAlign: "center" }}>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
              لا توجد جلسات هذا الأسبوع — ابدأ تحدياً الآن
            </p>
          </div>
        ) : (
          <>
            <div className="glass-card-light" style={{ padding: 24, marginBottom: 24 }}>
              <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--success))", marginBottom: 16 }}>ملخص الأسبوع</p>
              {[
                { text: `${stats.sessionCount} جلسة مكتملة` },
                { text: `متوسط نقاط التدفق: ${stats.avgFlowScore}` },
                { text: `متوسط كلمات الحشو: ${stats.avgFillers.toFixed(1)} في الجلسة` },
                { text: `متوسط المدة: ${stats.avgDuration} ثانية` },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                  <ArrowUp size={14} color="hsl(var(--success))" />
                  <span className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--foreground))" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
              <div className="glass-card-light" style={{ filter: "blur(5px)", padding: 24 }}>
                <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))" }}>وش تركز عليه الأسبوع الجاي</p>
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>ركز على تقليل فترات السكوت</p>
                <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>حاول تتكلم بدون يعني</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Lock size={20} color="hsl(var(--primary-soft))" />
                <button
                  type="button"
                  onClick={() => setProModal(true)}
                  className="font-cairo font-bold text-white"
                  style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 13, cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)", minHeight: 44 }}
                >
                  افتح التحليل الكامل
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyReport;
