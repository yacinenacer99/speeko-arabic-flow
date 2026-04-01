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

      {/* Learning Path */}
      <div style={{ padding: "0 24px 120px", marginTop: -200 , position: "relative", zIndex: 2 }}>
        <h2 className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--foreground))", marginBottom: 24, textAlign: "center" }}>
          مسارك
        </h2>

        <div
          style={{
            background: "rgba(26, 26, 40, 0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "24px 20px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex flex-col" style={{ gap: 0 }}>
            {levels.map((item, i) => {
              const Icon = badgeIcon(item.badge);
              const isLast = i === levels.length - 1;
              return (
                <div key={i} className="flex gap-4" style={{ direction: "rtl" }}>
                  {/* Timeline column */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`flex items-center justify-center ${item.status === "current" ? "animate-pulse-glow" : ""}`}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background:
                          item.status === "completed"
                            ? "hsl(var(--primary))"
                            : item.status === "current"
                              ? "rgba(108,99,255,0.15)"
                              : "rgba(42,42,62,0.6)",
                        border: item.status === "current" ? "2px solid hsl(var(--primary))" : "none",
                      }}
                    >
                      {item.status === "completed" && <Check size={18} color="white" />}
                      {item.status === "current" && <span className="font-cairo font-bold text-[13px]" style={{ color: "#A89CFF" }}>{item.level}</span>}
                      {item.status === "locked" && <Lock size={16} color="#9090A8" />}
                    </div>
                    {!isLast && (
                      <div style={{
                        width: 2,
                        flex: 1,
                        minHeight: 24,
                        background: item.status === "completed" ? "hsl(var(--primary))" : "rgba(42,42,62,0.6)",
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 8 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <span className="font-cairo font-bold" style={{
                        fontSize: 14,
                        color: item.status === "locked" ? "#9090A8" : "hsl(var(--foreground))",
                      }}>
                        المستوى {item.level}
                      </span>
                      <span
                        className="flex items-center gap-1 font-cairo font-light"
                        style={{
                          fontSize: 11,
                          color: item.status === "locked" ? "#9090A8" : "#A89CFF",
                          background: item.status === "locked" ? "rgba(42,42,62,0.4)" : "rgba(108,99,255,0.1)",
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        <Icon size={11} />
                        {item.badge}
                      </span>
                    </div>
                    <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
