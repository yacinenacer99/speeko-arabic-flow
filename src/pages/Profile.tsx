import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Mic, Flame, Sparkles, Award, Diamond, Trophy, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";

type UserRow = {
  name: string | null;
  goal: string | null;
  level: string | null;
};

type ProgressRow = {
  stage: number | null;
  xp: number | null;
  streak: number | null;
};

const badges = [
  { name: "أول جلسة", Icon: Mic },
  { name: "7 أيام", Icon: Flame },
  { name: "صفر حشو", Icon: Sparkles },
  { name: "أسبوع نظيف", Icon: Diamond },
  { name: "مبدع", Icon: Award },
  { name: "ملتزم", Icon: Trophy },
];

const menuItems = [
  { label: "الإعدادات", path: "/settings" },
  { label: "الاشتراك", path: "/subscribe" },
  { label: "تواصل معنا", path: "/contact" },
];

function nextXpMilestone(xp: number): number {
  const step = 100;
  return Math.floor(xp / step) * step + step;
}

const Profile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [progressData, setProgressData] = useState<ProgressRow | null>(null);
  const [sessionCount, setSessionCount] = useState<number>(0);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const [{ data: userDataRes }, { data: progressDataRes }, { count }] = await Promise.all([
          supabase.from("users").select("name, goal, level").eq("id", session.user.id).maybeSingle(),
          supabase.from("progress").select("stage, xp, streak").eq("user_id", session.user.id).maybeSingle(),
          supabase.from("sessions").select("id", { count: "exact", head: true }).eq("user_id", session.user.id),
        ]);

        if (cancelled) return;
        if (userDataRes) setUserData(userDataRes as UserRow);
        if (progressDataRes) setProgressData(progressDataRes as ProgressRow);
        setSessionCount(count ?? 0);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON] profile load error:", message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName = userData?.name?.trim() || "";
  const avatarLetter = displayName.length > 0 ? displayName.charAt(0) : "";
  const xp = typeof progressData?.xp === "number" ? progressData.xp : 0;
  const nextGoal = nextXpMilestone(xp);
  const xpBarPct = nextGoal > 0 ? Math.min(100, (xp / nextGoal) * 100) : 0;
  const stageLabel =
    typeof progressData?.stage === "number" ? `مرحلة ${progressData.stage}` : progressData?.stage != null ? String(progressData.stage) : "";
  const badgeSubtitle = userData?.level?.trim() || userData?.goal?.trim() || "";

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <BackButton variant="light" />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: 48 }}>
            <Loader2 size={32} color="hsl(var(--primary))" className="animate-spin" />
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 12 }}>
              جارٍ التحميل
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col items-center" style={{ marginBottom: 32 }}>
              <div
                className="flex items-center justify-center profile-avatar"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-soft)))",
                  marginBottom: 12,
                }}
              >
                <span className="font-cairo font-bold text-white" style={{ fontSize: 28 }}>
                  {avatarLetter}
                </span>
              </div>
              <p className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--foreground))" }}>
                {displayName}
              </p>
              {(stageLabel || badgeSubtitle) && (
                <span
                  className="font-cairo font-bold"
                  style={{
                    fontSize: 12,
                    color: "hsl(var(--primary))",
                    background: "rgba(108,99,255,0.1)",
                    borderRadius: 999,
                    padding: "4px 14px",
                    marginTop: 8,
                  }}
                >
                  {stageLabel || badgeSubtitle}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-3" style={{ marginBottom: 24 }}>
              {[
                { value: String(sessionCount), label: "الجلسات" },
                { value: String(0), label: "الشارات" },
                {
                  value:
                    progressData?.streak !== null && progressData?.streak !== undefined ? String(progressData.streak) : "—",
                  label: "السترك",
                },
              ].map((s) => (
                <div key={s.label} className="flex-1 flex flex-col items-center glass-card-light" style={{ padding: 14 }}>
                  <span className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--primary-soft))" }}>
                    {s.value}
                  </span>
                  <span className="font-cairo font-light" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* XP bar */}
            <div className="glass-card-light" style={{ padding: 16, marginBottom: 24 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                  {xp} / {nextGoal} نقاط الخبرة للمرحلة التالية
                </span>
              </div>
              <div style={{ background: "hsl(var(--border))", borderRadius: 999, height: 8 }}>
                <div
                  style={{
                    background: "hsl(var(--primary))",
                    borderRadius: 999,
                    height: 8,
                    width: `${xpBarPct}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Badges */}
            <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 12 }}>
              إنجازاتي
            </h2>
            <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
              {badges.map((b) => (
                <div
                  key={b.name}
                  className="flex flex-col items-center text-center glass-card-light"
                  style={{ padding: 16, opacity: 0.45, position: "relative" }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(144,144,168,0.1)" }}
                  >
                    <b.Icon size={20} color="hsl(var(--muted-foreground))" />
                  </div>
                  <p className="font-cairo font-bold" style={{ fontSize: 10, color: "hsl(var(--foreground))", marginTop: 6 }}>
                    {b.name}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: 20 }}>
                    <Lock size={16} color="hsl(var(--muted-foreground))" />
                  </div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div className="glass-card-light" style={{ overflow: "hidden", marginBottom: 12, padding: 0 }}>
              {menuItems.map((item, i) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between w-full font-cairo font-light"
                  style={{
                    padding: "14px 16px",
                    fontSize: 14,
                    color: "hsl(var(--foreground))",
                    background: "none",
                    border: "none",
                    borderBottom: i < menuItems.length - 1 ? "1px solid hsl(var(--border))" : "none",
                    cursor: "pointer",
                    minHeight: 44,
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronLeft size={16} color="hsl(var(--muted-foreground))" />
                </button>
              ))}
            </div>

            <div className="glass-card-light" style={{ overflow: "hidden", padding: 0 }}>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full font-cairo font-light"
                style={{
                  padding: "14px 16px",
                  fontSize: 14,
                  color: "#FF6B6B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  minHeight: 44,
                }}
              >
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .profile-avatar { width: 80px !important; height: 80px !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Profile;
