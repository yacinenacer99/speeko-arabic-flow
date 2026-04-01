import { useNavigate } from "react-router-dom";
import { Lock, Check, Flame, Zap, Shield, Mic, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const levels = [
  { level: 1, badge: "مبتدئ", desc: "تكلم 30 ثانية بدون توقف", status: "completed" as const },
  { level: 2, badge: "مبتدئ", desc: "قلل التوقفات الطويلة", status: "completed" as const },
  { level: 3, badge: "متحدث", desc: "تخلص من كلمات الحشو", status: "current" as const },
  { level: 4, badge: "متحدث", desc: "تكلم دقيقة كاملة بثقة", status: "locked" as const },
  { level: 5, badge: "متحدث", desc: "نوّع نبرة صوتك", status: "locked" as const },
  { level: 6, badge: "مؤثر", desc: "بنِ أفكارك بوضوح وتسلسل", status: "locked" as const },
  { level: 7, badge: "خطيب", desc: "تكلم عن أي موضوع بدون تحضير", status: "locked" as const },
  { level: 8, badge: "خطيب", desc: "أي موضوع، أي غرفة، أي جمهور", status: "locked" as const },
];

const badgeIcon = (badge: string) => {
  switch (badge) {
    case "مبتدئ": return Mic;
    case "متحدث": return Shield;
    case "مؤثر": return Award;
    case "خطيب": return Award;
    default: return Mic;
  }
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 300, height: 300, top: "10%", right: "-8%" }} />
      <div className="blob blob-pink" style={{ width: 250, height: 250, top: "60%", left: "-5%" }} />

      {/* Hero section */}
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ height: "100vh", padding: "0 24px", marginTop: -60 }}
      >
        <p className="font-cairo font-bold" style={{ fontSize: 26, color: "hsl(var(--foreground))", marginBottom: 8 }}>
          مرحباً، أحمد
        </p>
        <div className="flex items-center gap-3" style={{ marginBottom: 64 }}>
          <span className="font-cairo font-light flex items-center gap-1" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
            <Flame size={14} color="#FF6B6B" /> 12 يوم
          </span>
          <span className="font-cairo font-light flex items-center gap-1" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
            <Zap size={14} color="#F59E0B" /> 340 XP
          </span>
        </div>

        {/* Glow bg */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Circle button */}
        <div className="hero-float" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-stroke-wrapper" style={{ padding: 5 }}>
            <div
              className="hero-circle"
              style={{ width: 260, height: 260, cursor: "pointer" }}
              onClick={() => navigate("/challenge")}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold text-[18px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ تحديك اليومي
                </span>
                <span className="font-cairo font-light text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  التحدي جاهز
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 16 }}>
          اضغط للبدء
        </p>
      </div>

      {/* Quest map */}
      <div style={{ padding: "40px 24px 24px" }}>
        <h2 className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--foreground))", marginBottom: 24 }}>
          مسارك
        </h2>

        <div className="relative flex flex-col items-center" style={{ gap: 32 }}>
          {stages.map((stage, i) => (
            <div
              key={i}
              className="flex items-center w-full gap-4"
              style={{ flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              {/* Node */}
              <div
                className={`flex items-center justify-center shrink-0 ${stage.status === "current" ? "animate-pulse-glow" : ""}`}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background:
                    stage.status === "completed"
                      ? "hsl(var(--primary))"
                      : stage.status === "current"
                        ? "white"
                        : "hsl(var(--surface-2))",
                  border: stage.status === "current" ? "3px solid hsl(var(--primary))" : "none",
                }}
              >
                {stage.status === "completed" && <Check size={24} color="white" />}
                {stage.status === "locked" && <Lock size={20} color="hsl(var(--muted-foreground))" />}
              </div>

              {/* Label */}
              <div>
                <p
                  className="font-cairo font-bold"
                  style={{
                    fontSize: 15,
                    color: stage.status === "locked" ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
                  }}
                >
                  {stage.name}
                </p>
                <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
