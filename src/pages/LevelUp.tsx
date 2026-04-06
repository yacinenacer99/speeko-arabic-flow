import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import BackButton from "@/components/BackButton";

type LevelUpState = {
  newStage?: number;
  newStageName?: string;
};

const CONFETTI_COLORS = ["#6C63FF", "#A89CFF", "#FF9DC4", "#5DBE8A", "#F59E0B"];

const LevelUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LevelUpState | null;
  const newStage = state?.newStage ?? 2;
  const newStageName = state?.newStageName ?? "متحدث";

  const confettiItems = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        width: 6 + Math.random() * 6,
        height: 6 + Math.random() * 6,
        color: CONFETTI_COLORS[i % 5],
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    [],
  );

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100dvh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 var(--page-padding-mobile)" }}
    >
      <BackButton variant="dark" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiItems.map((item, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: item.width,
              height: item.height,
              background: item.color,
              left: `${item.left}%`,
              top: -10,
              animation: `confettiFall ${item.duration}s linear ${item.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100dvh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div
        className="flex items-center justify-center"
        style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(168,156,255,0.15)",
        }}
      >
        <Star size={40} color="hsl(var(--primary-soft))" />
      </div>
      <p className="font-cairo font-bold text-white" style={{ fontSize: 28, marginTop: 16 }}>ترقيت!</p>
      <p className="font-cairo font-bold" style={{ fontSize: 40, color: "hsl(var(--primary-soft))", marginTop: 8 }}>{newStageName}</p>
      <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>وصلت للمرحلة {newStage}</p>

      <div
        className="flex flex-col items-center glass-card-dark"
        style={{ padding: 20, marginTop: 32, width: "100%", maxWidth: 300 }}
      >
        <span className="font-cairo font-bold" style={{ fontSize: 28, color: "hsl(var(--primary-soft))" }}>+100 XP</span>
        <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>نقاط مكتسبة</span>
      </div>

      <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 16 }}>
        فتحت: كلمات ممنوعة متعددة + تحديات أصعب
      </p>

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
          marginTop: 32,
          maxWidth: 400,
          height: 50,
        }}
      >
        استمر في التدريب
      </button>
    </div>
  );
};

export default LevelUp;
