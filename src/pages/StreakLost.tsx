import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, X, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const StreakLost = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUseFreeze = async () => {
    if (!session?.user?.id) return;
    setBusy(true);
    setErrorMessage(null);

    try {
      const { data: row, error: fetchErr } = await supabase
        .from("progress")
        .select("freeze_tokens, streak")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (fetchErr) {
        console.log("[MLASOON] freeze read error:", fetchErr.message);
        setErrorMessage("تعذّر استخدام الرمز — حاول مجدداً");
        setBusy(false);
        return;
      }

      const tokens = typeof row?.freeze_tokens === "number" ? row.freeze_tokens : 0;
      if (tokens < 1) {
        setErrorMessage("لا يوجد رموز تجميد متبقية");
        setBusy(false);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const prevStreak = typeof row?.streak === "number" ? row.streak : 0;
      const nextStreak = prevStreak > 0 ? prevStreak : 1;

      const { error: updErr } = await supabase
        .from("progress")
        .update({
          freeze_tokens: tokens - 1,
          last_session_date: today,
          streak: nextStreak,
        })
        .eq("user_id", session.user.id);

      if (updErr) {
        console.log("[MLASOON] freeze update error:", updErr.message);
        setErrorMessage("تعذّر استخدام الرمز — حاول مجدداً");
        setBusy(false);
        return;
      }

      navigate("/home", { state: { freezeSuccess: true } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log("[MLASOON] freeze unexpected:", message);
      setErrorMessage("تعذّر استخدام الرمز — حاول مجدداً");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100dvh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 var(--page-padding-mobile)" }}
    >
      <BackButton variant="dark" />
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div
          className="flex items-center justify-center"
          style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,107,107,0.15)" }}
        >
          <Flame size={32} color="#FF6B6B" />
        </div>
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: -4, right: -4, width: 20, height: 20,
            borderRadius: "50%", background: "#FF6B6B",
          }}
        >
          <X size={12} color="white" />
        </div>
      </div>

      <p className="font-cairo font-bold text-white" style={{ fontSize: 24 }}>انقطع سترك</p>
      <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>كان عندك 12 يوم</p>

      <div
        className="flex flex-col items-center w-full glass-card-dark"
        style={{ padding: 20, marginTop: 32, maxWidth: 320 }}
      >
        <p className="font-cairo font-light text-white" style={{ fontSize: 14 }}>عندك رمز تجميد واحد</p>
        <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>يحفظ سترك بدون يوم تدريب</p>
        <button
          type="button"
          onClick={() => void handleUseFreeze()}
          disabled={busy}
          className="font-cairo font-bold w-full"
          style={{
            border: "1px solid hsl(var(--primary))",
            color: "hsl(var(--primary))",
            background: "transparent",
            borderRadius: 999,
            padding: "12px 0",
            fontSize: 14,
            cursor: busy ? "wait" : "pointer",
            marginTop: 16,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : null}
          استخدم الرمز
        </button>
        {errorMessage && (
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "#FF6B6B", marginTop: 12, marginBottom: 0 }}>
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/home")}
        className="font-cairo font-bold text-white w-full"
        style={{
          background: "hsl(var(--primary))",
          border: "none",
          borderRadius: 999,
          padding: "16px 0",
          fontSize: 15,
          cursor: "pointer",
          marginTop: 16,
          maxWidth: 320,
          height: 50,
        }}
      >
        ابدأ من جديد
      </button>
      <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 12 }}>
        لا يهم — كل يوم بداية جديدة
      </p>
    </div>
  );
};

export default StreakLost;
