import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Flame, Mic, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestMap from "@/components/QuestMap";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  upsertUserProfile,
  defaultSignupProfile,
  PENDING_ONBOARDING_KEY,
} from "@/lib/userProfile";
import { STAGE_NODES, getDailyChallengeForStage } from "@/lib/stageContent";

type HomeData = {
  userName: string | null;
  level: string;
  stage: number;
  xp: number;
  streak: number;
  stageProgressCount: number;
  stageProgressRequired: number;
  plan: "free" | "pro";
};

type LoadState = "loading" | "ok" | "error";

type HomeLocationState = { freezeSuccess?: boolean };

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading: authLoading } = useAuth();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<HomeData | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const uid = session?.user?.id;

  useEffect(() => {
    if (authLoading || !uid) return;
    let cancelled = false;
    const run = async () => {
      setLoadState("loading");
      try {
        const [uRes, pRes, sRes] = await Promise.all([
          supabase.from("users").select("name, level").eq("id", uid).maybeSingle(),
          supabase
            .from("progress")
            .select("stage, xp, streak, stage_progress_count, stage_progress_required")
            .eq("user_id", uid)
            .maybeSingle(),
          supabase.from("subscriptions").select("plan").eq("user_id", uid).maybeSingle(),
        ]);
        if (cancelled) return;
        if (uRes.error) throw uRes.error;
        if (pRes.error) throw pRes.error;
        if (sRes.error) throw sRes.error;

        const rawStage = pRes.data?.stage ?? 1;
        const stage = Math.min(Math.max(Math.floor(rawStage), 1), 6);
        const req = Math.max(pRes.data?.stage_progress_required ?? 1, 1);

        setData({
          userName: uRes.data?.name?.trim() ? uRes.data.name.trim() : null,
          level: uRes.data?.level ?? "beginner",
          stage,
          xp: pRes.data?.xp ?? 0,
          streak: pRes.data?.streak ?? 0,
          stageProgressCount: pRes.data?.stage_progress_count ?? 0,
          stageProgressRequired: req,
          plan: sRes.data?.plan === "pro" ? "pro" : "free",
        });
        setLoadState("ok");
      } catch {
        if (!cancelled) setLoadState("error");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [uid, authLoading, retryKey]);

  useEffect(() => {
    if (authLoading || !uid) return;
    void (async () => {
      const raw = localStorage.getItem(PENDING_ONBOARDING_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            name: string;
            interests: string[];
            goal: string | null;
            level: string;
            language: "ar";
          };
          const { error } = await upsertUserProfile(supabase, { id: uid, ...parsed });
          if (!error) {
            localStorage.removeItem(PENDING_ONBOARDING_KEY);
            if (parsed.name) localStorage.setItem("user_name", parsed.name);
          }
        } catch {
          localStorage.removeItem(PENDING_ONBOARDING_KEY);
        }
        return;
      }
      const { data: row } = await supabase.from("users").select("id").eq("id", uid).maybeSingle();
      if (!row) {
        await upsertUserProfile(supabase, defaultSignupProfile(uid));
      }
    })();
  }, [session, authLoading, uid]);

  useEffect(() => {
    const st = location.state as HomeLocationState | null;
    if (st?.freezeSuccess) {
      toast.success("تم حفظ سترك باستخدام رمز التجميد");
      navigate("/home", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  const showSkeleton = authLoading || loadState === "loading";
  const showError = !authLoading && loadState === "error";
  const showContent = !authLoading && loadState === "ok" && data !== null;

  const welcomeLabel = data?.userName ? `هلا، ${data.userName}` : "هلا، متحدث";
  const stageMeta = showContent ? STAGE_NODES[data.stage - 1] : null;
  const dailyChallenge = showContent ? getDailyChallengeForStage(data.stage) : null;

  return (
    <div className="relative" style={{ background: "#F5F4F0", minHeight: "100dvh", direction: "rtl" }}>
      <Navbar />

      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "40%", left: "-10%" }} />
      <div className="blob blob-blue" style={{ width: 200, height: 200, top: "30%", left: "-5%" }} />

      {showError ? (
        <div
          className="flex flex-col items-center justify-center gap-3"
          style={{
            paddingTop: 100,
            paddingBottom: 48,
            paddingLeft: "var(--page-padding-mobile)",
            paddingRight: "var(--page-padding-mobile)",
            minHeight: "50vh",
          }}
        >
          <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", textAlign: "center" }}>
            حدث خطأ في تحميل البيانات
          </p>
          <button
            type="button"
            onClick={handleRetry}
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
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <>
      <div className="flex justify-center home-welcome-area" style={{ paddingTop: 80, paddingLeft: "var(--page-padding-mobile)", paddingRight: "var(--page-padding-mobile)" }}>
        <div
          className="home-welcome-card"
          style={{
            maxWidth: "calc(100% - 32px)",
            width: 340,
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "16px 20px",
          }}
        >
          {showSkeleton && (
            <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
              <div style={{ flex: 1 }}>
                <div className="animate-pulse rounded-2xl bg-neutral-300/80" style={{ height: 22, width: "70%", marginBottom: 10 }} />
                <div className="animate-pulse rounded-2xl bg-neutral-300/80" style={{ height: 14, width: "50%", marginBottom: 8 }} />
                <div className="animate-pulse rounded-2xl bg-neutral-300/80" style={{ height: 14, width: "85%" }} />
              </div>
              <div className="flex flex-col items-center" style={{ marginRight: 8 }}>
                <div className="animate-pulse rounded-full bg-neutral-300/80" style={{ width: 36, height: 36 }} />
                <div className="animate-pulse rounded-2xl bg-neutral-300/80" style={{ width: 36, height: 10, marginTop: 8 }} />
              </div>
            </div>
          )}
          {showContent && stageMeta && (
            <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
              <div>
                <p className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E" }}>
                  {welcomeLabel}
                </p>
                {data.streak > 0 && (
                  <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                    <Flame size={14} color="#FF6B6B" />
                    <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
                      {data.streak} يوم متواصل
                    </span>
                  </div>
                )}
                <p className="font-cairo font-light" style={{ fontSize: 12, color: "#6C63FF", marginTop: 4 }}>
                  {stageMeta.name} · {data.stageProgressCount}/{data.stageProgressRequired}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(108,99,255,0.1)",
                    border: "1.5px solid rgba(108,99,255,0.3)",
                  }}
                >
                  <Mic size={18} color="#6C63FF" />
                </div>
                <span className="font-cairo font-bold" style={{ fontSize: 10, color: "#6C63FF", marginTop: 4 }}>
                  متحدث
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="home-gap-1" style={{ height: 32 }} />

      <div className="flex flex-col items-center" style={{ padding: "0 var(--page-padding-mobile)" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            width: "min(400px, 100vw)", height: "min(400px, 100vw)", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="hero-float" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-stroke-wrapper" style={{ padding: 5 }}>
            <div
              className="hero-circle home-circle"
              style={{ width: 220, height: 220, cursor: "pointer", maxWidth: "calc(100vw - 40px)" }}
              onClick={() => navigate("/challenge")}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold" style={{ fontSize: 18, color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ التحدي
                </span>
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  تكلم الآن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-gap-2" style={{ height: 24 }} />

      <div className="flex justify-center" style={{ padding: "0 var(--page-padding-mobile)" }}>
        <div
          className="home-challenge-card"
          style={{
            maxWidth: "calc(100% - 32px)",
            width: 340,
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "16px 20px",
            minHeight: 140,
          }}
        >
          {showSkeleton && (
            <div>
              <div className="animate-pulse rounded-2xl bg-neutral-300/80 mx-auto" style={{ height: 18, width: "40%", marginBottom: 16 }} />
              <div className="animate-pulse rounded-2xl bg-neutral-300/80 mx-auto" style={{ height: 20, width: "65%", marginBottom: 12 }} />
              <div className="animate-pulse rounded-2xl bg-neutral-300/80 mx-auto" style={{ height: 14, width: "90%", marginBottom: 16 }} />
              <div className="animate-pulse rounded-2xl bg-neutral-300/80 mx-auto" style={{ height: 14, width: "35%" }} />
            </div>
          )}
          {showContent && dailyChallenge && (
            <>
              <p className="font-cairo font-bold text-center" style={{ fontSize: 15, color: "#1A1A2E" }}>
                تحدي اليوم
              </p>
              <p className="font-cairo font-bold text-center" style={{ fontSize: 16, color: "#6C63FF", marginTop: 16 }}>
                {dailyChallenge.title}
              </p>
              <p className="font-cairo font-light text-center" style={{ fontSize: 12, color: "#9090A8", lineHeight: 1.6, marginTop: 8 }}>
                {dailyChallenge.body}
              </p>
              <div className="flex items-center justify-center" style={{ marginTop: 16, gap: 16 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <Clock size={14} color="#9090A8" />
                  <span className="font-cairo font-light" style={{ fontSize: 11, color: "#9090A8" }}>{dailyChallenge.durationLabel}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ paddingTop: 48, paddingBottom: 48 }}>
        {showSkeleton && (
          <div style={{ padding: "0 var(--page-padding-mobile)" }}>
            <div className="animate-pulse rounded-2xl bg-neutral-300/80" style={{ height: 22, width: 120, marginBottom: 24, marginRight: "auto" }} />
            {[1, 2, 3].map((k) => (
              <div key={k} className="animate-pulse rounded-xl bg-neutral-300/80" style={{ height: 88, width: "100%", maxWidth: 400, margin: "0 auto 16px" }} />
            ))}
          </div>
        )}
        {showContent && data && (
          <QuestMap
            currentStage={data.stage}
            stageProgressCount={data.stageProgressCount}
            stageProgressRequired={data.stageProgressRequired}
            plan={data.plan}
          />
        )}
      </div>

      {showContent && (
        <div className="flex justify-center" style={{ padding: "0 var(--page-padding-mobile)", paddingBottom: 48 }}>
          <button
            type="button"
            onClick={() => navigate("/weekly-report")}
            className="font-cairo font-light"
            style={{
              maxWidth: "calc(100% - 32px)",
              width: 340,
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 20,
              padding: "14px 20px",
              fontSize: 14,
              color: "#6C63FF",
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            التقرير الأسبوعي
          </button>
        </div>
      )}

        </>
      )}

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          .home-welcome-area { padding-top: 90px !important; }
          .home-welcome-card { max-width: 360px !important; padding: 20px 24px !important; }
          .home-gap-1 { height: 40px !important; }
          .home-circle { width: 240px !important; height: 240px !important; }
          .home-gap-2 { height: 32px !important; }
          .home-challenge-card { max-width: 360px !important; }
        }
        @media (min-width: 1024px) {
          .home-welcome-area { padding-top: 100px !important; }
          .home-welcome-card { max-width: 340px !important; padding: 20px 24px !important; }
          .home-gap-1 { height: 48px !important; }
          .home-circle { width: 260px !important; height: 260px !important; }
          .home-gap-2 { height: 40px !important; }
          .home-challenge-card { max-width: 340px !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
